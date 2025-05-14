import Header from "../components/Header";
import Footer from "../components/Footer";
import Player from "../components/Player/Player"; 
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ padding: "1rem", minHeight: "80vh" }}>
        <Outlet />  {/* Контент страницы */}
      </main>
      <Player />
      <Footer />
    </>
  );
}
