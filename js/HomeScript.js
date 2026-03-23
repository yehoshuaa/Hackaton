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
    