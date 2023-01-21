import { getWinners, SingleWinnerParams } from "./api";

const API_URL = "http://127.0.0.1:3000";

class Winners {
  winners: Array<SingleWinnerParams> = [];

  constructor() {
    getWinners(API_URL)
      .then((data) => {
        this.winners = data.winners;
      })
      .then(() => {
        this.winners.forEach((winner) => {
          // console.log(winner);
        });
      });
  }

  render() {
    let winnersContainer = document.querySelector(".winners-container");
    if (!winnersContainer) {
      winnersContainer = document.createElement("section");
      winnersContainer.classList.add("winners-container");
    }
    winnersContainer.innerHTML = "";
    winnersContainer.appendChild(this.createHeading());
    document.querySelector(".main")?.append(winnersContainer);
  }

  private createHeading() {
    const heading = document.createElement("h2");
    heading.textContent = `Winners (${this.winners.length})`;
    return heading;
  }
}

export default Winners;
