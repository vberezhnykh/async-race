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

export class Car {
  private _name: string;
  private _color: string;
  private _id: number;
  private _models = CAR_MODELS;
  private _brands = CAR_BRANDS;
  constructor(characteristics: Сharacteristics) {
    this._name = characteristics.name;
    this._color = characteristics.color;
    this._id = characteristics.id;
  }
  get name() {
    return this._name;
  }
  get color() {
    return this._color;
  }
  get id() {
    return this._id;
  }
  get models() {
    return this._models;
  }
  get brands() {
    return this._brands;
  }
}
