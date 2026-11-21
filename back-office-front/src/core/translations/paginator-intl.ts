import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Elements per pàgina:';
  override nextPageLabel = 'Pàgina següent';
  override previousPageLabel = 'Pàgina anterior';
  override firstPageLabel = 'Primera pàgina';
  override lastPageLabel = 'Última pàgina';




}
