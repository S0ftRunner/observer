// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// Заготовка на будущий стор
// import {
//   TypedUseSelectorHook,
//   useDispatch as dispatchHook,
//   useSelector as selectorHook
// } from 'react-redux';
// import { ingredientsReducer } from './slices/ingredientSlice';
// import { feedsReducer } from './slices/feedsSlice';
// import { userOrderReducer } from './slices/userOrderSlice';
// import { userDataReducer } from './slices/userDataSlice';

// export const rootReducer = combineReducers({
//   ingredients: ingredientsReducer,
//   feeds: feedsReducer,
//   userOrder: userOrderReducer,
//   userData: userDataReducer
// });

// export const store = configureStore({
//   reducer: rootReducer,
//   devTools: process.env.NODE_ENV !== 'production'
// });

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;

// export const useDispatch: () => AppDispatch = () => dispatchHook();
// export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
