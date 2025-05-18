import React, { useState } from 'react';
import { register } from '../authService';
import AuthForm from '../components/AuthForm';
import { Container, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      alert('Успешно зарегистрирован!');
      navigate('/auth/login');
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      <AuthForm form={form} onChange={handleChange} onSubmit={handleSubmit} isRegister loading={loading} />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Уже есть аккаунт?{' '}
        <Link component={RouterLink} to="/auth/login">
          Войти
        </Link>
      </Typography>
    </Container>
  );
}