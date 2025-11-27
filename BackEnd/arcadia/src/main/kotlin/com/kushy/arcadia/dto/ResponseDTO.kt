package com.kushy.arcadia.dto

import com.kushy.arcadia.entity.enums.Role

class ResponseDTO (
    val nome: String,
    val token: String? = null,
    val role: Role?,
    val type: String = "Bearer"
){
}