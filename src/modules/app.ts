import Controls from "./controls";
import Garage from "./garage";
import { Winners } from "./winners";

export class App {
  Controls: Controls;

  Garage: Garage;

  Winners: Winners;

  constructor() {
    this.Garage = new Garage();
    this.Winners = new Winners();
    this.Controls = new Controls(this.Garage, this.Winners);
  }

  static createMain() {
    const main = document.createElement("main");
    main.classList.add("main");
    return main;
  }

  start() {
    this.Controls.render();
    document.body.appendChild(App.createMain());
    this.Garage.render();
  }
}

export default App;
