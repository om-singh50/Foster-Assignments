# Fastor Restaurant Discovery

A React.js frontend application built with Vite, Tailwind CSS, and Axios to integrate with the Fastor staging API. The application supports mobile number registration, OTP-based authentication, and restaurant discovery.

## Features

- **User Registration:** Register using a mobile number and receive an OTP.
- **OTP Login:** Authenticate using the registered mobile number and OTP.
- **JWT Authentication:** Extract the authentication token from the login response and store it in `sessionStorage`.
- **Restaurant Listing:** Fetch restaurants from the Fastor API for city ID `118`.
- **Restaurant Cards:** Display restaurant logos, names, addresses, and restaurant IDs.
- **Loading States:** Show skeleton loaders while restaurant data is being fetched.
- **Error Handling:** Display API errors and provide retry functionality.
- **Refresh:** Reload the restaurant list using the API.
- **Responsive UI:** Support mobile, tablet, and desktop layouts.
- **Logout:** Clear the stored authentication token and return to the login page.

## Tech Stack

- React.js
- Vite
- Tailwind CSS v4
- Axios
- JavaScript (ES Modules)

## Project Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── client.js
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── auth/
│   │   │   ├── OtpForm.jsx
│   │   │   └── PhoneForm.jsx
│   │   ├── layout/
│   │   │   └── AppHeader.jsx
│   │   └── restaurants/
│   │       └── RestaurantCard.jsx
│   ├── features/
│   │   ├── auth/
│   │   │   └── authApi.js
│   │   └── restaurants/
│   │       └── restaurantApi.js
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   └── RestaurantsPage.jsx
│   ├── utils/
│   │   └── getErrorMessage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## Prerequisites

Make sure you have the following installed:

- Node.js compatible with the Vite version specified in `package.json`
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

Navigate to the frontend directory:

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://staging.fastor.ai
```

The API base URL is configurable through the environment, so it can be changed without modifying the API service files.

**Important:** Vite exposes variables prefixed with `VITE_` to client-side JavaScript. Do not store private credentials, API secrets, or other sensitive values in these variables.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## API Integration

The application communicates with the Fastor staging API using Axios.

### 1. Register User

**Endpoint**

```http
POST /v1/pwa/user/register
```

**Request body**

Content-Type: `application/x-www-form-urlencoded`

| Parameter | Description | Example |
|---|---|---|
| `phone` | User's mobile number | `9818979450` |
| `dial_code` | Country dialing code | `+91` |

**Example successful response**

```json
{
  "status": "Success",
  "status_code": 200,
  "data": "otp sent"
}
```

After successful registration, the application displays the OTP verification form.

### 2. Login with OTP

**Endpoint**

```http
POST /v1/pwa/user/login
```

**Request body**

Content-Type: `application/x-www-form-urlencoded`

| Parameter | Description | Example |
|---|---|---|
| `phone` | Registered mobile number | `9818979450` |
| `otp` | OTP received from the API | `123456` |
| `dial_code` | Country dialing code | `+91` |

The application checks the response status and extracts the JWT from:

```js
response.data.data.token
```

The token is stored in `sessionStorage` and used for authenticated API requests.

Use the staging OTP provided by the API or the assignment instructions.

### 3. Fetch Restaurants

**Endpoint**

```http
GET /v1/m/restaurant?city_id=118
```

**Headers**

```http
Authorization: Bearer <JWT>
```

The request is made through the shared Axios client.

**Restaurant response structure**

The restaurant records are available at:

```js
response.data.data.results
```

The response also includes metadata:

```json
{
  "meta": {
    "total_pages": 3,
    "total_count": 56
  }
}
```

Each restaurant card uses these fields:

| Field | Description |
|---|---|
| `restaurant_id` | Unique restaurant identifier |
| `restaurant_name` | Restaurant name |
| `logo` | Restaurant logo image URL |
| `address_complete` | Full restaurant address |

If `address_complete` is missing or contains the literal string `"null"`, the UI displays `Address unavailable`.

## Application Flow

1. The user enters their mobile number.
2. The application sends a registration request.
3. After successful registration, the OTP form is displayed.
4. The user enters the OTP and submits the login form.
5. The application extracts the JWT and stores it in `sessionStorage`.
6. The restaurant page fetches restaurant data using the JWT.
7. The application displays the restaurant cards.
8. The user can refresh the restaurant list or log out.

## Project Architecture

The project separates API communication, reusable components, pages, and utility functions.

- **`api/client.js`** — Creates the shared Axios instance and configures the API base URL.
- **`features/auth/authApi.js`** — Contains registration and OTP login API functions.
- **`features/restaurants/restaurantApi.js`** — Contains the restaurant-fetching API function.
- **`components/auth/`** — Contains the phone registration and OTP forms.
- **`components/layout/`** — Contains the shared application header.
- **`components/restaurants/`** — Contains the reusable restaurant card.
- **`pages/AuthPage.jsx`** — Handles registration and OTP login logic.
- **`pages/RestaurantsPage.jsx`** — Handles restaurant fetching, loading states, errors, and rendering.
- **`utils/getErrorMessage.js`** — Provides a shared utility for extracting readable error messages.
- **`App.jsx`** — Manages authentication state and switches between the authentication and restaurant pages.

## Available Scripts

Run these commands from the frontend project directory.

### Start development server

```bash
npm run dev
```

### Run ESLint

```bash
npm run lint
```

### Create production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Pagination Status

The restaurant API reports `total_pages` and `total_count` in its response metadata. However, requests using the tested `page=2` parameter returned the same restaurant records as the default request.

Therefore, pagination controls have not been implemented. The application currently displays the restaurant records returned by the API.

Pagination can be added once the backend's supported pagination parameter and behavior have been confirmed.

## Error Handling and Troubleshooting

### API requests fail in the browser

If an API request works in Postman but fails in the browser, check the browser console and Network tab for CORS errors. The staging API must permit requests from the frontend origin.

### Login succeeds but the restaurant page does not load

Verify that the login response contains a token at `response.data.data.token` and that the restaurant request includes the `Authorization: Bearer <JWT>` header.

### Restaurant cards show missing images

Check the `logo` URL returned by the API. If an image cannot load, the card displays a fallback icon.

### Environment variable changes are not applied

Restart the Vite development server after changing the `.env` file.

### Build or lint errors

Run the following commands and resolve any reported issues:

```bash
npm run lint
npm run build
```

## Security Notes

- `sessionStorage` is used for authentication token storage for assignment simplicity. JavaScript running on the page can access the token.
- For production applications, consider a suitable authentication architecture using appropriately configured secure, HTTP-only cookies where supported by the backend.
- Never commit secrets or private credentials to the repository.
- Do not commit a real authentication token or a sensitive API response.

## License

This project was created for a frontend assignment using the Fastor staging API.
