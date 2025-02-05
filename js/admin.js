import { getAppointments, getHairdressers } from './api.js';

const loadHairdressers = async () => {
  const hairdressers = await getHairdressers();
  const filterSelect = document.getElementById("hairdresser-filter");

  hairdressers.forEach(hairdresser => {
    const option = document.createElement("option");
    option.value = hairdresser.id;
    option.textContent = hairdresser.name;
    filterSelect.appendChild(option);
  });
};

const loadAppointments = async () => {
  const appointments = await getAppointments();
  const selectedHairdresserId = document.getElementById("hairdresser-filter").value;
  const searchTerm = document.getElementById("search-appointments").value.toLowerCase();
  const list = document.getElementById("appointments-list");

  list.innerHTML = "";

  const filteredAppointments = appointments.filter(app => {
    const matchesHairdresser = selectedHairdresserId === "all" || app.hairdresser_id == selectedHairdresserId;
    const matchesSearch = app.customer_name.toLowerCase().includes(searchTerm) ||
                          app.service.toLowerCase().includes(searchTerm);
    return matchesHairdresser && matchesSearch;
  });

  filteredAppointments.forEach(app => {
    const li = document.createElement("li");
    li.className = "appointment-item";
    li.textContent = `${app.customer_name} - ${app.appointment_date} (${app.service})`;

    // STÁTUSZ
    const statusBadge = document.createElement("span");
    statusBadge.className = app.status === "confirmed" ? "status-confirmed" : "status-pending";
    statusBadge.textContent = app.status === "confirmed" ? "Megerősítve" : "Függőben";
    li.appendChild(statusBadge);

    // MEGERŐSÍTÉS
    if (app.status !== "confirmed") {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container"; 
      
        const confirmButton = document.createElement("button");
        confirmButton.className = "confirm-btn";
        confirmButton.textContent = "Megerősítés";
      
        confirmButton.onclick = () => {
          statusBadge.textContent = "Megerősítve";
          statusBadge.className = "status-confirmed";
          li.classList.add("confirmed");
          confirmButton.remove();
        };
      
        buttonContainer.appendChild(confirmButton); 
        li.appendChild(buttonContainer);
      }
      
    list.appendChild(li);
  });
};

document.getElementById("search-appointments").addEventListener("input", loadAppointments);
document.getElementById("hairdresser-filter").addEventListener("change", loadAppointments);

window.onload = async () => {
  await loadHairdressers();
  await loadAppointments();
};

