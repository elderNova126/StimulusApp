export const CONTROLLER_PROTO = 'CONTROLLER_PROTO';
export const CONTROLLER_PROTO_PACKAGE_NAME = 'controller';
export const CONTROLLER_PROTO_PACKAGE_PATH = 'main';

export enum ProtoServices {
  DATA = 'data',
  DISCOVERY = 'discovery',
}

export const ServicesMapping: Record<ProtoServices, string> = {
  [ProtoServices.DATA]: 'DataService',
  [ProtoServices.DISCOVERY]: 'DiscoveryService',
};
