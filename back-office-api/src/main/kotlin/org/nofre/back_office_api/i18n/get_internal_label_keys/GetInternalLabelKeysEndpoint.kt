package org.nofre.back_office_api.i18n.get_internal_label_keys

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

//TODO esto solo debe estar disponible en desarrollo
@RestController
internal class GetInternalLabelKeysEndpoint(val handler: GetLabelKeysHandler) {

    @GetMapping("/internal/api/translations/keys")
    fun listLabelKeys() = handler.listLabelKeys()


}