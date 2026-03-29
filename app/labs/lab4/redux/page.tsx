"use client";

import { Provider } from "react-redux";
import HelloRedux from "./hello/index";
import store from "../store";
import CounterRedux from "./CounterRedux/index";
import AddRedux from "./AddRedux/index";
import TodoList from "./todos/TodoList";

export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div>
        <h2>Redux Examples</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
        <TodoList />
      </div>
    </Provider>
  );
}
