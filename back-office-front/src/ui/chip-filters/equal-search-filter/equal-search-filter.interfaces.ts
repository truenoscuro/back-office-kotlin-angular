export interface EqualSearchField<T> {
  type: 'equals' | 'notEquals';
  values: T[];
}
