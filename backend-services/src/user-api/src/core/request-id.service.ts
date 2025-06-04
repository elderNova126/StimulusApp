import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdService {
  private requestId: string;

  getRequestId(): string {
    if (!this.requestId) {
      this.requestId = uuidv4();
    }
    return this.requestId;
  }
}
