import { createBackendApp } from "./backend/app";
import { initializeData } from "./backend/data/factorio-data";
import { createAppController } from "./controller/create-controller";
import { runApp } from "./frontend/app";

function main() {
  const backend = createBackendApp(initializeData());
  const controller = createAppController(backend);
  runApp(controller);
}

main();