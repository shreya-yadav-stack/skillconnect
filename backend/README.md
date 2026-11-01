# SkillConnect Backend

Express.js REST API for the SkillConnect mobile application.

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- JWT authentication
- bcrypt
- Nodemailer
- PayPal REST API (Sandbox)
- node-cron

## Prerequisites

- Node.js 22.11 or later
- npm
- PostgreSQL
- PayPal Sandbox account for payment testing
- SMTP account for email functionality

## Installation

```bash
cd backend
npm install
```

## Environment Configuration

Create a `.env` file inside the `backend/` directory.

```env
DB_USER=your_database_user
DB_HOST=localhost
DB_NAME=skillconnect
DB_PASSWORD=your_database_password
DB_PORT=5432

JWT_SECRET=your_long_random_secret

EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password

PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret

PUBLIC_API_URL=your_public_backend_url
INR_PER_USD=your_configured_conversion_rate
```

Replace the example values with your actual configuration. Do not share or commit real credentials.

## Database Setup

1. Ensure PostgreSQL is running.
2. Create the `skillconnect` database if it does not already exist.
3. Ensure all tables required by the application are present.

The backend directory currently does not contain a SQL schema file, so a fresh database may require separate schema setup.

## Run the Server

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The current development server uses port `5000`.

## Health Check

With the backend running, open another terminal and execute:

```bash
curl http://localhost:5000/
```

Expected response:

```json
{"message":"SkillConnect backend is running"}
```

## Membership Payments

The backend supports membership plan selection and PayPal Sandbox payment verification.

For testing:

1. Configure PayPal Sandbox credentials.
2. Ensure the public backend URL is reachable when required by the payment flow.
3. Use Sandbox buyer credentials.
4. Confirm payment verification succeeds before membership activation.

Never use live credentials for Sandbox testing.

## Automatic Membership Expiry

A scheduled job checks expired active memberships every minute and marks them inactive. The backend process must remain running for the scheduled job to execute.

## Useful Commands

```bash
npm install
npm run dev
npm start
node --check server.js
```

## Security

- Keep `.env` private.
- Use a strong, random JWT secret.
- Never publish database passwords, email credentials, or PayPal client secrets.
- Do not commit real credentials to source control.
