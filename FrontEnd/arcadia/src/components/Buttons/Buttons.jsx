import styles from "./Buttons.module.css";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


// Botão para levar a /home
export function BtnInicio() {
  return (
    <Link to="/home">
      <button className={styles.link}>Início</button>
    </Link>
  );
}


// Botão para levar a /games
export function BtnJogos() {
  return (
    <>
      <Link to="/games">
        <button className={styles.link}>Jogos</button>
      </Link>
    </>
  );
}


// Botão para levar a /login
export function BtnLogin() {
  return (
    <Link to="/login">
      <button className={styles.loginButton}>Login</button>
    </Link>
  );
}

// Botão para levar a /home
export function BtnLogo() {
  return (
    <Link to="/home">
      <div className={styles.logo}>
        <span className={styles.text}>Arcadia</span>
      </div>
    </Link>
  );
}

// Botão para levar a /profile
export function BtnProfile() {
  return (
    <Link to="/profile">
      <div className={styles.profileIcon}>
        <AccountCircleIcon style={{ width: "100%", height: "100%", color: "white" }} />
      </div>
    </Link>
  );
}

// Botão para levar a /reviews
export function BtnReviews() {
  return (
    <Link to="/reviews">
      <button className={styles.link}>Reviews</button>
    </Link>
  );
}

// Botão para levar a /wishlist
export function BtnWishlist() {
  return (
    <>
      <Link to="/wishlist">
        <button className={styles.link}>Wishlist</button>
      </Link>
    </>
  );
}
