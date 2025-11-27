package com.kushy.arcadia.repository

import com.kushy.arcadia.entity.Review
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ReviewRepository : JpaRepository<Review, Long> {

    // Verifica se já existe uma review para um usuário e jogo específicos
    // Retorna true se existir, false caso contrário
    fun existsByUserIdAndRawgGameId(userId: Long, rawgGameId: Long): Boolean

    // Busca todas as reviews feitas por um usuário
    fun findByUserId(userId: Long): List<Review>

    // Busca todas as reviews relacionadas a um jogo
    fun findByRawgGameId(rawgGameId: Long): List<Review>
}