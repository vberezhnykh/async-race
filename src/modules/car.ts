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

  element?: HTMLDivElement;

  start?: number;

  previousTimeStamp?: number;

  animationFinished = false;

  intervalId?: ReturnType<typeof setInterval>;

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

  animateCar(url: string, container: HTMLLIElement) {
    if (this.id) {
      toggleCarEngine(url, this.id, "started")
        .then((data) => {
          if (data instanceof Object)
            this.calculateSpeedDistanceAndTime(data, container);
        })
        .then(() => {
          if (this.id)
            toggleDriveMode(url, this.id).then((data) => {
              this.moveCar(data);
            });
        });
    }
  }

  private calculateSpeedDistanceAndTime(
    data: SpeedAndDistance,
    container: HTMLLIElement
  ) {
    this.velocity = data.velocity;
    if (this.element) {
      this.distance = Math.floor(
        container.getBoundingClientRect().width -
          this.element.getBoundingClientRect().width
      );
      this.time = this.distance / this.velocity;
    }
  }

  moveCar(response: Response) {
    clearInterval(this.intervalId);
    let deltaPx = 0;
    this.intervalId = setInterval(() => {
      if (
        response.status === 500 ||
        (this.distance && deltaPx >= this.distance)
      ) {
        clearInterval(this.intervalId);
      } else if (this.element && this.velocity) {
        deltaPx += (this.velocity / 1000) * 16;
        this.element.style.left = `${deltaPx}px`;
      }
    }, 16);
  }
}

export default Car;
