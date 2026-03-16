"use client";
import ClickEvent from "./ClickEvent";
import PassingFunctions from "./PassingFunctions";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import PassingDataOnEvent from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import { Provider } from "react-redux";
import store from "./store";
import Link from "next/link";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }

  return (
    <div id="wd-lab4">
      <ClickEvent />
      <PassingDataOnEvent />
      <PassingFunctions theFunction={sayHello} />
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <PassingDataOnEvent />
      <ObjectStateVariable />
      <Provider store={store}>
        <ArrayStateVariable />
      </Provider>
      <ParentStateComponent />
      <div>
        <h2>Lab 4</h2>
        <Link href="/labs/lab4/redux">Redux Examples</Link>
        <hr />
        <Link href="/labs/lab4/react-context">React Context Examples</Link>
        <hr />
        <Link href="/labs/lab4/zustand">Zustand Examples</Link>
      </div>
    </div>
  );
}
