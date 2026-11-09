package org.nofre.back_office_api.i18n.get_internal_label_keys

import org.nofre.back_office_api.i18n.domain.Label
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service

internal interface GetLabelKeysRepository : Repository<Label, Long> {

    @Query(
        """
        select concat(g.key,'.',l.key) 
        from  Label l
        join  l.labelGroup g
        order by g.key, l.key
    """
    )
    fun listLabelKeys(): Set<String>
}

@Service
internal class GetLabelKeysHandler(val repository: GetLabelKeysRepository) {

    fun listLabelKeys(): Set<String> = repository.listLabelKeys()
}