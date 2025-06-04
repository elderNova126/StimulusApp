import * as dotenv from 'dotenv';
import { BaseEntity, ViewEntity, ViewColumn } from 'typeorm';

dotenv.config();

const viewExpression = `
SELECT company.*,
(SELECT TOP 1 *
FROM [${process.env.GLOBAL_DB_SCHEMA}].score score
WHERE score.companyId = company.id
ORDER BY score.timestamp DESC
FOR JSON AUTO,
        WITHOUT_ARRAY_WRAPPER,
        INCLUDE_NULL_VALUES) AS score,
    CompanyWatermark.watermark AS watermark
FROM [${process.env.GLOBAL_DB_SCHEMA}].[company] company
INNER JOIN
(SELECT CompanyAndRelatedMaxWatermark.id,

(SELECT MAX([value].rowVersion)
    FROM(
        VALUES(CompanyAndRelatedMaxWatermark.companyRV), (CompanyAndRelatedMaxWatermark.maxScoreRV)) AS value(rowVersion)) AS watermark
FROM
(SELECT company.id,
        company.rowversion AS companyRV,
        MAX(Score.rowversion) AS maxScoreRV
    FROM [${process.env.GLOBAL_DB_SCHEMA}].[company] company
    LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[score] Score ON company.id = Score.companyId
    GROUP BY company.id,
            company.rowversion) AS CompanyAndRelatedMaxWatermark) CompanyWatermark ON CompanyWatermark.id = company.id
`;
@ViewEntity({
  expression: viewExpression,
})
export class CompanyAggregateIndex extends BaseEntity {
  @ViewColumn()
  id: number;
}
