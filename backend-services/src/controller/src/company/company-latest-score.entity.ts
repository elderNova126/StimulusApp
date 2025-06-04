import * as dotenv from 'dotenv';
import { ViewEntity, ViewColumn, BaseEntity } from 'typeorm';

dotenv.config();

const viewExpression = `
SELECT company.id AS companyId, 
       score.id AS scoreId
FROM [${process.env.GLOBAL_DB_SCHEMA}].company
     LEFT JOIN score ON score.id =
(
    SELECT score.id
    FROM [${process.env.GLOBAL_DB_SCHEMA}].score
    WHERE score.companyId = company.id
    ORDER BY timestamp DESC
    OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
)`;

@ViewEntity({
  expression: viewExpression,
})
export class CompanyLatestScore extends BaseEntity {
  @ViewColumn()
  companyId: string;

  @ViewColumn()
  scoreId: number;
}
