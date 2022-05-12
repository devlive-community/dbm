export class SshModel {
  sshHost: string;
  sshPort: number = 22;
  sshUsername: string = 'root';
  sshPassword: string = '123456';
  timeout: number = 6000;
  localHost: string = '127.0.0.1';
  localPort: number = 8123;
  localUsername: string;
  localPassword: string;
}
