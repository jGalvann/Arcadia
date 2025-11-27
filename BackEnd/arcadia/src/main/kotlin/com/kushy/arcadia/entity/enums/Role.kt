package com.kushy.arcadia.entity.enums

import org.springframework.security.core.GrantedAuthority

/*
   Basicamente, para o Spring Security, não importa se tu tens algo chamado "Role", "Função" ou oq seja. Tudo isso é uma GrantedAuthority.
   Isso padroniza como  o framework checa o acesso.
   A unica coisa que o Spring precisa saber é o nome dessa autoridade, que é obtido através do getAuthority, que nesse caso vai retornar "ROLE_USER ou ROLE_ADMIN"

 */

enum class Role : GrantedAuthority{
    ADMIN {
        override fun getAuthority(): String = "ROLE_ADMIN" // essa é a implementação exigida pelo GrantedAuthority para cada constante.
        // para admin, retorna -> ROLE_ADMIN
    },
    USER {
        override fun getAuthority(): String = "ROLE_USER"
        // e para user, retorna -> ROLE_USER
    };

    abstract override fun getAuthority(): String // essa fun, declara que o métod getAuthority() deve ser implementado a cada membro do enum.
    // usar abstract garante que você não se esqueça de fornecer a string de autoridade para cada novo papel que adicionar ao enum.
}