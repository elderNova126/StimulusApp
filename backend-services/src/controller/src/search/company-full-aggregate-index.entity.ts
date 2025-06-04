import * as dotenv from 'dotenv';
import { BaseEntity, ViewEntity, ViewColumn } from 'typeorm';

dotenv.config();

// we need to update this query;
const viewExpression = `
  SELECT company.*,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].[contact] contact
  WHERE contact.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS contacts,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].[contingency] contingency
  WHERE contingency.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS contingencies,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].certification certification
  WHERE certification.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS certifications,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].[location] LOCATION
  WHERE location.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS locations,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].insurance insurance
  WHERE insurance.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS insurances,

  (SELECT *
  FROM [${process.env.GLOBAL_DB_SCHEMA}].product product
  WHERE product.companyId = company.id
    FOR JSON AUTO,
              INCLUDE_NULL_VALUES ) AS products,

  (SELECT *
    FROM [${process.env.GLOBAL_DB_SCHEMA}].tenant_company_relationship tcr
    WHERE tcr.companyId = company.id
      FOR JSON AUTO,
                INCLUDE_NULL_VALUES ) AS tcr,

  (SELECT *,
    (SELECT description from [global].industry where industry.id = industryId) AS description_index,
    (SELECT title from [global].industry where industry.id = industryId) AS title_index
    FROM [${process.env.GLOBAL_DB_SCHEMA}].company_industries_industry industries
    WHERE industries.companyId = company.id
      FOR JSON AUTO,
                INCLUDE_NULL_VALUES ) AS industries,

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
          VALUES(CompanyAndRelatedMaxWatermark.companyRV), (CompanyAndRelatedMaxWatermark.maxContactRV), (CompanyAndRelatedMaxWatermark.maxContingencyRV), (CompanyAndRelatedMaxWatermark.maxCertificationRV), (CompanyAndRelatedMaxWatermark.maxLocationRV), (CompanyAndRelatedMaxWatermark.maxInsuranceRV), (CompanyAndRelatedMaxWatermark.maxProductRV), (CompanyAndRelatedMaxWatermark.maxScoreRV), (CompanyAndRelatedMaxWatermark.maxTCRRV), (CompanyAndRelatedMaxWatermark.maxIndustryRV)) AS value(rowVersion)) AS watermark
  FROM
    (SELECT company.id,
            company.rowversion AS companyRV,
            MAX(Contact.rowversion) AS maxContactRV,
            MAX(Contingency.rowversion) AS maxContingencyRV,
            MAX(Certification.rowversion) AS maxCertificationRV,
            MAX(Location.rowversion) AS maxLocationRV,
            MAX(Insurance.rowversion) AS maxInsuranceRV,
            MAX(Product.rowversion) AS maxProductRV,
            MAX(Score.rowversion) AS maxScoreRV,
            MAX(TCR.rowversion) AS maxTCRRV,
            MAX(Industry.rowversion) AS maxIndustryRV
      FROM [${process.env.GLOBAL_DB_SCHEMA}].[company] company
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[contact] Contact ON company.id = Contact.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[contingency] Contingency ON company.id = Contingency.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[certification] Certification ON company.id = Certification.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[location] LOCATION ON company.id = Location.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[insurance] Insurance ON company.id = Insurance.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[product] Product ON company.id = Product.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[score] Score ON company.id = Score.companyId
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[tenant_company_relationship] TCR ON company.id = TCR.companyId
      CROSS JOIN  [${process.env.GLOBAL_DB_SCHEMA}].[industry] Industry
      LEFT JOIN [${process.env.GLOBAL_DB_SCHEMA}].[company_industries_industry] CompIndustry ON company.id = CompIndustry.companyId AND Industry.id = CompIndustry.industryId
      GROUP BY company.id,
              company.rowversion) AS CompanyAndRelatedMaxWatermark) CompanyWatermark ON CompanyWatermark.id = company.id
  `;
@ViewEntity({
  expression: viewExpression,
})
export class CompanyFullAggregateIndex extends BaseEntity {
  @ViewColumn()
  id: number;
}
