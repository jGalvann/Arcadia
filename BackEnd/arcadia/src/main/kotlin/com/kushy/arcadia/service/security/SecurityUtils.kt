package com.kushy.arcadia.service.security

import com.kushy.arcadia.entity.User
import org.springframework.http.HttpStatus
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException

@Component

/*
    Essa classe faz a leitura do usuário autenticado e lança erros claros.
    Como ia ter q fzr essa validação varias vezes, mais facil criar isso aqui.
 */
class SecurityUtils {

    fun getAuthenticatedUser(): User { // recebe um usuário
        val auth = SecurityContextHolder.getContext().authentication                                                        // Pega o contexto anteriormente guardado
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado")                            // se não tiver, retornar um "seu autorização"
        val principal = auth.principal                                                                                      // principal representa o usuário autenticado
        if (principal !is User) {                                                                                           // se não for user,
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Principal inválido no contexto de segurança")
        }
        // assume que User.id não é null quando autenticado
        return principal
    }

    fun isAdmin(): Boolean {                                                                                                // Fun para checar as roles do usuário
        val auth = SecurityContextHolder.getContext().authentication
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado")

        return auth.authorities.any { it.authority == "ROLE_ADMIN" }
    }

}
