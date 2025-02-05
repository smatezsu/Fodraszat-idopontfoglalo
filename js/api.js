const BASE_URL = "http://salonsapi.prooktatas.hu/api";

export const getHairdressers = async () => {
  const response = await fetch(`${BASE_URL}/hairdressers`);
  return response.json();
};

export const getAppointments = async () => {
  const response = await fetch(`${BASE_URL}/appointments`);
  return response.json();
};

export const createAppointment = async (appointmentData) => {
  const response = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData)
  });
  return response.ok ? response.json() : Promise.reject("Hiba történt!");
};
