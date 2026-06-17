import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { blogRtkApi } from "@/redux/blog/blogApi";
import blogReducer from "@/redux/blog/blogSlice";
import authReducer from "./slices/authSlice";
import { sessionHydrateRequest } from "./slices/authSlice";
import { rootSaga } from "./rootSaga";
import { getPersistedAuth } from "@/utils/authStorage";

const sagaMiddleware = createSagaMiddleware();

const persistedAuth = getPersistedAuth();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    [blogRtkApi.reducerPath]: blogRtkApi.reducer,
  },
  preloadedState: persistedAuth
    ? {
        auth: {
          user: persistedAuth.user,
          loading: true,
          error: null,
          isAuthenticated: true,
          sessionChecked: false,
        },
      }
    : {
        auth: {
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
          sessionChecked: true,
        },
      },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(blogRtkApi.middleware)
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

if (persistedAuth?.accessToken) {
  store.dispatch(sessionHydrateRequest());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
