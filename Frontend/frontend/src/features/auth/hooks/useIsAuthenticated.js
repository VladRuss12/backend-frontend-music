import { useSelector } from 'react-redux';

export function useIsAuthenticated() {
  const { accessToken } = useSelector((state) => state.auth);
  return Boolean(accessToken);
}