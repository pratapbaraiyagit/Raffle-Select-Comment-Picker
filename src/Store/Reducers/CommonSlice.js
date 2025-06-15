import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  loading: false,
  videoUrl: '',
  userActivityId: '',
  appCssTheme: '',
  isUserInput: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setVideoUrl: (state, action) => {
      state.videoUrl = action.payload;
    },
    setUserActivityId: (state, action) => {
      state.userActivityId = action.payload;
    },
    setAppCssTheme: (state, action) => {
      state.appCssTheme = action.payload;
    },
    setIsUserInput: (state, action) => {
      state.isUserInput = action.payload;
    },
    resetCommonSlice: () => initialState,
  },
});

export const {
  setLoading,
  setAppCssTheme,
  resetCommonSlice,
  setVideoUrl,
  setUserActivityId,
  setIsUserInput,
} = commonSlice.actions;

export default commonSlice.reducer;
