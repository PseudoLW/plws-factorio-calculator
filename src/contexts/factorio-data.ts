import { createContext } from "preact";
import { DeepAsConst, FactorioData, initializeData } from "../data/factorio-data";

export const FactorioDataContext = createContext<FactorioData>(
    initializeData());
