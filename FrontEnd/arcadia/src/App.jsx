import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Reviews from "./pages/Reviews/Reviews";
import Games from "./pages/Games/Games";
import Wishlist from "./pages/Wishlist/Wishlist";

//usando o toastify para os alertas ficarem mais bonitos e fecharem sozinhos
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PriveteRoute/PrivateRoute";





function App() {

  
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
            <Route path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route path="/reviews" 
              element={
                <PrivateRoute>
                  <Reviews/>
                </PrivateRoute>
              }
            />
            <Route path="/games" 
              element={
                <PrivateRoute>
                  <Games/>
                </PrivateRoute>
              }
            />
            <Route path="/wishlist" 
              element={
                <PrivateRoute>
                  <Wishlist/>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>    
      </>
  );
}

export default App;
