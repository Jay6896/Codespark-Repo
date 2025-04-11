const locations = [
  { name: "EPM (Electrical Power and Machines Lab)", floor: 1 },
  { name: "ECT (Electronic and Control Lab)", floor: 1 },
  { name: "Course Coordinators office", floor: 1 },
  { name: "EDS (Engineering Drawing Studio)", floor: 1 },
  { name: "RML (Robotics and Mechatronics Laboratory)", floor: 2 },
  { name: "ACR (Air Conditioning and Refridgeratory Laboratory)", floor: 2 },
  { name: "LAB1", floor: 2 },
  { name: "TFL (Thermofluid Lab)", floor: 2 },
  { name: "MML (Mechanics of Machines Lab)", floor: 2 },
  { name: "Faculty Library", floor: 2 },
  { name: "RM 2", floor: 2 },
  { name: "RM 1", floor: 2 },
  { name: "LAB2", floor: 2 },
  { name: "Tuck Shop", floor: 2 },
  { name: "PHY LAB (Physics and Applied Electricity Lab)", floor: 3 },
  { name: "CHM LAB (Chemistry Lab)", floor: 3 },
  { name: "RM 5", floor: 3 },
  { name: "RM 4", floor: 3 },
  { name: "RM 3", floor: 3 },
];

function switchFloor(floor) {
  // Switch active map
  document.querySelectorAll('.map').forEach(map => map.classList.remove('active'));
  document.getElementById(`floor-${floor}`).classList.add('active');

  // Highlight active floor button
  document.querySelectorAll('.floor-buttons button').forEach((btn, index) => {
    btn.classList.toggle('active', index === floor - 1);
  });
}

const searchInput = document.getElementById("search");
const suggestionsBox = document.getElementById("suggestions");

let currentFocus = -1;
let currentSuggestions = [];

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";
  currentSuggestions = [];

  if (!value) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = locations
    .filter(loc => loc.name.toLowerCase().includes(value))
    .sort((a, b) => a.name.toLowerCase().indexOf(value) - b.name.toLowerCase().indexOf(value));

  matches.forEach((loc, index) => {
    const div = document.createElement("div");
    div.textContent = loc.name;
    div.onclick = () => selectSuggestion(loc.name);
    suggestionsBox.appendChild(div);
    currentSuggestions.push(div);
  });

  currentFocus = -1;
  suggestionsBox.style.display = matches.length ? "flex" : "none";
});

searchInput.addEventListener("keydown", e => {
  if (!currentSuggestions.length) return;

  if (e.key === "ArrowDown") {
    currentFocus = (currentFocus + 1) % currentSuggestions.length;
    updateActiveSuggestion();
  } else if (e.key === "ArrowUp") {
    currentFocus = (currentFocus - 1 + currentSuggestions.length) % currentSuggestions.length;
    updateActiveSuggestion();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (currentFocus >= 0 && currentSuggestions[currentFocus]) {
      currentSuggestions[currentFocus].click();
    } else if (searchInput.value.trim()) {
      selectSuggestion(searchInput.value.trim());
    }
  }
});

document.addEventListener("click", e => {
  if (!document.getElementById("search-wrapper").contains(e.target)) {
    suggestionsBox.style.display = "none";
  }
});

function updateActiveSuggestion() {
  currentSuggestions.forEach(el => el.classList.remove("active"));
  if (currentFocus >= 0) {
    currentSuggestions[currentFocus].classList.add("active");
    currentSuggestions[currentFocus].scrollIntoView({ block: "nearest" });
  }
}

function selectSuggestion(name) {
  searchInput.value = name;
  suggestionsBox.style.display = "none";
  highlightLocation(name);
}

function highlightLocation(name) {
  const query = name.toLowerCase();
  const match = locations.find(loc => loc.name.toLowerCase() === query);

  document.querySelectorAll('.marker').forEach(m => m.classList.remove('highlight'));

  if (match) {
    switchFloor(match.floor);
    const map = document.getElementById(`floor-${match.floor}`);
    const marker = [...map.querySelectorAll('.marker')].find(m => m.dataset.name.toLowerCase() === query);
    if (marker) marker.classList.add('highlight');
  } else {
    alert("Location not found");
  }
}
