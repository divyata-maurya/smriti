async function loadProgress() {

    try {

        const summaryResponse =
            await fetch(
                "/api/patient/demo-patient-001/summary"
            );

        const summary =
            await summaryResponse.json();


        const historyResponse =
            await fetch(
                "/api/patient/demo-patient-001/history"
            );

        const history =
            await historyResponse.json();


        document.getElementById(
            "totalSessions"
        ).textContent =
            summary.total_sessions;


        document.getElementById(
            "averageScore"
        ).textContent =
            summary.average_score;


        document.getElementById(
            "averageAccuracy"
        ).textContent =
            `${summary.average_accuracy}%`;


        document.getElementById(
            "bestScore"
        ).textContent =
            summary.best_score;


        createInsight(
            summary
        );


        renderHistory(
            history.history
        );


    } catch (error) {

        console.error(
            "Could not load progress:",
            error
        );

        document.getElementById(
            "aiInsight"
        ).textContent =
            "Your progress is being prepared.";

    }

}


function createInsight(summary) {

    const accuracy =
        summary.average_accuracy;


    if (summary.total_sessions === 0) {

        document.getElementById(
            "aiInsight"
        ).textContent =
            "Welcome to your cognitive journey! 🌱";

        document.getElementById(
            "aiInsightText"
        ).textContent =
            "Complete your first activity and SMRITI will begin learning your performance pattern.";

        return;
    }


    if (accuracy >= 85) {

        document.getElementById(
            "aiInsight"
        ).textContent =
            "You're doing wonderfully! 🌟";

        document.getElementById(
            "aiInsightText"
        ).textContent =
            "Your accuracy is strong. SMRITI may gradually introduce more challenging activities.";

    }

    else if (accuracy >= 65) {

        document.getElementById(
            "aiInsight"
        ).textContent =
            "You're making steady progress. 🌱";

        document.getElementById(
            "aiInsightText"
        ).textContent =
            "Keep practicing regularly. SMRITI will continue adapting activities to your performance.";

    }

    else {

        document.getElementById(
            "aiInsight"
        ).textContent =
            "Every activity is a step forward. ❤️";

        document.getElementById(
            "aiInsightText"
        ).textContent =
            "SMRITI will keep activities comfortable and supportive while you practice.";

    }

}


function renderHistory(
    history
) {

    const list =
        document.getElementById(
            "activityList"
        );


    list.innerHTML = "";


    if (
        !history ||
        history.length === 0
    ) {

        list.innerHTML = `
            <div class="empty">
                No activities completed yet.
            </div>
        `;

        return;

    }


    history.forEach(
        activity => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "activity-item";


            const gameName =
                formatGameName(
                    activity.game_type
                );


            const date =
                new Date(
                    activity.created_at
                );


            item.innerHTML = `

                <div>

                    <div class="activity-name">
                        ${gameName}
                    </div>

                    <div class="activity-date">
                        ${date.toLocaleString()}
                    </div>

                </div>


                <div class="activity-score">

                    <strong>
                        ${activity.score}
                    </strong>

                    <small>
                        ${activity.accuracy}% accuracy
                    </small>

                </div>

            `;


            list.appendChild(
                item
            );

        }
    );

}


function formatGameName(
    gameType
) {

    const names = {

        memory_garden:
            "🧩 Memory Garden",

        focus_find:
            "👀 Focus & Find",

        daily_story:
            "🌸 My Daily Story"

    };


    return (
        names[gameType] ||
        gameType
    );

}


function goHome() {

    window.location.href =
        "/elder.html";

}


loadProgress();