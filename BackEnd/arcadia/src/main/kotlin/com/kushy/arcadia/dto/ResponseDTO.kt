package com.kushy.arcadia.dto

import com.kushy.arcadia.entity.enums.Role

class ResponseDTO (
    val nome: String,
    val token: String? = null,
    val role: Role?,    // ele envia a role, mas isso nao afeta na segurança, é somente para facilitar para o front. A role está dentro do token.
    val type: String = "Bearer"
){
}