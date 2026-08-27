/* =========================================
   SMRITI — REMINDERS
========================================= */


/* =========================================
   DEFAULT REMINDERS
========================================= */

const defaultReminders = [

    {
        id: 1,
        time: "10:30",
        title: "Cognitive activity",
        type: "cognitive",
        icon: "🧠"
    },

    {
        id: 2,
        time: "13:00",
        title: "Family time",
        type: "family",
        icon: "📞"
    },

    {
        id: 3,
        time: "20:00",
        title: "Evening activity",
        type: "routine",
        icon: "🌙"
    }

];


/* =========================================
   LOAD REMINDERS
========================================= */

function getReminders() {

    try {

        const saved =
            localStorage.getItem(
                "smritiReminders"
            );


        if (saved) {

            return JSON.parse(saved);

        }

    } catch (error) {

        console.error(
            "Could not load reminders:",
            error
        );

    }


    /*
     * First time opening the page:
     * create the default reminders.
     */

    localStorage.setItem(
        "smritiReminders",
        JSON.stringify(defaultReminders)
    );


    return [...defaultReminders];

}


/* =========================================
   SAVE REMINDERS
========================================= */

function saveReminders(reminders) {

    localStorage.setItem(
        "smritiReminders",
        JSON.stringify(reminders)
    );

}


/* =========================================
   REMINDER TYPE
========================================= */

function getReminderType(type) {

    const types = {

        health: {
            name: "Health & Wellness",
            icon: "❤️"
        },

        cognitive: {
            name: "Cognitive Activity",
            icon: "🧠"
        },

        family: {
            name: "Family & Friends",
            icon: "📞"
        },

        routine: {
            name: "Daily Routine",
            icon: "🌸"
        },

        other: {
            name: "Other",
            icon: "🔔"
        }

    };


    return (
        types[type] ||
        types.other
    );

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {

    if (!time) {
        return "";
    }


    const parts =
        time.split(":");


    let hour =
        parseInt(parts[0], 10);

    const minutes =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    if (hour === 0) {
        hour = 12;
    }

    else if (hour > 12) {
        hour -= 12;
    }


    return `${hour}:${minutes} ${period}`;

}


/* =========================================
   RENDER REMINDERS
========================================= */

function renderReminders() {

    const list =
        document.getElementById(
            "reminderList"
        );

    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!list) {
        return;
    }


    const reminders =
        getReminders();


    list.innerHTML = "";


    /*
     * Show empty state
     */

    if (reminders.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    /*
     * Sort reminders by time
     */

    reminders.sort(
        (a, b) =>
            a.time.localeCompare(
                b.time
            )
    );


    /*
     * Create reminder cards
     */

    reminders.forEach(
        reminder => {

            const type =
                getReminderType(
                    reminder.type
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "reminder-item";


            item.innerHTML = `

                <div class="reminder-icon">
                    ${reminder.icon || type.icon}
                </div>


                <div class="reminder-details">

                    <div class="reminder-time">
                        ${formatTime(reminder.time)}
                    </div>

                    <div class="reminder-title">
                        ${escapeHtml(reminder.title)}
                    </div>

                    <div class="reminder-type">
                        ${type.name}
                    </div>

                </div>


                <button
                    type="button"
                    class="delete-button"
                    onclick="deleteReminder(${reminder.id})"
                    aria-label="Delete reminder"
                    title="Delete reminder"
                >
                    🗑️
                </button>

            `;


            list.appendChild(
                item
            );

        }
    );

}


/* =========================================
   SHOW ADD REMINDER
========================================= */

function showAddReminder() {

    const section =
        document.getElementById(
            "addReminderSection"
        );


    if (!section) {
        return;
    }


    section.classList.remove(
        "hidden"
    );


    const timeInput =
        document.getElementById(
            "reminderTime"
        );


    if (timeInput) {

        timeInput.focus();

    }

}


/* =========================================
   HIDE ADD REMINDER
========================================= */

function hideAddReminder() {

    const section =
        document.getElementById(
            "addReminderSection"
        );


    if (section) {

        section.classList.add(
            "hidden"
        );

    }


    const form =
        document.getElementById(
            "reminderForm"
        );


    if (form) {

        form.reset();

    }

}


/* =========================================
   SAVE NEW REMINDER
========================================= */

function saveReminder(event) {

    event.preventDefault();


    const time =
        document.getElementById(
            "reminderTime"
        ).value;


    const title =
        document.getElementById(
            "reminderTitle"
        ).value.trim();


    const type =
        document.getElementById(
            "reminderType"
        ).value;


    if (!time || !title) {

        alert(
            "Please enter both a time and reminder."
        );

        return;

    }


    const reminders =
        getReminders();


    const reminderType =
        getReminderType(type);


    const newReminder = {

        id:
            Date.now(),

        time:
            time,

        title:
            title,

        type:
            type,

        icon:
            reminderType.icon

    };


    reminders.push(
        newReminder
    );


    saveReminders(
        reminders
    );


    hideAddReminder();


    renderReminders();


    /*
     * Small confirmation for the elder user.
     */

    alert(
        "Reminder saved successfully. ❤️"
    );

}


/* =========================================
   DELETE REMINDER
========================================= */

function deleteReminder(id) {

    const shouldDelete =
        confirm(
            "Would you like to remove this reminder?"
        );


    if (!shouldDelete) {
        return;
    }


    const reminders =
        getReminders();


    const updatedReminders =
        reminders.filter(
            reminder =>
                reminder.id !== id
        );


    saveReminders(
        updatedReminders
    );


    renderReminders();

}


/* =========================================
   VOICE ASSISTANCE
========================================= */

function speakReminders() {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Voice support is not available in this browser."
        );

        return;

    }


    const reminders =
        getReminders();


    if (reminders.length === 0) {

        speak(
            "You have no reminders for today."
        );

        return;

    }


    const sorted =
        [...reminders].sort(
            (a, b) =>
                a.time.localeCompare(
                    b.time
                )
        );


    let message =
        "Here are your reminders for today. ";


    sorted.forEach(
        reminder => {

            message +=
                `${formatTime(reminder.time)}, ` +
                `${reminder.title}. `;

        }
    );


    speak(message);

}


/* =========================================
   SPEECH HELPER
========================================= */

function speak(text) {

    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.rate =
        0.8;


    speech.pitch =
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
   SAFE HTML
========================================= */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   START
========================================= */

renderReminders();