package org.nofre.back_office_api.i18n.get_translations

import org.nofre.back_office_api.i18n.I8nProvider
import org.springframework.stereotype.Service

@Service
internal class GetTranslationsHandler(val i8nProvider: I8nProvider) {
    fun getTranslations(locale: String): Map<String, String> = i8nProvider.getDictionary(locale)
}