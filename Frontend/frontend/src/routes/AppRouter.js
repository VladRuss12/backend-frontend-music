import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyProfilePage from '../pages/MyProfilePage/MyProfilePage';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import PlayerBar from '../components/Player/PlayerBar';

function AppRouter() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/users/me" element={<MyProfilePage />} />
      </Routes>

      <PlayerBar />
      <Footer />
    </>
  );
}

export default AppRouter;