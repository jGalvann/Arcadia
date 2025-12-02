import axios from "axios";
import { useState } from "react";
import styles from "./SearchBar.module.css";

/**
 * Componente SearchBar
 * barra de pesquisa que consulta a API RAWG e retorna jogos conforme o usuário digita
 *
 * Props:
 * - onResults: função recebida do componente pai para enviar os resultados da busca
 */
function SearchBar({ onResults }) {

    const API_KEY = "74789459df8c4381a2b1d53cee393da1"; 
    const API_URL = "https://api.rawg.io/api/games";

    // estado que armazena o texto digitado pelo usuário no input
    const [pesquisaJogo, setPesquisaJogo] = useState("");


    // função que busca jogos na API conforme o texto pesquisado

    async function buscarJogo(query) {
        // se o usuário apagar tudo, limpa os resultados
        if (!query) {
            onResults([]); 
            return;
        }

        try {
            // envia requisição GET para API RAWG
            const response = await axios.get(API_URL, {
                params: {
                    key: API_KEY,
                    search: query, // termo pesquisado
                }, 
            });

            // envia os jogos encontrados para o componente pai
            onResults(response.data.results);

        } catch (error) {
            console.error("Erro ao buscar jogo:", error);
        }
    }

    // atualiza o estado de pesquisa conforme o usuário digita e dispara a busca imediatamente
    function handleChange(e) {
        const valor = e.target.value; // captura texto digitado
        setPesquisaJogo(valor);

        buscarJogo(valor); // faz a busca na API em tempo real
    }

    return (
        <div className={styles.SearchBar}>
            <input
                type="text"
                placeholder="Pesquisar Jogos..."
                value={pesquisaJogo}
                onChange={handleChange} // dispara quando o usuário digita
            />
        </div>
    );
}

export default SearchBar;

