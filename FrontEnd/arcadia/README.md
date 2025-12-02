#  ARCADIA - FrontEnd

Plataforma Social de Games

Este é o cliente web do projeto **Arcadia**, desenvolvido para consumir a API RESTful do backend Spring Boot e a API pública de jogos RAWG. A interface é focada na **experiência do usuário (UX)**, inspirada no design minimalista e funcional do "Letterboxd".

---

##  Informações Técnicas

### Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Core** | React.js (Vite) | Biblioteca para construção da UI |
| **Linguagem** | JavaScript (ES6+) | Lógica do cliente |
| **Roteamento** | React Router DOM | Navegação **SPA (Single Page Application)** |
| **HTTP Client** | Axios | Consumo de APIs (Backend e RAWG) |
| **Estilização** | CSS Modules | Escopo local de estilos para evitar conflitos |
| **UI Components** | Material UI (MUI) | Componentes visuais (Botões, Ícones, Modais) |
| **Notificações** | React Toastify | Feedback visual para o usuário |

---

## Estrutura dos Arquivos

A estrutura foi pensada para **desacoplar a lógica de negócio** (chamadas de API) da **interface visual** (componentes), facilitando a manutenção.

```text
arcadia-frontend/
 ├─ src/
 │   ├─ assets/             → imagens, fontes e arquivos estáticos
 │   ├─ components/         → componentes reutilizáveis (Navbar, GameCard, Modal)
 │   ├─ pages/              → páginas da aplicação (rotas)
 │   │   ├─ Home/
 │   │   ├─ Login/
 │   │   ├─ Profile/
 │   │   └─ Reviews/
 │   ├─ services/           → comunicação com APIs (Axios configurations)
 │   │   ├─ api.js          → instância axios com interceptors (JWT)
 │   │   ├─ authApi.js      → login e registro
 │   │   ├─ rawgApi.js      → busca de jogos externos
 │   │   ├─ reviewApi.js    → CRUD de reviews
 │   │   └─ wishlistApi.js  → gerenciamento de favoritos
 │   ├─ context/            → gerenciamento de estado global (AuthContext)
 │   └─ routes/             → configuração de rotas e proteção (PrivateRoute)

````
---

##  Integração com o Back-End



O Front-end se comunica com o Back-end seguindo os padrões de segurança definidos:

* **Autenticação:** O Login retorna um **JWT (JSON Web Token)**.
* **Persistência:** O token é armazenado no `localStorage`.
* **Interceptors:** O arquivo `api.js` intercepta todas as requisições para o Back-end e injeta o cabeçalho `Authorization: Bearer {token}` automaticamente.
* **Segurança:** Rotas como `/profile` e `/wishlist` são protegidas por um componente **`PrivateRoute`**, que verifica a existência do token antes de renderizar a página.



##  Funcionalidades do Cliente

* **Catálogo:** Consumo da API RAWG para listagem, busca, paginação e ordenação de jogos.
* **Sistema de Reviews:** Interface para criar, editar e excluir avaliações de jogos (conectado ao PostgreSQL via Spring Boot).
* **Wishlist:** Botão de "Favoritar" que salva o jogo na lista de desejos do usuário logado.
* **Interatividade:** Modais para detalhes do jogo, toasts para feedback de erros/sucesso e loaders para estados de espera.

---

Projeto desenvolvido para a integração das disciplinas de **Desenvolvimento Web**.
