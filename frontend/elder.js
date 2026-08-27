/* =====================================================
   SMRITI — ELDER DASHBOARD
   STABLE VERSION
===================================================== */


/* =====================================================
   OPEN MEMORY GARDEN
===================================================== */

function startMemoryGame() {

    console.log("Opening Memory Garden...");

    // Safe default immediately
    localStorage.setItem(
        "smritiRecommendation",
        JSON.stringify({
            difficulty: "easy",
            next_activity: "memory_garden"
        })
    );

    // Open immediately — don't wait for API
    window.location.href = "/memory.html";


    // Fetch latest AI recommendation in background
    fetch(
        "/api/patient/demo-patient-001/adaptive"
    )
        .then(response => {

            if (!response.ok) {
                throw new Error("Adaptive API failed");
            }

            return response.json();

        })
        .then(data => {

            if (data.recommendation) {

                localStorage.setItem(
                    "smritiRecommendation",
                    JSON.stringify(
                        data.recommendation
                    )
                );

                console.log(
                    "Memory recommendation:",
                    data.recommendation
                );

            }

        })
        .catch(error => {

            console.error(
                "Memory recommendation error:",
                error
            );

        });

}


/* =====================================================
   OPEN FOCUS & FIND
===================================================== */

function startAttentionGame() {

    console.log("Opening Focus & Find...");

    // Safe default
    localStorage.setItem(
        "smritiRecommendation",
        JSON.stringify({
            difficulty: "easy",
            next_activity: "focus_find"
        })
    );

    // Open immediately
    window.location.href = "/focus.html";


    // Update recommendation in background
    fetch(
        "/api/patient/demo-patient-001/adaptive"
    )
        .then(response => {

            if (!response.ok) {
                throw new Error("Adaptive API failed");
            }

            return response.json();

        })
        .then(data => {

            if (data.recommendation) {

                localStorage.setItem(
                    "smritiRecommendation",
                    JSON.stringify(
                        data.recommendation
                    )
                );

                console.log(
                    "Focus recommendation:",
                    data.recommendation
                );

            }

        })
        .catch(error => {

            console.error(
                "Focus recommendation error:",
                error
            );

        });

}


/* =====================================================
   OPEN MY DAILY STORY
===================================================== */

function startRoutineGame() {

    console.log("Opening My Daily Story...");

    // Safe default
    localStorage.setItem(
        "smritiRecommendation",
        JSON.stringify({
            difficulty: "easy",
            next_activity: "daily_routine"
        })
    );

    // Open immediately
    window.location.href = "/routine.html";


    // Update recommendation in background
    fetch(
        "/api/patient/demo-patient-001/adaptive"
    )
        .then(response => {

            if (!response.ok) {
                throw new Error("Adaptive API failed");
            }

            return response.json();

        })
        .then(data => {

            if (data.recommendation) {

                localStorage.setItem(
                    "smritiRecommendation",
                    JSON.stringify(
                        data.recommendation
                    )
                );

                console.log(
                    "Routine recommendation:",
                    data.recommendation
                );

            }

        })
        .catch(error => {

            console.error(
                "Routine recommendation error:",
                error
            );

        });

}


/* =====================================================
   MOOD
===================================================== */

function selectMood(mood) {

    alert(
        "Thank you ❤️\n\n" +
        "SMRITI recorded your mood as: " +
        mood
    );

}


/* =====================================================
   VOICE
===================================================== */

function speakDashboard() {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Voice support is not available in this browser."
        );

        return;

    }


    const message =
        "Good morning Amma. " +
        "You have three activities planned today. " +
        "SMRITI recommends starting with Memory Garden.";


    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.rate = 0.8;


    window.speechSynthesis.speak(
        speech
    );

}


/* =====================================================
   PROFILE — FINAL CLEAN VERSION
===================================================== */

