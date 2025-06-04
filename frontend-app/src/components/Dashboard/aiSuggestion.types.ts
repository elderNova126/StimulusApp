export interface Data {
  Company: string[];
  xAxis: number[];
  yAxis: number[];
  zAxis: number[];
}

export interface DataFrame extends Data {
  colorValue: number[];
}

export interface ChartData {
  companiesName: string[];
  column1: number[];
  column2: number[];
  column3: number[];
}
