package org.nofre.back_office_api.i18n.cache

import org.nofre.back_office_api.i18n.I8nProvider
import org.nofre.back_office_api.shared.logger.Loggable
import org.nofre.back_office_api.shared.logger.log
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

@Service
class I8nCache : I8nProvider, Loggable {

    private val dictionary: ConcurrentMap<String, MutableMap<String, String>> = ConcurrentHashMap()

    internal fun clear() {
        dictionary.clear()
    }

    //Actualizamos  el diccionario
    internal fun add(locale: String, key: String, translation: String) {

        if (isInvalidKeyFormat(key)) return

        val languageDictionary = dictionary.getOrPut(locale) { mutableMapOf() }
        languageDictionary[key.uppercase()] = translation
    }

    private fun isInvalidKeyFormat(key: String): Boolean {
        if (key.split(".").size != 2) {
            log.warn("Invalid key format")
            return true
        }
        return false
    }


    override fun translate(languageTag: String, key: String): String {

        if (isInvalidKeyFormat(key)) {
            return key
        }

        return dictionary[languageTag]?.get(key.uppercase()) ?: key
    }

    override fun getDictionary(languageTag: String): Map<String, String> {
        return dictionary[languageTag] ?: emptyMap()
    }
}