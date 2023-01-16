import { Controls } from "./controls";
import { Garage } from "./garage";
import { Winners } from "./winners";

export class App {
  _Controls: Controls;
  _Garage: Garage;
  _Winners: Winners;
  constructor() {
    this._Garage = new Garage();
    this._Winners = new Winners();
    this._Controls = new Controls(this._Garage, this._Winners);
  }
  createMain() {
    const main = document.createElement("main");
    main.classList.add("main");
    return main;
  }
  start() {
    this._Controls.render();
    document.body.appendChild(this.createMain());
    this._Garage.render();
  }
}
