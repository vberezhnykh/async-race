import {
  Сharacteristics,
  createCar,
  deleteCar,
  getCars,
  updateCar,
  toggleCarEngine,
} from "./api";
import Car from "./car";
import finishFlagSrc from "../assets/finish-flag.svg";
import { defaultCarImage } from "./carImage";

const API_URL = "http://127.0.0.1:3000";

class Garage {
  private totalNumberOfCars: string | null = null;

  private carsInGarage: Array<Сharacteristics> | null = null;

  private selectedCarId?: number;

  private updateButton?: HTMLButtonElement;

  private paginationLimit = 7;

  private pageCount = 1;

  private currentPage = 1;

  private prevRange = 0;

  private currRange = 7;

  private carsInView: Array<Car> = [];

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
    if (this.totalNumberOfCars === null || this.carsInGarage === null) {
      this.getCarsAndSetProps().then(() => this.createElements());
    } else this.createElements();
  }

  private createElements() {
    this.getCarsAndSetProps().then(() => {
      const garageContainer = document.querySelector(".garage-container");
      if (garageContainer) {
        garageContainer.appendChild(this.createCarCreateInput());
        garageContainer.appendChild(this.createUpdateInput());
        garageContainer.appendChild(this.createRaceButtons("race"));
        garageContainer.appendChild(this.createRaceButtons("reset"));
        garageContainer.appendChild(this.createGenerateButton());
        garageContainer.appendChild(this.createHeading());
        garageContainer.appendChild(this.createPagination());
        garageContainer.appendChild(this.createListOfCars());
      }
    });
  }

  private createCarCreateInput() {
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
    }).then(() => {
      if (this.carsInGarage) {
        const lastCarId = this.carsInGarage[this.carsInGarage.length - 1].id;
        this.carsInGarage.push({
          name: input.value,
          color: colorInput.value,
          id: lastCarId + 1,
        });
      }
      this.updateView();
    });
  }

  private updateView() {
    this.carsInView = [];
    const garageContainer = document.querySelector(".garage-container");
    if (garageContainer) garageContainer.innerHTML = "";
    this.render();
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
      }).then(() => {
        if (this.carsInGarage) {
          this.carsInGarage = this.carsInGarage.map((carInGarage) => {
            if (carInGarage.id === this.selectedCarId) {
              return {
                name: input.value,
                color: colorInput.value,
                id: this.selectedCarId,
              };
            }
            return carInGarage;
          });
        }
        this.updateView();
      });
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
        if (this.carsInGarage) {
          const lastId = this.carsInGarage[this.carsInGarage.length - 1].id;
          this.carsInGarage.push({
            name: car.name,
            color: car.color,
            id: lastId + 1,
          });
        }
      }
      this.updateView();
    };
    return button;
  }

  private createRaceButtons(mode: "race" | "reset") {
    const button = document.createElement("button");
    button.innerHTML = mode.toUpperCase();
    button.className = `${mode}`;

    button.onclick = () => {
      const cars: Array<Car> = [];
      for (let i = this.prevRange; i < this.currRange; i += 1) {
        if (this.carsInView[i]) cars.push(this.carsInView[i]);
      }
      if (mode === "race") {
        Garage.startRace(cars);
      } else {
        Garage.resetRace(cars);
      }
    };

    return button;
  }

  static startRace(cars: Car[]) {
    const engineStartedPromises: Promise<Response>[] = [];
    cars.forEach((car) => {
      if (car.id) {
        engineStartedPromises.push(
          toggleCarEngine(API_URL, car.id, "started", "Response")
        );
      }
    });
    const setProps = async (
      result: PromiseSettledResult<Response>,
      index: number
    ) => {
      if (result.status === "fulfilled") {
        const data = await result.value.json();
        const car = cars[index];
        if (data instanceof Object && car.carContainer)
          car.calculateSpeedDistanceAndTime(data, car.carContainer);
      }
    };
    const startCarsEngine = async () =>
      Promise.allSettled(engineStartedPromises);
    const setSpeedAndDistanceOfCars = async (
      results: PromiseSettledResult<Response>[]
    ) => {
      const promises: Array<Promise<void>> = [];
      results.forEach((result, index) =>
        promises.push(setProps(result, index))
      );
      return Promise.all(promises);
    };
    const startCarsAnimation = () => {
      cars.forEach((car) => {
        if (car.accelerateButton && car.brakeButton)
          car.moveCar(car.accelerateButton, car.brakeButton, true);
      });
    };
    startCarsEngine()
      .then((results) => setSpeedAndDistanceOfCars(results))
      .then(() => startCarsAnimation());
  }

  static resetRace(cars: Car[]) {
    const promises: Array<Promise<Response>> = [];
    cars.forEach((car) => {
      if (car.id)
        promises.push(toggleCarEngine(API_URL, car.id, "stopped", "Response"));
    });
    Promise.all(promises).then(() => {
      cars.forEach((car) => {
        if (car.accelerateButton && car.brakeButton)
          car.stopCarAnimation(
            API_URL,
            car.accelerateButton,
            car.brakeButton,
            true
          );
      });
    });
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
    this.carsInView = [];
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
      this.carsInView.push(car);
      const container = document.createElement("li");
      car.carContainer = container;
      container.classList.add(
        "car-list__item" /* , "car-list__item--hidden" */
      );
      this.createSelectAndRemoveButtons(index, container, car);
      Garage.createCarName(car, container);
      Garage.createCarControls(container, car);
      Garage.createTrack(carInGarage, container, car);
      if (index >= this.prevRange && index < this.currRange) {
        // container.classList.remove("car-list__item--hidden");
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
    car.carElement = image;
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
    car.accelerateButton = accelerateButton;
    driveButtonsContainer.append(accelerateButton);
    const brakeButton = document.createElement("button");
    brakeButton.textContent = "B";
    car.brakeButton = brakeButton;
    brakeButton.disabled = true;
    driveButtonsContainer.append(brakeButton);
    container.append(driveButtonsContainer);
    accelerateButton.onclick = () => {
      car.animateCar(API_URL, container, accelerateButton, brakeButton);
    };
    brakeButton.onclick = () => {
      car.stopCarAnimation(API_URL, accelerateButton, brakeButton);
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
      if (car.id) this.deleteCarAndUpdateView(car.id, index);
    });
    controlButtonsContainer.append(removeButton);
    container.append(controlButtonsContainer);
  }

  private deleteCarAndUpdateView(id: number, index: number) {
    if (index === this.prevRange) {
      this.currentPage -= 1;
      this.updatePageRanges();
    }
    deleteCar(API_URL, id).then(() => {
      if (this.carsInGarage) {
        this.carsInGarage = this.carsInGarage.filter(
          (carInGarage) => carInGarage.id !== id
        );
        this.updateView();
      }
    });
  }
}

export default Garage;
