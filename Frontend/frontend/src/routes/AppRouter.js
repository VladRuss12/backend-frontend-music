import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import UserPage from '../pages/UserPage';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import ChatWindow from '../features/aiChat/components/ChatWindow';
import PlaylistPage from '../pages/PlaylistPage';
import SearchResultsPage from '../features/search/components/SearchResultsPage';

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
        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
        <Route path="/music/search" element={<SearchResultsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRouter;