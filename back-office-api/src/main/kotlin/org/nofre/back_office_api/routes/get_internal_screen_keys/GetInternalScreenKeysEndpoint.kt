package org.nofre.back_office_api.routes.get_internal_screen_keys

import org.nofre.back_office_api.routes.domain.ScreenKeys
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GetInternalScreenKeysEndpoint {


    @GetMapping("/internal/api/screens/keys")
    fun getScreenKeys() = ScreenKeys.entries.toTypedArray()

}