import { createContext } from "preact";
import { AppController } from "../../controller/controller";

export const AppControllerContext = createContext<AppController>(null!);