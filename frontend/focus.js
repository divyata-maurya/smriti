/* =========================================================
   SMRITI — FOCUS & FIND
   ========================================================= */

const easySymbols = [
    "🌸",
    "🪷",
    "🌻",
    "🌺"
];

const mediumSymbols = [
    "🌸",
    "🪷",
    "🌻",
    "🌺",
    "🌼",
    "🌷"
];

const hardSymbols = [
    "🌸",
    "🪷",
    "🌻",
    "🌺",
    "🌼",
    "🌷",
    "🌹",
    "🍀"
];


let smritiRecommendation = {
    difficulty: "easy",
    next_activity: "focus_find"
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

    console.error(
        "Could not read SMRITI recommendation:",
        error
    );

}


let currentRound = 1;

let totalRounds = 5;

let attempts = 0;

let correctAnswers = 0;

let seconds = 0;

let timerInterval = null;

let gameFinished = false;

let roundLocked = false;


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    clearInterval(timerInterval);

    currentRound = 1;
    attempts = 0;
    correctAnswers = 0;
    seconds = 0;
    gameFinished = false;
    roundLocked = false;


    document.getElementById(
        "introScreen"
    ).classList.add("hidden");


    document.getElementById(
        "resultScreen"
    ).classList.add("hidden");


    document.getElementById(
        "gameScreen"
    ).classList.remove("hidden");


    document.getElementById(
        "round"
    ).textContent = currentRound;


    document.getElementById(
        "score"
    ).textContent = "0";


    document.getElementById(
        "timer"
    ).textContent = "00:00";


    document.getElementById(
        "message"
    ).textContent =
        "Take your time. Find the different object. 🌸";


    createRound();

    startTimer();

    speakInstructions();

}


/* =========================================================
   CREATE ROUND
   ========================================================= */

function createRound() {

    roundLocked = false;


    const grid =
        document.getElementById(
            "focusGrid"
        );


    grid.innerHTML = "";


    let symbols;


    const difficulty =
        smritiRecommendation.difficulty || "easy";


    if (
        difficulty === "medium"
    ) {

        symbols =
            mediumSymbols;

    } else if (
        difficulty === "hard"
    ) {

        symbols =
            hardSymbols;

    } else {

        symbols =
            easySymbols;

    }


    const baseSymbol =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    let differentSymbol =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    while (
        differentSymbol === baseSymbol
    ) {

        differentSymbol =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

    }


    let gridSize = 8;


    if (difficulty === "medium") {

        gridSize = 12;

    }


    if (difficulty === "hard") {

        gridSize = 16;

    }


    const differentPosition =
        Math.floor(
            Math.random() *
            gridSize
        );


    for (
        let i = 0;
        i < gridSize;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.textContent =
            i === differentPosition
                ? differentSymbol
                : baseSymbol;


        button.setAttribute(
            "aria-label",
            "Focus object"
        );


        button.addEventListener(
            "click",
            () =>
                checkAnswer(
                    button,
                    i === differentPosition
                )
        );


        grid.appendChild(button);

    }


    document.getElementById(
        "instruction"
    ).textContent =
        "Find the one object that is different.";

}


/* =========================================================
   CHECK ANSWER
   ========================================================= */

function checkAnswer(
    button,
    isDifferent
) {

    if (
        gameFinished ||
        roundLocked
    ) {

        return;

    }


    attempts++;


    if (isDifferent) {

        roundLocked = true;

        correctAnswers++;


        button.classList.add(
            "correct"
        );


        const score =
            Math.round(
                (
                    correctAnswers /
                    totalRounds
                ) * 100
            );


        document.getElementById(
            "score"
        ).textContent = score;


        document.getElementById(
            "message"
        ).textContent =
            "Excellent! You found it! 🌟";


        if (
            currentRound >= totalRounds
        ) {

            setTimeout(
                finishGame,
                700
            );

            return;

        }


        setTimeout(
            () => {

                currentRound++;

                document.getElementById(
                    "round"
                ).textContent =
                    currentRound;

                createRound();

            },
            700
        );


    } else {

        button.classList.add(
            "wrong"
        );


        document.getElementById(
            "message"
        ).textContent =
            "Almost! Look carefully and try again. 🌱";


        setTimeout(
            () => {

                button.classList.remove(
                    "wrong"
                );

            },
            400
        );

    }

}


/* =========================================================
   TIMER
   ========================================================= */

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
                    ).padStart(
                        2,
                        "0"
                    );


                const secs =
                    String(
                        seconds % 60
                    ).padStart(
                        2,
                        "0"
                    );


                document.getElementById(
                    "timer"
                ).textContent =
                    `${minutes}:${secs}`;

            },
            1000
        );

}


/* =========================================================
   FINISH GAME
   ========================================================= */

async function finishGame() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;


    clearInterval(
        timerInterval
    );


    const accuracy =
        attempts > 0
            ? Math.round(
                (
                    correctAnswers /
                    attempts
                ) * 100
            )
            : 0;


    const safeAccuracy =
        Math.min(
            accuracy,
            100
        );


    const score =
        calculateScore(
            safeAccuracy,
            seconds
        );


    document.getElementById(
        "gameScreen"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "resultScreen"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "finalAccuracy"
    ).textContent =
        `${safeAccuracy}%`;


    document.getElementById(
        "finalTime"
    ).textContent =
        `${seconds}s`;


    await sendResult(
        score,
        safeAccuracy
    );

}


/* =========================================================
   SCORE
   ========================================================= */

function calculateScore(
    accuracy,
    time
) {

    let score =
        accuracy * 0.7;


    if (time <= 30) {

        score += 30;

    } else if (time <= 60) {

        score += 20;

    } else {

        score += 10;

    }


    return Math.round(
        Math.min(
            score,
            100
        )
    );

}


/* =========================================================
   BACKEND
   ========================================================= */

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
                            "focus_find",

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
                            attempts,

                        hints:
                            0

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not save game result"
            );

        }


        const data =
            await response.json();


        if (
            data.recommendation
        ) {

            document.getElementById(
                "aiMessage"
            ).textContent =
                data.recommendation.message ||
                "Wonderful work! Keep going. 🌟";


            document.getElementById(
                "aiRecommendation"
            ).textContent =
                data.recommendation.next_activity ||
                "SMRITI will personalize your next activity.";

        }


    } catch (error) {

        console.error(
            "Could not save Focus & Find result:",
            error
        );


        document.getElementById(
            "aiMessage"
        ).textContent =
            "Wonderful work completing your activity! 🌟";


        document.getElementById(
            "aiRecommendation"
        ).textContent =
            "SMRITI will personalize your next activity.";

    }

}


/* =========================================================
   VOICE
   ========================================================= */

function speakInstructions() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    window.speechSynthesis.cancel();


    const text =
        "Welcome to Focus and Find. " +
        "Look carefully and find the one object that is different. " +
        "Take your time.";


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate = 0.8;


    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function goBack() {

    window.location.href =
        "/elder.html";

}


function goHome() {

    window.location.href =
        "/elder.html";

}