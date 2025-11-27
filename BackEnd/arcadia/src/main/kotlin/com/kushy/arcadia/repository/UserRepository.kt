package com.kushy.arcadia.repository

import com.kushy.arcadia.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/*
    O repository é a camada de Acesso de dados. É responsável pela comunicação direta com o banco de dados.
    Utiliza do JPA/Hibernate para criar, ler, atualizar e deletar os dados ( CRUD )

 */

@Repository // anotação que indica ao Spring que esta interface é um componente de acesso a dados.


interface UserRepository :JpaRepository<User, Long>{ // aqui ela da um "extends"
    // JpaRepository< [ entidade ], [ Tipo do ID ]> : Fornece os métodos de um CRUD básico.


    fun findByEmail(email: String): User?


    /*
    -------------------------------------------------------------------------------------------------
    temos fun dentro do repository pois:
        A arquitetura do Spring Boot divide o código em camadas, e cada uma tem sua responsabilidade,
        a camada aqui, se chama: Repository layer, que é responsável por:
            - Única e exclusivamente integir com o banco de dados.
            - Ela mapeia a entidade para a tabela e executa as consultas.
        a fun "findByEmail" é uma consulta no banco, por isso está aqui.
     -------------------------------------------------------------------------------------------------
     Outro ponto interessante, o Spring tem uma característica chamada "Query method derivation" que consiste em que:
     - O nome da função DEFINE seu comportamento.
     Ou seja, findByEmail significa -> SELECT * FROM users WHERE email = :email
     obs: tbm funciona em ptBR mas fica meio estranho, ent vou deixar em ingles.
     */
}
