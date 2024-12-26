import { render } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { FactorioDataContext } from './contexts/factorio-data';
import { addNewItem, ItemBreakdownState } from './core/app-state';
import { ItemBreakdown } from './components/item-breakdown';
import { NeededItemList } from './components/needed-items';

function App() {
  const data = useContext(FactorioDataContext);
  useEffect(() => {
    console.log(data)
  }, [])
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
  const onDelete = () => { /* TODO */}
  return <>
    <NeededItemList needed={state.needed} onNewEntry={onNewEntry} onDelete={onDelete} />
    <ItemBreakdown recipeConfigurations={state.recipes} remainders={state.remainders} />
  </>;
}

export function runApp() {
  render(<App />, document.body);
};