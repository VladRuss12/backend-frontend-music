// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../api/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form);
      dispatch(setCredentials(data));
      // переадресация
      window.location.href = '/';
    } catch (err) {
      alert('Ошибка входа: ' + err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5">Вход</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth margin="normal"
          label="Email" name="email" value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth margin="normal"
          label="Пароль" name="password" type="password" value={form.password}
          onChange={handleChange}
        />
        <Button fullWidth variant="contained" type="submit">Войти</Button>
      </form>
    </Container>
  );
}
