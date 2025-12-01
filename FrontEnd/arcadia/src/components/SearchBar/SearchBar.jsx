import axios from "axios";
import { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ onResults }) {

    const API_KEY = "74789459df8c4381a2b1d53cee393da1"; 
    const API_URL = "https://api.rawg.io/api/games";

    const [pesquisaJogo, setPesquisaJogo] = useState("");

    async function buscarJogo(query) {
        if (!query) {
            onResults([]); 
            return;
        }

        try {
            const response = await axios.get(API_URL, {
                params: {
                    key: API_KEY,
                    search: query,
                },
            });

            onResults(response.data.results);

        } catch (error) {
            console.error("Erro ao buscar jogo:", error);
        }
    }

    function handleChange(e) {
        const valor = e.target.value;
        setPesquisaJogo(valor);

        buscarJogo(valor); 
    }

    return (
        <div className={styles.SearchBar}>
            <input
                type="text"
                placeholder="Pesquisar Jogos..."
                value={pesquisaJogo}
                onChange={handleChange}
            />
        </div>
    );
}

export default SearchBar;

