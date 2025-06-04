import { Injectable } from '@nestjs/common';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CustomMetric } from '../evaluation/custom-metric.entity';

export interface ScoreComponents {
  quality: number;
  reliability: number;
  features: number;
  cost: number;
  relationship: number;
  financial: number;
  diversity: number;
  innovation: number;
  flexibility: number;
  brand: number;
}

const normalization = (value, fromInterval, toInterval) => {
  const [min, max] = fromInterval;
  const [a, b] = toInterval;

  return ((b - a) * (value - min)) / (max - min) + a;
};

const metricNormalization = (value, metric) => {
  const { exceptionalValue, metExpectationsValue, unsatisfactoryValue } = metric;
  const isAscendent = unsatisfactoryValue < metExpectationsValue && metExpectationsValue < exceptionalValue;
  const isDescendent = unsatisfactoryValue > metExpectationsValue && metExpectationsValue > exceptionalValue;
  let returnValue = 0;

  if (isAscendent) {
    if (value < metExpectationsValue) {
      returnValue = normalization(value, [unsatisfactoryValue, metExpectationsValue], [-10, 0]);
    } else {
      returnValue = normalization(value, [metExpectationsValue, exceptionalValue], [0, 10]);
    }
  } else if (isDescendent) {
    if (value > metExpectationsValue) {
      returnValue = -10 - normalization(value, [metExpectationsValue, unsatisfactoryValue], [-10, 0]);
    } else {
      returnValue = 10 - normalization(value, [exceptionalValue, metExpectationsValue], [0, 10]);
    }
  }

  const roundValue = Math.round(returnValue);
  return Math.min(Math.max(roundValue, -10), 10);
};

@Injectable()
export class ScoreLogicServiceV2 {
  private readonly scoreComponents = [
    'quality',
    'reliability',
    'features',
    'cost',
    'relationship',
    'financial',
    'diversity',
    'innovation',
    'flexibility',
    'brand',
  ];
  private readonly weights = {
    quality: 20,
    reliability: 18,
    features: 13,
    cost: 12,
    relationship: 10,
    financial: 7,
    diversity: 5,
    innovation: 5,
    flexibility: 5,
    brand: 5,
  };
  private readonly sumWeights = Object.values(this.weights).reduce((acc, curr) => acc + curr, 0);

  computeProjectScore(components: ScoreComponents) {
    const overallPerformance =
      this.scoreComponents.reduce((acc, curr) => acc + components[curr] * this.weights[curr], 0) / this.sumWeights;
    const evaluationScore = 1000 + 100 * overallPerformance;
    return {
      overallPerformance,
      evaluationScore,
    };
  }

  computeEvaluation(
    components: ScoreComponents,
    budgetSpent: number,
    projectDate: Moment,
    customMetrics: CustomMetric[]
  ) {
    const getComponentValue = (id: string) => {
      const customMetric = customMetrics.find((metrics) => metrics.extendsCategory === id);
      return customMetric ? metricNormalization(components[id], customMetric) : components[id];
    };
    const overallPerformance =
      this.scoreComponents.reduce((acc, curr) => acc + getComponentValue(curr) * this.weights[curr], 0) /
      this.sumWeights;
    const evaluationScore = 1000 + 100 * overallPerformance;
    const monthSinceEval = Math.min(Math.max(moment.utc().diff(projectDate, 'months'), 24), 84);
    const denominator = budgetSpent * (1 - (monthSinceEval - 24) / 60);

    const numerators = this.scoreComponents.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: (1000 + 100 * getComponentValue(curr)) * budgetSpent * (1 - (monthSinceEval - 24) / 60),
      }),
      {}
    );
    Object.assign(numerators, {
      overall: (1000 + 100 * overallPerformance) * budgetSpent * (1 - (monthSinceEval - 24) / 60),
    });
    return {
      overallPerformance,
      evaluationScore,
      budgetSpent,
      monthSinceEval,
      denominator,
      numerators,
    };
  }
}
