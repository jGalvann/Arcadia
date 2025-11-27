package com.kushy.arcadia.service.wishlist


import com.kushy.arcadia.dto.WishlistDTO
import com.kushy.arcadia.dto.WishlistResponseDTO
import com.kushy.arcadia.entity.User
import com.kushy.arcadia.entity.Wishlist
import com.kushy.arcadia.repository.UserRepository
import com.kushy.arcadia.repository.WishlistRepository
import com.kushy.arcadia.service.security.SecurityUtils
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties.Http
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class WishlistService(
    private val wishlistRepository: WishlistRepository,
    private val securityUtils: SecurityUtils,
) {

    fun addToWishlist(dto: WishlistDTO): WishlistResponseDTO {

        val authUser = securityUtils.getAuthenticatedUser()

        // Evita duplicação manualmente (e também pelo UniqueConstraint)
        if (wishlistRepository.existsByUserIdAndRawgGameId(authUser.id, dto.gameId)) {
            throw ResponseStatusException(HttpStatus.CONFLICT,"Este jogo já está na wishlist do usuário.")
        }

        val wishlist = Wishlist(
            user = authUser,
            rawgGameId = dto.gameId
        )

        return wishlistRepository.save(wishlist).toDTO()
    }


    fun removeFromWishlist(id: Long) {
        val item = wishlistRepository.findById(id)
            .orElseThrow{ ResponseStatusException(HttpStatus.NOT_FOUND, "Item da wishlist não encontrado")}

        val authUser = securityUtils.getAuthenticatedUser()

        if (item.user.id != authUser.id) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Voce não pode remover itens da wishlist de outro usuário" )
        }

        wishlistRepository.deleteById(id)
    }


    fun getRandomWishlistItem(): WishlistResponseDTO {

        val authUser = securityUtils.getAuthenticatedUser()
        val items = wishlistRepository.findByUserId(authUser.id!!)

        if (items.isEmpty()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Sua wishlist está vazia")
        }

        return items.random().toDTO()
    }

    fun getCurrentUserWishlist(): List<WishlistResponseDTO> {
        val authUser = securityUtils.getAuthenticatedUser()

        return wishlistRepository.findByUserId(authUser.id!!)
            .map { it.toDTO() }
    }


    fun Wishlist.toDTO() = WishlistResponseDTO(
        id = this.id,
        gameId = this.rawgGameId,
    )


}
