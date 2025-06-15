import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  planLoading: false,
  planList: [],
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlanList: (state, action) => {
      state.planList = action.payload;
    },
    setPlanLoading: (state, action) => {
      state.planLoading = action.payload;
    },
    resetPlanSlice: () => initialState,
  },
});

export const { setPlanLoading, setPlanList, resetPlanSlice } =
  planSlice.actions;

export default planSlice.reducer;
