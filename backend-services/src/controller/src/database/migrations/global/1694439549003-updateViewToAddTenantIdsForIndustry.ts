import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateViewToAddTenantIdsForIndustry1694439549003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP VIEW IF EXISTS [global].[company_full_aggregate_index_backup]
        DECLARE @Definition NVARCHAR(MAX)
        DECLARE @ViewObjetId INT
        DECLARE @ViewName NVARCHAR(MAX) = 'company_full_aggregate_index'
        DECLARE @ViewBackUpName NVARCHAR(MAX) = 'company_full_aggregate_index_backup'
        
        SELECT
            @ViewObjetId = object_id
        FROM sys.objects
        where name = @ViewName
        
        SELECT
            @Definition = definition
        FROM
            sys.sql_modules
        WHERE
             object_id
             = @ViewObjetId
        
        SET @Definition = REPLACE(@Definition, @ViewName, @ViewBackUpName)
        EXEC(@Definition)

        DROP VIEW IF EXISTS [global].[company_full_aggregate_index]`);

    await queryRunner.query(`CREATE VIEW [global].[company_full_aggregate_index]
        AS
            SELECT company.id,
                company.created,
                company.updated,
                company.description,
                company.legalBusinessName,
                company.doingBusinessAs,
                CASE
                       WHEN company.legalBusinessName IS NOT NULL THEN dbo.AppendPipeToBeginning(company.legalBusinessName)
                       ELSE dbo.AppendPipeToBeginning(company.doingBusinessAs)
                       END                                                                                        AS displayName,
                company.jurisdictionOfIncorporation,
                company.creditScoreBusinessNo,
                company.taxIdNo,
                company.yearFounded,
                company.financialsDataYear,
                company.revenue,
                company.netProfitGrowthCAGR,
                company.customerDataYear,
                company.customers,
                company.customersGrowthCAGR,
                company.peopleDataYear,
                company.employeesTotal,
                company.leadershipTeamTotal,
                company.boardTotal,
                company.brandDataYear,
                company.boardDiverse,
                company.leadershipTeamDiverse,
                company.shareholdersEquity,
                company.parentCompanyId,
                (SELECT legalBusinessName
                FROM [global].company pc
                WHERE pc.id = company.parentCompanyId
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                              parentCompany,
                (SELECT name
                FROM [global].company_names cn
                WHERE cn.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                              businessNames,
                company.customersDataYear,
                company.employeesDiverse,
                company.diverseOwnershipPct,
                company.website,
                company.webDomain,
                company.emailDomain,
                company.linkedin,
                company.linkedInFollowersGrowthCAGR,
                company.facebook,
                company.facebookFollowersGrowthCAGR,
                company.twitter,
                company.twitterFollowersGrowthCAGR,
                company.assetsRevenueRatio,
                company.liabilitiesRevenueRatio,
                company.shortDescription,
                company.logo,
                company.otherBusinessNames,
                company.revenueGrowthCAGR,
                company.netProfit,
                company.netProfitPct,
                company.netPromoterScore,
                company.revenuePerEmployee,
                company.totalLiabilities,
                company.linkedInFollowers,
                company.facebookFollowers,
                company.twitterFollowers,
                company.previousBusinessNames,
                company.operatingStatus,
                company.fiscalYearEnd,
                company.leaderDiverse,
                company.currency,
                company.totalAssets,
                company.employeesTotalGrowthCAGR,
                (SELECT TOP 1
                    Cast(ROUND(scoreValue, 2) as int)
                FROM [global].score score
                WHERE score.companyId = company.id
                ORDER BY score.timestamp DESC)                                                                AS scoreValue,
        
                (SELECT lET.label
                FROM [global].legalEntityTypes lET
                where lET.id = company.typeOfLegalEntityId)                                                     as typeOfLegalEntity,
        
                (SELECT STRING_AGG(ISNULL(t.tag, ' '), ',') As tags
                FROM [global].tags t,
                    [global].company_tags_tags ctt
                WHERE ctt.tagsId = t.id
                    and ctt.companyId = company.id)
                                                                                                                  AS tags,
                (SELECT STRING_AGG(ISNULL(do.diverseOwnership, ' '), ',') As diverseOwnership
                FROM [global].diverseOwnership do,
                    [global].diverseOwnership_company doc
                WHERE doc.diverseOwnershipId = do.id
                    and doc.companyId = company.id)
                                                                                                                  as diverseOwnership,
                cast
                       (company.totalAssets as double precision)                                                  as totalAssets_double,
                cast
                       (
                           company.employeesTotalGrowthCAGR as double precision
                       )                                                                                          as employeesTotalGrowthCAGR_double,
                CAST
                       (
                           IIF
                               (
                                       revenue is null
                                       or revenue = 0,
                                       null,
                                       (ISNULL
                                            (totalAssets, 0) / revenue) * 100
                               ) as double precision
                       )                                                                                          as assetsPctOfRevenue,
                CAST
                       (
                           IIF
                               (
                                       revenue is null
                                       or revenue = 0,
                                       null,
                                       (ISNULL
                                            (totalLiabilities, 0) / revenue) * 100
                               ) as double precision
                       )                                                                                          as liabilitiesPctOfRevenue,
                (SELECT *
                FROM [global].[contact] contact
                WHERE contact.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS contacts,
                (SELECT *
                FROM [global].[contingency] contingency
                WHERE contingency.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS contingencies,
                (SELECT *
                FROM [global].certification certification
                WHERE certification.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS certifications,
                (SELECT LOCATION.*,
                    CONVERT(VARCHAR(MAX), CASE
                                                     WHEN TRY_PARSE(latitude AS FLOAT) IS not NULL AND
                        TRY_PARSE(longitude AS FLOAT) IS not NULL
                                                         THEN '{ "type" : "Point", "coordinates": [' + longitude + ', ' + latitude + ']}' END) as location
                FROM [global].[location] LOCATION
                WHERE LOCATION.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS locations,
                (SELECT *
                FROM [global].insurance insurance
                WHERE insurance.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS insurances,
                (SELECT *
                FROM [global].product product
                WHERE product.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS products,
                (SELECT *
                FROM [global].tenant_company_relationship tcr
                WHERE tcr.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS tcr,
                (SELECT *,
                    (SELECT description
                    from [global].industry
                    where industry.id = industryId) AS description_index,
                    (SELECT title
                    from [global].industry
                    where industry.id = industryId) AS title_index,
                    (SELECT code
                    from [global].industry
                    where industry.id = industryId) AS code,
                    JSON_QUERY((
                SELECT tenantId
                    FROM [global].tenant_industry AS ti
                    WHERE ti.industryId = industries.industryId
                    FOR JSON AUTO, INCLUDE_NULL_VALUES
            )) AS tenants
                FROM [global].company_industries_industry industries
                WHERE industries.companyId = company.id
                FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS industries,
                (SELECT TOP 1
                    *
                FROM [global].score score
                WHERE score.companyId = company.id
                ORDER BY score.timestamp DESC
                FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES)                                    AS score,
                company.rowversion                                                                             AS watermark
            FROM [global].[company] company`);

    await queryRunner.query(`
            DROP VIEW IF EXISTS [global].[company_locations_full_aggregate_index_backup]
            DECLARE @Definition NVARCHAR(MAX)
            DECLARE @ViewObjetId INT
            DECLARE @ViewName NVARCHAR(MAX) = 'company_location_full_aggregate_index'
            DECLARE @ViewBackUpName NVARCHAR(MAX) = 'company_location_full_aggregate_index_backup'
            
            SELECT
                @ViewObjetId = object_id
            FROM sys.objects
            where name = @ViewName
            
            SELECT
                @Definition = definition
            FROM
                sys.sql_modules
            WHERE
                 object_id
                 = @ViewObjetId
            
            SET @Definition = REPLACE(@Definition, @ViewName, @ViewBackUpName)
            EXEC(@Definition)
            DROP VIEW IF EXISTS [global].[company_location_full_aggregate_index]`);
    await queryRunner.query(`
        CREATE VIEW [global].[company_location_full_aggregate_index]
    AS
    SELECT
        l.id,
        l.addressStreet,
        l.addressStreet2,
        l.addressStreet3,
        l.postalCode,
        l.country,
        l.city,
        l.state,
        l.companyId,
        CONVERT (VARCHAR(MAX), CASE WHEN TRY_PARSE(latitude AS FLOAT) IS not NULL AND TRY_PARSE(longitude  AS FLOAT) IS not NULL THEN '{ "type" : "Point", "coordinates": [' + longitude + ', ' + latitude + ']}' END ) as location,
        l.latitude,
        l.longitude,
        company.description,
        company.legalBusinessName,
        company.doingBusinessAs,
        CASE
            WHEN company.legalBusinessName IS NOT NULL THEN company.legalBusinessName
            ELSE company.doingBusinessAs
        END AS displayName,
        company.otherBusinessNames,
        company.previousBusinessNames,
        (
        SELECT
            TOP 1
            Cast(ROUND(scoreValue,2) as int)
        FROM
            [global].score score
        WHERE
            score.companyId = company.id
        ORDER BY
            score.timestamp DESC
                                    ) AS scoreValue,
        company.typeOfLegalEntity,
        company.taxIdNo,
        company.yearFounded,
        company.revenue,
        company.customers,
        company.employeesTotal,
        company.leadershipTeamTotal,
        company.boardTotal,
        (
    SELECT
            STRING_AGG( ISNULL(t.tag, ' '), ',') As tags
        FROM [global].tags t, [global].company_tags_tags ctt
        WHERE ctt.tagsId = t.id and ctt.companyId = company.id
    ) AS tags,
        (
    SELECT STRING_AGG( ISNULL(do.diverseOwnership, ' '), ',') As diverseOwnership
        FROM [global].diverseOwnership do , [global].diverseOwnership_company doc
        WHERE doc.diverseOwnershipId = do.id and doc.companyId = company.id
    ) as diverseOwnership,
        company.diverseOwnershipPct,
        company.netProfit,
        company.netProfitPct,
        company.netPromoterScore,
        company.revenuePerEmployee,
        company.totalLiabilities,
        company.linkedInFollowers,
        company.facebookFollowers,
        company.twitterFollowers,
        (
            SELECT
            legalBusinessName
        FROM
            [global].company pc
        WHERE
            pc.id = company.parentCompanyId
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
        ) parentCompany,
        cast
(company.totalAssets as double precision) as totalAssets_double,
        cast
(
        company.employeesTotalGrowthCAGR as double precision
    ) as employeesTotalGrowthCAGR_double,
        CAST
(
        IIF
(
            revenue is null
            or revenue = 0,
            null,
(ISNULL
(totalAssets, 0) / revenue) * 100
        ) as double precision
    ) as assetsPctOfRevenue,
        CAST
(
        IIF
(
            revenue is null
            or revenue = 0,
            null,
(ISNULL
(totalLiabilities, 0) / revenue) * 100
        ) as double precision
        ) as liabilitiesPctOfRevenue,
        (
        SELECT
            name
        FROM
            [global].[contingency] contingency
        WHERE
            contingency.companyId = company.id
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
        ) AS contingencies,
        (
        SELECT
            name
        FROM
            [global].certification certification
        WHERE
            certification.companyId = company.id
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
            ) AS certifications,
        (
        SELECT
            name
        FROM
            [global].insurance insurance
        WHERE
            insurance.companyId = company.id
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
                    ) AS insurances,
        (
        SELECT
            name
        FROM
            [global].product product
        WHERE
            product.companyId = company.id
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
                        ) AS products,
        (
        SELECT
            tenantId,
            isFavorite,
            type,
            status
        FROM
            [global].tenant_company_relationship tcr
        WHERE
            tcr.companyId = company.id
        FOR JSON AUTO,
            INCLUDE_NULL_VALUES
                            ) AS tcr,
        (SELECT *,
            (SELECT description
            from [global].industry
            where industry.id = industryId) AS description_index,
            (SELECT title
            from [global].industry
            where industry.id = industryId) AS title_index,
            (SELECT code
            from [global].industry
            where industry.id = industryId) AS code,
            JSON_QUERY((
                SELECT tenantId
            FROM [global].tenant_industry AS ti
            WHERE ti.industryId = industries.industryId
            FOR JSON AUTO, INCLUDE_NULL_VALUES
            )) AS tenants
        FROM [global].company_industries_industry industries
        WHERE industries.companyId = company.id
        FOR JSON AUTO, INCLUDE_NULL_VALUES)                                                           AS industries,
        (
        SELECT
            TOP 1
            score.brandValue,
            score.customerValue,
            score.employeeValue,
            score.longevityValue,
            score.scoreValue
        FROM
            [global].score score
        WHERE
            score.companyId = company.id
        ORDER BY
            score.timestamp DESC
        FOR JSON AUTO,
            WITHOUT_ARRAY_WRAPPER,
            INCLUDE_NULL_VALUES
                                    ) AS score,
        company.rowversion AS watermark
    FROM [global].[location]  l
        LEFT JOIN [global].[company] company ON company.id = l.companyId`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP VIEW IF EXISTS [global].[company_full_aggregate_index]
        DECLARE @Definition NVARCHAR(MAX)
        DECLARE @ViewObjetId INT
        DECLARE @ViewName NVARCHAR(MAX) = 'company_full_aggregate_index'
        DECLARE @ViewBackUpName NVARCHAR(MAX) = 'company_full_aggregate_index_backup'
        
        SELECT
            @ViewObjetId = object_id
        FROM sys.objects
        where name = @ViewBackUpName
        
        SELECT
            @Definition = definition
        FROM
            sys.sql_modules
        WHERE
             object_id
             = @ViewObjetId
        
        SET @Definition = REPLACE(@Definition, @ViewBackUpName, @ViewName)
        EXEC(@Definition)`);

    await queryRunner.query(`
        DROP VIEW IF EXISTS [global].[company_location_full_aggregate_index]
        DECLARE @Definition NVARCHAR(MAX)
        DECLARE @ViewObjetId INT
        DECLARE @ViewName NVARCHAR(MAX) = 'company_location_full_aggregate_index'
        DECLARE @ViewBackUpName NVARCHAR(MAX) = 'company_location_full_aggregate_index_backup'

        SELECT
            @ViewObjetId = object_id
        FROM sys.objects
        where name = @ViewBackUpName

        SELECT
            @Definition = definition
        FROM
            sys.sql_modules
        WHERE
         object_id= @ViewObjetId

        SET @Definition = REPLACE(@Definition, @ViewBackUpName, @ViewName)
        EXEC(@Definition)`);
  }
}
