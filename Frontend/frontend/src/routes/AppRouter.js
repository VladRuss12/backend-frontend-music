import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';       
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Header from '../components/Header';     
import Footer from '../components/Footer';      

function AppRouter() {
  return (
    <BrowserRouter>
    
      <Header />

      <Routes>
        
        <Route path="/" element={<HomePage />} />

        
        <Route path="/auth/login" element={<LoginPage />} />

       
        <Route path="/auth/register" element={<RegisterPage />} />

       
      </Routes>

      
      <Footer />
    </BrowserRouter>
  );
}

export default AppRouter;
