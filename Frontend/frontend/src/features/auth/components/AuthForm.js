import React from 'react';
import { TextField, Button } from '@mui/material';

export default function AuthForm({ form, onChange, onSubmit, isRegister, loading }) {
  return (
    <form onSubmit={onSubmit}>
      {isRegister && (
        <TextField
          fullWidth margin="normal" label="Имя пользователя"
          name="username" value={form.username || ''} onChange={onChange}
        />
      )}
      <TextField
        fullWidth margin="normal" label="Email"
        name="email" value={form.email} onChange={onChange}
      />
      <TextField
        fullWidth margin="normal" label="Пароль" type="password"
        name="password" value={form.password} onChange={onChange}
      />
      <Button
        fullWidth variant="contained" type="submit"
        sx={{ mt: 2 }} disabled={loading}
      >
        {isRegister ? "Зарегистрироваться" : "Войти"}
      </Button>
    </form>
  );
}