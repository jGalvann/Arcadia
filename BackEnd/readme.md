# ARCADIA - BackEnd
### Plataforma Social de Games

A construção do arcadia vem devido a um projeto de integração das matérias de desenvolvimento Front e Back end, no qual optamos por fazer uma aplicação parecida com o conhecido "Letterboxd", mas, que ao invés de filmes, o foco seria em jogos. 

---

## Informações Técnicas: 
### Tecnologias Utilizadas 

| Categoria | Tecnologia |
| :--- | :--- |
| Linguagem | Kotlin |
| Framework Web | Spring Boot |
| ORM / Persistência | Spring Data JPA |
| Autenticação | Spring Security + JWT |
| Banco de Dados | PostgreSQL |
| Build Tool | Gradle |
| Jakarta Persistence | JPA/Hibernate |

--- 

### Estrutura dos Arquivos 

```text
arcadia/
 ├─ controller/            → REST controllers
 ├─ dto/                   → objetos de transferência de dados
 ├─ entity/                → modelos JPA
 ├─ repository/            → interfaces JPA
 ├─ service/               → regras de negócio ( um package para cada service ) 
 ├─ service/security/      → token, filtro e utilitários de segurança
 └─ service/secutiry/cors  → configuração do cors
```
A estrutura segue as boas práticas da Clean Architecture aplicada ao nosso ecossistema Spring. 

--- 

### Funcionalidades da Aplicação

Segurança
- Uso do JWT ( JSON Web Token ) para a autenticação stateless
- Spring Security para proteção das rotas
- BCrypt para hash das senhas
- Filtro customizado que intercepta as requisições e valida o token
- Uso de DTOs para proteção e integridade do código

Crud
- Crud de acordo com as normas de segurança e regra de negócio
- Sistema compartilhado de reviews
- Funcionalidade de Like para as reviews

Wishlist 
- Wish de acordo com as normas de seguraça e regra de negócio

--- 
## Observações

**Fora comentado aqui somente um âmbito geral do projeto, as especificações mais técnicas e a lógica da aplicação estão presentes nos comentário do código.**

  

  













