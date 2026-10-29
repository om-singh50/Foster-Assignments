# Foster CRM Backend

A REST API for a Customer Relationship Management (CRM) system built with **Node.js, Express.js, MongoDB, and JWT authentication**.

The application allows prospective students to submit course enquiries without authentication. Employees and counselors can register, log in, view unclaimed enquiries, claim leads, and retrieve the leads assigned to them.

## Features

- Employee registration and login using email and password.
- Password hashing using `bcryptjs`.
- JWT-based authentication for protected API endpoints.
- Public enquiry submission without authentication.
- Fetching all unclaimed public enquiries.
- Claiming enquiries and assigning them to the authenticated counselor.
- Fetching leads claimed by the logged-in counselor.
- MongoDB integration using Mongoose.
- Request rate limiting for employee registration and login.
- Centralized error handling and JSON responses.
- Input validation for employee registration, login, and enquiry submissions.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Hashing:** bcryptjs
- **Validation:** Zod and request-level validation
- **Environment Variables:** dotenv
- **CORS:** cors
- **Rate Limiting:** express-rate-limit
- **Development:** nodemon

## Project Structure

```text
Foster-Backend-Assignment/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── leadController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── Employee.js
│   └── Lead.js
├── routes/
│   ├── authRoutes.js
│   └── leadRoutes.js
├── utils/
│   └── tokenUtils.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

The `.env` file should also be present in the project root locally. It should not be committed to version control.

## Prerequisites

Before running the application, ensure you have:

- Node.js installed.
- npm installed.
- MongoDB running locally or a MongoDB Atlas database.
- Postman or another REST API client for testing.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Foster-Backend-Assignment
```

Replace `<YOUR_REPOSITORY_URL>` with the actual repository URL.

If you already have the project locally, open a terminal in the project root and continue to the next step.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/foster_crm

FRONTEND_URL=http://localhost:5173

JWT_ACCESS_SECRET=replace_with_a_secure_random_secret

ACCESS_TOKEN_TTL=15m
```

#### Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port on which the Express server listens. |
| `MONGODB_URI` | MongoDB connection URI. |
| `FRONTEND_URL` | Allowed frontend origin for CORS. |
| `JWT_ACCESS_SECRET` | Secret used to sign and verify JWT access tokens. |
| `ACCESS_TOKEN_TTL` | Access-token expiry duration, defaulting to `15m`. |

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection URI.

Generate a secure JWT secret using Node.js:

```bash
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"
```

Use the generated value for `JWT_ACCESS_SECRET`.

**Security:** Never commit your `.env` file or expose your JWT secret in API responses, screenshots, or public repositories.

Ensure `.gitignore` contains:

```gitignore
node_modules/
.env
*.log
```

### 4. Start the server

Run the development server:

```bash
npm run dev
```

The terminal should display a MongoDB connection message followed by the server's listening message.

The default API base URL is:

```text
http://localhost:5000
```

## API Documentation

All request and response bodies use JSON unless stated otherwise.

### Authentication APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Not required | Register an employee. |
| POST | `/api/v1/auth/login` | Not required | Authenticate an employee and obtain a JWT. |
| GET | `/api/v1/auth/me` | Bearer token | Retrieve the authenticated employee's profile. |

### 1. Employee Registration

**Endpoint**

```http
POST /api/v1/auth/register
```

**Request body**

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "StrongPassword123"
}
```

**Expected behavior**

- Validates the supplied employee details.
- Hashes the password before storing it.
- Creates an employee record in MongoDB.
- Returns the created employee's information.

**Expected status:** `201 Created`

A duplicate email should be rejected rather than creating a second account.

### 2. Employee Login

**Endpoint**

```http
POST /api/v1/auth/login
```

**Request body**

```json
{
  "email": "rahul@example.com",
  "password": "StrongPassword123"
}
```

**Expected behavior**

- Finds the employee by email.
- Verifies the password hash.
- Checks that the employee account is active.
- Generates a JWT access token.
- Returns the token and employee information.

**Expected status:** `200 OK`

Copy the `accessToken` returned by the API. Use it for subsequent authenticated requests.

### 3. Get Current Employee

**Endpoint**

```http
GET /api/v1/auth/me
```

**Authentication**

```http
Authorization: Bearer <ACCESS_TOKEN>
```

**Request body:** None.

**Expected behavior**

Returns the profile of the authenticated employee.

**Expected status:** `200 OK`

## Lead Management APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/v1/leads` | Not required | Submit a public enquiry. |
| GET | `/api/v1/leads/public` | Bearer token | Fetch unclaimed enquiries. |
| POST | `/api/v1/leads/:id/claim` | Bearer token | Claim an unclaimed enquiry. |
| GET | `/api/v1/leads/mine` | Bearer token | Fetch leads claimed by the logged-in employee. |

### 4. Submit a Public Enquiry

**Endpoint**

```http
POST /api/v1/leads
```

**Authentication:** Not required.

**Request body**

```json
{
  "fullName": "Amit Verma",
  "email": "amit@example.com",
  "phone": "9876543210",
  "courseInterest": "Full Stack Development",
  "message": "I am interested in the next batch."
}
```

**Expected behavior**

- Validates the enquiry details.
- Creates a lead in MongoDB.
- Sets the lead status to `public`.
- Leaves `assignedTo` and `claimedAt` as `null`.

**Expected status:** `201 Created`

The `phone` and `message` fields are optional in the current implementation.

This endpoint is publicly accessible so prospective students can submit enquiries without creating an employee account or obtaining a JWT.

### 5. Fetch Unclaimed Public Enquiries

**Endpoint**

