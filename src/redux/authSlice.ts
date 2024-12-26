import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
    setAuthToken: (state) => {
      const token = new Date().toISOString();
      state.token = token;
      localStorage.setItem('token', token);
    },
  },
});

export const { logout, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
