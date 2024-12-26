import { FactorioData } from "../data/factorio-data";
import { breakdownLinear } from "./calculator";

export type ItemAndRateInternal = {
    itemId: number;
    rate: number;
};
export type ItemAndRateView = {
    itemName: string;
    rate: number;
};
export type RecipeSelectionInternal = {
    recipeId: number;
    satisfyingItemId: number;
    selectedMachineId: number;
};
export type RecipeSelectionView = {
    recipeName: string;
    selectedMachineName: string;
    machineCount: number;
    possibleMachineNames: string[];
};
export type ItemBreakdownState = {
    needed: (ItemAndRateInternal & ItemAndRateView)[];
    recipes: (RecipeSelectionInternal & RecipeSelectionView)[];
    remainders: (
        ItemAndRateInternal &
        ItemAndRateView &
        { availableRecipes: { name: string; id: number; }[]; })[];
};
function breakdownOutputToState(
    needed: ItemAndRateInternal[],
    recipes: RecipeSelectionInternal[],
    data: FactorioData
): ItemBreakdownState {
    const output = breakdownLinear(needed, recipes, data);
    console.log(output)
    return {
        needed: needed.map(({ itemId, rate }) => ({
            itemName: data.items[itemId].name,
            itemId, rate
        })),
        recipes: needed.map(({ itemId }) => {
            const recipeId = data.items[itemId].recipesProducingThis[0];
            const satisfyingItemId = data.recipes[recipeId].products[0].item;
            const machineId = data.recipes[recipeId].machines[0];
            return {
                recipeName: data.recipes[recipeId].name,
                recipeId,
                satisfyingItemId,
                possibleMachineNames: data.recipes[recipeId].machines
                    .map((machineId) => data.machines[machineId].name),
                selectedMachineName: data.machines[machineId].name,
                selectedMachineId: machineId,
                machineCount: 0
            };
        }),
        remainders: [...output.remaining.entries()].map(([itemId, rate]) => ({
            itemName: data.items[itemId].name,
            itemId,
            rate,
            availableRecipes: data.items[itemId].recipesConsumingThis.map(
                (recipeId) => ({ name: data.recipes[recipeId].name, id: recipeId })
            )
        }))
    };
}
export function addNewItem(
    oldState: ItemBreakdownState,
    newItem: ItemAndRateInternal,
    data: FactorioData
): ItemBreakdownState {
    const needed = [...oldState.needed, newItem];
    const recipes = oldState.recipes.map(({ recipeId, satisfyingItemId, selectedMachineId }) => ({
        recipeId,
        satisfyingItemId,
        selectedMachineId
    }));
    return breakdownOutputToState(needed, recipes, data);
};
export function addNewBreakdown(
    oldState: ItemBreakdownState,
    brokenDownItem: { item: number; recipe: number; },
    data: FactorioData
): ItemBreakdownState {
    const needed = oldState.needed;
    const recipes = [
        ...oldState.recipes, {
            recipeId: brokenDownItem.recipe,
            satisfyingItemId: brokenDownItem.item,
            selectedMachineId: data.recipes[brokenDownItem.recipe].machines[0]
        }];
    return breakdownOutputToState(needed, recipes, data);
}