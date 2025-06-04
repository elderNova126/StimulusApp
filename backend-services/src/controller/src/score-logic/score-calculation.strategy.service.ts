import { Injectable } from '@nestjs/common';
import { Element } from './element.interface';
import { Strategy, math } from './strategy';

@Injectable()
export class CalculationStrategyService {
  private strategy: Strategy;

  initStrategy(scoreDefinition) {
    this.strategy = Object.keys(scoreDefinition).reduce(
      (acc: Strategy, categoryElement: string) => ({
        ...acc,
        [categoryElement]: Object.keys(scoreDefinition[categoryElement]).reduce((acc: any, elementId: string) => {
          return {
            ...acc,
            [elementId]: {
              ...scoreDefinition[categoryElement][elementId],
              ...math,
            },
          };
        }, {}),
      }),
      {}
    );
  }

  checkElements(data) {
    for (const component of Object.keys(this.strategy)) {
      for (const element of Object.keys(this.strategy[component])) {
        if (!data[component][element]) data[component][element] = this.strategy[component][element].baseline;
      }
    }
    return data;
  }

  getWeight(categoryElement: string, element: Element) {
    try {
      return this.strategy[categoryElement][element.id].getWeight(element.value);
    } catch (error) {
      return 0; // if specified element or value of it is not available in the strategy
    }
  }
}
