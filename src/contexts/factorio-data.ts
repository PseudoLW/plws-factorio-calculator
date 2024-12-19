import { createContext } from "preact";
import { FactorioData, initializeData } from "../data/factorio-data";

export const FactorioDataContext = createContext<FactorioData>(initializeData());
