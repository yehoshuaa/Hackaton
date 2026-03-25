const ROOSTER_API_URL = "https://ical.windesheim.nl/api/Rooster-v10?culture=en&key=a77430f8-e6c3-4127-9864-ec966b839427";
const ROOSTER_PROXY_URL = `https://cors.utilitytool.app/${ROOSTER_API_URL}`;
const DAYS_TO_SHOW = 7;
const DUTCH_DAY_NAMES = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
const DUTCH_MONTH_NAMES = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
];

const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const floorButtons = document.querySelectorAll(".floor-btn");
const mapImage = document.getElementById("mapImage");
const mapTab = document.getElementById("mapTab");
const roosterTab = document.getElementById("roosterTab");
const mapContent = document.getElementById("mapContent");
const roosterContent = document.getElementById("roosterContent");
const buildingSelect = document.getElementById("buildingSelect");
const scheduleList = document.getElementById("scheduleList");
const modalOverlay = document.getElementById("modalOverlay");
const locationButtons = document.getElementById("locationButtons");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const header = document.querySelector("header");
const main = document.querySelector("main");
const buildingFloorImages = {
    circus: {
        1: "assets/circus-1.png",
        2: "assets/circus-2.png"
    }
};

hamburgerBtn.addEventListener("click", function () {
    sideMenu.classList.toggle("open");
    overlay.classList.toggle("show");
});

overlay.addEventListener("click", function () {
    sideMenu.classList.remove("open");
    overlay.classList.remove("show");
});

function updateMapImage() {
    const activeFloorButton = document.querySelector(".floor-btn.active");
    const selectedBuilding = buildingSelect.value;
    const selectedFloor = activeFloorButton ? activeFloorButton.dataset.floor : "1";
    const buildingImages = buildingFloorImages[selectedBuilding] || {};
    const imagePath = buildingImages[selectedFloor];

    if (!imagePath) {
        mapImage.removeAttribute("src");
        mapImage.alt = `Geen plattegrond beschikbaar voor ${selectedBuilding} verdieping ${selectedFloor}`;
        return;
    }

    mapImage.src = imagePath;
    mapImage.alt = `Plattegrond ${selectedBuilding} verdieping ${selectedFloor}`;
}

floorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        floorButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        updateMapImage();
    });
});

mapTab.addEventListener("click", function () {
    mapTab.classList.add("active");
    roosterTab.classList.remove("active");

    mapContent.classList.remove("hide");
    roosterContent.classList.remove("show");
});

roosterTab.addEventListener("click", function () {
    roosterTab.classList.add("active");
    mapTab.classList.remove("active");

    mapContent.classList.add("hide");
    roosterContent.classList.add("show");
});

buildingSelect.addEventListener("change", function () {
    console.log("Geselecteerd gebouw:", buildingSelect.value);
    updateMapImage();
});

function openModal() {
    modalOverlay.classList.add("show");
    header.classList.add("blur");
    main.classList.add("blur");
}

