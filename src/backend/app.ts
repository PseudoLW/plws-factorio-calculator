import { breakdownLinear } from "./core/calculator";
import { FactorioData, ItemId, MachineId, RecipeId } from "./data/factorio-data";

export function createBackendApp(initialData: FactorioData) {
    const data = initialData;
    const neededItems = [] as {
        itemId: ItemId;
        rate: number;
    }[];
    const breakdownRecipes = [] as {
        recipeId: RecipeId;
        selectedMachineId: MachineId;
        satisfyingItemId: ItemId;
    }[];

    return {
        neededItems,
        breakdownRecipes,
        breakDown() {
            return breakdownLinear(neededItems, breakdownRecipes, data);
        },
        data
    };
}

export type BackendApp = ReturnType<typeof createBackendApp>;