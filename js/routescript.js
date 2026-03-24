// ======================================
// INSTELLINGEN
// ======================================

// Kies hier het lokaal.
// Later kun je dit uit localStorage, URL params of een API halen.
const selectedRoom = "AC1.18";

// Optioneel: vaknaam / tekst in popup
const selectedCourse = "Advanced AR 2";

// ======================================
// DATA
// ======================================

// Gebruik de PNG/JPG export van jouw echte plattegronden.
// naturalWidth/naturalHeight moeten overeenkomen met de gebruikte afbeelding.
// Pas deze aan als jouw export andere afmetingen heeft.

const buildingData = {
  Circus: {
    AC1: {
      image: "assets/circus-1.png",
      naturalWidth: 1182,
      naturalHeight: 790,
      start: [784, 174], // ongeveer roltrap / kerngebied
      routes: {
        "AC1.18": {
          main: [
            [784, 174],
            [760, 174],
            [760, 192],
            [318, 192],
            [318, 289]
          ],
          accessible: [
            [784, 174],
            [705, 174],
            [705, 239],
            [474, 239],
            [474, 192],
            [318, 192],
            [318, 289]
          ],
          quiet: [
            [784, 174],
            [786, 240],
            [542, 240],
            [542, 434],
            [286, 434],
            [286, 289]
          ]
        },

        "AC1.20": {
          main: [
            [784, 174],
            [760, 174],
            [760, 192],
            [318, 192],
            [318, 368]
          ],
          accessible: [
            [784, 174],
            [705, 174],
            [705, 239],
            [474, 239],
            [474, 192],
            [318, 192],
            [318, 368]
          ],
          quiet: [
            [784, 174],
            [786, 240],
            [542, 240],
            [542, 434],
            [286, 434],
            [286, 368]
          ]
        }
      }
    },

    AC2: {
      image: "assets/circus-2.png",
      naturalWidth: 1039,
      naturalHeight: 808,
      start: [752, 317], // bij kern / trap / liftzone
      routes: {
        "AC2.01": {
          main: [
            [752, 317],
            [650, 317],
            [650, 509],
            [146, 509]
          ],
          accessible: [
            [752, 317],
            [650, 317],
            [650, 649],
            [120, 649],
            [120, 509],
            [146, 509]
          ],
          quiet: [
            [752, 317],
            [640, 317],
            [640, 244],
            [254, 244],
            [254, 509],
            [146, 509]
          ]
        },

        "AC2.38": {
          main: [
            [752, 317],
            [650, 317],
            [650, 548],
            [301, 548]
          ],
          accessible: [
            [752, 317],
            [650, 317],
            [650, 649],
            [301, 649],
            [301, 548]
          ],
          quiet: [
            [752, 317],
            [640, 317],
            [640, 244],
            [254, 244],
            [254, 548],
            [301, 548]
          ]
        }
      }
    }
  }
};

// ======================================
// HULPFUNCTIES
// ======================================

function getFloorFromRoom(room) {
  if (room.startsWith("AC1.")) return "AC1";
  if (room.startsWith("AC2.")) return "AC2";
  return "AC1";
}

function getBuildingFromRoom(room) {
  if (room.startsWith("AC")) return "Circus";
  return "Circus";
}

function getRouteColor(routeType) {
  if (routeType === "accessible") return "#1eb06a";
  if (routeType === "quiet") return "#4f94d3";
  return "#111111";
}

function getRouteClass(routeType) {
  if (routeType === "accessible") return "route-path accessible";
  if (routeType === "quiet") return "route-path quiet";
  return "route-path";
}

