# =========================================================
# SMRITI AI ENGINE
# Adaptive Cognitive Recommendation System
# =========================================================


def get_adaptive_recommendation(rows):

    # =====================================================
    # FIRST-TIME USER
    # =====================================================

    if not rows:

        return {
            "message":
                "Welcome to SMRITI! 🌸 Let's begin gently.",

            "difficulty":
                "easy",

            "next_activity":
                "memory_garden",

            "reason":
                "This is the first activity, so SMRITI is starting with a comfortable cognitive challenge.",

            "confidence":
                50,

            "latest_accuracy":
                0,

            "average_accuracy":
                0,

            "average_response_time":
                0,

            "trend":
                0,

            "latest_game":
                None
        }


    # =====================================================
    # COLLECT PERFORMANCE DATA
    # =====================================================

    accuracies = [
        row["accuracy"]
        for row in rows
        if row["accuracy"] is not None
    ]


    response_times = [
        row["response_time"]
        for row in rows
        if row["response_time"] is not None
    ]


    # =====================================================
    # AVERAGES
    # =====================================================

    average_accuracy = (
        sum(accuracies) / len(accuracies)
        if accuracies
        else 0
    )


    average_response_time = (
        sum(response_times) / len(response_times)
        if response_times
        else 0
    )


    # =====================================================
    # LATEST PERFORMANCE
    # =====================================================

    latest_accuracy = (
        rows[0]["accuracy"]
        if rows[0]["accuracy"] is not None
        else 0
    )


    latest_game = rows[0]["game_type"]


    # =====================================================
    # PERFORMANCE TREND
    # =====================================================

    if len(accuracies) >= 2:

        recent_accuracy = accuracies[0]

        previous_accuracy = accuracies[1]

        trend_difference = (
            recent_accuracy -
            previous_accuracy
        )

    else:

        trend_difference = 0


    # =====================================================
    # INITIAL DIFFICULTY DECISION
    # =====================================================

    if average_accuracy >= 85:

        difficulty = "hard"

        reason = (
            "Excellent recent performance. "
            "SMRITI is increasing the cognitive challenge."
        )

        confidence = 90


    elif average_accuracy >= 70:

        difficulty = "medium"

        reason = (
            "Good and consistent performance. "
            "SMRITI is providing a moderate cognitive challenge."
        )

        confidence = 85


    elif average_accuracy >= 50:

        difficulty = "easy"

        reason = (
            "Performance is developing steadily. "
            "SMRITI is keeping the activity comfortable."
        )

        confidence = 75


    else:

        difficulty = "gentle"

        reason = (
            "Recent performance suggests that a gentler "
            "cognitive activity would be more comfortable."
        )

        confidence = 85


    # =====================================================
    # TREND ADJUSTMENT
    # =====================================================

    if trend_difference >= 15:

        if difficulty == "easy":

            difficulty = "medium"

        elif difficulty == "medium":

            difficulty = "hard"


        reason = (
            "Your recent performance is improving. "
            "SMRITI is increasing the challenge slightly."
        )

        confidence = 88


    elif trend_difference <= -20:

        if difficulty == "hard":

            difficulty = "medium"

        elif difficulty == "medium":

            difficulty = "easy"

        elif difficulty == "easy":

            difficulty = "gentle"


        reason = (
            "Your recent performance has dipped a little. "
            "SMRITI is reducing the cognitive load."
        )

        confidence = 88


    # =====================================================
    # RESPONSE-TIME SAFETY
    # =====================================================

    if average_response_time > 45:

        difficulty = "gentle"

        reason = (
            reason +
            " Response time is relatively high, "
            "so SMRITI is reducing the cognitive load."
        )

        confidence = 90


    # =====================================================
    # NEXT ACTIVITY
    # =====================================================

    if average_accuracy >= 85:

        if latest_game == "memory_garden":

            next_activity = "focus_find"

        elif latest_game == "focus_find":

            next_activity = "daily_routine"

        elif latest_game == "daily_routine":

            next_activity = "memory_garden"

        else:

            next_activity = "memory_garden"


    elif average_accuracy >= 65:

        if latest_game == "memory_garden":

            next_activity = "daily_routine"

        elif latest_game == "focus_find":

            next_activity = "memory_garden"

        elif latest_game == "daily_routine":

            next_activity = "focus_find"

        else:

            next_activity = "memory_garden"


    else:

        # Lower performance:
        # Keep the user with a familiar activity.

        next_activity = latest_game

        if next_activity not in [
            "memory_garden",
            "focus_find",
            "daily_routine"
        ]:

            next_activity = "memory_garden"


    # =====================================================
    # ACTIVITY DISPLAY NAMES
    # =====================================================

    activity_names = {

        "memory_garden":
            "Memory Garden",

        "focus_find":
            "Focus & Find",

        "daily_routine":
            "My Daily Story"
    }


    activity_name = activity_names.get(
        next_activity,
        "Memory Garden"
    )


    # =====================================================
    # PERSONALIZED MESSAGE
    # =====================================================

    if difficulty == "hard":

        message = (
            f"Wonderful progress! 🌟 "
            f"SMRITI recommends {activity_name} "
            f"with a slightly higher challenge."
        )


    elif difficulty == "medium":

        message = (
            f"You're doing well! 🌱 "
            f"SMRITI recommends {activity_name} "
            f"at a moderate difficulty."
        )


    elif difficulty == "gentle":

        message = (
            f"Let's take things gently today. ❤️ "
            f"SMRITI recommends {activity_name} "
            f"with a simpler cognitive challenge."
        )


    else:

        message = (
            f"You're building your skills nicely. 🌸 "
            f"SMRITI recommends {activity_name} "
            f"at a comfortable difficulty."
        )


    # =====================================================
    # FINAL AI RESPONSE
    # =====================================================

    return {

        "message":
            message,

        "difficulty":
            difficulty,

        "next_activity":
            next_activity,

        "reason":
            reason,

        "confidence":
            confidence,

        "latest_accuracy":
            round(latest_accuracy, 1),

        "average_accuracy":
            round(average_accuracy, 1),

        "average_response_time":
            round(average_response_time, 1),

        "trend":
            round(trend_difference, 1),

        "latest_game":
            latest_game
    }