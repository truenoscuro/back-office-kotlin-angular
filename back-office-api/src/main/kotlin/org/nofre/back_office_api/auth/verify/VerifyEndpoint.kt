package org.nofre.back_office_api.auth.verify

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController


@RestController
internal class VerifyEndpoint(val handler: VerifyHandler) {


    @GetMapping("/api/auth/verify")
    fun verify(@RequestHeader("Authorization") token: String) = handler.verify(token)

}