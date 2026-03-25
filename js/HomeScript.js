        const hamburgerBtn = document.getElementById("hamburgerBtn");
        const sideMenu = document.getElementById("sideMenu");
        const overlay = document.getElementById("overlay");

        hamburgerBtn.addEventListener("click", function () {
            sideMenu.classList.toggle("open");
            overlay.classList.toggle("show");
        });

        overlay.addEventListener("click", function () {
            sideMenu.classList.remove("open");
            overlay.classList.remove("show");
        });

        const floorButtons = document.querySelectorAll(".floor-btn");
        const mapImage = document.getElementById("mapImage");

        floorButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const floor = button.dataset.floor;

                mapImage.src = `../images/placeholder${floor}.png`;
                mapImage.alt = `Plattegrond verdieping ${floor}`;

                floorButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");
            });
        });

        const mapTab = document.getElementById("mapTab");
        const roosterTab = document.getElementById("roosterTab");
        const mapContent = document.getElementById("mapContent");
        const roosterContent = document.getElementById("roosterContent");

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

        const buildingSelect = document.getElementById("buildingSelect");

        buildingSelect.addEventListener("change", function () {
            console.log("Geselecteerd gebouw:", buildingSelect.value);
        });
    
        const scheduleList = document.getElementById("scheduleList");

        const roosterData = [
            {
                day: "Maandag",
                lessons: [
                    {
                        time: "09:00\n11:00",
                        title: "Kick off Cycle 4",
                        room: "AC OPEN RUIMTE",
                        teacher: "",
                        highlight: false
                    },
                    {
                        time: "11:30\n13:30",
                        title: "UX Kennismeeting 3",
                        room: "AC1.18; AC1.20; AC1.22/1.24",
                        teacher: "",
                        highlight: false
                    },
                    {
                        time: "15:30\n17:30",
                        title: "Voorlichting keuzes studiejaar 3",
                        room: "AC1.20; AC1.22/1.24",
                        teacher: "",
                        highlight: false
                    }
                ]
            },
            {
                day: "Dinsdag",
                lessons: [
                    {
                        time: "09:30\n16:00",
                        title: "Bedrijfsproject",
                        room: "AC OPEN RUIMTE",
                        teacher: "",
                        highlight: false
                    },
                    {
                        time: "13:00\n15:00",
                        title: "WC Coaching",
                        room: "AC1.22/1.24",
                        teacher: "",
                        highlight: false
                    }
                ]
            },
            {
                day: "Woensdag",
                lessons: [
                    {
                        time: "09:00\n09:30",
                        title: "Check in",
                        room: "",
                        teacher: "",
                        highlight: true
                    },
                    {
                        time: "09:30\n16:00",
                        title: "Bedrijfsproject",
                        room: "AC OPEN RUIMTE",
                        teacher: "",
                        highlight: false
                    }
                ]
            },
            {
                day: "Donderdag",
                lessons: [
                    {
                        time: "09:00\n09:30",
                        title: "Check in",
                        room: "",
                        teacher: "",
                        highlight: true
                    },
                    {
                        time: "09:30\n16:00",
                        title: "Bedrijfsproject",
                        room: "AC OPEN RUIMTE",
                        teacher: "",
                        highlight: false
                    }
                ]
            },
            {
                day: "Vrijdag",
                lessons: []
            }
        ];

        function renderRooster() {
            scheduleList.innerHTML = "";

            roosterData.forEach(function (dayBlock) {
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

        renderRooster();

        const lessonCards = document.querySelectorAll(".lesson-card");
        const modalOverlay = document.getElementById("modalOverlay");
        const locationButtons = document.getElementById("locationButtons");
        const closeModalBtn = document.getElementById("closeModalBtn");
        const cancelModalBtn = document.getElementById("cancelModalBtn");
        const header = document.querySelector("header");
        const main = document.querySelector("main");

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

        lessonCards.forEach(card => {
            card.addEventListener("click", function () {
                const lokalenString = card.dataset.lokalen;
                const lokalen = lokalenString.split(",").map(lokaal => lokaal.trim());

                if (lokalen.length === 1) {
                    const gekozenLokaal = lokalen[0];

                    // Pas dit aan naar correcte pagina 
                    window.location.href = `klas.html?lokaal=${encodeURIComponent(gekozenLokaal)}`;
                } else {
                    locationButtons.innerHTML = "";

                    lokalen.forEach(lokaal => {
                        const button = document.createElement("button");
                        button.classList.add("location-option-btn");
                        button.textContent = lokaal;

                        button.addEventListener("click", function () {
                            window.location.href = `klas.html?lokaal=${encodeURIComponent(lokaal)}`;
                        });

                        locationButtons.appendChild(button);
                    });

                    openModal();
                }
            });
        });

        closeModalBtn.addEventListener("click", closeModal);
        cancelModalBtn.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", function (event) {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });