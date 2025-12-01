import styles from "./Home.module.css";
import Navbar02 from "../../components/Navbar02/Navbar02";
import ParaVoce from "../../components/HomeGames/HomeGames";
import HomeReviews from "../../components/HomeReviews/HomeReviews";

function Home() {
  return (
    <div className={styles.container}>
      <Navbar02 />
      
      {/* Container que alinha o carrosel e as setas */}
      <div className={styles.content}>
        <ParaVoce />
        <HomeReviews />
      </div>
    </div>
  );
}

export default Home;