import { createContext } from "preact";
import { FactorioData, initializeData } from "../../backend/data/factorio-data";

export const FactorioDataContext = createContext<FactorioData>(
    initializeData());
