import { combineReducers, configureStore } from '@reduxjs/toolkit';
import auth from '../Store/Reducers/AuthSlice';
import social from '../Store/Reducers/SocialSlice';
import common from '../Store/Reducers/CommonSlice';
import plan from '../Store/Reducers/PlanSlice';

const reducers = combineReducers({
  auth,
  social,
  common,
  plan,
});

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
