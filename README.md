# with-data

A higher order component for associating data items with components for use in event handlers for high performance user interfaces.

## Install

```shell
npm i with-data
```

or

```shell
yarn add with-data
```

## Use

```typescript
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
```
