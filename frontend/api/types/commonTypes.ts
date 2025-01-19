export interface CursorPaginatedProps<T> {
  results: T[];
  next: string | null;
  previous: string | null;
}

export interface PagePaginatedProps<T> {
  results: T[];
  count: number | null;
  next: string | null;
  previous: string | null;
}

export type ErrorResponse = string | Array<string> | null;
