import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Вход</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal" label="Email"
          name="email" value={form.email} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" label="Пароль" type="password"
          name="password" value={form.password} onChange={handleChange}
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Войти
        </Button>
      </form>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Нет аккаунта?{' '}
        <Link component={RouterLink} to="/auth/register">
          Зарегистрироваться
        </Link>
      </Typography>
    </Container>
  );
}
