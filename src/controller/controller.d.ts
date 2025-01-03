export type AppController = {
    addNewNeededItem(itemName: string, rate: number): void;
    deleteNeededItem(itemId: number): void;
    addNewBreakdown(itemId: number, recipeId: number): void;

    getNeededItems(): {
        items: { name: string; id: number; rate: number; }[];
        itemList: string[];
    };
    getBreakdownRecipes(): {
        breakdown: {
            item: string;
            recipe: string;
            machineCount: number;
            selectedMachine: string;
            availableMachines: { name: string; id: number; }[];
        }[];
        remainder: {
            item: { name: string; id: number; };
            rate: number;
            availableRecipes: { name: string; id: number; }[];
        }[];
    };
    checkNeededItemAvailability(name: string): 'ok' | 'illegal' | 'used' | 'noRecipe';
};