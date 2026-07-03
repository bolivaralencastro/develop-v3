export type PageDto<T> = {
  data: T[];
  meta: PageMeta;
};

export type PageMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy?: string[];
  searchBy?: string[];
  search?: string;
  select?: string[];
  filter: {};
  links: PageLinksMeta;
};

export type PageLinksMeta = {
  first: string;
  previous: string;
  current: string;
  next: string;
  last: string;
};

export type BaseFilter<T> = {
  page?: number;
  limit?: number;
  search?: string;
} & FilterMask<T>;

type FilterMask<T> = {
  [K in keyof T as `filter.${string & K}`]?: T[K][];
};
