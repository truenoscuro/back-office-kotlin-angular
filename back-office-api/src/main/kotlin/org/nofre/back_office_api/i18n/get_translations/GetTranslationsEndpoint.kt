package org.nofre.back_office_api.i18n.get_translations

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GetTranslationsEndpoint(val handler: GetTranslationsHandler) {


    @GetMapping("/api/i18n/{locale}")
    fun getTranslations(@PathVariable locale: String) = handler.getTranslations(locale)


}