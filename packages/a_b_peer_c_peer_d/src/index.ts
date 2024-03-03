import packageJson from '../package.json';

export function a_b_peer_c_peer_d(): string {
  return packageJson.name + '@' + packageJson.version;
}
