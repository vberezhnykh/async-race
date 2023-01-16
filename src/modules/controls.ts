import { Garage } from "./garage";
import { Winners } from "./winners";

export class Controls {
  _Garage: Garage;
  _Winners: Winners;
  constructor(garage: Garage, winners: Winners) {
    this._Garage = garage;
    this._Winners = winners;
  }
  render() {
    const garageButton = document.createElement("button");
    garageButton.textContent = "TO GARAGE";
    garageButton.onclick = (event) => this.clearAndUpdateView(event);
    const winnersButton = document.createElement("button");
    winnersButton.textContent = "TO WINNERS";
    winnersButton.onclick = (event) => this.clearAndUpdateView(event);
    const navContainer = document.createElement("nav");
    navContainer.appendChild(garageButton);
    navContainer.appendChild(winnersButton);
    document.body.prepend(navContainer);
  }

  private clearAndUpdateView(event: MouseEvent) {
    const main = document.querySelector(".main");
    const button = event.target;
    if (main) {
      main.innerHTML = "";
      if (button instanceof HTMLButtonElement) {
        if (button.textContent === "TO GARAGE") this._Garage.render();
        /* if (button.textContent === 'TO WINNERS')  */
      }
    }
  }
}
