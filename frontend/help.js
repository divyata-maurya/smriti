/* =========================================
   SMRITI — HELP / ASSISTANT
========================================= */


/* =========================================
   CURRENT ANSWER
========================================= */

let currentAction = null;


/* =========================================
   HELP ANSWERS
========================================= */

const helpAnswers = {

    today: {

        title:
            "Your plan for today 🌅",

        text:
            "You have three gentle activities planned: " +
            "Memory Garden, Focus and Find, and My Daily Story. " +
            "You can start with the activity recommended by SMRITI.",

        button:
            "Start today's activity",

        action:
            "today"

    },


    games: {

        title:
            "How to play 🎮",

        text:
            "Each activity is simple and takes only a few minutes. " +
            "Read the instruction carefully, take your time, " +
            "and tap the answer you think is correct. " +
            "There is no need to hurry.",

        button:
            "Go to today's activities",

        action:
            "today"

    },


    reminders: {

        title:
            "Your reminders 🔔",

        text:
            "SMRITI can help you remember important activities, " +
            "family time, and your daily routine.",

        button:
            "Open my reminders",

        action:
            "reminders"

    },


    progress: {

        title:
            "Your progress 📈",

        text:
            "Your progress page shows your completed activities, " +
            "average score, accuracy, best score, and recent sessions. " +
            "SMRITI uses this information to personalize your activities.",

        button:
            "Open my progress",

        action:
            "progress"

    }

};


/* =========================================
   SHOW ANSWER
========================================= */

function showHelpAnswer(type) {

    const answer =
        helpAnswers[type];


    if (!answer) {
        return;
    }


    currentAction =
        answer.action;


    const answerCard =
        document.getElementById(
            "answerCard"
        );


    const answerTitle =
        document.getElementById(
            "answerTitle"
        );


    const answerText =
        document.getElementById(
            "answerText"
        );


    const answerAction =
        document.getElementById(
            "answerAction"
        );


    if (!answerCard) {
        return;
    }


    answerTitle.textContent =
        answer.title;


    answerText.textContent =
        answer.text;


    answerAction.textContent =
        answer.button;


    answerCard.classList.remove(
        "hidden"
    );


    /*
     * Scroll gently to the answer.
     */

    answerCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    /*
     * Voice the answer for elder users.
     */

    speak(answer.text);

}


/* =========================================
   PERFORM ANSWER ACTION
========================================= */

function performAnswerAction() {

    switch (currentAction) {

        case "today":

            goHome();

            break;


        case "reminders":

            window.location.href =
                "/reminders.html";

            break;


        case "progress":

            window.location.href =
                "/progress.html";

            break;


        default:

            goHome();

            break;

    }

}


/* =========================================
   VOICE HELP
========================================= */

function speakHelp() {

    const text =
        "Welcome to SMRITI Help. " +
        "You can ask about today's activities, " +
        "learn how to play the games, " +
        "see your reminders, or check your progress.";


    speak(text);

}


/* =========================================
   SUPPORT VOICE
========================================= */

function speakSupport() {

    const text =
        "If you need more help, please ask a family member " +
        "or caregiver. They can help you whenever you need it.";


    speak(text);

}


/* =========================================
   SPEECH FUNCTION
========================================= */

function speak(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    /*
     * Stop previous speech first.
     */

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    /*
     * Elder-friendly voice speed.
     */

    speech.rate =
        0.8;


    speech.pitch =
        1;


    speech.volume =
        1;


    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href =
        "/elder.html";

}


/* =========================================
   START
========================================= */

console.log(
    "SMRITI Help loaded successfully."
);