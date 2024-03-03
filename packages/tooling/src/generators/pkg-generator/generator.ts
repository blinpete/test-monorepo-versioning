import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { PkgGeneratorGeneratorSchema } from './schema';

export async function pkgGeneratorGenerator(
  tree: Tree,
  options: PkgGeneratorGeneratorSchema
) {
  const projectRoot = `packages/${options.name}`;
  // addProjectConfiguration(tree, options.name, {
  //   root: projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${projectRoot}/src`,
  //   targets: {},
  // });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default pkgGeneratorGenerator;
