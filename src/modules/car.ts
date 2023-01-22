import {
  createWinner,
  getWinner,
  SpeedAndDistance,
  toggleCarEngine,
  toggleDriveMode,
  updateWinner,
  Сharacteristics,
} from "./api";
import defaultCarImage from "./carImage";

const CAR_BRANDS = [
  "Alpha Romeo",
  "Audi",
  "BMW",
  "Chevrolet",
  "Fiat",
  "Ferrari",
  "Jaguar",
  "Honda",
  "Range Rover",
  "Mercedes",
];

const CAR_MODELS = [
  "Giulia",
  "R8",
  "M4",
  "Camaro",
  "500",
  "F40",
  "F-Type",
  "Civic",
  "Sport",
  "AMG GT",
];

let winningCar: null | number = null;

const API_URL = "http://127.0.0.1:3000";

class Car {
  name: string;

  color: string;

  id?: number;

  image = defaultCarImage;

  velocity?: number;

  distance?: number;

  time?: number;

  carElement?: HTMLDivElement;

  carContainer?: HTMLLIElement;

  start?: number;

  intervalId?: ReturnType<typeof setInterval>;

  accelerateButton?: HTMLButtonElement;

  brakeButton?: HTMLButtonElement;

  constructor(isRandom: boolean, characteristics?: Сharacteristics) {
    if (!isRandom && characteristics) {
      this.name = characteristics.name;
      this.color = characteristics.color;
      this.id = characteristics.id;
      this.image = this.image.replace(
        `fill="#000000"`,
        `fill=${characteristics.color}`
      );
    } else {
      const brand = CAR_BRANDS[Car.getRandomIntInclusive(0, 9)];
      const model = CAR_MODELS[Car.getRandomIntInclusive(0, 9)];
      this.name = `${brand} ${model}`;
      this.color = `${Car.getRandomColor()}`;
    }
  }

  static getRandomIntInclusive(min: number, max: number) {
    const minNum = Math.ceil(min);
    const maxNum = Math.floor(max);
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
  }

  static getRandomColor() {
    const LETTERS = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i += 1) {
      color += LETTERS[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  animateCar(
    url: string,
    container: HTMLLIElement,
    accelerateButton: HTMLButtonElement,
    brakeButton: HTMLButtonElement
  ) {
    if (this.id) {
      toggleCarEngine(url, this.id, "started")
        .then((data) => {
          if (data instanceof Object)
            this.calculateSpeedDistanceAndTime(data, container);
        })
        .then(() => {
          if (this.id) this.moveCar(accelerateButton, brakeButton);
        });
    }
  }

  calculateSpeedDistanceAndTime(
    data: SpeedAndDistance,
    container: HTMLLIElement
  ) {
    this.velocity = data.velocity;
    if (this.carElement) {
      this.distance = Math.floor(
        container.getBoundingClientRect().width -
          this.carElement.getBoundingClientRect().width
      );
      const [seconds, ms] = (this.distance / this.velocity)
        .toString()
        .split(".");
      this.time = Number(`${seconds}.${ms.slice(0, 2)}`);
    }
  }

  async moveCar(
    accelerateButton: HTMLButtonElement,
    breakButton: HTMLButtonElement,
    isRace?: boolean
  ) {
    const MS_IN_SEC = 1000;
    const FRAMES_PER_SEC = 60;
    const RESPONSE_TIME = Math.floor(1000 / FRAMES_PER_SEC);
    let promise: Promise<Response>;
    if (this.id) promise = toggleDriveMode(API_URL, this.id);
    clearInterval(this.intervalId);
    if (isRace) winningCar = null;
    let deltaPx = 0;
    Car.toggleAccelerateBreakButtons(accelerateButton, breakButton, "drive");
    this.intervalId = setInterval(async () => {
      if (this.distance && deltaPx >= this.distance) {
        clearInterval(this.intervalId);
        Car.toggleAccelerateBreakButtons(
          accelerateButton,
          breakButton,
          "break"
        );
        if (isRace && winningCar === null && this.id) {
          winningCar = this.id;
          getWinner(API_URL, winningCar).then((winnerResponse) => {
            if (winnerResponse === "404" && winningCar && this.time) {
              createWinner(API_URL, {
                id: winningCar,
                wins: 1,
                time: this.time,
              });
            } else if (
              winningCar &&
              winnerResponse instanceof Object &&
              this.time
            ) {
              const params = {
                wins: winnerResponse.wins,
                time: winnerResponse.time,
              };
              if (params.time > this.time) params.time = this.time;
              params.wins += 1;
              updateWinner(API_URL, winningCar, params);
            }
          });
        }
      } else if (this.carElement && this.velocity) {
        deltaPx += (this.velocity / MS_IN_SEC) * RESPONSE_TIME;
        this.carElement.style.left = `${deltaPx}px`;
        await promise.then((response) => {
          if (response.status === 500) clearInterval(this.intervalId);
        });
      }
    }, RESPONSE_TIME);
  }

  stopCarAnimation(
    url: string,
    accelerateButton: HTMLButtonElement,
    breakButton: HTMLButtonElement,
    engineStopped?: boolean
  ) {
    if (this.id) {
      if (!engineStopped) {
        toggleCarEngine(url, this.id, "stopped").then((data) => {
          if (data === 200 && this.carElement) {
            clearInterval(this.intervalId);
            this.carElement.style.left = "0";
            Car.toggleAccelerateBreakButtons(
              accelerateButton,
              breakButton,
              "break"
            );
          }
        });
      } else if (engineStopped && this.carElement) {
        clearInterval(this.intervalId);
        this.carElement.style.left = "0";
        Car.toggleAccelerateBreakButtons(
          accelerateButton,
          breakButton,
          "break"
        );
      }
    }
  }

  static toggleAccelerateBreakButtons(
    accelerateButton: HTMLButtonElement,
    breakButton: HTMLButtonElement,
    status: "drive" | "break"
  ) {
    if (status === "drive") {
      breakButton.disabled = false;
      accelerateButton.disabled = true;
    } else {
      breakButton.disabled = true;
      accelerateButton.disabled = false;
    }
  }
}

export default Car;
