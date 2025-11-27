package com.kushy.arcadia.dto

data class ReviewCreateDTO(
    val gameId: Long,
    val nota: Float,
    val textReview: String,
    val status: String
)
