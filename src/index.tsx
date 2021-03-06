import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  Provider as UrqlProvider,
  createClient,
  dedupExchange,
  fetchExchange,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "./generated/graphql";
import { betterUpdateQuery } from "./utils/betterUpdateQuery";
import { store } from "./store";
import { Provider as ReduxProvider } from "react-redux";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result: LoginMutation, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login?.errors && result.login?.errors.length > 0) {
                  return query;
                } else {
                  return { me: result.login?.user };
                }
              }
            );
          },
          register: (_result: RegisterMutation, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (
                  result.register?.errors &&
                  result.register?.errors.length > 0
                ) {
                  return query;
                } else {
                  return { me: result.register?.user };
                }
              }
            );
          },
          logout: (_result: LogoutMutation, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.logout) {
                  return { me: null };
                } else {
                  return query;
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <UrqlProvider value={client}>
        <App />
      </UrqlProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
