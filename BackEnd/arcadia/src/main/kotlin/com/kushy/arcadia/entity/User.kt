package com.kushy.arcadia.entity

import com.kushy.arcadia.entity.enums.Role
import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

// O lombok funciona mto bem em java, mas nem tanto assim em kotlin, então nao precisa das anotações @Getter, @Setter @NoArgsConstructor e @AllArgsConstructor. O Kotlin faz isso automaticamente.


@Entity // marca a classe como uma entidade JPA, que vai ser mapeada para o banco de dados.
@Table(name = "users")  // especifica o nome da tabela no banco de dados. ( não pode ser user, o postgres usa já esse nome )



class User(
    @Id // marca o campo como chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // define a estratégia de geração do ID, a IDENTITY usa a parada de auto-incremento do postgres
    var id: Long = 0L,

    var nickname: String = "",

    // O 'unique' garante que não haverá dois logins com o mesmo email.
    @Column(unique = true) // garante que o email seja único no banco.
    var email: String = "",

    // Senha criptografada.
    private var password : String = "",

    // @Enumerated(EnumType.STRING) é a melhor prática para o JPA.
    @Enumerated(EnumType.STRING) // @Enumerated(EnumType.STRING): Salva o nome do Enum ("USER" ou "ADMIN") no banco.
    var role : Role = Role.USER // Role padrão definida ( usuário ).

    // OBS: optei por fzr os relacionamentos unilaterais para manter a simplicidade da aplicação.
) :UserDetails { // é necessário fazer o import do UserDetails para a parte de validação/roles.


    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }


    override fun getUsername(): String = email // email como nome do usuário

    override fun getPassword(): String = password // informações importantes:

    /*
        O Kotlin gera automaticamente os getters e os setters das vars.
        E o UserDetails ( que é do java) pede que cada coisa tenha seu getter.
        O problema foi que, como esse biblioteca é mais veia podi, ela não estava reconhecendo os getters gerados automaticamente pelo Kotlin
        e se eu fizesse o override fun getPassword, ele dava erro tbm, pois havia 2 métodos iguais.

        Para resolver:
        Deixei a var password como private, e dei override no getPassword.
     */



    // todos esses metodos vem como false, mas como a ideia é fazer só um login simples, vou deixar tudo como true, aí n precisa validar, deus abencoe
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true

}

