export function computeScoreSearchGQL(metric: string, from: string, limit: 1 | -1) {
  return (company: { id: string }) => `
      ${getScoreQueryNameFromCompanyId(company.id)}:stimulusScores(
        companyId: "${company.id}",
        limit: ${limit},
        orderBy: "timestamp",
        direction: "DESC",
        timestampFrom: "${from}",
      ){
        ... on StimulusScoreResponse{
          results{
            id
            ${metric}
            timestamp
          }
        }
      }
      `;
}

export function computeTargetScoreGql(projectId: number) {
  return (company: { id: string; taxIdNo: string }) => `
    ${getTargetScoreQueryNameFromCompanyId(company.id)}:companyExpectedScore(
      taxIdNoSupplier: "${company.taxIdNo}",
      id: ${projectId}
    ) {
      scoreValue
    }`;
}

const queryNameFromCompanyId = (id: string) => id?.split('-').join('_');
export const getScoreQueryNameFromCompanyId = (id: string) => `score__${queryNameFromCompanyId(id)}`;
export const getTargetScoreQueryNameFromCompanyId = (id: string) => `targetscore__${queryNameFromCompanyId(id)}`;
