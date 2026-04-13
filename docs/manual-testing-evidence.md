# Manual Testing Evidence

This document records manual testing carried out for the Cake and Baking Quiz Game.
It can be included as supporting material for the assignment submission.

## Test Environment

- Frontend: React + Vite
- Backend: FastAPI + SQLite
- Browser used for testing: modern Chromium-based browser
- Local frontend URL: `http://localhost:5173`
- Local backend URL: `http://localhost:8000`

## Manual Test Checklist

### Authentication and Virtual Identity

1. Register a new user with a valid username, email, and strong password.
Expected result: account is created and user is redirected to the login screen.

2. Try registering with an existing email address.
Expected result: registration is rejected with an error message.

3. Try registering with an invalid email or weak password.
Expected result: validation messages are shown and registration is blocked.

4. Log in with correct credentials.
Expected result: session is created and the user is redirected to the dashboard.

5. Log in with incorrect credentials.
Expected result: login is rejected with an error message.

6. Access `/dashboard`, `/quiz`, or `/result` without logging in.
Expected result: protected route redirects to the login page.

7. Log out from the dashboard or quiz page.
Expected result: session is cleared and the user returns to the login screen.

### Quiz Flow and Event-Driven Behaviour

1. Start the challenge from the quiz landing screen.
Expected result: round 1 loads and the countdown starts.

2. Enter a correct banana answer.
Expected result: score increases and success feedback is shown.

3. Enter an invalid banana answer such as letters.
Expected result: live validation blocks the submission.

4. Let the timer expire in the banana round.
Expected result: timeout feedback is shown with the correct answer.

5. Continue to round 2 and select a dessert answer.
Expected result: feedback is shown and the round completes.

6. Let the timer expire in the dessert round.
Expected result: timeout feedback is shown.

7. Finish the challenge.
Expected result: result page appears and score is saved.

### Dashboard and Persistence

1. Complete one or more quiz attempts.
Expected result: attempts appear in dashboard history.

2. Open the dashboard after saving results.
Expected result: total plays, best score, average score, and latest score are visible.

3. Refresh the browser while still logged in.
Expected result: active session is restored from the cookie-backed session.

### Interoperability and External Services

1. Load the banana question.
Expected result: backend requests data from the Banana API or uses fallback content.

2. Load the dessert round.
Expected result: backend requests dessert data from TheMealDB or uses fallback content.

3. Open the result page after a quiz attempt.
Expected result: backend requests a score fact from Numbers API or uses fallback text.

## Notes for Submission

- Screenshots or a short transcript of completed tests can be added below this file if needed.
- If a tutor asks for evidence, this checklist can be paired with a short video demonstration.
