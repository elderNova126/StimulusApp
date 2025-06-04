import { ArgumentMetadata } from '@nestjs/common';
import { GrpcFailedPreconditionException } from 'src/shared/utils-grpc/exception';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { Project } from './project.entity';

describe('Project validation pipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    validationPipe = new ValidationPipe(Project);
  });

  it('should validate empty project', async () => {
    const projectRequest = { project: new Project() };
    const result = await validationPipe.transform(projectRequest, { data: 'project' } as ArgumentMetadata);
    expect(result).toStrictEqual(projectRequest);
  });

  it('should validate', async () => {
    const project = {
      expectedStartDate: new Date().toISOString(),
      status: 'COMPLETED',
      currency: 'USD',
      budget: 200,
    };
    const projectRequest = { project: project };
    const result = await validationPipe.transform(projectRequest, { data: 'project' } as ArgumentMetadata);
    expect(result).toStrictEqual(projectRequest);
  });

  it('should throw error', async () => {
    const project = {
      expectedStartDate: 'Some incorrect date',
      status: 'INCORRECTSTATUS',
      currency: 'INCORRECTCURRENCY',
      budget: -4,
    };
    const projectRequest = { project: project };
    await expect(validationPipe.transform(projectRequest, { data: 'project' } as ArgumentMetadata)).rejects.toThrow(
      new GrpcFailedPreconditionException(
        "The following fields don't respect validation criteria: status,budget,expectedStartDate,currency"
      )
    );
  });
});
