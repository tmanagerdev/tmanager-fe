export interface ApiResponse<T> {
  total: number;
  data: T[];
}

export interface ISort {
  field?: string | string[];
  order?: number;
}

export interface IDropdownFilters {
  filter: string;
}
