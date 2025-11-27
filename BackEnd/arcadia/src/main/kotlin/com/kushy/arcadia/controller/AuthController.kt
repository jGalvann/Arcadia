package com.kushy.arcadia.controller

import com.kushy.arcadia.dto.LoginRequestDTO
import com.kushy.arcadia.dto.RegisterRequestDTO
import com.kushy.arcadia.dto.ResponseDTO
import com.kushy.arcadia.entity.User
import com.kushy.arcadia.entity.enums.Role
import com.kushy.arcadia.repository.UserRepository
import com.kushy.arcadia.service.security.TokenService
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
    // Marca a classe como um controller Rest, ou seja, os métodos retornam JSON/resposta HTTP.

@RequestMapping("/auth")
    // Prefixa todas as rotas dessa classe como /auth.

class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val tokenService: TokenService
) {

    // Endpoint para fazer login
    @PostMapping("/login") // a rota aqui fica POST /auth/login
    fun login(@RequestBody body: LoginRequestDTO): ResponseEntity<ResponseDTO> {                    // Essa classe espera um JSON para ser "quebrado" pelo DTO.
                                                                                                    // No nosso caso tem email e senha.

        val usernamePassword = UsernamePasswordAuthenticationToken(body.email, body.password)       // Cria um UsernamePasswordAuthenticationToken contendo as credenciais.


        val auth = this.authenticationManager.authenticate(usernamePassword)                        // Envia o token para o AuthenticationManager
                                                                                                    // O Spring vai chamar o CustomUserDetailsService.loadUserByUsername(email)
                                                                                                    // Vai obter o UserDetails, vai comparar a senha enviada com a senha armazenada usando o PasswordEncoder
                                                                                                    // Se estiverem erradas, o métod lança uma exceção ( bad credentials )

        val user = auth.principal as User                                                           // auth.principal é o objeto principal autenticado
        val token = tokenService.generateToken(user)                                                // chama o tokenService.generateToken(user) para gerar o tokenJWT que vai ser usado adiante.


        return ResponseEntity.ok(ResponseDTO(user.nickname, token, user.role))                      // Vai retornar um 200 OK com um responseDTO, contendo o Nome do usuário e o Token,
    }


        // endpoint para se registrar
    @PostMapping("/register") // /auth/register
    fun register(@RequestBody body: RegisterRequestDTO): ResponseEntity<ResponseDTO> {


        val existingUser: User? = userRepository.findByEmail(body.email)                            // verifica se o user existe, retorna um User ou null

        if (existingUser != null) {

            return ResponseEntity.badRequest().body(ResponseDTO("Usuário já existe", null, null)) // se existe, vai retornar um bad request, e no DTO de resposta vai ter "User já existe"
        }

        val encryptedPassword = passwordEncoder.encode(body.password)                               // Cria o hash da senha com o PasswordEncoder | BCrypt
                                                                                                    // não pode ser null

                                                                                                    // Cria a nova entidade User
        val newUser = User(
            // id é gerado pela JPA
            nickname = body.username,
            email = body.email,
            password = encryptedPassword,
            role = Role.USER    // define a role USER como a padrão.
        )



        val savedUser = userRepository.save(newUser)                                                // Persiste o usuário no banco.
                                                                                                    // .save é um métod do JpaRepository


        return ResponseEntity.ok(ResponseDTO(savedUser.nickname, null, null))       // retorna o responseDTO com o nome do usuário, mas sem token
    }
}