import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import UserAvatar from './UserAvatar';

export default function UserProfile({ user }) {
  if (!user) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={0} sx={{ boxShadow: 'none', p: { xs: 3, sm: 5 }, maxWidth: 400, width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <UserAvatar user={user} size={100} />
          <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
            {user.username || user.email}
          </Typography>
          {user.email && (
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {user.bio || "Пользователь пока не добавил описание"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}