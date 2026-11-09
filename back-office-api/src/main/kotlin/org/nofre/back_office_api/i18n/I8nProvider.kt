package org.nofre.back_office_api.i18n

interface I8nProvider {
    fun getDictionary(languageTag: String): Map<String, String>
    fun translate(languageTag: String, key: String): String
}
