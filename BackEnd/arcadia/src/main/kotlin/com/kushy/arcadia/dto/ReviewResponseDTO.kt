package com.kushy.arcadia.dto


data class ReviewResponseDTO(
    val id: Long,
    val userId: Long,
    val gameId: Long,
    val nota: Float,
    val textReview: String?,
    val status: String?,
    val dataReview: String,
)
