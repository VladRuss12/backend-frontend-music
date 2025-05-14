import React, { useState } from 'react';
import { register } from '../api/authApi';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Успешно зарегистрирован!');
      navigate('/auth/login');
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>Регистрация</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal" label="Имя пользователя"
          name="username" value={form.username} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" label="Email"
          name="email" value={form.email} onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal" label="Пароль" type="password"
          name="password" value={form.password} onChange={handleChange}
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Зарегистрироваться
        </Button>
      </form>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Уже есть аккаунт?{' '}
        <Link component={RouterLink} to="/auth/login">
          Войти
        </Link>
      </Typography>
    </Container>
  );
}
