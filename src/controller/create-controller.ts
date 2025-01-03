import { BackendApp } from "../backend/app";
import { ItemId, RecipeId } from "../backend/data/factorio-data";
import { AppController } from './controller';

export function createAppController(backend: BackendApp): AppController {
    let breakdownResult: ReturnType<typeof backend['breakDown']> = {
        machinesNeeded: [], remaining: new Map()
    };

    const {
        recipes: Recipes,
        machines: Machines,
        items: Items,
        nameToIds: NameToIdMapping
    } = backend.data;
    return {
        addNewNeededItem(itemName, rate) {
            backend.neededItems.push({
                itemId: NameToIdMapping.items[itemName],
                rate
            });
            breakdownResult = backend.breakDown();
        },

        deleteNeededItem(itemName) {
            const { neededItems } = backend;
            const soughtItemId = NameToIdMapping.items[itemName];
            const neededItemIndex = backend.neededItems.findIndex(
                (item) => item.itemId == soughtItemId);
            if (neededItemIndex === undefined) {
                throw new Error('Tried to delete an inexistent item.');
            }
            neededItems.splice(neededItemIndex);

            breakdownResult = backend.breakDown();
        },

        addNewBreakdown(itemId, recipeId) {
            const defaultMachine = Recipes[recipeId as RecipeId].machines[0];
            backend.breakdownRecipes.push({
                recipeId: recipeId as RecipeId,
                selectedMachineId: defaultMachine,
                satisfyingItemId: itemId as ItemId
            });
            breakdownResult = backend.breakDown();
        },

        getNeededItems() {
            return {
                items: backend.neededItems.map(({ itemId, rate }) => ({
                    name: Items[itemId].name,
                    id: itemId,
                    rate: rate
                })),
                itemList: (Items as (typeof Items)[ItemId][])
                    .map((s) => s.name)
            };
        },

        getBreakdownRecipes() {
            return {
                breakdown: backend.breakdownRecipes
                    .map(({ recipeId, selectedMachineId, satisfyingItemId }, i) => {
                        const machinesNeeded = breakdownResult.machinesNeeded[i];
                        const recipe = Recipes[recipeId];
                        return {
                            item: Items[satisfyingItemId].name,
                            machineCount: machinesNeeded,
                            recipe: recipe.name,
                            selectedMachine: Machines[selectedMachineId].name,
                            availableMachines: recipe.machines.map((id) => ({
                                name: Machines[id].name,
                                id
                            }))
                        };
                    }),

                remainder: Array.from(breakdownResult.remaining)
                    .map(([itemId, rate]) => {
                        return {
                            item: { name: Items[itemId].name, id: itemId },
                            availableRecipes: Items[itemId]
                                .recipesProducingThis
                                .map((recipeId) => ({
                                    name: Recipes[recipeId].name,
                                    id: recipeId
                                })),
                            rate
                        };
                    })
            };
        },

        checkNeededItemAvailability(name) {
            const id = NameToIdMapping.items[name] as ItemId | undefined;
            if (backend.neededItems.find(({ itemId }) => itemId === id)) {
                return 'used';
            } else if (id === undefined) {
                return 'illegal';
            } else if (Items[id].recipesProducingThis.length === 0) {
                return 'noRecipe';
            }
            return 'ok';
        },
    };
}