function showProfile() {

    console.log("Opening My Profile...");

    // Remove old profile if already open
    const oldProfile =
        document.getElementById("smritiProfileRoot");

    if (oldProfile) {
        oldProfile.remove();
    }


    // Create profile root
    const root =
        document.createElement("div");

    root.id = "smritiProfileRoot";
    root.className = "smriti-profile-root";


    root.innerHTML = `

        <div class="smriti-profile-overlay">

            <div
                class="smriti-profile-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="smritiProfileTitle"
            >

                <button
                    type="button"
                    class="smriti-profile-close"
                    id="smritiProfileClose"
                    aria-label="Close profile"
                >
                    ×
                </button>


                <div class="smriti-profile-avatar">
                    👵
                </div>


                <h2 id="smritiProfileTitle">
                    Amma
                </h2>


                <p class="smriti-profile-subtitle">
                    My Profile
                </p>


                <div class="smriti-profile-details">

                    <div class="smriti-profile-row">
                        <span>👤 Name</span>
                        <strong>Amma</strong>
                    </div>


                    <div class="smriti-profile-row">
                        <span>❤️ Caregiver</span>
                        <strong>Family</strong>
                    </div>


                    <div class="smriti-profile-row">
                        <span>🧠 SMRITI Mode</span>
                        <strong>Elder Mode</strong>
                    </div>

                </div>


                <div class="smriti-profile-settings">

                    <h3>
                        Accessibility
                    </h3>


                    <label class="smriti-profile-setting">

                        <span>
                            🔊 Voice assistance
                        </span>

                        <input
                            type="checkbox"
                            id="smritiVoiceToggle"
                        >

                    </label>


                    <label class="smriti-profile-setting">

                        <span>
                            🔤 Larger text
                        </span>

                        <input
                            type="checkbox"
                            id="smritiTextToggle"
                        >

                    </label>

                </div>


                <button
                    type="button"
                    class="smriti-profile-done"
                    id="smritiProfileDone"
                >
                    Done
                </button>

            </div>

        </div>

    `;


    // Add modal to BODY
    document.body.appendChild(root);


    // Prevent background scrolling
    document.body.style.overflow = "hidden";


    /* -----------------------------------------
       ELEMENTS
    ----------------------------------------- */

    const overlay =
        root.querySelector(
            ".smriti-profile-overlay"
        );


    const closeButton =
        root.querySelector(
            "#smritiProfileClose"
        );


    const doneButton =
        root.querySelector(
            "#smritiProfileDone"
        );


    const voiceToggle =
        root.querySelector(
            "#smritiVoiceToggle"
        );


    const textToggle =
        root.querySelector(
            "#smritiTextToggle"
        );


    /* -----------------------------------------
       RESTORE SAVED SETTINGS
    ----------------------------------------- */

    const savedVoice =
        localStorage.getItem(
            "smritiVoiceEnabled"
        );


    const savedLargeText =
        localStorage.getItem(
            "smritiLargeText"
        );


    voiceToggle.checked =
        savedVoice === null
            ? true
            : savedVoice === "true";


    textToggle.checked =
        savedLargeText === "true";


    document.body.classList.toggle(
        "large-text",
        textToggle.checked
    );


    /* -----------------------------------------
       CLOSE FUNCTION
    ----------------------------------------- */

    function close() {

        root.remove();

        document.body.style.overflow = "";

    }


    /* -----------------------------------------
       CLOSE BUTTON
    ----------------------------------------- */

    closeButton.addEventListener(
        "click",
        close
    );


    doneButton.addEventListener(
        "click",
        close
    );


    /* -----------------------------------------
       CLICK OUTSIDE
    ----------------------------------------- */

    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target === overlay
            ) {

                close();

            }

        }
    );


    /* -----------------------------------------
       VOICE TOGGLE
    ----------------------------------------- */

    voiceToggle.addEventListener(
        "change",
        function() {

            localStorage.setItem(
                "smritiVoiceEnabled",
                String(this.checked)
            );

        }
    );


    /* -----------------------------------------
       LARGE TEXT TOGGLE
    ----------------------------------------- */

    textToggle.addEventListener(
        "change",
        function() {

            document.body.classList.toggle(
                "large-text",
                this.checked
            );


            localStorage.setItem(
                "smritiLargeText",
                String(this.checked)
            );

        }
    );


    /* -----------------------------------------
       ESCAPE KEY
    ----------------------------------------- */

    document.addEventListener(
        "keydown",
        function profileEscapeHandler(event) {

            if (
                event.key === "Escape"
            ) {

                close();

                document.removeEventListener(
                    "keydown",
                    profileEscapeHandler
                );

            }

        }
    );


    console.log(
        "My Profile opened successfully."
    );

}


/* =====================================================
   BACKWARD COMPATIBILITY
===================================================== */

function closeProfile() {

    const profile =
        document.getElementById(
            "smritiProfileRoot"
        );


    if (profile) {

        profile.remove();

        document.body.style.overflow = "";

    }

}

/* =====================================================
   PROFILE VOICE
===================================================== */

function speakProfile() {

    if (!("speechSynthesis" in window)) {

        alert(
            "Voice support is not available in this browser."
        );

        return;
    }


    window.speechSynthesis.cancel();


    const message =
        "Hello Amma. " +
        "This is your SMRITI profile. " +
        "Your activity streak is 5 days. " +
        "Your reminders are enabled. " +
        "SMRITI is here to support you every day.";


    const speech =
        new SpeechSynthesisUtterance(message);


    speech.rate = 0.8;

    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );

}


