import {
  Сharacteristics,
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from "./api";
import Car from "./car";
import finishFlagSrc from "../assets/finish-flag.svg";
import { defaultCarImage } from "./carImage";

const API_URL = "http://127.0.0.1:3000";

class Garage {
  private totalNumberOfCars?: string;

  private carsInGarage?: Array<Сharacteristics>;

  private selectedCarId?: number;

  private updateButton?: HTMLButtonElement;

  private paginationLimit = 7;

  private pageCount = 1;

  private currentPage = 1;

  private prevRange = 0;

  private currRange = 7;

  private getCarsAndSetProps() {
    return getCars(API_URL).then((data) => {
      if (data instanceof Object) {
        if (data.totalNumberOfCars !== null)
          this.totalNumberOfCars = data.totalNumberOfCars;
        else this.totalNumberOfCars = data.cars.length;
        this.carsInGarage = data.cars;
        this.pageCount = Math.ceil(
          Number(this.totalNumberOfCars) / this.paginationLimit
        );
      }
    });
  }

  render() {
    this.getCarsAndSetProps().then(() => {
      const main = document.querySelector(".main");
      if (main) {
        main.appendChild(this.createCreateInput());
        main.appendChild(this.createUpdateInput());
        main.appendChild(this.createGenerateButton());
        main.appendChild(this.createHeading());
        main.appendChild(this.createPagination());
        main.appendChild(this.createListOfCars());
      }
    });
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
    createCar(API_URL, {
      name: input.value,
      color: colorInput.value,
    }).then(() => this.updateView());
  }

  private updateView() {
    this.getCarsAndSetProps().then(() => {
      const main = document.querySelector(".main");
      if (main) main.innerHTML = "";
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
    button.addEventListener("click", () =>
      this.updateCarAndView(input, colorInput)
    );
    this.updateButton = button;
    container.append(button);
    return container;
  }

  private updateCarAndView(
    input: HTMLInputElement,
    colorInput: HTMLInputElement
  ) {
    if (this.selectedCarId) {
      updateCar(API_URL, this.selectedCarId, {
        name: input.value,
        color: colorInput.value,
      }).then(() => this.updateView());
    }
  }

  private createGenerateButton() {
    const button = document.createElement("button");
    button.innerHTML = "GENERATE CARS";
    button.onclick = () => {
      for (let i = 0; i < 100; i += 1) {
        const car = new Car(true);
        createCar(API_URL, {
          name: car.name,
          color: car.color,
        });
      }
      this.updateView();
    };
    return button;
  }

  private createHeading() {
    const header = document.createElement("h2");
    header.textContent = `Garage (${this.totalNumberOfCars})`;
    return header;
  }

  private createPagination() {
    const nav = document.createElement("nav");
    nav.classList.add("pagination-nav");
    const prevButton = document.createElement("button");
    prevButton.textContent = "←";
    if (this.currentPage === 1) prevButton.disabled = true;
    nav.append(prevButton);
    const paginationNumber = document.createElement("span");
    paginationNumber.classList.add("page-number");
    paginationNumber.textContent = `Page #${this.currentPage}`;
    nav.append(paginationNumber);
    const nextButton = document.createElement("button");
    nextButton.textContent = "→";
    if (this.currentPage === this.pageCount) nextButton.disabled = true;
    nav.append(nextButton);
    prevButton.onclick = () => {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.updateCarListView(prevButton, nextButton, nav, paginationNumber);
      }
    };
    nextButton.onclick = () => {
      if (this.currentPage < this.pageCount) {
        this.currentPage += 1;
        this.updateCarListView(prevButton, nextButton, nav, paginationNumber);
      }
    };
    return nav;
  }

  private updatePageRanges() {
    this.prevRange = (this.currentPage - 1) * this.paginationLimit;
    this.currRange = this.currentPage * this.paginationLimit;
  }

  private handlePrevButton(prevButton: HTMLButtonElement) {
    this.updatePageRanges();
    if (this.currentPage === 1) prevButton.disabled = true;
    else prevButton.disabled = false;
  }

  private handleNextButton(nextButton: HTMLButtonElement) {
    this.updatePageRanges();
    if (this.pageCount === this.currentPage) nextButton.disabled = true;
    else nextButton.disabled = false;
  }

  private updateCarListView(
    prevButton: HTMLButtonElement,
    nextButton: HTMLButtonElement,
    nav: HTMLElement,
    paginationNumber: HTMLSpanElement
  ) {
    this.handlePrevButton(prevButton);
    this.handleNextButton(nextButton);
    document.querySelector(".car-list")?.remove();
    nav.after(this.createListOfCars());
    paginationNumber.textContent = `Page #${this.currentPage}`;
  }

  private createListOfCars() {
    const listOfCars = document.createElement("ul");
    listOfCars.classList.add("car-list");
    this.carsInGarage?.forEach((carInGarage, index) => {
      const car = new Car(false, carInGarage);
      const container = document.createElement("li");
      container.classList.add("car-list__item");
      this.createSelectAndRemoveButtons(index, container, car);
      Garage.createCarName(car, container);
      Garage.createCarControls(container, car);
      Garage.createTrack(carInGarage, container, car);
      if (index >= this.prevRange && index < this.currRange) {
        listOfCars.appendChild(container);
      }
    });
    return listOfCars;
  }

  static createTrack(
    carInGarage: Сharacteristics,
    container: HTMLLIElement,
    car: Car
  ) {
    const track = document.createElement("div");
    track.classList.add("track");
    // изображение машины;
    const image = document.createElement("div");
    image.classList.add("car-image");
    const svgImage = defaultCarImage.replace(
      `fill="#000000"`,
      `fill=${carInGarage.color}`
    );
    image.innerHTML = svgImage;
    track.append(image);
    car.element = image;
    // изображение флага
    const flag = new Image();
    flag.classList.add("flag");
    flag.src = finishFlagSrc;
    track.append(flag);
    container.append(track);
  }

  static createCarControls(container: HTMLLIElement, car: Car) {
    const driveButtonsContainer = document.createElement("div");
    driveButtonsContainer.classList.add("drive-buttons");
    const accelerateButton = document.createElement("button");
    accelerateButton.textContent = "A";
    driveButtonsContainer.append(accelerateButton);
    const breakButton = document.createElement("button");
    breakButton.textContent = "B";
    breakButton.disabled = true;
    driveButtonsContainer.append(breakButton);
    container.append(driveButtonsContainer);
    accelerateButton.onclick = () => {
      car.animateCar(API_URL, container, accelerateButton, breakButton);
    };
    breakButton.onclick = () => {
      car.stopCarAnimation(API_URL, accelerateButton, breakButton);
    };
  }

  static createCarName(car: Car, container: HTMLLIElement) {
    const carName = document.createElement("span");
    carName.classList.add("car-list__car-name");
    carName.textContent = car.name;
    container.append(carName);
  }

  private createSelectAndRemoveButtons(
    index: number,
    container: HTMLLIElement,
    car: Car
  ) {
    const controlButtonsContainer = document.createElement("div");
    controlButtonsContainer.classList.add("control-buttons");
    const selectButton = document.createElement("button");
    selectButton.textContent = "SELECT";
    selectButton.addEventListener("click", () => {
      this.selectedCarId = car.id;
      if (this.updateButton) this.updateButton.disabled = false;
    });
    controlButtonsContainer.append(selectButton);
    const removeButton = document.createElement("button");
    removeButton.textContent = "REMOVE";
    removeButton.addEventListener("click", () => {
      if (car.id) this.deleteCarAndUpdateView(car.id, index /* container */);
    });
    controlButtonsContainer.append(removeButton);
    container.append(controlButtonsContainer);
  }

  private deleteCarAndUpdateView(
    id: number,
    index: number
    /* container: HTMLLIElement */
  ) {
    if (index === this.prevRange) {
      this.currentPage -= 1;
      this.updatePageRanges();
    }
    deleteCar(API_URL, id).then(() =>
      // container.remove()
      this.updateView()
    );
  }
}

export default Garage;
