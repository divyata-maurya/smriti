const PATIENT_ID = "demo-patient-001";

document.addEventListener(
    "DOMContentLoaded",
    loadCaregiverDashboard
);


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadCaregiverDashboard() {

    try {

        const [
            summaryResponse,
            historyResponse,
            trendResponse,
            adaptiveResponse
        ] = await Promise.all([

            fetch(
                `/api/patient/${PATIENT_ID}/summary`
            ),

            fetch(
                `/api/patient/${PATIENT_ID}/history`
            ),

            fetch(
                `/api/patient/${PATIENT_ID}/trend`
            ),

            fetch(
                `/api/patient/${PATIENT_ID}/adaptive`
            )

        ]);


        const summary =
            await summaryResponse.json();

        const historyData =
            await historyResponse.json();

        const trendData =
            await trendResponse.json();

        const adaptiveData =
            await adaptiveResponse.json();


        updateSummary(summary);

        updateActivityHistory(
            historyData.history || []
        );

        updateAIInsight(
            historyData.history || []
        );

        updatePerformanceChart(
            trendData.trend || []
        );

        updateAdaptiveRecommendation(
            adaptiveData.recommendation
        );


    } catch (error) {

        console.error(
            "SMRITI Dashboard Error:",
            error
        );

        showDashboardError();

    }

}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(summary) {

    const scoreElement =
        document.getElementById(
            "cognitiveScore"
        );

    const accuracyElement =
        document.getElementById(
            "accuracy"
        );


    if (!scoreElement || !accuracyElement) {
        return;
    }


    if (
        !summary ||
        summary.total_sessions === 0
    ) {

        scoreElement.textContent = "—";

        accuracyElement.textContent = "—";

        return;
    }


    scoreElement.textContent =
        Math.round(
            Number(summary.average_score) || 0
        );


    accuracyElement.textContent =
        `${Math.round(
            Number(summary.average_accuracy) || 0
        )}%`;

}


/* =========================================
   ACTIVITY HISTORY
========================================= */

function updateActivityHistory(history) {

    const list =
        document.querySelector(
            ".activity-list"
        );


    if (!list) {
        return;
    }


    if (!Array.isArray(history) || history.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <div>
                    🧠
                </div>

                <p>
                    No cognitive activities completed yet.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML = "";


    history
        .slice(0, 5)
        .forEach(item => {

            const date =
                new Date(item.created_at);


            const dateText =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short"
                    }
                );


            const timeText =
                date.toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            const gameName =
                formatGameName(
                    item.game_type
                );


            const icon =
                getGameIcon(
                    item.game_type
                );


            const accuracy =
                Math.round(
                    Number(item.accuracy) || 0
                );


            const element =
                document.createElement("div");


            element.className =
                "history-item";


            element.innerHTML = `

                <div class="history-icon">
                    ${icon}
                </div>

                <div class="history-info">

                    <strong>
                        ${gameName}
                    </strong>

                    <span>
                        ${dateText} • ${timeText}
                    </span>

                </div>

                <div class="history-score">

                    <strong>
                        ${accuracy}%
                    </strong>

                    <span>
                        Accuracy
                    </span>

                </div>

            `;


            list.appendChild(element);

        });

}


/* =========================================
   GAME NAME
========================================= */

function formatGameName(type) {

    const names = {

        memory_garden:
            "Memory Garden",

        focus_find:
            "Focus & Find",

        daily_routine:
            "My Daily Story"

    };


    return names[type] || "Cognitive Activity";

}


/* =========================================
   GAME ICON
========================================= */

function getGameIcon(type) {

    const icons = {

        memory_garden:
            "🧩",

        focus_find:
            "👀",

        daily_routine:
            "🌸"

    };


    return icons[type] || "🧠";

}


/* =========================================
   AI INSIGHT
========================================= */

function updateAIInsight(history) {

    const message =
        document.querySelector(
            ".insight strong"
        );


    const description =
        document.querySelector(
            ".insight p"
        );


    if (!message || !description) {
        return;
    }


    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        message.textContent =
            "Waiting for cognitive activity";


        description.textContent =
            "Complete a cognitive activity to allow SMRITI AI to generate personalized insights.";

        return;
    }


    const latest =
        history[0];


    const accuracy =
        Number(latest.accuracy) || 0;


    if (accuracy >= 85) {

        message.textContent =
            "Strong cognitive performance today";


        description.textContent =
            `Accuracy was ${Math.round(
                accuracy
            )}%. SMRITI suggests gradually increasing the challenge.`;

    }

    else if (accuracy >= 65) {

        message.textContent =
            "Cognitive performance is stable";


        description.textContent =
            `Today's accuracy was ${Math.round(
                accuracy
            )}%. Continue regular short cognitive sessions.`;

    }

    else {

        message.textContent =
            "Performance needs gentle support";


        description.textContent =
            `Today's accuracy was ${Math.round(
                accuracy
            )}%. SMRITI recommends a simpler activity and continued observation.`;

    }

}


