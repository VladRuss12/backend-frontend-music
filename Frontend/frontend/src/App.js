import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { initializeAuth } from './api/authApi';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    initializeAuth(dispatch);
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
