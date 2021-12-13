import * as React from "react";
import "react-app-polyfill/ie11";
import { Button } from "react-bootstrap";
import * as ReactDOM from "react-dom";
import { withDataItem } from "../.";

const DataItemButton = withDataItem(
  Button, // <---------- A component to wrap
  ["onClick"], // <------ which event handlers should be wrapped
);

const people = ["Derek", "Jim", "Joe", "Mike"];

const sayName = (name: string, ev: MouseEvent) => {
  ev.stopPropagation();
  return alert(`Hello, ${name}`);
};

const App = () => {
  return (
    <div>
      {people.map((person) => (
        <DataItemButton
          dataItem={person} // <------------ associate any data with this component
          onClickDataItem={sayName} // <---- no need for lambda here which would otherwise cause unnecessary rerenders, data item will be passed as the first arg of the handler
        >
          {person}
        </DataItemButton>
      ))}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
