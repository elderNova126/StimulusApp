export interface IPaginationDTO {
  page: number;
  limit: number;
}

export interface IPagination {
  take?: number;
  skip?: number;
}
