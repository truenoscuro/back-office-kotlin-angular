package org.nofre.back_office_api.auth.login

import org.nofre.back_office_api.auth.domain.User
import org.nofre.back_office_api.roles.RoleApiService
import org.nofre.back_office_api.shared.jwt.JwtService
import org.springframework.context.annotation.Bean
import org.springframework.data.repository.Repository
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service


@Bean
internal fun passwordEncoder() = BCryptPasswordEncoder()
internal interface LoginRepository : Repository<User, Long> {
    fun findByEmail(email: String): User?
}

@Service
internal class LoginHandler(
    val repository: LoginRepository,
    val roleApi: RoleApiService,
    val jwtService: JwtService,
    val passwordEncoder: PasswordEncoder
) {

    fun execute(request: LoginRequest): LoginResponse {
        //Se puede modificar por cada tipo de auth
        val user = checkNotNull(repository.findByEmail(request.email)) { "User not found" }

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw Exception("Invalid user")
        }

        val roleId = checkNotNull(user.roleid) { " EL usuario no tiene rol asignado" }
        val role = roleApi.getRole(roleId)
        return LoginResponse(
            token = jwtService.generate(email = user.email, role = role.name),
            role = role.name,
            permissions = role.permissions
        )
    }
}