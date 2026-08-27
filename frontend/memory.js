/* =====================================================
   SMRITI MEMORY GARDEN
   CLEAN ADAPTIVE VERSION
===================================================== */


/* =====================================================
   SYMBOLS
===================================================== */

const EASY_SYMBOLS = [
    "🌸",
    "🪷",
    "🍎"
];


const MEDIUM_SYMBOLS = [
    "🌸",
    "🪷",
    "🍎",
    "🌻",
    "🍀",
    "🌺"
];


const HARD_SYMBOLS = [
    "🌸",
    "🪷",
    "🍎",
    "🌻",
    "🍀",
    "🌺",
    "🍓",
    "🌷"
];


const GENTLE_SYMBOLS = [
    "🌸",
    "🪷"
];


/* =====================================================
   SMRITI RECOMMENDATION
===================================================== */

let smritiRecommendation = {

    difficulty: "easy",

    next_activity: "memory_garden"

};


/* =====================================================
   LOAD RECOMMENDATION FROM LOCAL STORAGE
===================================================== */

function loadRecommendation() {

    try {

        const saved =
            localStorage.getItem(
                "smritiRecommendation"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (parsed && parsed.difficulty) {

                smritiRecommendation =
                    parsed;

            }

        }

    }

    catch (error) {

        console.error(
            "SMRITI recommendation error:",
            error
        );

    }


    console.log(
        "SMRITI Recommendation:",
        smritiRecommendation
    );

}


/* Load immediately */

loadRecommendation();


/* =====================================================
   GET PAIR COUNT
===================================================== */

function getPairCount() {

    const difficulty =
        smritiRecommendation.difficulty;


    if (difficulty === "gentle") {

        return 2;

    }


    if (difficulty === "easy") {

        return 3;

    }


    if (difficulty === "medium") {

        return 4;

    }


    if (difficulty === "hard") {

        return 5;

    }


    return 3;

}


/* =====================================================
   GET SYMBOLS
===================================================== */

function getAvailableSymbols() {

    const difficulty =
        smritiRecommendation.difficulty;


    if (difficulty === "gentle") {

        return GENTLE_SYMBOLS;

    }


    if (difficulty === "medium") {

        return MEDIUM_SYMBOLS;

    }


    if (difficulty === "hard") {

        return HARD_SYMBOLS;

    }


    return EASY_SYMBOLS;

}


/* =====================================================
   CREATE GAME SYMBOLS
===================================================== */

function getGameSymbols() {

    const pairCount =
        getPairCount();


    const available =
        getAvailableSymbols();


    const selected =
        available.slice(
            0,
            pairCount
        );


    const cards = [
        ...selected,
        ...selected
    ];


    console.log(
        "SMRITI cards:",
        cards
    );


    return cards;

}


/* =====================================================
   GAME VARIABLES
===================================================== */

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;

let moves = 0;

let seconds = 0;

let timerInterval = null;


/* =====================================================
   SHUFFLE
===================================================== */

function shuffle(array) {

    const newArray =
        [...array];


    for (
        let i = newArray.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            newArray[i],
            newArray[j]
        ] =
        [
            newArray[j],
            newArray[i]
        ];

    }


    return newArray;

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    console.log(
        "========== SMRITI GAME START =========="
    );


    /* Reload latest recommendation */

    loadRecommendation();


    /* Reset game variables */

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;

    moves = 0;

    seconds = 0;


    clearInterval(
        timerInterval
    );


    /* Get difficulty */

    const difficulty =
        smritiRecommendation.difficulty;


    const pairCount =
        getPairCount();


    console.log(
        "Difficulty:",
        difficulty
    );


    console.log(
        "Pair count:",
        pairCount
    );


    /* Update intro information */

    const cardCount =
        document.getElementById(
            "cardCount"
        );


    const pairCountElement =
        document.getElementById(
            "pairCount"
        );


    if (cardCount) {

        cardCount.textContent =
            pairCount * 2;

    }


    if (pairCountElement) {

        pairCountElement.textContent =
            pairCount;

    }


    /* Hide intro */

    document
        .getElementById("introScreen")
        .classList.add("hidden");


    /* Show game */

    document
        .getElementById("gameScreen")
        .classList.remove("hidden");


    /* Reset stats */

    document
        .getElementById("moves")
        .textContent = "0";


    document
        .getElementById("timer")
        .textContent = "00:00";


    /* Create cards */

    createBoard();


    /* Start timer */

    startTimer();


    /* Voice */

    speakInstructions();


    console.log(
        "========== GAME READY =========="
    );

}


/* =====================================================
   CREATE BOARD
===================================================== */