/* =========================================
   CAREGIVER PROFILE
========================================= */

function showCaregiverProfile() {

    const modal =
        createModal(
            "👩‍⚕️ Caregiver Profile",
            `

                <div class="profile-modal">

                    <div class="profile-avatar">
                        👩‍⚕️
                    </div>

                    <h3>
                        Caregiver
                    </h3>

                    <p class="profile-role">
                        SMRITI Caregiver Account
                    </p>

                    <div class="profile-info">

                        <div>
                            <span>Role</span>
                            <strong>Caregiver</strong>
                        </div>

                        <div>
                            <span>Patient</span>
                            <strong>Amma</strong>
                        </div>

                        <div>
                            <span>Account status</span>
                            <strong>Active</strong>
                        </div>

                    </div>

                    <button
                        class="modal-primary"
                        onclick="closeModal()"
                    >
                        Done
                    </button>

                </div>

            `
        );

    document.body.appendChild(modal);

}


/* =========================================
   GENERATE REPORT
========================================= */

async function generateReport() {

    try {

        const [
            summaryResponse,
            historyResponse,
            adaptiveResponse
        ] = await Promise.all([

            fetch(`/api/patient/${PATIENT_ID}/summary`),

            fetch(`/api/patient/${PATIENT_ID}/history`),

            fetch(`/api/patient/${PATIENT_ID}/adaptive`)

        ]);


        if (
            !summaryResponse.ok ||
            !historyResponse.ok ||
            !adaptiveResponse.ok
        ) {

            throw new Error("Failed to fetch report data");

        }


        const summary =
            await summaryResponse.json();

        const historyData =
            await historyResponse.json();

        const adaptiveData =
            await adaptiveResponse.json();


        const history =
            historyData.history || [];

        const recommendation =
            adaptiveData.recommendation || {};


        const reportDate =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        const reportHTML = `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>SMRITI Cognitive Report</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {

            font-family:
                Arial,
                sans-serif;

            padding: 40px;

            color: #19342f;

            max-width: 900px;

            margin: auto;

            background: #ffffff;

        }

        h1 {

            margin-bottom: 5px;

            font-size: 32px;

        }

        h2 {

            margin-top: 32px;

            margin-bottom: 15px;

        }

        .subtitle {

            color: #71827e;

            margin-bottom: 25px;

        }

        .patient-info {

            padding: 18px;

            background: #edf7f3;

            border-radius: 12px;

            margin-bottom: 25px;

        }

        .metrics {

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            gap: 15px;

            margin-top: 20px;

        }

        .metric {

            border: 1px solid #dce8e4;

            border-radius: 12px;

            padding: 18px;

        }

        .metric span {

            display: block;

            color: #71827e;

            font-size: 12px;

        }

        .metric strong {

            display: block;

            font-size: 25px;

            margin-top: 7px;

        }

        table {

            width: 100%;

            border-collapse: collapse;

            margin-top: 15px;

        }

        th,
        td {

            padding: 11px;

            border-bottom:
                1px solid #e5ece9;

            text-align: left;

        }

        th {

            background: #edf7f3;

        }

        .recommendation {

            background: #edf7f3;

            padding: 20px;

            border-radius: 12px;

            margin-top: 15px;

        }

        .recommendation p {

            line-height: 1.6;

        }

        .print-button {

            margin-top: 30px;

            padding: 12px 20px;

            border: none;

            border-radius: 8px;

            background: #244f45;

            color: white;

            cursor: pointer;

            font-size: 14px;

        }

        .empty {

            color: #71827e;

            padding: 15px 0;

        }

        @media (max-width: 600px) {

            body {
                padding: 20px;
            }

            .metrics {

                grid-template-columns: 1fr;

            }

        }

        @media print {

            .print-button {

                display: none;

            }

            body {

                padding: 20px;

            }

        }

    </style>

</head>


<body>

    <h1>
        SMRITI
    </h1>

    <p class="subtitle">
        Cognitive Caregiver Report
    </p>


    <div class="patient-info">

        <p>
            <strong>Patient:</strong>
            Amma
        </p>

        <p>
            <strong>Generated:</strong>
            ${reportDate}
        </p>

    </div>


    <h2>
        Performance Summary
    </h2>


    <div class="metrics">

        <div class="metric">

            <span>
                Total Sessions
            </span>

            <strong>
                ${Number(summary.total_sessions) || 0}
            </strong>

        </div>


        <div class="metric">

            <span>
                Average Score
            </span>

            <strong>
                ${Math.round(
                    Number(summary.average_score) || 0
                )}
            </strong>

        </div>


        <div class="metric">

            <span>
                Average Accuracy
            </span>

            <strong>
                ${Math.round(
                    Number(summary.average_accuracy) || 0
                )}%
            </strong>

        </div>

    </div>


    <h2>
        Recent Activities
    </h2>


    ${
        history.length === 0

        ? `

            <p class="empty">
                No cognitive activities completed yet.
            </p>

        `

        : `

            <table>

                <thead>

                    <tr>

                        <th>
                            Activity
                        </th>

                        <th>
                            Accuracy
                        </th>

                        <th>
                            Score
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        history
                            .slice(0, 10)
                            .map(item => `

                                <tr>

                                    <td>
                                        ${formatGameName(
                                            item.game_type
                                        )}
                                    </td>

                                    <td>
                                        ${Math.round(
                                            Number(
                                                item.accuracy
                                            ) || 0
                                        )}%
                                    </td>

                                    <td>
                                        ${Math.round(
                                            Number(
                                                item.score
                                            ) || 0
                                        )}
                                    </td>

                                </tr>

                            `)
                            .join("")
                    }

                </tbody>

            </table>

        `
    }


    <h2>
        SMRITI AI Recommendation
    </h2>


    <div class="recommendation">

        <p>

            <strong>
                Recommended Activity:
            </strong>

            ${
                formatGameName(
                    recommendation.next_activity
                )
            }

        </p>


        <p>

            <strong>
                Difficulty:
            </strong>

            ${
                recommendation.difficulty || "—"
            }

        </p>


        <p>

            ${
                recommendation.reason ||
                "No recommendation available yet."
            }

        </p>


        ${
            recommendation.confidence !== undefined

            ? `

                <p>

                    <strong>
                        Confidence:
                    </strong>

                    ${recommendation.confidence}%

                </p>

            `

            : ""
        }

    </div>


    <button
        class="print-button"
        onclick="window.print()"
    >
        Print / Save as PDF
    </button>


</body>

</html>

        `;


        /* =========================================
           CREATE REPORT FILE
        ========================================= */

        const blob =
            new Blob(
                [reportHTML],
                {
                    type: "text/html"
                }
            );


        const reportURL =
            URL.createObjectURL(blob);


        /* =========================================
           OPEN REPORT
        ========================================= */

        const reportWindow =
            window.open(
                reportURL,
                "_blank"
            );


        if (!reportWindow) {

            URL.revokeObjectURL(reportURL);

            alert(
                "Please allow pop-ups for SMRITI to generate the report."
            );

            return;

        }


        /* Clean up object URL later */

        setTimeout(() => {

            URL.revokeObjectURL(reportURL);

        }, 10000);


    } catch (error) {

        console.error(
            "Report generation error:",
            error
        );


        alert(
            "Unable to generate the report right now."
        );

    }

}


