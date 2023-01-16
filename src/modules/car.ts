import { Сharacteristics } from "api";
export class Car {
  private _name: string;
  private _color: string;
  private _id: number;
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
}
