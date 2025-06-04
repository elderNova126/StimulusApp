import {
  ServicesMapping,
  CONTROLLER_PROTO,
  CONTROLLER_PROTO_PACKAGE_NAME,
  CONTROLLER_PROTO_PACKAGE_PATH,
} from './proto.constants';
import { controller } from 'controller-proto/codegen/tenant_pb';

export const controllerProto = {
  provide: CONTROLLER_PROTO,
  useFactory: async () => {
    const controllerProtoConfig = {
      packageName: CONTROLLER_PROTO_PACKAGE_NAME,
      packagePath: CONTROLLER_PROTO_PACKAGE_PATH,
      services: {},
    };
    for (const serviceRecord in ServicesMapping) {
      const serviceName = ServicesMapping[serviceRecord];
      const serviceMethods = {};
      controllerProtoConfig.services[serviceRecord] = {};
      const methods = Object.getOwnPropertyNames(controller[ServicesMapping[serviceRecord]].prototype).filter((p) => {
        if (p === 'constructor') return false;
        return typeof controller[ServicesMapping[serviceRecord]].prototype[p] === 'function';
      });
      for (const method of methods) {
        const methodObj = {};
        methodObj[method] = method;
        Object.assign(serviceMethods, methodObj);
      }
      Object.assign(controllerProtoConfig.services[serviceRecord], { serviceMethods });
      Object.assign(controllerProtoConfig.services[serviceRecord], { serviceName });
    }
    return controllerProtoConfig;
  },
};
