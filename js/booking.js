import { createAppointment, getHairdressers } from './api.js';
import { showMessage, validateForm } from './utils.js';

let selectedHairdresser = null;
let selectedTime = ""; 

// MODAL //
export const selectHairdresser = async (hairdresser) => {
  selectedHairdresser = hairdresser;
  document.getElementById("selected-hairdresser-name").textContent = `Időpontfoglalás: ${hairdresser.name}`;
  document.getElementById("booking-modal").classList.remove("hidden");

  const allHairdressers = await getHairdressers();
  const details = allHairdressers.find(h => h.id === hairdresser.id);

  if (details && details.services) {
    populateServices(details.services);
  } else {
    showMessage("Ehhez a fodrászhoz nincs elérhető szolgáltatás.", true);
    document.getElementById("service").innerHTML = "";
  }

  document.getElementById("appointment-date").addEventListener("change", (e) => {
    generateTimeSlots(e.target.value);
  });
};

export const closeModal = () => {
  document.getElementById("booking-modal").classList.add("hidden");
  selectedTime = "";
};

// SZOLGÁLTATÁSOK LISTÁZÁSA //
const populateServices = (services) => {
  const serviceSelect = document.getElementById("service");
  serviceSelect.innerHTML = ""; 

  services.forEach(service => {
    const option = document.createElement("option");
    option.value = service;
    option.textContent = service;
    serviceSelect.appendChild(option);
  });
};

// IDŐPONTOK GENERÁLÁSA //
const generateTimeSlots = (selectedDate) => {
  const timeSlotsContainer = document.getElementById("time-slots");
  timeSlotsContainer.innerHTML = "";
  timeSlotsContainer.classList.remove("hidden");

  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    ["00", "30"].forEach((minutes) => {
      const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
      const fullDateTime = `${selectedDate}T${time}`;

      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot";
      timeSlot.textContent = time;
      timeSlot.onclick = () => selectTimeSlot(timeSlot, fullDateTime);

      timeSlotsContainer.appendChild(timeSlot);
    });
  }
};

const selectTimeSlot = (element, time) => {
  document.querySelectorAll(".time-slot").forEach(slot => slot.classList.remove("selected"));
  element.classList.add("selected");
  selectedTime = time;
};

// IDŐPONT LEFOGLALÁSA //
export const submitBooking = async (event) => {
  event.preventDefault();

  const customerName = document.getElementById("customer-name").value;
  const customerPhone = document.getElementById("customer-phone").value;
  const service = document.getElementById("service").value;

  if (!validateForm(customerName, customerPhone, selectedTime)) {
    showMessage("Minden mezőt ki kell tölteni, és válassz időpontot!", true);
    return;
  }

  const appointment = {
    hairdresser_id: selectedHairdresser.id,
    customer_name: customerName,
    customer_phone: customerPhone,
    appointment_date: selectedTime,
    service: service
  };

  try {
    await createAppointment(appointment);
    showMessage("Sikeres foglalás!");
    closeModal();
  } catch (error) {
    showMessage("Hiba történt a foglalás során!", true);
  }
};
