package com.kushy.arcadia.entity

import jakarta.persistence.*

@Entity
@Table(name = "wishlist", uniqueConstraints = [
    // @UniqueConstraint: Evita que um User adicione o MESMO Game duas vezes na Wishlist.
    UniqueConstraint(columnNames = ["user_id", "game_id"])
])
class Wishlist(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L,




    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    var user: User = User(),

    @Column(name = "game_id", nullable = false)
    var rawgGameId: Long,

    /* ----------------------------------------------------------------------- */
) {

}