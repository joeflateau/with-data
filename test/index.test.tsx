import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { withDataItem } from '../src';

const Button = (props: { onClick?: () => void; children: React.ReactNode }) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};

describe('Thing', () => {
  it('renders without crashing', () => {
    const DataItemButton = withDataItem(
      Button, // <---------- A component to wrap
      ['onClick'] // <------ which event handlers should be wrapped
    );

    const people = ['Derek', 'Jim', 'Joe', 'Mike'];

    const sayName = (name: string) => alert(`Hello, ${name}`);

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
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
