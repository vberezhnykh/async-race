import { Сharacteristics } from "api";

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
}

export default Car;
