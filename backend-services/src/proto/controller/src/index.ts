import { join } from 'path';

export default function getControllerProtoPackagePath(packageName: string): string {
  return join(__dirname, `../proto/${packageName}.proto`);
}
