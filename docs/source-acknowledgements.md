# Source Acknowledgements

This document records external sources, services, media, and assistance used in the
Cake and Baking Quiz Game. It supports the assignment requirement to make clear where
external code, APIs, media, or AI assistance were used.

## External APIs

| Source | URL | How it is used |
| --- | --- | --- |
| Marc Conrad Banana API | https://marcconrad.com/uob/banana/doc.php | Provides banana puzzle question data for round 1 of the quiz. |
| TheMealDB API | https://www.themealdb.com/api.php | Provides dessert names and images for the dessert matching round. |
| Numbers API | http://numbersapi.com/ | Provides a number fact based on the user's final quiz score. |

The backend communicates with these services using HTTP requests and JSON responses.
Fallback content is included so the application can still run if an external service is
unavailable during testing or demonstration.

## Image And Media Sources

| Source | How it is used |
| --- | --- |
| Unsplash | Some decorative UI images and fallback dessert image URLs use publicly hosted Unsplash image URLs. |
| Local project assets | The cake shop SVG illustration in `frontend/src/assets/cake-shop-hero.svg` is used as a local frontend asset. |

## AI Assistance

Generative AI tools may have been used for guidance, explanation, debugging support,
code refinement, and documentation wording. The final submitted code was reviewed,
tested, and integrated into this individual project by the author.

AI-assisted work is also acknowledged in source comments where relevant, including the
backend API file.

## Related Source Files

- `backend/main.py`: API integrations, fallback data, authentication/session logic,
  and source comments for external APIs.
- `frontend/src/pages/Login.jsx`: source comment for the Unsplash login image.
- `README.md`: project-level source acknowledgements.
