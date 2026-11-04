import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const archive = process.argv[2]
assert.ok(archive, 'Usage: yarn verify:package <package.tgz>')
const requiredAndroid = [
  'android/src/main/AndroidManifest.xml',
  'android/src/main/cpp/cpp-adapter.cpp',
  'android/src/main/java/com/nitroinappbrowser/HybridNitroInAppBrowser.kt',
  'android/src/main/java/com/nitroinappbrowser/NitroInAppBrowserImpl.kt',
  'android/src/main/java/com/nitroinappbrowser/NitroInAppBrowserPackage.java',
]
const entries = execFileSync('tar', ['-tzf', path.resolve(archive)], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
assert.ok(
  entries.every(
    (name) => name.startsWith('package/') && !name.split('/').includes('..')
  ),
  'Archive paths must stay inside package/'
)
const missing = requiredAndroid.filter(
  (name) => !entries.includes(`package/${name}`)
)
assert.deepEqual(
  missing,
  [],
  `Missing Android runtime sources: ${missing.join(', ')}`
)

const temp = mkdtempSync(path.join(tmpdir(), 'nitro-browser-package-'))
try {
  execFileSync('tar', ['-xzf', path.resolve(archive), '-C', temp])
  const packedRoot = path.join(temp, 'package')
  const source = JSON.parse(
    readFileSync(path.join(root, 'package.json'), 'utf8')
  )
  const packed = JSON.parse(
    readFileSync(path.join(packedRoot, 'package.json'), 'utf8')
  )
  assert.equal(packed.name, source.name)
  assert.equal(packed.version, source.version)

  // 포장에 들어간 파일만 비교하면 필수 원본의 누락을 놓칠 수 있어요.
  const runtimeFiles = execFileSync(
    'git',
    [
      'ls-files',
      '-z',
      '--',
      'android/src',
      'ios',
      'nitrogen/generated',
      'src',
      'cpp',
      '*.podspec',
      'android/CMakeLists.txt',
      'android/build.gradle',
      'android/gradle.properties',
    ],
    { cwd: root, encoding: 'utf8' }
  )
    .split('\0')
    .filter(Boolean)
  assert.ok(runtimeFiles.length >= requiredAndroid.length)
  for (const name of runtimeFiles) {
    const packedPath = path.join(packedRoot, name)
    assert.ok(existsSync(packedPath), `Missing runtime source: ${name}`)
    assert.deepEqual(
      readFileSync(packedPath),
      readFileSync(path.join(root, name)),
      `Packed runtime source differs: ${name}`
    )
  }
  for (const field of ['main', 'module', 'types', 'react-native']) {
    const entry = packed[field]
    assert.ok(
      entry &&
        [entry, `${entry}.ts`].some((name) =>
          existsSync(path.join(packedRoot, name))
        ),
      `Missing package entry: ${field}`
    )
  }

  // 실제 소비자와 같은 CLI 파서가 tarball의 Android Package를 찾아야 해요.
  const require = createRequire(path.join(root, 'package.json'))
  const {
    dependencyConfig,
  } = require('@react-native-community/cli-platform-android')
  const android = dependencyConfig(packedRoot, {})
  assert.ok(android, 'Packed Android dependency must autolink')
  assert.equal(
    android.packageImportPath,
    'import com.nitroinappbrowser.NitroInAppBrowserPackage;'
  )
  assert.equal(android.packageInstance, 'new NitroInAppBrowserPackage()')
  assert.equal(android.sourceDir, path.join(packedRoot, 'android'))
  console.log(
    JSON.stringify(
      {
        name: packed.name,
        version: packed.version,
        requiredAndroidFiles: requiredAndroid.length,
        runtimeFilesCompared: runtimeFiles.length,
        androidPackage: android.packageInstance,
        passed: true,
      },
      null,
      2
    )
  )
} finally {
  rmSync(temp, { recursive: true, force: true })
}
