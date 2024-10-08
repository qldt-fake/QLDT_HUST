export interface IGetSavedSearch {
  index: number;
  count: number;
}

export interface ISavedSearch {
  id: number;
  keyword: string;
  created: Date;
}

export interface IDeleteSavedSearch {
  search_id: number;
  all: number;
}

export interface ISearch {
  keyword: string;
  user_id: any;
  index: number;
  count: number;
}

export interface ISearchResult {
  id: number;
  name: string;
  image: any;
  described: string;
  created: Date;
  feel: number;
  mark_comment: number;
  is_felt: number;
  state: string;
  author: any;
}

export interface IGetSearchUser {
  keyword: string;
  index: number;
  count: number;
}
