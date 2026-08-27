let smritiRecommendation = {
    difficulty: "easy",
    next_activity: "daily_story"
};


try {

    const saved =
        localStorage.getItem(
            "smritiRecommendation"
        );

    if (saved) {

        smritiRecommendation =
            JSON.parse(saved);

    }

} catch (error) {

    console.error(error);

}


const routines = [

    {
        emoji: "🌅",
        text: "Wake up"
    },

    {
        emoji: "🪥",
        text: "Brush teeth"
    },

    {
        emoji: "☕",
        text: "Have breakfast"
    },

    {
        emoji: "🛁",
        text: "Take a bath"
    }

];


let selectedOrder = [];

let seconds = 0;

let timerInterval = null;

let gameFinished = false;


function startGame() {

    document
        .getElementById("introScreen")
        .classList.add("hidden");

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");

    createRoutine();

    startTimer();

    speakInstructions();

}


function createRoutine() {

    const grid =
        document.getElementById(
            "routineGrid"
        );

    grid.innerHTML = "";

    let options =
        [...routines];

    options.sort(
        () => Math.random() - 0.5
    );


    options.forEach(
        routine => {

            const button =
                document.createElement("button");

            button.className =
                "routine-card";

            button.innerHTML = `

                <span class="emoji">
                    ${routine.emoji}
                </span>

                ${routine.text}

            `;

            button.onclick =
                () => selectRoutine(
                    button,
                    routine
                );

            grid.appendChild(button);

        }
    );

}


function selectRoutine(
    button,
    routine
) {

    if (gameFinished) {
        return;
    }


    if (
        selectedOrder.includes(
            routine.text
        )
    ) {
        return;
    }


    selectedOrder.push(
        routine.text
    );


    button.classList.add(
        "selected"
    );


    button.disabled = true;


    document.getElementById(
        "message"
    ).textContent =
        `Step ${selectedOrder.length} selected. 🌸`;


    if (
        selectedOrder.length ===
        routines.length
    ) {

        checkRoutine();

    }

}


function checkRoutine() {

    const correctOrder = [

        "Wake up",
        "Brush teeth",
        "Have breakfast",
        "Take a bath"

    ];


    let correct = 0;


    for (
        let i = 0;
        i < correctOrder.length;
        i++
    ) {

        if (
            selectedOrder[i] ===
            correctOrder[i]
        ) {

            correct++;

        }

    }


    finishGame(
        correct,
        correctOrder.length
    );

}


function startTimer() {

    timerInterval =
        setInterval(
            () => {

                seconds++;

                const minutes =
                    String(
                        Math.floor(
                            seconds / 60
                        )
                    )
                    .padStart(2, "0");

                const secs =
                    String(
                        seconds % 60
                    )
                    .padStart(2, "0");

                document.getElementById(
                    "timer"
                ).textContent =
                    `${minutes}:${secs}`;

            },
            1000
        );

}


async function finishGame(
    correct,
    total
) {

    if (gameFinished) {
        return;
    }


    gameFinished = true;

    clearInterval(
        timerInterval
    );


    const accuracy =
        Math.round(
            (correct / total) * 100
        );


    const score =
        Math.round(
            accuracy * 0.7 +
            (seconds <= 30 ? 30 : 15)
        );


    document
        .getElementById("gameScreen")
        .classList.add("hidden");


    document
        .getElementById("resultScreen")
        .classList.remove("hidden");


    document
        .getElementById("finalScore")
        .textContent = score;


    document
        .getElementById("finalAccuracy")
        .textContent =
        `${accuracy}%`;


    document
        .getElementById("finalTime")
        .textContent =
        `${seconds}s`;


    await sendResult(
        score,
        accuracy
    );

}


async function sendResult(
    score,
    accuracy
) {

    try {

        const response =
            await fetch(
                "/api/game-results",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        patient_id:
                            "demo-patient-001",

                        game_type:
                            "daily_routine",

                        difficulty:
                            smritiRecommendation.difficulty ||
                            "easy",

                        score:
                            score,

                        accuracy:
                            accuracy,

                        response_time:
                            seconds,

                        moves:
                            selectedOrder.length,

                        hints:
                            0

                    })

                }
            );


        const data =
            await response.json();


        document
            .getElementById("aiMessage")
            .textContent =
            data.recommendation.message;


        document
            .getElementById("aiRecommendation")
            .textContent =
            data.recommendation.next_activity;


    } catch (error) {

        console.error(error);


        document
            .getElementById("aiMessage")
            .textContent =
            "Wonderful work completing your activity! 🌟";


        document
            .getElementById("aiRecommendation")
            .textContent =
            "SMRITI will personalize your next activity.";

    }

}


function speakInstructions() {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }


    const speech =
        new SpeechSynthesisUtterance(
            "Welcome to My Daily Story. " +
            "Choose the daily activities " +
            "in the order you usually do them."
        );


    speech.rate = 0.8;

    window.speechSynthesis.speak(
        speech
    );

}


function goBack() {

    window.location.href =
        "/elder.html";

}


function goHome() {

    window.location.href =
        "/elder.html";

}