import { render } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { ItemBreakdown } from './components/item-breakdown';
import { NeededItemList } from './components/needed-items';
import { FactorioDataContext } from './contexts/factorio-data';
import { addNewBreakdown, addNewItem, ItemBreakdownState, removeNeededItem } from '../backend/core/app-state';

function App() {
  const data = useContext(FactorioDataContext);
  const [state, setState] = useState<ItemBreakdownState>({
    needed: [],
    recipes: [],
    remainders: []
  });
  const onNewEntry = (itemId: number, rate: number) => {
    const newState = addNewItem(state, {
      itemId,
      rate
    }, data);
    setState(newState);
  };
  const onDeleteNeededItem = (itemId: number) => {
    const newState = removeNeededItem(state, itemId, data);
    setState(newState);
  };
  const onBreakdown = (item: number, recipe: number) => {
    console.log(item, recipe);
    const newState = addNewBreakdown(state, { item, recipe }, data);
    console.log(newState);
    setState(newState);
  };
  return <>
    <NeededItemList
      needed={state.needed}
      onNewEntry={onNewEntry}
      onDelete={onDeleteNeededItem}
    />
    <ItemBreakdown
      recipeConfigurations={state.recipes}
      remainders={state.remainders}
      onBreakdown={onBreakdown}
    />
  </>;
}

export function runApp() {
  render(<App />, document.body);
};