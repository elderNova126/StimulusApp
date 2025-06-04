export interface IOrderDTO {
  key: string;
  direction: 'ASC' | 'DESC';
}

export interface IOrder {
  [propName: string]: 'ASC' | 'DESC';
}