/* =========================================
   AI INSIGHTS
========================================= */

function viewAIInsights() {

    const modal =
        createModal(
            "✨ SMRITI AI Insights",
            `

                <div class="insights-modal">

                    <div class="modal-icon">
                        🧠
                    </div>

                    <h3>
                        Personalized Cognitive Insights
                    </h3>

                    <p>
                        SMRITI analyzes recent cognitive
                        activity, accuracy, response time
                        and performance trends to adapt
                        future activities.
                    </p>

                    <div class="insight-point">
                        🌱 Regular short sessions
                        are recommended.
                    </div>

                    <div class="insight-point">
                        🧠 Difficulty is adjusted
                        according to performance.
                    </div>

                    <div class="insight-point">
                        📈 Performance trends are
                        continuously monitored.
                    </div>

                    <button
                        class="modal-primary"
                        onclick="closeModal()"
                    >
                        Done
                    </button>

                </div>

            `
        );


    document.body.appendChild(modal);

}


/* =========================================
   VIEW ALL ACTIVITIES
========================================= */

function viewAllActivities() {

    const activitySection =
        document.querySelector(
            ".lower-grid"
        );


    if (activitySection) {

        activitySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================
   ALERT MANAGEMENT
========================================= */

function manageAlerts() {

    const modal =
        createModal(
            "🔔 Alert Management",
            `

                <div class="alerts-modal">

                    <h3>
                        Caregiver Alerts
                    </h3>

                    <p>
                        Manage the types of updates
                        you want to monitor.
                    </p>


                    <label class="alert-setting">

                        <input
                            type="checkbox"
                            checked
                        >

                        Missed activity alerts

                    </label>


                    <label class="alert-setting">

                        <input
                            type="checkbox"
                            checked
                        >

                        Mood check-in alerts

                    </label>


                    <label class="alert-setting">

                        <input
                            type="checkbox"
                            checked
                        >

                        Performance changes

                    </label>


                    <label class="alert-setting">

                        <input
                            type="checkbox"
                        >

                        Reminder notifications

                    </label>


                    <button
                        class="modal-primary"
                        onclick="closeModal()"
                    >
                        Save Settings
                    </button>

                </div>

            `
        );


    document.body.appendChild(modal);

}


/* =========================================
   MODAL CREATOR
========================================= */

function createModal(title, content) {

    const overlay =
        document.createElement("div");


    overlay.className =
        "smriti-modal-overlay";


    overlay.innerHTML = `

        <div
            class="smriti-modal"
            role="dialog"
            aria-modal="true"
        >

            <button
                class="modal-close"
                onclick="closeModal()"
                aria-label="Close"
            >
                ×
            </button>

            <h2>
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

                closeModal();

            }

        }
    );


    return overlay;

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    const modal =
        document.querySelector(
            ".smriti-modal-overlay"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================
   DASHBOARD ERROR
========================================= */

function showDashboardError() {

    const adaptive =
        document.querySelector(
            ".adaptive-content"
        );


    if (adaptive) {

        adaptive.innerHTML = `

            <p>
                ⚠️ Unable to load the latest
                caregiver data.
            </p>

            <button
                class="start-recommended"
                onclick="loadCaregiverDashboard()"
            >
                Try again
            </button>

        `;

    }

}


/* =========================================
   PERFORMANCE CHART
========================================= */

function updatePerformanceChart(trend) {

    const svg =
        document.querySelector(
            ".chart svg"
        );


    if (
        !svg ||
        !Array.isArray(trend) ||
        trend.length === 0
    ) {
        return;
    }


    const points =
        trend.map(
            (item, index) => {

                const x =
                    trend.length === 1
                        ? 350
                        : 20 +
                          (
                              index /
                              (trend.length - 1)
                          ) * 630;


                const score =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Number(item.score) || 0
                        )
                    );


                const y =
                    235 -
                    (
                        score / 100
                    ) * 210;


                return `${x},${y}`;

            }
        );


    svg.innerHTML = "";


    const polyline =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );


    polyline.setAttribute(
        "points",
        points.join(" ")
    );


    svg.appendChild(polyline);


    points.forEach(point => {

        const [
            x,
            y
        ] = point.split(",");


        const circle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        circle.setAttribute(
            "cx",
            x
        );


        circle.setAttribute(
            "cy",
            y
        );


        circle.setAttribute(
            "r",
            "5"
        );


        svg.appendChild(circle);

    });

}


/* =========================================
   ADAPTIVE RECOMMENDATION
========================================= */

function updateAdaptiveRecommendation(
    recommendation
) {

    const element =
        document.querySelector(
            ".adaptive-recommendation"
        );


    if (!element) {
        return;
    }


    if (!recommendation) {

        element.querySelector(
            ".adaptive-content"
        ).innerHTML = `
            <p>
                No recommendation available yet.
            </p>
        `;

        return;
    }


    const activityNames = {

        memory_garden:
            "Memory Garden",

        focus_find:
            "Focus & Find",

        daily_routine:
            "My Daily Story"

    };


    const activityLinks = {

        memory_garden:
            "memory.html",

        focus_find:
            "focus.html",

        daily_routine:
            "routine.html"

    };


    const activity =
        activityNames[
            recommendation.next_activity
        ] ||
        "Memory Garden";


    const activityLink =
        activityLinks[
            recommendation.next_activity
        ] ||
        "memory.html";


    element.innerHTML = `

        <div class="adaptive-header">

            <span>
                🧠
            </span>

            <strong>
                SMRITI Adaptive Recommendation
            </strong>

        </div>


        <div class="adaptive-content">

            <h3>
                Next: ${activity}
            </h3>

            <p>
                Difficulty:
                <strong>
                    ${
                        recommendation.difficulty
                        || "easy"
                    }
                </strong>
            </p>

            <p>
                ${
                    recommendation.reason
                    || "SMRITI has prepared a personalized activity."
                }
            </p>

            <small>
                Confidence:
                ${
                    recommendation.confidence ?? 50
                }%
            </small>

            <br><br>

            <button
                class="start-recommended"
                onclick="startRecommendedActivity('${activityLink}')"
            >
                Start Recommended Activity →
            </button>

        </div>

    `;

}


/* =========================================
   START RECOMMENDED ACTIVITY
========================================= */

function startRecommendedActivity(link) {

    if (!link) {
        return;
    }


    window.location.href = link;

}