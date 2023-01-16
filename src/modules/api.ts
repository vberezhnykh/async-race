export type Сharacteristics = {
  name: string;
  color: "string";
  id: number;
};

export async function getCars(address: string, limit?: number /* page */) {
  let url = `${address}/garage`;
  if (limit) url = `${address}/garage?_limit=${limit}`;
  const response = await fetch(url);
  if (response.ok) {
    return {
      cars: await response.json(),
      totalNumberOfCars: response.headers.get("x-total-count"),
    };
  }
  return response.status;
}

export async function getCar(url: string, id: number) {
  const response = await fetch(`${url}/garage/${id}`);
  if (response.ok) return response.json();
  return response.status;
}

interface CarParams {
  name: string;
  color: string;
}
export async function createCar(url: string, params: CarParams) {
  const response = await fetch(`${url}/garage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.status;
}

export async function deleteCar(url: string, id: number) {
  const response = await fetch(`${url}/garage/${id}`, {
    method: "DELETE",
  });
  return response.status;
}

export async function updateCar(url: string, id: number, params: CarParams) {
  const response = await fetch(`${url}/garage/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.status;
}

export async function toggleCarEngine(
  url: string,
  id: number,
  status: "started" | "stopped"
) {
  const response = await fetch(`${url}/engine?id=${id}&status=${status}`, {
    method: "PATCH",
  });
  if (response.ok) return response.json();
  return response.status;
}

type SpeedAndDistance = {
  velocity: number;
  distance: number;
};
/* export async function toggleDriveMode(url: string, id: number) {
  const response = await fetch(`${url}/engine?id=${id}&status='drive`);
  if (response.ok) return response.json();
  return response.status;
} */

interface WinnersParams {
  _page?: number;
  _limit?: number;
  _sort?: "id" | "wins" | "time";
  _order?: "ASC" | "DESC";
}

export async function getWinners(url: string, params?: WinnersParams) {
  let response;
  if (params) {
    const paramsKeys = Object.keys(params);
    let queryParams = "";
    paramsKeys.forEach((key, index) => {
      if (
        key === "_page" ||
        key === "_limit" ||
        key === "_sort" ||
        key === "_order"
      ) {
        if (paramsKeys.length > 1 && index + 1 !== paramsKeys.length) {
          queryParams += `${key}=${params[key]}&`;
        } else queryParams += `${key}=${params[key]}`;
      }
    });
    response = await fetch(`${url}/winners?${queryParams}`);
  } else {
    response = await fetch(`${url}/winners`);
  }
  return {
    winners: await response.json(),
    totalNumberOfWinners: response.headers.get("x-total-count"),
  };
}

export async function getWinner(url: string, id: number) {
  const response = await fetch(`${url}/winners/${id}`);
  return response.json();
}

type SingleWinnerParams = {
  id: number;
  wins: number;
  time: number;
};
export async function createWinner(url: string, params: SingleWinnerParams) {
  const response = await fetch(`${url}/winners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.status;
}

export async function deleteWinner(url: string, id: number) {
  const response = await fetch(`${url}/winners/${id}`, {
    method: "DELETE",
  });
  return response.status;
}

export async function updateWinner(
  url: string,
  id: number,
  params: Pick<SingleWinnerParams, "wins" | "time">
) {
  const response = await fetch(`${url}/winners/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.status;
}