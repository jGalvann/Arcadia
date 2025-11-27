package com.kushy.arcadia.controller

import com.kushy.arcadia.dto.WishlistDTO
import com.kushy.arcadia.dto.WishlistResponseDTO
import com.kushy.arcadia.service.wishlist.WishlistService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/wishlist")

// Libera o acesso via CORS para qualquer origem (frontend)
@CrossOrigin(origins = ["*"])

class WishlistController(
    private val wishlistService: WishlistService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)                                             // 201
    fun addToWishlist(@RequestBody dto: WishlistDTO): WishlistResponseDTO {
        return wishlistService.addToWishlist(dto)
    }


    @GetMapping()
    fun getOwnWishList(): List<WishlistResponseDTO> {
        return wishlistService.getCurrentUserWishlist()
    }


    @GetMapping("/random")
    fun getRandomItem(): WishlistResponseDTO{
        return wishlistService.getRandomWishlistItem()
    }

    @DeleteMapping("/{id}")
    fun removeItem(@PathVariable id: Long) =
        wishlistService.removeFromWishlist(id)
}
