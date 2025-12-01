package com.kushy.arcadia.controller

import com.kushy.arcadia.dto.ReviewCreateDTO
import com.kushy.arcadia.dto.ReviewResponseDTO
import com.kushy.arcadia.dto.ReviewUpdateDTO
import com.kushy.arcadia.entity.Review
import com.kushy.arcadia.repository.ReviewRepository
import com.kushy.arcadia.service.review.ReviewService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController                                                                                // Marca a classe como controller rest, recebendo requisição HTTP e retornando JSON
@RequestMapping("/reviews")                                                                 // define a rota base dos endpoints.
@CrossOrigin(origins = ["*"])
class ReviewController(
    private val reviewService: ReviewService,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)                                                       // retorna 201 ao criar
    fun create(@RequestBody dto: ReviewCreateDTO): ReviewResponseDTO {

        return reviewService.createReview(dto)                                               // chama o service para executar as funcs
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ReviewResponseDTO {
        return reviewService.getReviewById(id)
    }

    @GetMapping("/user/{userId}")
    fun getByUser(@PathVariable userId: Long): List<ReviewResponseDTO> {
        return reviewService.getReviewsByUser(userId)
    }

    @GetMapping
    fun getAllReviews() : List<ReviewResponseDTO> {
        return reviewService.getAllReviews()
    }

    @GetMapping("/game/{gameId}")
    fun getByGame(@PathVariable gameId: Long): List<ReviewResponseDTO> {
        return reviewService.getReviewsByGame(gameId)
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody dto: ReviewUpdateDTO
    ): ReviewResponseDTO {

        return reviewService.updateReview(id, dto)
    }

    @PutMapping("/{id}/like")
    fun likeReview(@PathVariable id: Long): ReviewResponseDTO {
        return reviewService.addLike(id)
    }

    @PutMapping("/{id}/dislike")
    fun dislikeReview(@PathVariable id: Long): ReviewResponseDTO {
        return reviewService.addDislike(id)
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)  // 204
    fun delete(@PathVariable id: Long) {

        reviewService.deleteReview(id)
    }
}

