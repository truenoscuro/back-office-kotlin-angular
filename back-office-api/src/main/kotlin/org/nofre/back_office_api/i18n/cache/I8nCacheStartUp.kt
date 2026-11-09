package org.nofre.back_office_api.i18n.cache

import org.nofre.back_office_api.i18n.domain.Translation
import org.nofre.back_office_api.shared.logger.Loggable
import org.nofre.back_office_api.shared.logger.log
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional


internal interface I8nCacheRepositor : Repository<Translation, Long> {


    @Query(
        """
        SELECT t
        FROM Translation t
        WHERE t.language.isActive
        ORDER BY t.label.labelGroup.key, t.label.key
    """
    )
    fun findAllActives(pageable: Pageable): Slice<Translation>
}


@Component
internal class I8nCacheStartUp(
    val repository: I8nCacheRepositor, val cache: I8nCache
) : Loggable {

    @Transactional(readOnly = true)
    @EventListener(ApplicationReadyEvent::class)
    fun initializeCache() {
        try {

            cache.clear()

            var hasNextPage: Boolean
            var index = 0
            do {
                val translations = repository.findAllActives(PageRequest.of(index++, 100))
                hasNextPage = translations.hasNext()

                for (translation in translations) {
                    val language = translation.language!!.locale
                    val labelKey = translation.label!!.key
                    val labelGroupKey = translation.label!!.labelGroup!!.key
                    val label = "${labelGroupKey}.${labelKey}"
                    cache.add(
                        locale = language, key = label, translation = translation.value
                    )

                }


            } while (hasNextPage)
        } catch (e: Exception) {
            log.error("Error al inicializar la cache", e)
        }
    }
}
