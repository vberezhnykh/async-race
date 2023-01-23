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
    garageButton.classList.add("garage-button", "garage-button--active");
    garageButton.textContent = "TO GARAGE";
    const winnersButton = document.createElement("button");
    winnersButton.textContent = "TO WINNERS";
    winnersButton.classList.add("winners-button");
    const navContainer = document.createElement("nav");
    navContainer.classList.add("nav-buttons");
    navContainer.appendChild(garageButton);
    navContainer.appendChild(winnersButton);
    garageButton.onclick = (event) =>
      this.clearAndUpdateView(event, garageButton, winnersButton);
    winnersButton.onclick = (event) =>
      this.clearAndUpdateView(event, garageButton, winnersButton);
    document.body.prepend(navContainer);
  }

  private async clearAndUpdateView(
    event: MouseEvent,
    garageButton: HTMLButtonElement,
    winnersButton: HTMLButtonElement
  ) {
    const garageContainer = document.querySelector(".garage-container");
    const winnersContainer = document.querySelector(".winners-container");
    const button = event.target;
    if (garageContainer) {
      if (button instanceof HTMLButtonElement) {
        if (button === garageButton) {
          garageContainer.classList.remove("garage-container--hidden");
          if (winnersContainer) winnersContainer.remove();
          garageButton.classList.add("garage-button--active");
          winnersButton.classList.remove("winners-button--active");
        }
        if (button === winnersButton) {
          garageContainer.classList.add("garage-container--hidden");
          garageButton.classList.remove("garage-button--active");
          winnersButton.classList.add("winners-button--active");
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
