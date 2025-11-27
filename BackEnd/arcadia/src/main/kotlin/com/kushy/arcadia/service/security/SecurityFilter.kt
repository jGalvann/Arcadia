package com.kushy.arcadia.service.security

import com.kushy.arcadia.entity.User
import com.kushy.arcadia.repository.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

/*
    Basicamente o SecurityFilter é o porteiro de um role, onde vai verificar se as pessoas tem o ingresso, e para qual área é o mesmo,
    ou seja, é aqui que o Token vai ser validado, e onde as permissões de casa usuário vao ser dadas.
    Normalmente as permissões são listas, então o mais básico seria a role de user, um usuário admin, vai ter em sua lista algo como ( role_user, role_admin), ou seja
    ele vai ter todas as permissões que um usuário comum tem, e as permissões de admin.

 */
@Component // indica ao security que deve gerenciar essa classe como um Bean.
class SecurityFilter(

    private val tokenService: TokenService,              // responsável por gerar e validar os tokens JWT
    private val userRepository: UserRepository           // usado para Buscar o usuário no banco pelo email extraído do token

) : OncePerRequestFilter() { // filtro que é executado UMA VEZ por request ( assim que funfa o stateless )


    override fun doFilterInternal( // Métod principal

        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain

    ) {

        if (request.servletPath.startsWith("/auth")) {
            filterChain.doFilter(request, response)
            return
        }

        val tokenJWT = recoverToken(request) // Aqui ele pega o token do cabeçalho HTTP
            // a estrutura de um Token JWT é a seguinte -> TokenJWK = Header.Payload.Signature
            // basicamente é uma  string gigante separada por pontos.
            // No header vai ter o algoritmo de assinatura, e o tipo do token ( HMAC256, e JWT )
            // no payload vai ter as informações do usuário e o tempo de expiração
            // e na signature, tem o resultado da criptografia do Header + Payload usando a secretKey.
            // a Informação normalmente vem assim: Authorization: Bearer <token>, aí ele tira o Bearer e deixa só o token.



        if (tokenJWT != null) {

            val subject = tokenService.validateToken(tokenJWT)
                // Aqui a ideia é validar o token e extrair o subject.
                // a classe TokenService decodifica o tokenJWT, valida a assinatura e sua expiração, e retornar o subject ( email do usuário autenticado )
                // se estiver inválido, ou expirado, vai ter retorno NULL


            if (subject != null) { // checa se o token tava podre veio

                val usuario: User? = userRepository.findByEmail(subject)
                // Busca o usuário que corresponde ao subject.
                // o retorno disso é uma entidade User, que tem o getUsername, getPassword e getAuthorities
                // Agora, esse objeto é reconhecido pelo SpringSecurity

                if (usuario != null) { // se n tem token, não tem user, se não tem user, não tem como autenticar nada.

                    val authentication = UsernamePasswordAuthenticationToken(usuario, null, usuario.authorities)
                    // Esse é o objeto de autenticação interna do SpringBoot, que guarda:
                    // quem é o usuário
                    // senha
                    // lista de permissões do mesmo


                    SecurityContextHolder.getContext().authentication = authentication
                    // Aqui o usuário autenticado é injetado no contexto atual da requisição
                    // a partir daqui o spring reconhece a requisição como autenticada.
                    // qualquer endpoint protegido por @PreAuthorize ou @RolesAllowed sabem agora, quem é o usuário.
                }
            }
        }


        filterChain.doFilter(request, response)
            // depois que o filtro faz a verificação e registra o usuário autenticado, ele manda o request para frente.
            // podendo ser para outro filtro, ou para um controller.
    }


    private fun recoverToken(request: HttpServletRequest): String? {  // recebe o request que veio do user
        val authorizationHeader = request.getHeader("Authorization")  // pega o header authorization, que no nosso caso, é onde está o token
        return authorizationHeader?.replace("Bearer ", "")
    }
}