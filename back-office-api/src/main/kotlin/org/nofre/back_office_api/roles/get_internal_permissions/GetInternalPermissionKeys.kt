package org.nofre.back_office_api.roles.get_internal_permissions

import org.nofre.back_office_api.roles.Permissions
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GetInternalPermissionKeys {

    @GetMapping("/internal/api/permissions/keys")
    fun getPermissionKeys() = Permissions.entries.toTypedArray()
}