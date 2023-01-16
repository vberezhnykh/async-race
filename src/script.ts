import "./index.html";
import {
  Сharacteristics,
  createCar,
  createWinner,
  deleteCar,
  deleteWinner,
  getCar,
  getCars,
  getWinner,
  getWinners,
  toggleCarEngine,
  /* toggleDriveMode, */
  updateCar,
  updateWinner,
} from "./modules/api";
import "./styles/styles.scss";
import carImageSrc from "./assets/car.svg";
import finishFlagSrc from "./assets/finish-flag.svg";
import { defaultCarImage } from "./carImage";

const URL = "http://127.0.0.1:3000";

/* class Controls {} */

class Garage {
  _totalNumberOfCars?: string;
  _carsInGarage?: Array<Сharacteristics>;
  _selectedCarId?: number;
  _updateButton?: HTMLButtonElement;
  constructor() {
    this.getCarsAndSetProps().then(() => this.render());
  }
  private getCarsAndSetProps() {
    return getCars(URL).then((data) => {
      if (data instanceof Object) {
        data.totalNumberOfCars !== null
          ? (this._totalNumberOfCars = data.totalNumberOfCars)
          : (this._totalNumberOfCars = data.cars.length);
        this._carsInGarage = data.cars;
      }
    });
  }

  render() {
    document.body.appendChild(this.createCreateInput());
    document.body.appendChild(this.createUpdateInput());
    document.body.appendChild(this.createHeading());
    document.body.appendChild(this.createListOfCars());
  }

  private createCreateInput() {
    const container = document.createElement("div");
    const input = document.createElement("input");
    container.append(input);
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#0000FF";
    container.append(colorInput);
    const button = document.createElement("button");
    button.textContent = "Create";
    button.addEventListener("click", () => {
      this.createCarAndUpdateView(input, colorInput);
    });
    container.append(button);
    return container;
  }

  private createCarAndUpdateView(
    input: HTMLInputElement,
    colorInput: HTMLInputElement
  ) {
    createCar(URL, {
      name: input.value,
      color: colorInput.value,
    }).then(() => this.updateView());
  }

  private updateView() {
    this.getCarsAndSetProps().then(() => {
      document.body.innerHTML = "";
      this.render();
    });
  }

  private createUpdateInput() {
    const container = document.createElement("div");
    const input = document.createElement("input");
    container.append(input);
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#0000FF";
    container.append(colorInput);
    const button = document.createElement("button");
    button.textContent = "Update";
    button.disabled = true;
    button.addEventListener("click", () => {
      this.updateCarAndView(input, colorInput);
    });
    this._updateButton = button;
    container.append(button);
    return container;
  }

  private updateCarAndView(
    input: HTMLInputElement,
    colorInput: HTMLInputElement
  ) {
    if (this._selectedCarId) {
      updateCar(URL, this._selectedCarId, {
        name: input.value,
        color: colorInput.value,
      }).then(() => this.updateView());
    }
  }

  private createHeading() {
    const header = document.createElement("h2");
    header.textContent = `Garage (${this._totalNumberOfCars})`;
    return header;
  }

  private createListOfCars() {
    const listOfCars = document.createElement("ul");
    listOfCars.classList.add("car-list");
    this._carsInGarage?.forEach((carInGarage, index) => {
      const car = new Car(carInGarage);
      const container = document.createElement("div");
      container.classList.add("car-list__item");
      // кнопки управления select remove
      const controlButtonsContainer = document.createElement("div");
      controlButtonsContainer.classList.add("control-buttons");
      const selectButton = document.createElement("button");
      selectButton.textContent = "SELECT";
      selectButton.addEventListener("click", () => {
        this._selectedCarId = index + 1;
        if (this._updateButton) this._updateButton.disabled = false;
      });
      controlButtonsContainer.append(selectButton);
      const removeButton = document.createElement("button");
      removeButton.textContent = "REMOVE";
      removeButton.addEventListener("click", () => {
        this.deleteCarAndUpdateView(index);
      });
      controlButtonsContainer.append(removeButton);
      container.append(controlButtonsContainer);
      // название машины
      const carName = document.createElement("span");
      carName.classList.add("car-list__car-name");
      carName.textContent = car.name;
      container.append(carName);
      // кнопки управления автомобилем
      const driveButtonsContainer = document.createElement("div");
      driveButtonsContainer.classList.add("drive-buttons");
      const accelerateButton = document.createElement("button");
      accelerateButton.textContent = "A";
      driveButtonsContainer.append(accelerateButton);
      const breakButton = document.createElement("button");
      breakButton.textContent = "B";
      driveButtonsContainer.append(breakButton);
      container.append(driveButtonsContainer);
      // трек
      const track = document.createElement("div");
      track.classList.add("track");
      // изображение машины;
      const image = document.createElement("div");
      const svgImage = defaultCarImage.replace(
        `fill="#000000"`,
        `fill=${carInGarage.color}`
      );
      image.innerHTML = svgImage;
      track.append(image);
      // изображение флага
      const flag = new Image();
      flag.classList.add("flag");
      flag.src = finishFlagSrc;
      track.append(flag);
      container.append(track);
      listOfCars.appendChild(container);
    });
    return listOfCars;
  }

  private deleteCarAndUpdateView(index: number) {
    deleteCar(URL, index + 1).then(() => this.updateView());
  }
}

class Car {
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

const garage = new Garage();
// garage.render();

// class Winners {}

// getCars(URL).then((data) => console.log(data));
