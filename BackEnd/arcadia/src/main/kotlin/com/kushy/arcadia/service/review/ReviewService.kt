package com.kushy.arcadia.service.review

import com.kushy.arcadia.dto.ReviewCreateDTO
import com.kushy.arcadia.dto.ReviewResponseDTO
import com.kushy.arcadia.dto.ReviewUpdateDTO
import com.kushy.arcadia.entity.Review
import com.kushy.arcadia.entity.User
import com.kushy.arcadia.repository.ReviewRepository
import com.kushy.arcadia.repository.UserRepository
import com.kushy.arcadia.service.security.SecurityUtils
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.format.DateTimeFormatter

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val securityUtils: SecurityUtils
) {

    fun createReview(dto: ReviewCreateDTO): ReviewResponseDTO {

        val authUser: User = securityUtils.getAuthenticatedUser()

        // validação nota
        if (dto.nota < 0.5f || dto.nota > 5f)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Nota deve estar entre 0.5 e 5.0")



        if (reviewRepository.existsByUserIdAndRawgGameId(authUser.id!!, dto.gameId)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "O usuário já fez review desse jogo. ( RAWG ID: ${dto.gameId}")
        }

        val review = Review(
            user = authUser,        // ver se tem problema deixar o authUser aqui, que dai economiza uma pesquisa no banco
            rawgGameId = dto.gameId,
            nota = dto.nota,
            textReview = dto.textReview,
            status = dto.status
        )

        return reviewRepository.save(review).toDTO()
    }


    fun updateReview(id: Long, dto: ReviewUpdateDTO): ReviewResponseDTO {              // Aqui ele está recebendo o ID do @PathVariable

        val review = reviewRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Review não encontrada") }

        val authUser = securityUtils.getAuthenticatedUser()

        val isOwner = review.user.id == authUser.id
        val isAdmin = securityUtils.isAdmin()

                                                                                        //  Forbidden se NÃO for o dono E NÃO for Admin
        if (!isOwner && !isAdmin)
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para alterar esta review")
        // atualização parcial
        review.nota = dto.nota ?: review.nota
        review.textReview = dto.textReview ?: review.textReview
        review.status = dto.status ?: review.status


        if (review.nota < 0.5f || review.nota > 5f)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Nota deve estar entre 0.5 e 5.0")

        return reviewRepository.save(review).toDTO()
    }

    fun deleteReview(id: Long) {

        val review = reviewRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Review não encontrada") }

        val authUser = securityUtils.getAuthenticatedUser()

        val isOwner = review.user.id == authUser.id
        val isAdmin = securityUtils.isAdmin()

        if (!isOwner && !isAdmin) {                 // checa se o usuário é o owner da review ou se é admin.
            throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Você não tem permissão para excluir esta review."
            )
        }


        reviewRepository.deleteById(id)
    }

    fun Review.toDTO() = ReviewResponseDTO(
        id = this.id!!,
        userId = this.user.id!!,
        gameId = this.rawgGameId,
        nota = this.nota,
        textReview = this.textReview,
        status = this.status,
        dataReview = this.dataReview.format(DateTimeFormatter.ISO_DATE)
    )


    fun getReviewById(id: Long): ReviewResponseDTO {
        val review = reviewRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Review não encontrada") }

        return review.toDTO()
    }


    fun getReviewsByUser(userId: Long): List<ReviewResponseDTO> {
        return reviewRepository.findByUserId(userId)
            .map { it.toDTO() }
    }


    fun getReviewsByGame(gameId: Long): List<ReviewResponseDTO> {
        return reviewRepository.findByRawgGameId(gameId) // <-- CORRIGIDO
            .map { it.toDTO() }
    }
}
