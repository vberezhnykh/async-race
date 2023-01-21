import { getCar, getWinners, SingleWinnerParams, Сharacteristics } from "./api";
import { defaultCarImage } from "./carImage";

const API_URL = "http://127.0.0.1:3000";

class Winners {
  winners: Array<SingleWinnerParams> = [];

  winnersCars: Сharacteristics[] = [];

  orderBy: "wins" | "time" | null = null;

  sortOrder: "DESC" | "ASC" = "ASC";

  constructor() {
    getWinners(API_URL)
      .then((data) => {
        this.winners = data.winners;
      })
      .then(() => {
        const promises: Promise<Response>[] = [];
        this.winners.forEach((winner) => {
          promises.push(getCar(API_URL, winner.id));
        });
        return Promise.all(promises);
      })
      .then((result) => {
        function isСharacteristicsArray(
          response: unknown
        ): response is Array<Сharacteristics> {
          return true;
        }
        if (isСharacteristicsArray(result)) {
          this.winnersCars = result;
        }
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
    winnersContainer.appendChild(this.createLeaderBoard());
    document.querySelector(".main")?.append(winnersContainer);
  }

  private createHeading() {
    const heading = document.createElement("h2");
    heading.textContent = `Winners (${this.winners.length})`;
    return heading;
  }

  private createLeaderBoard() {
    const leaderBoard = document.createElement("div");
    leaderBoard.classList.add("leader-board");
    leaderBoard.appendChild(this.createLeaderBoardHeader());
    leaderBoard.appendChild(this.createWinnersList());
    return leaderBoard;
  }

  private createWinnersList() {
    console.log(this.winnersCars);
    const winnerList = document.createElement("ul");
    winnerList.classList.add("winner-list");
    for (let i = 0; i < this.winnersCars.length; i += 1) {
      const listItem = this.createListItem(i);
      winnerList.appendChild(listItem);
    }
    return winnerList;
  }

  private createListItem(i: number) {
    const listItem = document.createElement("li");
    listItem.classList.add("winner-list__item");
    const number = document.createElement("div");
    number.innerHTML = `${i + 1}`;
    number.classList.add("leader-board__number-cell");
    listItem.appendChild(number);
    const car = document.createElement("div");
    car.innerHTML = defaultCarImage.replace(
      `fill="#000000"`,
      `fill=${this.winnersCars[i].color}`
    );
    car.classList.add("leader-board__car-image-cell");
    listItem.appendChild(car);
    const name = document.createElement("div");
    name.innerHTML = this.winnersCars[i].name;
    name.classList.add("leader-board__name-cell");
    listItem.appendChild(name);
    const winsCell = document.createElement("div");
    const numberOfWins = this.winners.find(
      (winner) => winner.id === this.winnersCars[i].id
    )?.wins;
    if (numberOfWins) winsCell.innerText = `${numberOfWins}`;
    winsCell.classList.add("leader-board__wins-cell");
    listItem.appendChild(winsCell);
    const bestTimeCell = document.createElement("div");
    const bestTime = this.winners.find(
      (winner) => winner.id === this.winnersCars[i].id
    )?.time;
    if (bestTime) bestTimeCell.innerText = `${bestTime}`;
    bestTimeCell.classList.add("leader-board__best-time-cell");
    listItem.appendChild(bestTimeCell);
    return listItem;
  }

  private createLeaderBoardHeader() {
    const header = document.createElement("div");
    header.classList.add("leader-board__header");
    const number = document.createElement("div");
    number.innerHTML = "Number";
    number.classList.add("leader-board__number-cell");
    header.appendChild(number);
    const carImage = document.createElement("div");
    carImage.innerHTML = "Car";
    carImage.classList.add("leader-board__car-image-cell");
    header.appendChild(carImage);
    const name = document.createElement("div");
    name.innerHTML = "Name";
    name.classList.add("leader-board__name-cell");
    header.appendChild(name);
    const wins = document.createElement("div");
    wins.innerHTML = "Wins";
    wins.classList.add("leader-board__wins-cell");
    wins.onclick = () => this.sortBy("wins");
    header.appendChild(wins);
    const bestTime = document.createElement("div");
    bestTime.innerHTML = "Best time (seconds)";
    bestTime.classList.add("leader-board__best-time-cell");
    bestTime.onclick = () => this.sortBy("time");
    header.appendChild(bestTime);
    return header;
  }

  private sortBy(sortby: "wins" | "time") {
    if (this.sortOrder === "ASC") this.sortOrder = "DESC";
    else this.sortOrder = "ASC";
    this.orderBy = sortby;
    this.winners.sort((a, b) => {
      if (this.sortOrder === "DESC") return b[sortby] - a[sortby];
      return a[sortby] - b[sortby];
    });
    const winnersCarsCopy: Сharacteristics[] = [];
    this.winners.forEach((winner) => {
      const elem = this.winnersCars.find(
        (winnerCar) => winnerCar.id === winner.id
      );
      if (elem) winnersCarsCopy.push(elem);
    });
    this.winnersCars = winnersCarsCopy.map((winnerCar) => winnerCar);
    this.render();
  }
}

export default Winners;
