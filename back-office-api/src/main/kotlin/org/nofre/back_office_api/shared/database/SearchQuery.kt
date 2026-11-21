package org.nofre.back_office_api.shared.database

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

data class SortField(val field: String, val direction: Sort.Direction = Sort.Direction.ASC)

fun List<SortField>.toSort(): Sort =
    if (this.isEmpty()) {
        Sort.unsorted()
    } else {
        Sort.by(
            this.map { Sort.Order(it.direction, it.field) }
        )
    }

data class SearchQuery<T>(
    val sorts: List<SortField> = emptyList(),
    val page: Int = 1,
    val limit: Int = 50,
    val filters: T? = null
) {

    fun getPageRequest() = PageRequest.of(
        page,
        limit,
        sorts.toSort()
    )


    fun getPageRequest(transform: (SortField) -> SortField) = PageRequest.of(
        page,
        limit,
        sorts.map { transform(it) }
            .toSort()
    )
}