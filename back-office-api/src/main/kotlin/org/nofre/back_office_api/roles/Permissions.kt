package org.nofre.back_office_api.roles

enum class Permissions {
    // Permiso de  rol con permiso a todo lo de administación básica
    ROLE_SUPER_ADMIN,

    // Permiso de rol  anónimo
    ROLE_ANONYMOUS,

    //Permisos reales que puete tener una paersona
    ROUTE_READ,
    ROUTE_WRITE,
    USER_READ,
    USER_WRITE,
    USER_DELETE,
    ROLE_READ,
    ROLE_WRITE,
    ROLE_DELETE,
    TRANSLATION_READ,
    TRANSLATION_WRITE,
}