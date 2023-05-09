import { configureStore } from "@reduxjs/toolkit";
import gremlinReducer from '../reducers/gremlinReducer';
import graphReducer from '../reducers/graphReducer';
import optionReducer from '../reducers/optionReducer';
import { useDispatch } from "react-redux";
import { cam4dmApi } from "../services/cam4dm";
import { gremlinApi } from "../services/gremlin";

const store = configureStore({
  reducer: {
    gremlin: gremlinReducer,
    graph: graphReducer,
    options: optionReducer,
    [cam4dmApi.reducerPath]: cam4dmApi.reducer,
    [gremlinApi.reducerPath]: gremlinApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cam4dmApi.middleware, gremlinApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;