/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

import devkit from '@nx/devkit';
import path from 'path';
const { readCachedProjectGraph, readJsonFile } = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

function updatePackageJson(mixin) {
  const json = JSON.parse(readFileSync(`package.json`).toString());

  for (const [key,val] of Object.entries(mixin)) {
    if (val == null) continue

    if (typeof val === 'object') {
      // obj -> merge in
      // example:
      //  - dependencies
      //  - peerDependencies

      json[key] = {
        ...(json[key] || {}),
        ...val
      };
    } else {
      // literal -> assign
      // example:
      //  - version

      json[key] = val
    }
  }

  // console.log("🚀 | updatePackageJson | json:", json)
  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
}

// Executing publish script: node path/to/publishManyVersions.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, tag = 'next'] = process.argv;

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
);

const outputPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);


try {
  const publishMeta = readJsonFile(path.resolve(project.data.root, 'publishMeta.json'))
  // console.log("🚀 | publishMeta:", publishMeta)

  const versionsList = publishMeta.versionToDep.map(x => {
    return {
      // version
      version: x[0],
      // dependency for this version
      dependencies: publishMeta.dependency
        ? { [publishMeta.dependency]: x[1] }
        : null,
      peerDependencies: publishMeta.peerDependency
        ? { [publishMeta.peerDependency]: x[1] }
        : null,
    }
  })

  console.log("🚀 | versionsList:", versionsList)
  process.chdir(outputPath);


  for (const pkgJsonMixin of versionsList) {
    const version = pkgJsonMixin.version;
    // A simple SemVer validation to validate the version
    const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
    invariant(
      version && validVersion.test(version),
      `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
    );

    // Updating the version and dependencies in "package.json" before publishing
    updatePackageJson(pkgJsonMixin);

    // Execute "npm publish" to publish
    console.log(`🚀 publishing ${project.name}@${version}`)
    execSync(`npm publish --access public --tag ${tag}`);
  }

  // latest
  // execSync(`npm publish --access public --tag latest`);
} catch (e) {
  console.log("🚀 | e:", e)
  console.error(`Error reading package.json file from library build output.`);
}


