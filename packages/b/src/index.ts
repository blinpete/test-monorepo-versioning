import packageJson from '../package.json';

export function b(): string {
  return 'b' + packageJson.version;
}
