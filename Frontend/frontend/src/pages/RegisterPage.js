import React, { useState } from 'react';
import { register } from '../api/authApi';
import { Container, TextField, Button, Typography } from '@mui/material';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Успешно зарегистрирован!');
      window.location.href = 'auth/login';
    } catch (err) {
      alert('Ошибка регистрации: ' + err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5">Регистрация</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal"
          label="Имя пользователя"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Пароль"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button fullWidth variant="contained" type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </Container>
  );
}
