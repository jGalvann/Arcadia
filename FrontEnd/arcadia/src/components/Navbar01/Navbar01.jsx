import styles from "./Navbar01.module.css";
import {
  BtnInicio,
  BtnJogos,
  BtnReviews,
  BtnLogin
} from "../Buttons/Buttons";

function Navbar01() {
  return (
    <div className={styles.navbar01}>
      {/* botões da navbar */}
      <BtnInicio />
      <BtnJogos />
      <BtnReviews />
      <BtnLogin />
    </div>
  );
}

export default Navbar01;
