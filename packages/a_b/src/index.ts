import packageJson from '../package.json';

export function a_b(): string {
  return packageJson.name + '@' + packageJson.version;
}
