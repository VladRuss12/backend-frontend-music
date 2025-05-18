import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../authService';
import { setCredentials } from '../authSlice';
import AuthForm from '../components/AuthForm';
import { Container, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Вход</Typography>
      <AuthForm form={form} onChange={handleChange} onSubmit={handleSubmit} loading={loading} />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Нет аккаунта?{' '}
        <Link component={RouterLink} to="/auth/register">
          Зарегистрироваться
        </Link>
      </Typography>
    </Container>
  );
}