function createBoard() {

    const grid =
        document.getElementById(
            "memoryGrid"
        );


    if (!grid) {

        console.error(
            "memoryGrid NOT FOUND"
        );

        return;

    }


    /* Clear previous board */

    grid.innerHTML = "";


    /* Generate cards */

    const symbols =
        shuffle(
            getGameSymbols()
        );


    console.log(
        "Rendering",
        symbols.length,
        "cards"
    );


    /* Create each card */

    symbols.forEach(
        (symbol, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";


            card.className =
                "card";


            card.dataset.symbol =
                symbol;


            card.dataset.index =
                index;


            card.innerHTML = `

                <div class="card-inner">

                    <div class="card-front">
                        🌿
                    </div>

                    <div class="card-back">
                        ${symbol}
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                function () {

                    flipCard(card);

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    console.log(
        "Board children:",
        grid.children.length
    );

}


/* =====================================================
   FLIP CARD
===================================================== */

function flipCard(card) {

    if (lockBoard) {

        return;

    }


    if (card === firstCard) {

        return;

    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    card.classList.add(
        "flipped"
    );


    if (!firstCard) {

        firstCard =
            card;

        return;

    }


    secondCard =
        card;


    moves++;


    document
        .getElementById("moves")
        .textContent =
        moves;


    checkMatch();

}


/* =====================================================
   CHECK MATCH
===================================================== */

function checkMatch() {

    const match =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (match) {

        firstCard
            .classList
            .add("matched");


        secondCard
            .classList
            .add("matched");


        matchedPairs++;


        resetCards();


        const totalPairs =
            getPairCount();


        if (
            matchedPairs ===
            totalPairs
        ) {

            finishGame();

        }

    }

    else {

        lockBoard = true;


        setTimeout(
            function () {

                firstCard
                    .classList
                    .remove("flipped");


                secondCard
                    .classList
                    .remove("flipped");


                resetCards();

            },
            800
        );

    }

}


/* =====================================================
   RESET CARDS
===================================================== */

function resetCards() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    timerInterval =
        setInterval(
            function () {

                seconds++;


                const minutes =
                    String(
                        Math.floor(
                            seconds / 60
                        )
                    )
                    .padStart(
                        2,
                        "0"
                    );


                const secs =
                    String(
                        seconds % 60
                    )
                    .padStart(
                        2,
                        "0"
                    );


                document
                    .getElementById("timer")
                    .textContent =
                    `${minutes}:${secs}`;

            },
            1000
        );

}


/* =====================================================
   FINISH GAME
===================================================== */

async function finishGame() {

    clearInterval(
        timerInterval
    );


    const totalPairs =
        getPairCount();


    const accuracy =
        Math.min(
            100,
            Math.round(
                (totalPairs / moves) *
                100
            )
        );


    const score =
        calculateScore(
            accuracy,
            seconds
        );


    console.log(
        "GAME FINISHED"
    );


    console.log(
        "Accuracy:",
        accuracy
    );


    console.log(
        "Score:",
        score
    );


    /* Hide game */

    document
        .getElementById("gameScreen")
        .classList
        .add("hidden");


    /* Show result */

    document
        .getElementById("resultScreen")
        .classList
        .remove("hidden");


    /* Show score */

    document
        .getElementById("finalScore")
        .textContent =
        score;


    document
        .getElementById("finalAccuracy")
        .textContent =
        `${accuracy}%`;


    document
        .getElementById("finalTime")
        .textContent =
        `${seconds}s`;


    /* Send to backend */

    await sendResult(
        score,
        accuracy
    );

}


/* =====================================================
   SCORE
===================================================== */

function calculateScore(
    accuracy,
    time
) {

    let score =
        accuracy * 0.7;


    if (time <= 20) {

        score += 30;

    }

    else if (time <= 35) {

        score += 20;

    }

    else {

        score += 10;

    }


    return Math.round(
        score
    );

}


/* =====================================================
   SEND RESULT TO BACKEND
===================================================== */

async function sendResult(score, accuracy) {

    try {

        const response = await fetch("/api/game-results", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                patient_id: "demo-patient-001",

                game_type: "memory_garden",

                difficulty: smritiRecommendation.difficulty,

                score: score,

                accuracy: accuracy,

                response_time: seconds,

                moves: moves,

                hints: 0

            })

        });


        if (!response.ok) {
            throw new Error("Failed to submit game result");
        }


        const data = await response.json();


        console.log("Game Result:", data);


        /*
        =========================================
        SAVE AI RECOMMENDATION
        =========================================
        */

        if (data.recommendation) {

            const newRecommendation = {

                difficulty:
                    data.recommendation.difficulty ||
                    "easy",

                next_activity:
                    data.recommendation.next_activity ||
                    "memory_garden",

                reason:
                    data.recommendation.reason ||
                    "",

                confidence:
                    data.recommendation.confidence ||
                    0

            };


            localStorage.setItem(
                "smritiRecommendation",
                JSON.stringify(newRecommendation)
            );


            console.log(
                "SMRITI Recommendation Saved:",
                newRecommendation
            );

        }


        /*
        =========================================
        SHOW AI RESULT
        =========================================
        */

        document.getElementById("aiMessage")
            .textContent =
            data.recommendation.message;


        document.getElementById("aiRecommendation")
            .textContent =
            data.recommendation.next_activity;


    }

    catch (error) {

        console.error(
            "Game result error:",
            error
        );


        document.getElementById("aiMessage")
            .textContent =
            "Great job completing your activity!";


        document.getElementById("aiRecommendation")
            .textContent =
            "SMRITI will personalize your next activity.";

    }

}


/* =====================================================
   VOICE
===================================================== */

function speakInstructions() {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    const text =
        "Welcome to Memory Garden. " +
        "Find the matching pairs. " +
        "Take your time and enjoy the activity.";


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate = 0.8;


    window
        .speechSynthesis
        .speak(
            speech
        );

}


/* =====================================================
   NAVIGATION
===================================================== */

function goBack() {

    window.location.href =
        "/elder.html";

}


function goHome() {

    window.location.href =
        "/elder.html";

}