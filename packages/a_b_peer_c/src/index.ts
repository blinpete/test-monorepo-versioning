import packageJson from '../package.json';

export function a_b_peer_c(): string {
  return packageJson.name + '@' + packageJson.version;
}
