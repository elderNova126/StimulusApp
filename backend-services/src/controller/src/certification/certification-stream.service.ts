import { Inject, Injectable, Scope } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { GrpcInvalidArgumentException } from '../shared/utils-grpc/exception';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { Certification, DiverseOwnership } from './certification.entity';
import { DataTraceMetaService } from 'src/shared/data-trace-meta/data-trace-meta.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';

@Injectable({ scope: Scope.REQUEST })
export class CertificationStreamService {
  private readonly certificationRepository: Repository<Certification>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly dataTraceMetaService: DataTraceMetaService
  ) {
    this.certificationRepository = connection.getRepository(Certification);
  }

  async createCertifications(certificationsData: Certification[]): Promise<any> {
    const errors = [];
    const pointsArray = [];
    const tenantId = this.reqContextResolutionService.getTenantId();
    const userId = this.reqContextResolutionService.getUserId();

    const internalIds = certificationsData.map((x) => x.company.internalId);

    const tcrs = await this.tenantCompanyRelationService.getTCRsFromTenantContext(internalIds);
    const certifications = certificationsData as unknown as Certification[];

    for (const certification of certifications) {
      const i = certifications.indexOf(certification);
      const internalId = certification.company.internalId;
      const tenantCompany = tcrs.find((x) => x.internalId === certification.company.internalId);

      if (tenantCompany) {
        const dataTrace = certificationsData[i];
        this.dataTraceMetaService.addDataTraceMeta({
          data: certification,
          tenantCompany,
          internalId,
          tenantId,
          userId,
          dataTrace,
        });
        certification.company = tenantCompany.company;
        pointsArray.push(certification);
      } else errors.push(certification.company.internalId);
    }

    await this.certificationRepository
      .createQueryBuilder()
      .insert()
      .into(Certification)
      .values(pointsArray)
      .execute()
      .catch(async (error) => {
        this.logger.log('Failed to add certifications using the bulk insert method. Move to for each approach.');
        this.logger.debug(`Error is : ${error}`);
        await Promise.all(
          certificationsData.map((certification) => {
            return this.createCertificationWithCompany(certification).catch((err) => {
              this.logger.error(`Failed to create certification with error ${err}`);
              errors.push(certification.internalId);
              return undefined;
            });
          })
        ).then(async (result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${certificationsData.length} certifications`);
        });
      });

    return { errors };
  }

  async createCertificationWithCompany(certificationData: Certification) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      certificationData.company.internalId
    );
    if (!(certificationData.diversityOwnership && Object.keys(DiverseOwnership).includes(certificationData.type)))
      throw new GrpcInvalidArgumentException('Invalid type for diverse ownership certification');

    certificationData.company = tenantCompany.company;
    return await this.certificationRepository.save(certificationData);
  }

  async updateCertificationUsingInternalId(
    internalId: string,
    certificationData: Certification
  ): Promise<Certification> {
    return await this.certificationRepository.save({ id: internalId, ...certificationData });
  }

  async deleteCertificationUsingInternalId(internalId: string): Promise<DeleteResult> {
    return await this.certificationRepository.delete({ internalId });
  }
}