```http
GET /api/v1/leads/public
```

**Authentication**

```http
Authorization: Bearer <ACCESS_TOKEN>
```

**Request body:** None.

**Expected behavior**

Returns enquiries that have not yet been claimed.

The API filters for leads with:

```json
{
  "status": "public",
  "assignedTo": null
}
```

**Expected status:** `200 OK`

Only authenticated, active employees can retrieve the public enquiry list.

### 6. Claim a Lead

**Endpoint**

```http
POST /api/v1/leads/:id/claim
```

Replace `:id` with the actual MongoDB ID of the enquiry.

For example:

```http
POST /api/v1/leads/68f123456789abcdef123456/claim
```

**Authentication**

```http
Authorization: Bearer <ACCESS_TOKEN>
```

**Request body:** None.

**Expected behavior**

- Validates the lead ID.
- Checks that the lead is still public and unassigned.
- Assigns the lead to the authenticated employee.
- Changes its status to `claimed`.
- Records the claim timestamp.

**Expected status:** `200 OK`

The claim operation uses a conditional atomic MongoDB update. This ensures that two employees cannot successfully claim the same enquiry concurrently.

If the lead has already been claimed, the API returns `409 Conflict`. If the lead does not exist, it returns `404 Not Found`.

### 7. Fetch Leads Claimed by the Logged-In Employee

**Endpoint**

```http
GET /api/v1/leads/mine
```

**Authentication**

```http
Authorization: Bearer <ACCESS_TOKEN>
```

**Request body:** None.

**Expected behavior**

Returns only claimed leads assigned to the authenticated employee.

The database query filters by the current employee's ID and the `claimed` status.

**Expected status:** `200 OK`

A counselor cannot retrieve another counselor's private enquiries through this endpoint.

## Testing with Postman

Use the following sequence to verify the complete CRM workflow.

### Step 1: Register an employee

Send a `POST` request to:

```text
http://localhost:5000/api/v1/auth/register
```

Use the registration JSON payload documented above.

### Step 2: Log in

Send a `POST` request to:

```text
http://localhost:5000/api/v1/auth/login
```

Copy the returned access token.

### Step 3: Submit an enquiry

Send a `POST` request to:

```text
http://localhost:5000/api/v1/leads
```

Do not provide an Authorization header.

### Step 4: Fetch public enquiries

Send a `GET` request to:

```text
http://localhost:5000/api/v1/leads/public
```

Provide the counselor's access token.

### Step 5: Claim an enquiry

Send a `POST` request to:

```text
http://localhost:5000/api/v1/leads/LEAD_ID/claim
```

Replace `LEAD_ID` with the ID returned when the enquiry was created.

### Step 6: Fetch your claimed enquiries

Send a `GET` request to:

```text
http://localhost:5000/api/v1/leads/mine
```

Use the same counselor's access token and confirm that the claimed lead appears.

### Step 7: Verify exclusive ownership

Fetch the public enquiries again. The claimed lead should no longer be present.

Attempt to claim the same lead a second time. The expected response is `409 Conflict`.

## Error Handling

The API returns JSON responses for errors.

Common HTTP status codes include:

| Status | Meaning |
|---|---|
| `400 Bad Request` | Invalid input or malformed resource ID. |
| `401 Unauthorized` | Missing, invalid, or expired access token, or invalid credentials. |
| `403 Forbidden` | Employee account is not active. |
| `404 Not Found` | Requested route or lead does not exist. |
| `409 Conflict` | Duplicate email or an enquiry that has already been claimed. |
| `429 Too Many Requests` | Authentication rate limit exceeded. |
| `500 Internal Server Error` | Unexpected server-side error. |

The exact response message depends on the controller or middleware handling the request.

## Lead Lifecycle

A lead moves through two states.

**Public**

```json
{
  "status": "public",
  "assignedTo": null,
  "claimedAt": null
}
```

The enquiry is available for counselors to claim.

**Claimed**

```json
{
  "status": "claimed",
  "assignedTo": "COUNSELOR_OBJECT_ID",
  "claimedAt": "CLAIM_TIMESTAMP"
}
```

The enquiry belongs to the counselor who successfully claimed it. It is removed from the public list and appears in that counselor's private lead list.

## Security Notes

- Passwords are stored as bcrypt hashes.
- JWT access tokens expire according to the configured token lifetime.
- Protected endpoints require a valid Bearer token.
- The authentication middleware checks the employee's current account status.
- Lead claiming uses an atomic MongoDB update to prevent duplicate successful claims.
- The public enquiry form does not require employee authentication.
- Employee registration is open in the current implementation. For a real production deployment, unrestricted public counselor registration should be restricted to trusted employees or an administrative onboarding process.
- The application currently uses access tokens; refresh-token rotation and revocable refresh sessions are not implemented.

## Future Improvements

Potential enhancements beyond the assignment's core requirements include:

- Pagination and filtering for public and claimed enquiries.
- Search by name, email, or course interest.
- Lead status tracking and follow-up management.
- Password reset and account recovery.
- Refresh-token rotation and logout.
- Stronger public-form spam protection.
- Automated API testing.
- Deployment configuration and production monitoring.

## Assignment Requirements

The implementation covers the required CRM operations:

- Employee registration and login.
- Public enquiry submission without authentication.
- Fetching unclaimed public enquiries.
- Claiming enquiries.
- Fetching enquiries claimed by the authenticated employee.

The application uses Node.js, Express.js, MongoDB, Mongoose, and JWT authentication to implement these requirements.

---

**Foster CRM Backend**  
Built with Node.js, Express.js, MongoDB, and JWT.
