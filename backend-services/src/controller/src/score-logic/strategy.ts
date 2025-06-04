export interface Strategy {
  [key: string]: {
    [key: string]: {
      baseline: number;
      range: number;
      impact: number;
      weight: number;
      getRatio: (value: number) => number;
      getNormImpact: (value: number) => number;
      getWeight: (value: number) => number;
    };
  };
}
export interface InputElementValue {
  [key: string]: number;
}
export interface InputElement {
  [key: string]: InputElementValue;
}

export const math = {
  getRatio(value: number) {
    if (typeof value === 'undefined') {
      return this.default / this.baseline;
    }
    if (value === 0 && this.baseline === 0) return 0;
    return value / this.baseline;
  },
  getNormImpact(value: number) {
    return (2 * this.range) / (1 + Math.exp(-3 * this.impact * (this.getRatio(value) - 1))) - this.range + 1;
  },

  getWeight(value: number) {
    return this.weight * this.getNormImpact(value);
  },
};
