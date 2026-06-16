# User Profiles - Full Stack Assessment

A small full stack application that lets administrators view a list of users and manage each user's profile and addresses. Built as part of a written technical evaluation.

- **Backend:** Java 21 + Spring Boot, in memory data store
- **Frontend:** React 19 + TypeScript + Material UI
- **Author:** Rayyan Rushdhi

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 4.1.0
- Spring Web, Spring Validation
- Lombok
- Maven

**Frontend**
- React 19 with TypeScript
- Vite
- Material UI ([your MUI version])
- React Router v6
- Axios

---

## Prerequisites

- JDK 21 or higher
- Node.js 18+ and npm
- Maven 

---

## Project Structure

```
.
├── backend/                    Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/.../
│       ├── controller/
│       ├── service/
│       ├── entity/   
│       ├── dto/
│       ├── config/
│       └── exception/
├── frontend/                   React + MUI single-page app
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── types/
│       └── theme.ts
└── README.md
```

---

## Getting Started

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`. On startup, the service seeds the in-memory store with four sample users (some with addresses, some without) so the UI has something to render immediately.

### Frontend

```bash
cd frontend
cp .env.example .env       
npm install
npm run dev
```

The app runs on `http://localhost:5173`. The frontend reads the API base URL from `VITE_API_BASE_URL` in `.env`.

`.env.example`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

CORS on the backend is configured to allow `http://localhost:5173`.

---

## API Reference

| Method | Endpoint                                       | Description                              |
|--------|------------------------------------------------|------------------------------------------|
| GET    | `/api/users`                                   | List all users (summary, with address count) |
| GET    | `/api/users/{id}`                              | Get one user with their full address list |
| PUT    | `/api/users/{id}`                              | Update profile fields                    |
| POST   | `/api/users/{id}/addresses`                    | Add a new address                        |
| PUT    | `/api/users/{id}/addresses/{addressId}`        | Update an existing address               |
| DELETE | `/api/users/{id}/addresses/{addressId}`        | Remove an address                        |

**Validation** runs at the controller layer with `@Valid` on request DTOs. A `@RestControllerAdvice` handles:
- `ResourceNotFoundException` → `404` with a clean message
- `MethodArgumentNotValidException` → `400` with field-level error messages

This gives the frontend structured errors it can surface in form states.

---

## Design Choices for the User → Address Flow

A short summary here; the full write-up is in the submitted PDF.

**Two-DTO pattern for users.** `GET /users` returns `UserSummaryDto` (id, email, name, addressCount). `GET /users/{id}` returns `UserDetailDto` with the full address list. The list endpoint stays cheap, the detail endpoint is complete.

**Nested resource URLs.** Addresses live under `/users/{id}/addresses` rather than a flat `/addresses/{id}`. Ownership is encoded in the URL, which simplifies authorization once that's added.

**One dialog component for create and edit.** The address form takes an optional `initial` prop — provided means edit mode, absent means create mode. Same fields, same validation, one component.

**Local state, no global store.** For a two-page app, Redux or TanStack Query would be over-engineering. The list page fetches its own data; the detail page holds one user in component state and mutates after successful API calls.

---


