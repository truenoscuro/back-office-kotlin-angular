export interface EqualField<T> {
  type: 'equals' | 'notEquals';
  values: T[];
}
