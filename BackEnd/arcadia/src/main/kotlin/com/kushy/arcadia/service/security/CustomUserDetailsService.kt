package com.kushy.arcadia.service.security

import com.kushy.arcadia.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/*
   o CustomUserDetailsService, funciona DURANTE o processo de login, ele faz a autenticação inicial, antes de gerar o token.
 */



@Service // marca um bean do tipo serviço.

class CustomUserDetailsService(

    // essa parte aqui, não é o padrão dessa classe, o padrão faria ela buscar de forma genérica, ou em memória.
    // no nosso caso, ele vai buscar os usuários dentro da base ( banco )
    private val userRepository: UserRepository
) : UserDetailsService {


    override fun loadUserByUsername(username: String): UserDetails {
            // o loadUserByUsername é o métod obrigatório dessa classe, ele é chamado automaticamente pelo SpringSecurity
            // no momento do login, enviando as credenciais do usuario.

            // primeiro recebe o paramêtro "username", que não precisa necessariamente o nome do usuário, no nosso caso é o email ( só vai dar de fzr login via email e senha, não com nome e senha )
            // no caso, o spring chama loadByUsername("email@doExemplo"), que é o valor que veio do json

            // depois, ele usa o UserRepository para buscar esse email no banco de dados.
            // a pesquisa retorna um objeto User, que implementa o UserDetails
            // Sempre que implementar o userDetails, é pq o spring precisa dos métodos dessa parada, que são os getters para nome(ou email), senha, e as perms


        return userRepository.findByEmail(username) ?: throw UsernameNotFoundException("Usuário não encontrado com o email: $username")
    }       // dai aqui tem o grande elvis, se for null o da esquerda, executa o da direita.
}