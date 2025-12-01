package com.kushy.arcadia.repository

import com.kushy.arcadia.entity.Wishlist
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/*
    O repository é a camada de Acesso de dados. É responsável pela comunicação direta com o banco de dados.
    Utiliza do JPA/Hibernate para criar, ler, atualizar e deletar os dados ( CRUD )

 */

@Repository
interface WishlistRepository : JpaRepository<Wishlist, Long> {

    // Verifica se já existe um item na wishlist para o usuário e jogo
    fun existsByUserIdAndRawgGameId(userId: Long, rawgGameId: Long): Boolean

    // Busca todos os itens da wishlist de um usuário
    fun findByUserId(userId: Long): List<Wishlist>
}
