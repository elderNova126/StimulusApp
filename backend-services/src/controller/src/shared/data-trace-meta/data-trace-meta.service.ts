import { Injectable } from '@nestjs/common';
import { DataTraceSource } from 'src/core/datatrace.types';
import { AddDataTraceMetaDto } from './add-data-trace-meta.dto';

@Injectable()
export class DataTraceMetaService {
  addDataTraceMeta(addDataTraceMetaDto: AddDataTraceMetaDto) {
    const data = addDataTraceMetaDto.data;
    const tenantCompany = addDataTraceMetaDto.tenantCompany;

    data.company = tenantCompany.company;
    data.company.internalId = addDataTraceMetaDto.internalId;
    data.dataTraceSource = DataTraceSource.INGESTION;
    data.dataTraceMeta = data.dataTraceMeta ?? Object();
    data.dataTraceMeta.method = 'INGESTION';
    data.dataTraceMeta.tenantId = addDataTraceMetaDto.tenantId;
    data.dataTraceMeta.userId = addDataTraceMetaDto.userId;

    const dataTrace = addDataTraceMetaDto.dataTrace;

    const sourceMeta = data.dataTraceMeta.source ?? Object();
    sourceMeta.name = dataTrace.sourceName ?? null;
    sourceMeta.type = dataTrace.sourceType ?? null;
    sourceMeta.date = dataTrace.sourceDate ?? null;
    data.dataTraceMeta.source = sourceMeta ?? null;
  }
}
