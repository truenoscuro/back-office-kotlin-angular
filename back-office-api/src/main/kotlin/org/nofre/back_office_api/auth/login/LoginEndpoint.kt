package org.nofre.back_office_api.auth.login

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
internal class LoginEndpoint(val handler: LoginHandler) {


    @PostMapping("/api/auth/login")
    fun login(@RequestBody request: LoginRequest) = handler.execute(request)

}


