import Garage from "./garage";
import Winners from "./winners";

class Controls {
  Garage: Garage;

  Winners: Winners;

  constructor(garage: Garage, winners: Winners) {
    this.Garage = garage;
    this.Winners = winners;
  }

  render() {
    const garageButton = document.createElement("button");
    garageButton.textContent = "TO GARAGE";
    garageButton.onclick = (event) => this.clearAndUpdateView(event);
    const winnersButton = document.createElement("button");
    winnersButton.textContent = "TO WINNERS";
    winnersButton.onclick = (event) => this.clearAndUpdateView(event);
    const navContainer = document.createElement("nav");
    navContainer.classList.add("nav-buttons");
    navContainer.appendChild(garageButton);
    navContainer.appendChild(winnersButton);
    document.body.prepend(navContainer);
  }

  private async clearAndUpdateView(event: MouseEvent) {
    const garageContainer = document.querySelector(".garage-container");
    const winnersContainer = document.querySelector(".winners-container");
    const button = event.target;
    if (garageContainer) {
      if (button instanceof HTMLButtonElement) {
        if (button.textContent === "TO GARAGE") {
          garageContainer.classList.remove("garage-container--hidden");
          if (winnersContainer) winnersContainer.remove();
        }
        if (button.textContent === "TO WINNERS") {
          garageContainer.classList.add("garage-container--hidden");
          const renderWinnersView = async () => {
            await this.Winners.loadWinners();
            this.Winners.render();
          };
          renderWinnersView();
        }
      }
    }
  }
}

export default Controls;
