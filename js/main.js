import { getHairdressers } from './api.js';
import { selectHairdresser, submitBooking, closeModal } from './booking.js';

const defaultAvatar = "assets/default-avatar.png";

const loadHairdressers = async () => {
  const hairdressers = await getHairdressers();
  const list = document.getElementById("hairdresser-list");
  list.innerHTML = "";

  hairdressers.forEach((hairdresser, index) => {
    const card = document.createElement("div");
    card.className = "box";
    card.style.animationDelay = `${index * 0.1}s`;

    card.onclick = () => selectHairdresser(hairdresser);

    const profileImg = document.createElement("img");
    profileImg.className = "profile-img";
    profileImg.src = hairdresser.profile_picture || defaultAvatar;

    const name = document.createElement("h3");
    name.textContent = hairdresser.name;

    const servicesList = document.createElement("p");
    servicesList.className = "services-list";
    servicesList.textContent = hairdresser.services?.length
      ? `Szolgáltatások: ${hairdresser.services.join(", ")}`
      : "Nincs elérhető szolgáltatás.";

    card.appendChild(profileImg);
    card.appendChild(name);
    card.appendChild(servicesList);
    list.appendChild(card);
  });
};

document.getElementById("booking-form-element").addEventListener("submit", submitBooking);
window.closeModal = closeModal;

window.onload = loadHairdressers;
