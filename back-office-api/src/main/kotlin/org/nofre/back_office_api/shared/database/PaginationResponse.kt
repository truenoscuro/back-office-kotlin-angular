package org.nofre.back_office_api.shared.database

data class PaginationResponse<T>(
    val totalPages: Int,
    val totalElements: Long,
    val elements: List<T>
)

