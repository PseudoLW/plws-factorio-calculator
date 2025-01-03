import { FactorioData } from "../data/factorio-data";
import { breakdownLinear } from "./calculator";
// TODO: delete
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
    const { items: Items, recipes: Recipes, machines: Machines } = data;
    const { remaining, machinesNeeded } = breakdownLinear(needed, recipes, data);
    const remainders = [...remaining.entries()].map(([itemId, rate]) => ({
        itemName: Items[itemId].name,
        itemId,
        rate,
        availableRecipes: Items[itemId].recipesProducingThis.map(
            (recipeId) => ({ name: Recipes[recipeId].name, id: recipeId })
        )
    })).filter(({ rate }) => rate > 0);

    const neededState = needed.map(({ itemId, rate }) => ({
        itemName: data.items[itemId].name,
        itemId, rate
    })).filter(({ rate }) => rate > 0);

    const recipesState = recipes.map(({ recipeId, satisfyingItemId, selectedMachineId }, i) => {
        return {
            recipeName: Recipes[recipeId].name,
            recipeId,
            satisfyingItemId,
            possibleMachineNames: Recipes[recipeId].machines.map(
                (machineId) => Machines[machineId].name
            ),
            selectedMachineName: Machines[selectedMachineId].name,
            selectedMachineId,
            machineCount: machinesNeeded[i]
        };
    }).filter(({ recipeId, machineCount }) => 
        Items[recipeId].recipesProducingThis.length > 0 &&
        machineCount > 0
    );

    return {
        needed: neededState,
        recipes: recipesState,
        remainders
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

export function removeNeededItem(
    oldState: ItemBreakdownState,
    itemId: number,
    data: FactorioData
): ItemBreakdownState {
    const needed = oldState.needed.filter(({ itemId: id }) => id !== itemId);
    const recipes = oldState.recipes.map(({ recipeId, satisfyingItemId, selectedMachineId }) => ({
        recipeId,
        satisfyingItemId,
        selectedMachineId
    }));
    return breakdownOutputToState(needed, recipes, data);
}
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