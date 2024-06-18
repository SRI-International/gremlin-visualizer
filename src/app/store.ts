import { configureStore } from "@reduxjs/toolkit";
import gremlinReducer from '../reducers/gremlinReducer';
import graphReducer from '../reducers/graphReducer';
import optionReducer from '../reducers/optionReducer';
import dialogReducer from '../reducers/dialogReducer';
import { useDispatch } from "react-redux";



// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
  reducer: { gremlin: gremlinReducer, graph: graphReducer, options: optionReducer, dialog: dialogReducer },
  // composeEnhancers(applyMiddleware(createLogger()))
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;