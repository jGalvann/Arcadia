import styles from "./Navbar02.module.css";
import {
  BtnJogos,
  BtnReviews,
  BtnWishlist,
  BtnProfile,
  BtnLogo,
  BtnInicio,
} from "../Buttons/Buttons";

function Navbar02() {
  return (
    <>
      <div className={styles.navbar02}>
        <BtnLogo />

        <div className={styles.botoes}>
          <BtnInicio />
          <BtnJogos />
          <BtnReviews />
          <BtnWishlist />
          <BtnProfile />
        </div>
      </div>
      <div className={styles.line}></div>
    </>
  );
}

export default Navbar02;