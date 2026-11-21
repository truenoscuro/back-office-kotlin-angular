export interface ChipEqualField<T> {
  type: 'equals' | 'notEquals';
  values: T[];
}
