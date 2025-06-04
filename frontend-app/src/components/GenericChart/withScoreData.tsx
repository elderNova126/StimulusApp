import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import moment, { Moment } from 'moment';
import React from 'react';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { getCompanyName } from '../../utils/dataMapper';

const { COMPANY_SCORES_SEARCH_GQL } = CompanyQueries;
interface Company {
  id: string;
  legalBusinessName: string;
}

interface WithScoreDataProps {
  period?: { from: Moment; to: Moment };
  metric: string;
  companies: Company[];
}

interface NormalizedData {
  [key: string]: { timestamp: string }[];
}

/**
 *
 * @param data - data retrieved from user-api (stimulus scores)
 * @param companies - companies associated with stimulus scores from data
 */
const normalizeData = (data: any, companies: Company[]): NormalizedData => {
  let scores: any = {};
  const getDisplayName = (gqlName: string) => {
    // use the same delimiter like is in query
    const id = gqlName.split('__')[1].split('_').join('-');

    return getCompanyName(companies.find((company: Company) => company.id === id) as Company);
  };

  if (data) {
    scores = Object.keys(data).reduce((acc: any, curr: string) => {
      acc[getDisplayName(curr)] = data[curr].results || [];

      return acc;
    }, {} as any);
  }

  return scores;
};

/**
 *
 * @param data - normalized data (scores)
 * @return latest oldest timestamp from scores
 */
const getOldestDateFromData = (data: NormalizedData): Moment => {
  const allScores = Object.values(data);
  let oldestDate = moment();

  if (allScores.length) {
    const oldestScore = allScores
      .map((scores: any) => scores[scores.length - 1]) // scores are ordered desc by timestamp, we need to take the last one
      .sort((a, b) => {
        // and sort all of them to retrieve the latest timestamp which will appear in the chart
        return moment(a.timestamp) > moment(b.timestamp) ? 1 : -1;
      })[0]; // oldest score is at 0 position

    oldestDate = moment(oldestScore.timestamp);
  }

  return oldestDate;
};

/**
 * Preparing data for chart
 * @param companyScores - scores data
 * @param metric - the metric which is used for comparison
 * @param period - optional. If exists it will controll the X-Axis labels of the chart, otherwise the labels will be calculated from data retrieved
 */
const prepareData = (companyScores: NormalizedData, metric: string, period?: { from: Moment; to: Moment }) => {
  const result: any[] = [];
  const from = period?.from || getOldestDateFromData(companyScores);
  const to = period?.to || moment();
  let stepDuration: 'months' | 'years' = 'months';

  if (!period) {
    if (to.diff(from, 'months') > 24) {
      stepDuration = 'years';
    }

    // subtract 1 duration to see first score impact (from 0 to his value)
    from.subtract(1, stepDuration);
  }

  const currentDate = to.clone();

  const isClosestScore = (score: any, i: number, arr: any[]) => {
    return currentDate >= moment(score.timestamp);
  };

  do {
    /**
     * building the chart data
     * name - label for X axis
     * other keys are line labels mapped with the value of Y axis
     * for more details: https://recharts.org/en-US
     */

    result.push({
      name: currentDate.format('MM/YYYY'),
      ...Object.keys(companyScores).reduce((acc: any, curr: string) => {
        const stimulusScore: any = companyScores[curr].find(isClosestScore) || {};
        acc[curr] = Math.round(stimulusScore[metric] || 0);

        return acc;
      }, {} as any),
    });

    currentDate.subtract(1, stepDuration);
  } while (currentDate > from);

  return result.reverse();
};

export const prepareChartData = prepareData;

const withScoreData = (hocProps: { WrappedComponent: any; metadata: WithScoreDataProps }) => (props: any) => {
  const { WrappedComponent, metadata } = hocProps;
  const { companies, period, metric } = metadata;
  const { loading, data } = useQuery(COMPANY_SCORES_SEARCH_GQL({ companies, period, metric }), {
    fetchPolicy: 'cache-first',
  });
  const chartData = !loading ? prepareData(normalizeData(data, companies), metric, period) : null;

  return (
    <React.Fragment>{loading ? <CircularProgress /> : <WrappedComponent data={chartData} {...props} />}</React.Fragment>
  );
};

export default withScoreData;
