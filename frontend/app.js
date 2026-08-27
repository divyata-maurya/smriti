function openElderMode() {

    window.location.href = "/elder.html";

}


function openCaregiverMode() {

    window.location.href = "/caregiver.html";

}

function startVoice() {

    if (!("speechSynthesis" in window)) {

        alert("Voice support is not available in this browser.");

        return;
    }

    const message =
        "Namaste. Welcome to Smriti. " +
        "I am here to help you remember, engage and connect.";

    const speech =
        new SpeechSynthesisUtterance(message);

    speech.rate = 0.85;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


function toggleLanguage() {

    // Agar dropdown already open hai to close kar do
    const existingMenu =
        document.getElementById("languageMenu");

    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    // Language menu create karo
    const menu =
        document.createElement("div");

    menu.id = "languageMenu";

    menu.style.position = "absolute";
    menu.style.top = "58px";
    menu.style.right = "0";
    menu.style.background = "white";
    menu.style.border = "1px solid #d4e5df";
    menu.style.borderRadius = "14px";
    menu.style.padding = "8px";
    menu.style.minWidth = "170px";
    menu.style.boxShadow = "0 10px 30px rgba(0,0,0,0.10)";
    menu.style.zIndex = "9999";


    // English option
    const english =
        document.createElement("button");

    english.type = "button";
    english.textContent = "🇬🇧 English";

    english.style.display = "block";
    english.style.width = "100%";
    english.style.padding = "11px 12px";
    english.style.border = "none";
    english.style.background = "transparent";
    english.style.borderRadius = "10px";
    english.style.textAlign = "left";
    english.style.cursor = "pointer";
    english.style.fontSize = "14px";


    // Hindi option
    const hindi =
        document.createElement("button");

    hindi.type = "button";
    hindi.textContent = "🇮🇳 हिंदी";

    hindi.style.display = "block";
    hindi.style.width = "100%";
    hindi.style.padding = "11px 12px";
    hindi.style.border = "none";
    hindi.style.background = "transparent";
    hindi.style.borderRadius = "10px";
    hindi.style.textAlign = "left";
    hindi.style.cursor = "pointer";
    hindi.style.fontSize = "14px";


    // Language select hone par save karo
    english.onclick = function () {

        localStorage.setItem(
            "smritiLanguage",
            "en"
        );

        updateLanguageButton("English");

        menu.remove();
    };


    hindi.onclick = function () {

        localStorage.setItem(
            "smritiLanguage",
            "hi"
        );

        updateLanguageButton("हिंदी");

        menu.remove();
    };


    menu.appendChild(english);
    menu.appendChild(hindi);


    // Button ke around wrapper create nahi karna,
    // isliye body me menu add karke position button ke according set karenge.
    document.body.appendChild(menu);


    const button =
        document.querySelector(".language-btn");

    if (button) {

        const rect =
            button.getBoundingClientRect();

        menu.style.position = "fixed";
        menu.style.top =
            (rect.bottom + 8) + "px";

        menu.style.left =
            (rect.right - 170) + "px";
    }


    // Bahar click karne par dropdown close
    setTimeout(function () {

        document.addEventListener(
            "click",
            closeLanguageMenu
        );

    }, 0);


    function closeLanguageMenu(event) {

        const button =
            document.querySelector(".language-btn");

        if (
            menu &&
            !menu.contains(event.target) &&
            event.target !== button
        ) {

            menu.remove();

            document.removeEventListener(
                "click",
                closeLanguageMenu
            );
        }
    }

}


function updateLanguageButton(language) {

    const button =
        document.querySelector(".language-btn");

    if (!button) {
        return;
    }

    button.textContent =
        "🌐 " + language;
}


/* Saved language ko page load par show karo */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedLanguage =
            localStorage.getItem(
                "smritiLanguage"
            );

        if (savedLanguage === "hi") {

            updateLanguageButton("हिंदी");

        } else {

            updateLanguageButton("English");

        }

    }
);