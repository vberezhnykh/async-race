import {
  SpeedAndDistance,
  toggleCarEngine,
  toggleDriveMode,
  Сharacteristics,
} from "./api";

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

class Car {
  name: string;

  color: string;

  id?: number;

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
    breakButton: HTMLButtonElement
  ) {
    if (this.id) {
      toggleCarEngine(url, this.id, "started")
        .then((data) => {
          if (data instanceof Object)
            this.calculateSpeedDistanceAndTime(data, container);
        })
        .then(() => {
          if (this.id)
            toggleDriveMode(url, this.id).then((data) => {
              this.moveCar(data, accelerateButton, breakButton);
            });
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
      this.time = this.distance / this.velocity;
    }
  }

  moveCar(
    response: Response,
    accelerateButton: HTMLButtonElement,
    breakButton: HTMLButtonElement
  ) {
    const MS_IN_SEC = 1000;
    const FRAMES_PER_SEC = 60;
    const RESPONSE_TIME = Math.floor(1000 / FRAMES_PER_SEC);
    clearInterval(this.intervalId);
    let deltaPx = 0;
    Car.toggleAccelerateBreakButtons(accelerateButton, breakButton, "drive");
    this.intervalId = setInterval(() => {
      if (response.status === 500) {
        clearInterval(this.intervalId);
      } else if (this.distance && deltaPx >= this.distance) {
        clearInterval(this.intervalId);
        Car.toggleAccelerateBreakButtons(
          accelerateButton,
          breakButton,
          "break"
        );
      } else if (this.carElement && this.velocity) {
        deltaPx += (this.velocity / MS_IN_SEC) * RESPONSE_TIME;
        this.carElement.style.left = `${deltaPx}px`;
      }
    }, RESPONSE_TIME);
  }

  stopCarAnimation(
    url: string,
    accelerateButton: HTMLButtonElement,
    breakButton: HTMLButtonElement
  ) {
    if (this.id) {
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
