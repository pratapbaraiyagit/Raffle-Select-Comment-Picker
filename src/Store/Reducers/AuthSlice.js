import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  authLoading: false,
  currentUser: {},
  isUserLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setIsUserLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
    resetAuthSlice: () => initialState,
  },
});

export const {
  setAuthLoading,
  setCurrentUser,
  setIsUserLoggedIn,
  resetAuthSlice,
} = authSlice.actions;

export default authSlice.reducer;
