// Arquivo de Configuração Principal de Segurança (Spring Security)
package com.kushy.arcadia.config

import com.kushy.arcadia.service.security.SecurityFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration      // Demonstra que é uma classe de configuração, ou seja, o Spring DEVE carregar essa classe antes de carregar qualquer outra coisa.
@EnableWebSecurity  // Habilita a segurança web do Spring

class SecurityConfig( // Essa é uma classe meio que padrão do Spring, mas ainda sim vou explicar sobre.

    private val securityFilter: SecurityFilter
    // Add o filtro antes criado.
) {


    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {


        return http
            .cors{} // ativa o suporte ao CORS e usa as coisa do CorsConfig
            .csrf { csrf -> csrf.disable() } // csrf ( Cross-Site Request Forgery ) -> Desabilita essa parada pq vms usar o JWT QUE É STATELESS
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }        // Define a política da sessão como STATELESS
            .authorizeHttpRequests { authorize ->
                authorize   // Aqui ele faz com que os endPoints abaixo não precisem de autenticação.
                    .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                    .requestMatchers(HttpMethod.GET, "/games").permitAll()

                    .anyRequest().authenticated() // Qualquer outra request, o user vai precisar estar autenticado
                                                  // Caso não esteja, vai ter um 403 Forbidden pro maluco
            }
            // A N T E S de fzr o authorize do HttpRequest, ele roda esse filtro
            // o filtro ve se o token ta correto, e dai add o usuário no contexto.
            .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()
    }


    @Bean
    // Usa a anotação @Bean para mostrar que a função vai ser exportada no código inteiro, tirando a necessidade de importar manualmente a mesma.

    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager { // Coordena o processo de validação do usuário.
        return authenticationConfiguration.authenticationManager
    }


    @Bean
    fun passwordEncoder(): PasswordEncoder {        // Vai ser usado no Controller, mas é o métod para não salvar a senha sem proteção,
        return BCryptPasswordEncoder()              // Basicamente vai criptografar a senha em um hash
    }
}