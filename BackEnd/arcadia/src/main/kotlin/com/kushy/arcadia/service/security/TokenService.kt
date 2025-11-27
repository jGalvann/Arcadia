package com.kushy.arcadia.service.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTCreationException
import com.auth0.jwt.exceptions.JWTVerificationException
import com.kushy.arcadia.entity.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Service      // marca essa classe como um componente de serviço gerenciado pelo Spring.
class TokenService {

    @Value("\${api.security.token.secret}")         // pega o valor da api.secutiry.... definida no applicationProperties
    private lateinit var secret : String     // precisa desse lateinit
    // metodo de criação/geração do token, que vai ser usando qndo o usuário for fzr login/registro

    fun generateToken (user: User): String {
        return try{

            val algoritmo = Algorithm.HMAC256(secret)        // criando o algoritmo de criptografia ( e escolhando o HMAC256 ) e passando a secretKey

            JWT.create()
                .withIssuer("arcadia-api")            // quem está emitindo o token ( nome da aplicação )
                .withSubject(user.email)                    // É a identidade do token, no caso vai ser o Email do usuário
                .withExpiresAt(generateExpirationDate())    // data de validade do token
                .sign(algoritmo)                            // Assina o token com o algoritmo
        }catch (exception: JWTCreationException) {          // lança uma exceção caso de algum erro na criação
            throw RuntimeException("Erro ao gerar token JWT", exception)
        }
    }


    fun validateToken (token : String) : String? {
        return try {
            val algoritmo = Algorithm.HMAC256(secret)

            JWT.require(algoritmo)
                .withIssuer("arcadia-api")           // verifica se o emissor é o mesmo
                .build()                                   // monta o obj para fzr a verificação
                .verify(token)                             // verifica a assinatura e a expiração do token
                .subject                                   // se tu estiver certo, ele retorna o EMAIL
        }catch (exception : JWTVerificationException) {    // se falhar, retorna nulo
            null
        }
    }

    private fun generateExpirationDate (): Instant {
        return LocalDateTime.now().plusHours(+2).toInstant(ZoneOffset.of("-03:00"))
    }

}