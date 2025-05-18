import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import UserPage from '../features/user/pages/UserPage';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import PlayerBar from '../components/Player/PlayerBar';
import ChatWindow from '../features/aiChat/components/chatWindow';

function AppRouter() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/users/me" element={<UserPage />} />
        <Route path="/ai-chat" element={<ChatWindow />} />
      </Routes>

      <PlayerBar />
      <Footer />
    </>
  );
}

export default AppRouter;