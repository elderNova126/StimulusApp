import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { KafkaContext, RequestContext, TcpContext } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class ReqContextResolutionService {
  private requestId: string;

  constructor(@Inject(REQUEST) private request: RequestContext) {}

  public getTenantId(): string {
    return this.retrieveDataFromRequest('tenant');
  }

  public getRequestId() {
    this.requestId = this.retrieveDataFromRequest('requestid');
    if (!this.requestId) {
      this.requestId = uuidv4();
    }
    return this.requestId;
  }

  public getUserId(): string {
    return this.retrieveDataFromRequest('user');
  }

  public getUploadReportId(): string {
    return this.retrieveDataFromRequest('uploadReport');
  }

  private retrieveDataFromRequest(field) {
    let data;
    if (this.request && this.request.context) {
      if (this.request.context instanceof TcpContext) {
        const reqData = this.request.getData();
        data = reqData.metadata[field];
      } else if (this.request.context instanceof KafkaContext) {
        const reqData = this.request.getData();
        data = reqData.value.metadata[field];
      } else {
        [data] = this.request.context.get(field);
      }
    }
    return data;
  }
}
