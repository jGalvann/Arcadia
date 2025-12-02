import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import marioImg from "../../assets/Images/MarioLandingPage.png";
import Navbar01 from "../../components/Navbar01/Navbar01";
import { BtnLogo } from "../../components/Buttons/Buttons";

/**
 * LandingPage
 * página inicial do sistema, voltada para apresentação do projeto.
 * não exige login e serve como porta de entrada visual para o usuário.
 */
function LandingPage() {
  const s = styles; // alias opcional para facilitar o uso de classes
  return (
    <div className={s.container}>
      <div className={s.navbar}>
        <div>
          <BtnLogo />
        </div>

        <div>
          <Navbar01 />
        </div>
      </div>

      {/* Dentro da section vai ficar todo o conteudo Principal do SITE*/}
      <section className={s.secaoprincipal}>
        <div className={s.txtsecao}>
          <h1 className={s.explore}>Explore</h1>
          <h1 className={s.avalie}>Avalie</h1>
          <h1 className={s.conquiste}>Conquiste</h1>

          <p className={s.herosubtitle}>
            De aventuras épicas a narrativas emocionantes,
            <br />
            cada review é um portal para outro mundo.
          </p>
        </div>

        {/* imagem do mario */}
        <div className={s.marioimage}>
          <img src={marioImg} alt="Mario lançando bola de fogo" />
        </div>
      </section>

      {/* rodape com o botão para ir até a tela de cadastro/register */}
      <footer className={s.footerlanding}>
        <div className={s.Cadastro}>
          <p>Comece agora mesmo!!</p>
          <Link to="/register">
            <button className={s.bntcadastro}>Cadastrar-se</button>
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
