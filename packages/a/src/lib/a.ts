import packageJson from '../../package.json';

export function a(): string {
  return 'a' + packageJson.version;
}
