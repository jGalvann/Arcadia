package com.kushy.arcadia.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "reviews", uniqueConstraints = [
    UniqueConstraint(columnNames = ["user_id","game_id"]) // não permite varias reviews do mesmo usuário para o mesmo jogo.
])
class Review(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L,

    // CHAVES ESTRANGEIRAS (FKs)

    // 1. FK para User: Muitas Reviews  pertencem a Um User.
    @ManyToOne
    // @JoinColumn: Cria a coluna real no banco (user_id) que armazena a FK.
    // nullable = false: Uma review SÓ EXISTE se tiver um User.
    @JoinColumn(name = "user_id", nullable = false)
    var user: User = User(), // A Chave Estrangeira armazena o objeto User

    @Column(name= "game_id", nullable = false)
    var rawgGameId: Long,


    var nota: Float, // Nota de 0.5 a 5.0 por isso float

    @Column(columnDefinition = "TEXT")
    var textReview: String = "",

    var status: String = "", // zerou, jogando, abandonado... // n vou fzr uma enum class para isso, melhor deixar essa parte com o front.

    var dataReview: LocalDate = LocalDate.now()
) {

}