/* =====================================================
   ELDER MODAL CREATOR
===================================================== */

function createElderModal(title, content) {

    const overlay =
        document.createElement("div");


    overlay.className =
        "elder-modal-overlay";


    overlay.innerHTML = `

        <div
            class="elder-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="elderModalTitle"
        >

            <button
                type="button"
                class="elder-modal-close"
                onclick="closeElderModal()"
                aria-label="Close profile"
            >
                ×
            </button>

            <h2 id="elderModalTitle">
                ${title}
            </h2>

            ${content}

        </div>

    `;


    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target === overlay
            ) {

                closeElderModal();

            }

        }
    );


    return overlay;

}


/* =====================================================
   CLOSE ELDER MODAL
===================================================== */

function closeElderModal() {

    const modal =
        document.querySelector(
            ".elder-modal-overlay"
        );


    if (modal) {

        modal.remove();

    }

}


/* =====================================================
   PROGRESS
===================================================== */

async function showProgress() {

    try {

        const summaryResponse =
            await fetch(
                "/api/patient/demo-patient-001/summary"
            );


        if (!summaryResponse.ok) {
            throw new Error(
                "Summary API failed"
            );
        }


        const summary =
            await summaryResponse.json();


        const trendResponse =
            await fetch(
                "/api/patient/demo-patient-001/trend"
            );


        if (!trendResponse.ok) {
            throw new Error(
                "Trend API failed"
            );
        }


        const trend =
            await trendResponse.json();


        localStorage.setItem(
            "smritiSummary",
            JSON.stringify(summary)
        );


        localStorage.setItem(
            "smritiTrend",
            JSON.stringify(trend)
        );


        window.location.href =
            "/progress.html";

    }

    catch (error) {

        console.error(
            "Progress loading error:",
            error
        );


        alert(
            "📈 My Progress\n\n" +
            "Unable to load your progress right now."
        );

    }

}


/* =====================================================
   REMINDERS
===================================================== */

function showReminders() {
    window.location.href = "/reminders.html";
}

/* =====================================================
   HELP
===================================================== */

function showHelp() {
    window.location.href = "/help.html";
}

/* =====================================================
   LOAD ADAPTIVE RECOMMENDATION
===================================================== */

async function loadAdaptiveRecommendation() {

    try {

        const response =
            await fetch(
                "/api/patient/demo-patient-001/adaptive"
            );


        if (!response.ok) {

            throw new Error(
                "Adaptive API failed"
            );

        }


        const data =
            await response.json();


        const recommendation =
            data.recommendation;


        if (!recommendation) {

            return;

        }


        console.log(
            "SMRITI Adaptive Recommendation:",
            recommendation
        );


        localStorage.setItem(
            "smritiRecommendation",
            JSON.stringify(
                recommendation
            )
        );


        /* -----------------------------------------
           DIFFICULTY
        ----------------------------------------- */

        const difficultyElement =
            document.getElementById(
                "memoryDifficulty"
            );


        if (difficultyElement) {

            const difficulty =
                recommendation.difficulty ||
                "easy";


            difficultyElement.textContent =
                difficulty
                    .charAt(0)
                    .toUpperCase() +
                difficulty.slice(1);

        }


        /* -----------------------------------------
           AI MESSAGE
        ----------------------------------------- */

        const aiText =
            document.getElementById(
                "aiRecommendationText"
            );


        if (aiText) {

            aiText.textContent =
                recommendation.message ||
                recommendation.reason ||
                "SMRITI has personalized today's activity for you.";

        }

    }

    catch (error) {

        console.error(
            "Adaptive recommendation error:",
            error
        );

        /*
         * IMPORTANT:
         * Don't break the dashboard if backend
         * recommendation is unavailable.
         */

    }

}


/* =====================================================
   RECOMMENDED ACTIVITY
===================================================== */

function startRecommendedActivity() {

    let recommendation = null;


    try {

        const saved =
            localStorage.getItem(
                "smritiRecommendation"
            );


        if (saved) {

            recommendation =
                JSON.parse(saved);

        }

    }

    catch (error) {

        console.error(
            "Could not read recommendation:",
            error
        );

    }


    const activity =
        recommendation?.next_activity ||
        "memory_garden";


    console.log(
        "Starting recommended activity:",
        activity
    );


    if (
        activity === "focus_find"
    ) {

        window.location.href =
            "/focus.html";

    }

    else if (
        activity === "daily_routine" ||
        activity === "daily_story"
    ) {

        window.location.href =
            "/routine.html";

    }

    else {

        window.location.href =
            "/memory.html";

    }

}


/* =====================================================
   DASHBOARD INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SMRITI Elder Dashboard loaded."
        );


        loadAdaptiveRecommendation();

    }
);