const API_KEY = "b2084c37a6ac5e6e8dc1f5d898ec3cf8";
const SUBDOMAIN = "roverkennels";
const LOCATION_ID = "santa-monica";

async function fetchDogs() {
  const url = `https://${SUBDOMAIN}.gingrapp.com/api/v1/back_of_house?key=${API_KEY}&location_id=${LOCATION_ID}&full_day=true`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    /*
      Gingr returns objects like:
      {
        animal_name: "",
        check_in_time: "",
        reservation_type: "daycare" OR "boarding",
        animal_photo_url: ""
      }
    */

    const dogs = [
      ...(data.checking_in || []),
      ...(data.checking_out || []),
    ];

    renderDogs(dogs);

    document.getElementById("lastUpdated").textContent =
      "Last updated: " + new Date().toLocaleTimeString();

  } catch (error) {
    console.error("Failed to fetch Gingr data:", error);
  }
}

function renderDogs(dogs) {
  const container = document.getElementById("dogContainer");
  container.innerHTML = "";

  dogs.forEach((dog) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Determine color based on daycare vs boarding
    const statusClass =
      dog.reservation_type?.toLowerCase() === "boarding"
        ? "boarding"
        : "daycare";

    const photoUrl = dog?.animal_photo_url || "https://place-puppy.com/300x300";

    card.innerHTML = `
      <img src="${photoUrl}" alt="Dog photo" />
      <h2 class="${statusClass}">${dog.animal_name}</h2>
      <div class="checkin">Check-In: ${dog.check_in_time || "—"}</div>
    `;

    container.appendChild(card);
  });

  adjustScrollSpeed(dogs.length);
}

/*
  Auto-scroll speed becomes slower when more dogs are present.
*/
function adjustScrollSpeed(dogCount) {
  const grid = document.getElementById("dogContainer");

  let duration = 25; // default animation speed

  if (dogCount > 18) duration = 35;
  if (dogCount > 28) duration = 45;
  if (dogCount > 36) duration = 60;

  grid.style.animationDuration = `${duration}s`;
}

// Initial fetch + every minute refresh
fetchDogs();
setInterval(fetchDogs, 60000);