function createPathData(points) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]} ${point[1]}`)
    .join(" ");
}

function createArrow(points, color) {
  if (points.length < 2) return "";

  const a = points[points.length - 2];
  const b = points[points.length - 1];
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const size = 18;

  const x1 = b[0] - size * Math.cos(angle - Math.PI / 6);
  const y1 = b[1] - size * Math.sin(angle - Math.PI / 6);
  const x2 = b[0] - size * Math.cos(angle + Math.PI / 6);
  const y2 = b[1] - size * Math.sin(angle + Math.PI / 6);

  return `
    <polygon
      points="${b[0]},${b[1]} ${x1},${y1} ${x2},${y2}"
      fill="${color}"
      vector-effect="non-scaling-stroke"
    />
  `;
}

// ======================================
// BASIS
// ======================================

const currentBuilding = getBuildingFromRoom(selectedRoom);
const currentFloor = getFloorFromRoom(selectedRoom);
const floorData = buildingData[currentBuilding][currentFloor];

const buildingLabel = document.getElementById("buildingLabel");
const floorLabel = document.getElementById("floorLabel");
const roomLabel = document.getElementById("roomLabel");
const pageTitle = document.getElementById("pageTitle");
const modalRoomText = document.getElementById("modalRoomText");
const modalCourseText = document.getElementById("modalCourseText");

const mapImage = document.getElementById("mapImage");
const routeSvg = document.getElementById("routeSvg");
const mapViewport = document.getElementById("mapViewport");
const mapStage = document.getElementById("mapStage");

const statusChip = document.getElementById("statusChip");

const startRouteBtn = document.getElementById("startRouteBtn");
const toggleAltRoutesBtn = document.getElementById("toggleAltRoutesBtn");
const arrivedBtn = document.getElementById("arrivedBtn");

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const centerBtn = document.getElementById("centerBtn");

const arrivalModal = document.getElementById("arrivalModal");
const closeModalBtn = document.getElementById("closeModalBtn");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const mobileRouteType = document.getElementById("mobileRouteType");
const routeTypeButtons = document.querySelectorAll(".route-type-btn");

buildingLabel.textContent = currentBuilding;
floorLabel.textContent = currentFloor;
roomLabel.textContent = selectedRoom;
pageTitle.textContent = selectedRoom;
modalRoomText.textContent = `Lokaal ${selectedRoom}`;
modalCourseText.textContent = selectedCourse;

mapImage.src = floorData.image;

// ======================================
// ROUTE STATE
// ======================================

let currentRouteType = "main";
let routeStarted = false;
let showAlternativeState = false;

// ======================================
// RENDER ROUTE
// ======================================

function renderRoute(routeType = "main") {
  const roomRoutes = floorData.routes[selectedRoom];

  if (!roomRoutes) {
    statusChip.textContent = `Geen routegegevens gevonden voor ${selectedRoom}`;
    routeSvg.innerHTML = "";
    return;
  }

  const points = roomRoutes[routeType];
  const start = floorData.start;
  const color = getRouteColor(routeType);
  const routeClass = getRouteClass(routeType);

  routeSvg.setAttribute(
    "viewBox",
    `0 0 ${floorData.naturalWidth} ${floorData.naturalHeight}`
  );
  routeSvg.setAttribute("width", floorData.naturalWidth);
  routeSvg.setAttribute("height", floorData.naturalHeight);

  routeSvg.innerHTML = `
    <path class="${routeClass}" d="${createPathData(points)}"></path>
    <circle class="start-dot" cx="${start[0]}" cy="${start[1]}" r="10"></circle>
    <text class="route-text" x="${start[0] + 18}" y="${start[1] - 18}">
      Start
    </text>
    ${createArrow(points, color)}
  `;

  currentRouteType = routeType;
  routeStarted = true;

  const labelMap = {
    main: "Hoofdroute actief",
    accessible: "Toegankelijke route actief",
    quiet: "Alternatieve route actief"
  };

  statusChip.textContent = `${selectedRoom} • ${labelMap[routeType]}`;
  syncRouteButtons(routeType);
}

function syncRouteButtons(routeType) {
  routeTypeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.routeType === routeType);
  });

  mobileRouteType.value = routeType;
}

function toggleAlternativeMode() {
  showAlternativeState = !showAlternativeState;

  if (!showAlternativeState) {
    renderRoute("main");
    return;
  }

  if (currentRouteType === "main") {
    renderRoute("accessible");
  } else if (currentRouteType === "accessible") {
    renderRoute("quiet");
  } else {
    renderRoute("main");
  }
}

// ======================================
// ZOOM + PAN
// ======================================

let scale = 1;
let minScale = 1;
let maxScale = 4;
let posX = 0;
let posY = 0;
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let lastTouchDistance = null;

function setStageSize() {
  const rect = mapImage.getBoundingClientRect();

  mapStage.style.width = `${rect.width}px`;
  mapStage.style.height = `${rect.height}px`;

  routeSvg.style.width = `${rect.width}px`;
  routeSvg.style.height = `${rect.height}px`;
}

function centerMap() {
  const viewportRect = mapViewport.getBoundingClientRect();

  const naturalRatio = floorData.naturalWidth / floorData.naturalHeight;
  const viewportRatio = viewportRect.width / viewportRect.height;

  if (naturalRatio > viewportRatio) {
    scale = viewportRect.width / floorData.naturalWidth;
  } else {
    scale = viewportRect.height / floorData.naturalHeight;
  }

  minScale = scale;

  const scaledWidth = floorData.naturalWidth * scale;
  const scaledHeight = floorData.naturalHeight * scale;

  posX = (viewportRect.width - scaledWidth) / 2;
  posY = (viewportRect.height - scaledHeight) / 2;

  applyTransform();
}

function clampPosition() {
  const viewportRect = mapViewport.getBoundingClientRect();
  const width = floorData.naturalWidth * scale;
  const height = floorData.naturalHeight * scale;

  const minX = Math.min(0, viewportRect.width - width);
  const minY = Math.min(0, viewportRect.height - height);

  const maxX = width < viewportRect.width ? (viewportRect.width - width) / 2 : 0;
  const maxY = height < viewportRect.height ? (viewportRect.height - height) / 2 : 0;

  posX = Math.max(minX, Math.min(maxX, posX));
  posY = Math.max(minY, Math.min(maxY, posY));
}

function applyTransform() {
  setStageSize();
  clampPosition();
  mapStage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

function zoomAt(clientX, clientY, nextScale) {
  const rect = mapViewport.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;

  const worldX = (px - posX) / scale;
  const worldY = (py - posY) / scale;

  scale = Math.max(minScale, Math.min(maxScale, nextScale));

  posX = px - worldX * scale;
  posY = py - worldY * scale;

  applyTransform();
}

function getTouchDistance(t1, t2) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Mouse
mapViewport.addEventListener("mousedown", (event) => {
  dragging = true;
  mapViewport.classList.add("dragging");
  dragStartX = event.clientX - posX;
  dragStartY = event.clientY - posY;
});

window.addEventListener("mousemove", (event) => {
  if (!dragging) return;
  posX = event.clientX - dragStartX;
  posY = event.clientY - dragStartY;
  applyTransform();
});

window.addEventListener("mouseup", () => {
  dragging = false;
  mapViewport.classList.remove("dragging");
});

mapViewport.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.15 : 0.88;
    zoomAt(event.clientX, event.clientY, scale * factor);
  },
  { passive: false }
);

// Touch
mapViewport.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length === 1) {
      dragging = true;
      dragStartX = event.touches[0].clientX - posX;
      dragStartY = event.touches[0].clientY - posY;
    } else if (event.touches.length === 2) {
      dragging = false;
      lastTouchDistance = getTouchDistance(event.touches[0], event.touches[1]);
    }
  },
  { passive: false }
);

mapViewport.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();

    if (event.touches.length === 1 && dragging) {
      posX = event.touches[0].clientX - dragStartX;
      posY = event.touches[0].clientY - dragStartY;
      applyTransform();
    } else if (event.touches.length === 2) {
      const newDistance = getTouchDistance(event.touches[0], event.touches[1]);

      if (lastTouchDistance) {
        const centerX =
          (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY =
          (event.touches[0].clientY + event.touches[1].clientY) / 2;

        zoomAt(centerX, centerY, scale * (newDistance / lastTouchDistance));
      }

      lastTouchDistance = newDistance;
    }
  },
  { passive: false }
);

mapViewport.addEventListener("touchend", () => {
  dragging = false;
  lastTouchDistance = null;
});

// ======================================
// BUTTONS
// ======================================

startRouteBtn.addEventListener("click", () => {
  renderRoute(currentRouteType || "main");
});

toggleAltRoutesBtn.addEventListener("click", () => {
  toggleAlternativeMode();
});

arrivedBtn.addEventListener("click", () => {
  arrivalModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  arrivalModal.classList.add("hidden");
});

zoomInBtn.addEventListener("click", () => {
  const rect = mapViewport.getBoundingClientRect();
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scale * 1.2);
});

zoomOutBtn.addEventListener("click", () => {
  const rect = mapViewport.getBoundingClientRect();
  zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scale / 1.2);
});

centerBtn.addEventListener("click", () => {
  centerMap();
  if (routeStarted) renderRoute(currentRouteType);
});

routeTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const routeType = button.dataset.routeType;
    renderRoute(routeType);
  });
});

mobileRouteType.addEventListener("change", (event) => {
  renderRoute(event.target.value);
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

window.addEventListener("click", (event) => {
  const clickedMenu = event.target.closest("#menuBtn");
  const clickedSidebar = event.target.closest("#sidebar");

  if (window.innerWidth <= 980 && !clickedMenu && !clickedSidebar) {
    sidebar.classList.remove("open");
  }
});

// ======================================
// INIT
// ======================================

mapImage.addEventListener("load", () => {
  centerMap();
});

window.addEventListener("resize", () => {
  centerMap();
  if (routeStarted) renderRoute(currentRouteType);
});