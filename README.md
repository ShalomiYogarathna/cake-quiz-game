# cake-quiz-game
Cake and Baking Quiz Game – Software for Enterprise Assignment

## Project Overview

This project is an individual Software for Enterprise assignment submission built as a
distributed web application. It includes a React frontend, a FastAPI backend, and a
SQLite database for storing users and quiz scores.

The application allows a player to:

- register and log in
- complete a two-round bakery quiz
- save quiz scores to a personal history
- view score statistics on a dashboard
- interact with external web services used by the application

## Main Features

- User registration with validation for username, email, and password
- User login with server-side session handling and cookie-based authentication
- Protected frontend routes for authenticated pages
- Event-driven quiz flow with timers, button clicks, input validation, and keyboard events
- Banana puzzle round using external API data
- Dessert image round using external API data
- Score persistence using SQLite
- Dashboard showing history and score summary
- Result page with score saving and number fact retrieval

## Technology Stack

### Frontend

- React
- React Router
- Vite
- ESLint

### Backend

- FastAPI
- Pydantic
- Requests
- SQLite
- Starlette session middleware

## Project Structure

- `frontend/`: React user interface
- `frontend/src/pages/`: main screens such as login, register, quiz, dashboard, and result
- `frontend/src/hooks/`: reusable state and event-handling logic
- `frontend/src/services/`: frontend API communication
- `backend/main.py`: FastAPI application and API endpoints
- `backend/database.py`: SQLite database helpers
- `backend/cake_shop.db`: local database file
- `docs/manual-testing-evidence.md`: supporting manual testing checklist

## Setup Instructions

Start the backend first, then start the frontend. The frontend depends on the backend
for authentication, quiz data, score saving, and dashboard data.

### 1. Frontend setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default on `http://localhost:5173`.
It sends API requests to `http://localhost:8000` unless `VITE_API_BASE_URL` is set.

### 2. Backend setup

From the project root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs by default on `http://localhost:8000`.

## Environment Variables

### Frontend

- `VITE_API_BASE_URL`: optional override for the backend API base URL. If this is not
  set, the frontend uses `http://localhost:8000`.

### Backend

- `SESSION_SECRET_KEY`: secret used to sign session cookies. If this is not set, the
  app uses a local development default.
- `SESSION_COOKIE_SECURE`: when set to `true`, cookies are sent only over HTTPS. The
  default is `false`, which is suitable for local development.

## Runtime Notes

### Startup Order

- Start the backend before using login, registration, quiz, result, or dashboard pages.
- Start the frontend after the backend is available so browser requests can succeed.

### Database Behaviour

- The backend uses SQLite with the local file `backend/cake_shop.db`.
- User and score tables are created automatically when the FastAPI app starts.
- Score history is stored per authenticated user and is shown in the dashboard.

## How the Application Works

1. A user creates an account using the registration page.
2. The user logs in and receives a server-managed session.
3. Protected pages use the current session to allow or deny access.
4. The quiz starts with a banana puzzle round and then continues to a dessert round.
5. Events such as typing, pressing Enter, clicking answers, and timer expiration update the UI.
6. At the end of the quiz, the score is saved and shown on the result page.
7. The dashboard displays historical attempts and summary statistics for the logged-in user.

## Assignment Theme Notes

### Version Control

This project is maintained in Git and includes commit and merge history showing how the
work has been developed incrementally.

### Event-Driven Programming

The frontend reacts to user events such as form submission, button clicks, keyboard
input, and countdown timers. These events control the quiz flow and validation.

### Interoperability

The backend communicates with external web services over HTTP and JSON:

- Banana API for banana puzzle data
- TheMealDB for dessert data
- Numbers API for score facts

This demonstrates interoperability between this system and third-party services.
The backend also includes fallback responses so the app can still function if an
external service is unavailable.

### Virtual Identity

The system uses user accounts, password validation, hashed passwords, protected routes,
and session cookies to establish and manage virtual identity.

## Fallback Behaviour

- If the Banana API request fails, the backend returns a local fallback banana question.
- If TheMealDB request fails or returns too few dessert items, the backend uses local
  fallback dessert data.
- If the Numbers API request fails, the backend returns fallback score text instead of
  stopping the result page flow.

These fallback paths help keep the application usable while still demonstrating
interoperability with external services.

## Testing Evidence

Manual testing evidence has been added in:

- [docs/manual-testing-evidence.md](/Users/shalomiyogarathna/cake-quiz-game/docs/manual-testing-evidence.md)

This checklist can be used as supporting material alongside the final video and source
code submission.

## Source Acknowledgements

- Banana puzzle content is integrated from Marc Conrad's Banana API:
  https://marcconrad.com/uob/banana/doc.php
- Dessert data is integrated from TheMealDB API:
  https://www.themealdb.com/api.php
- Number facts are integrated from Numbers API:
  http://numbersapi.com/
- Some decorative image assets in the UI and backend fallbacks use publicly hosted
  Unsplash image URLs.
- Generative AI tools may have been used during development for guidance,
  explanation, debugging support, and code refinement. Any final submitted code
  was reviewed and integrated into this individual project by the author.
- Attribution comments are also included in the related source files where these
  services and media are used.
- A dedicated acknowledgements record is included in:
  [docs/source-acknowledgements.md](/Users/shalomiyogarathna/cake-quiz-game/docs/source-acknowledgements.md)
