import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers/index";

const persistentState = sessionStorage.getItem("state")
  ? JSON.parse(sessionStorage.getItem("state"))
  : {};

// const store = createStore(reducers, persistentState, applyMiddleware(thunk));

const store = createStore(
  reducers,
  persistentState,
  composeWithDevTools(applyMiddleware(thunk))
);

store.subscribe(() => {
  const state = store.getState();
  const serializedState = JSON.stringify(state);
  sessionStorage.setItem("state", serializedState);
});

export default store;