function closeModal() {
    modalOverlay.classList.remove("show");
    header.classList.remove("blur");
    main.classList.remove("blur");
    locationButtons.innerHTML = "";
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function getLocalDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDayLabel(date) {
    return `${DUTCH_DAY_NAMES[date.getDay()]} ${date.getDate()} ${DUTCH_MONTH_NAMES[date.getMonth()]}`;
}

function formatTime(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function parseIcsText(icsText) {
    const unfoldedLines = icsText.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
    const events = [];
    let currentEvent = null;

    unfoldedLines.forEach(function (line) {
        if (line === "BEGIN:VEVENT") {
            currentEvent = {};
            return;
        }

        if (line === "END:VEVENT") {
            if (currentEvent) {
                events.push(currentEvent);
            }

            currentEvent = null;
            return;
        }

        if (!currentEvent) {
            return;
        }

        const separatorIndex = line.indexOf(":");

        if (separatorIndex === -1) {
            return;
        }

        const rawKey = line.slice(0, separatorIndex);
        const value = line.slice(separatorIndex + 1);
        const key = rawKey.split(";")[0];

        currentEvent[key] = value;
    });

    return events;
}

function decodeIcsText(value) {
    if (!value) {
        return "";
    }

    return value
        .replace(/\\n/g, "\n")
        .replace(/\\,/g, ",")
        .replace(/\\;/g, ";")
        .replace(/\\\\/g, "\\");
}

function parseIcsDate(value) {
    if (!value) {
        return null;
    }

    const cleanValue = value.replace("Z", "");
    const datePart = cleanValue.slice(0, 8);
    const year = Number(datePart.slice(0, 4));
    const month = Number(datePart.slice(4, 6)) - 1;
    const day = Number(datePart.slice(6, 8));

    if (cleanValue.length === 8) {
        return new Date(year, month, day);
    }

    const timePart = cleanValue.slice(9);
    const hours = Number(timePart.slice(0, 2));
    const minutes = Number(timePart.slice(2, 4));
    const seconds = Number(timePart.slice(4, 6) || 0);

    return new Date(year, month, day, hours, minutes, seconds);
}

function extractTeacher(description) {
    const decodedDescription = decodeIcsText(description);
    const match = decodedDescription.match(/Teacher\(s\):\s*(.+)/i);

    return match ? match[1].trim() : "";
}

function splitRooms(roomValue) {
    if (!roomValue) {
        return [];
    }

    return roomValue
        .split(/[;,]/)
        .map(function (room) {
            return room.trim();
        })
        .filter(Boolean);
}

function mapEventToLesson(event) {
    const start = parseIcsDate(event.DTSTART);
    const end = parseIcsDate(event.DTEND);

    if (!start || !end || event.DTSTART.length === 8) {
        return null;
    }

    const room = decodeIcsText(event.LOCATION || "");
    const rooms = splitRooms(room);

    return {
        dateKey: getLocalDateKey(start),
        start: start,
        time: `${formatTime(start)}\n${formatTime(end)}`,
        title: decodeIcsText(event.SUMMARY || "Onbekende les").replace(/\s+,.*$/, "").trim(),
        room: room,
        rooms: rooms,
        teacher: extractTeacher(event.DESCRIPTION),
        highlight: false
    };
}

function createDayBlocks(lessons) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groupedLessons = lessons.reduce(function (groups, lesson) {
        if (!groups[lesson.dateKey]) {
            groups[lesson.dateKey] = [];
        }

        groups[lesson.dateKey].push(lesson);
        return groups;
    }, {});

    return Array.from({ length: DAYS_TO_SHOW }, function (_, index) {
        const date = addDays(today, index);
        const dateKey = getLocalDateKey(date);
        const dayLessons = groupedLessons[dateKey] || [];

        dayLessons.sort(function (lessonA, lessonB) {
            return lessonA.start - lessonB.start;
        });

        return {
            day: formatDayLabel(date),
            lessons: dayLessons
        };
    });
}

function renderScheduleMessage(message) {
    scheduleList.innerHTML = "";

    const messageElement = document.createElement("div");
    messageElement.classList.add("empty-day");
    messageElement.textContent = message;

    scheduleList.appendChild(messageElement);
}

function renderRooster(dayBlocks) {
    scheduleList.innerHTML = "";

    dayBlocks.forEach(function (dayBlock) {
        const dayGroup = document.createElement("div");
        dayGroup.classList.add("day-group");

        const dayTitle = document.createElement("h3");
        dayTitle.classList.add("day-title");
        dayTitle.textContent = dayBlock.day;
        dayGroup.appendChild(dayTitle);

        if (dayBlock.lessons.length === 0) {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("empty-day");
            emptyDay.textContent = "Geen lessen gepland";
            dayGroup.appendChild(emptyDay);
        } else {
            dayBlock.lessons.forEach(function (lesson) {
                const lessonRow = document.createElement("div");
                lessonRow.classList.add("lesson-row");

                const lessonTime = document.createElement("div");
                lessonTime.classList.add("lesson-time");
                lessonTime.textContent = lesson.time;

                const lessonCard = document.createElement("div");
                lessonCard.classList.add("lesson-card");

                if (lesson.highlight) {
                    lessonCard.classList.add("highlight");
                }

                if (lesson.rooms.length > 0) {
                    lessonCard.dataset.lokalen = lesson.rooms.join(",");
                }

                let lessonHtml = `<div class="lesson-title">${lesson.title}</div>`;

                if (lesson.room) {
                    lessonHtml += `<div class="lesson-info"><span class="lesson-icon">📍</span>${lesson.room}</div>`;
                }

                if (lesson.teacher) {
                    lessonHtml += `<div class="lesson-info"><span class="lesson-icon">👤</span>${lesson.teacher}</div>`;
                }

                lessonCard.innerHTML = lessonHtml;

                lessonRow.appendChild(lessonTime);
                lessonRow.appendChild(lessonCard);
                dayGroup.appendChild(lessonRow);
            });
        }

        scheduleList.appendChild(dayGroup);
    });
}

async function loadRooster() {
    renderScheduleMessage("Rooster laden...");

    try {
        let response;

        try {
            response = await fetch(ROOSTER_API_URL);
        } catch (directFetchError) {
            response = await fetch(ROOSTER_PROXY_URL);
        }

        if (!response.ok) {
            response = await fetch(ROOSTER_PROXY_URL);
        }

        if (!response.ok) {
            throw new Error(`Rooster ophalen mislukt (${response.status})`);
        }

        const icsText = await response.text();
        const lessons = parseIcsText(icsText)
            .map(mapEventToLesson)
            .filter(Boolean);

        renderRooster(createDayBlocks(lessons));
    } catch (error) {
        console.error(error);
        renderScheduleMessage("Het rooster kon niet worden geladen.");
    }
}

scheduleList.addEventListener("click", function (event) {
    const lessonCard = event.target.closest(".lesson-card");

    if (!lessonCard || !lessonCard.dataset.lokalen) {
        return;
    }

    const lokalen = lessonCard.dataset.lokalen
        .split(",")
        .map(function (lokaal) {
            return lokaal.trim();
        })
        .filter(Boolean);

    if (lokalen.length === 0) {
        return;
    }

    if (lokalen.length === 1) {
        window.location.href = `klas.html?lokaal=${encodeURIComponent(lokalen[0])}`;
        return;
    }

    locationButtons.innerHTML = "";

    lokalen.forEach(function (lokaal) {
        const button = document.createElement("button");
        button.classList.add("location-option-btn");
        button.textContent = lokaal;

        button.addEventListener("click", function () {
            window.location.href = `klas.html?lokaal=${encodeURIComponent(lokaal)}`;
        });

        locationButtons.appendChild(button);
    });

    openModal();
});

closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

loadRooster();
updateMapImage();
