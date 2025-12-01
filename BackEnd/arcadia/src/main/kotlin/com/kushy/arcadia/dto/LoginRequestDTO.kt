package com.kushy.arcadia.dto

//  Basicamente os DTOs servem como os garçons entre o front e o backend,
//  levando somente as informações necessárias e assim ajudando na segurança da aplicação.
// lógica se aplica a todos.

data class LoginRequestDTO(
    val email: String,
    val password: String
)
