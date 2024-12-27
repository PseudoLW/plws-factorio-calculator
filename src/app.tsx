import { render } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { ItemBreakdown } from './components/item-breakdown';
import { NeededItemList } from './components/needed-items';
import { FactorioDataContext } from './contexts/factorio-data';
import { addNewItem, ItemBreakdownState, removeNeededItem } from './core/app-state';

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
  const onDelete = (itemId: number) => {
    const newState = removeNeededItem(state, itemId, data);
    setState(newState);
  };
  return <>
    <NeededItemList
      needed={state.needed}
      onNewEntry={onNewEntry}
      onDelete={onDelete}
    />
    <ItemBreakdown
      recipeConfigurations={state.recipes}
      remainders={state.remainders}
    />
  </>;
}

export function runApp() {
  render(<App />, document.body);
};