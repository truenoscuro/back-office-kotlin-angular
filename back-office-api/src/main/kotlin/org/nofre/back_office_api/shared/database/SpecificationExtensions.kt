package org.nofre.back_office_api.shared.database

import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.Expression
import jakarta.persistence.criteria.Predicate
import org.springframework.data.domain.Page

/**
 * Método que no tiene en cuenta el case sensitive
 */
fun CriteriaBuilder.ilike(expression: Expression<String>, pattern: String) =
    if (pattern.isEmpty()) {
        this.conjunction()
    } else {
        this.like(this.lower(expression), pattern.lowercase())
    }


fun <T> CriteriaBuilder.equalFilter(expression: Expression<T>, filter: EqualFilter<T>): Predicate =
    if (filter.values.isEmpty()) {
        this.conjunction()
    } else if (filter.type == EqualFilterType.equals) {
        expression.`in`(filter.values)
    } else {
        expression.`in`(filter.values)
            .not()
    }

fun <T : Any, R> Page<T>.toResponse(transform: (T) -> R) = PaginationResponse(
    totalPages = this.totalPages,
    totalElements = this.totalElements,
    elements = this.content.map(transform),
)