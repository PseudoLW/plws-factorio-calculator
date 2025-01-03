import { render } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { AppController } from '../controller/controller';
import { ItemBreakdown } from './components/item-breakdown';
import { NeededItemList } from './components/needed-items';
import { AppControllerContext } from './contexts/controller';

function App() {
  const controller = useContext(AppControllerContext);
  const [neededItems, setNeededItems] = useState(
    controller.getNeededItems()
  );
  const [breakdownRecipes, setBreakdownRecipes] = useState(
    controller.getBreakdownRecipes()
  );
  const onNewEntry = (itemName: string, rate: number) => {
    controller.addNewNeededItem(itemName, rate);
    setNeededItems(controller.getNeededItems());
    setBreakdownRecipes(controller.getBreakdownRecipes());
  };
  const onDeleteNeededItem = (itemId: number) => {
    controller.deleteNeededItem(itemId);
    setNeededItems(controller.getNeededItems());
    setBreakdownRecipes(controller.getBreakdownRecipes());
  };
  const onBreakdown = (item: number, recipe: number) => {
    controller.addNewBreakdown(item, recipe);
    setBreakdownRecipes(controller.getBreakdownRecipes());
  };
  return <>
    <NeededItemList
      needed={neededItems.items}
      itemList={neededItems.itemList}
      onNewEntry={onNewEntry}
      onDelete={onDeleteNeededItem}
    />
    <ItemBreakdown
      recipeConfigurations={breakdownRecipes.breakdown}
      remainders={breakdownRecipes.remainder}
      onBreakdown={onBreakdown}
    />
  </>;
}

export function runApp(controller: AppController) {
  render(
    <AppControllerContext.Provider value={controller}>
      <App />
    </AppControllerContext.Provider>
    , document.body);
};