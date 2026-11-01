# SkillConnect Mobile App

SkillConnect is a React Native mobile application for discovering professionals, managing profiles, and purchasing membership plans.

## Technology Stack

- React Native 0.87.1
- JavaScript
- React Navigation
- Redux Toolkit
- React Redux
- Axios
- AsyncStorage
- Android SDK

## Prerequisites

- Node.js 22.11 or later
- npm
- Java Development Kit compatible with the React Native Android build
- Android Studio and Android SDK
- Android emulator or USB-connected Android device

## Installation

From the mobile directory:

```bash
npm install
```

## Configure the Backend URL

Open:

`src/services/api.js`

Update the Axios `baseURL` to your running backend's reachable URL.

Examples:

- Android emulator: use the appropriate host address for the emulator.
- Physical Android device: use your computer's reachable LAN IP address.
- Public tunnel: use the current HTTPS tunnel URL while it is running.

A phone's `localhost` refers to the phone itself, not your computer.

Make sure the backend is running and accessible before testing API-dependent features.

## Start Metro

Open a terminal in the mobile directory:

```bash
npm start
```

Keep Metro running.

## Run on Android

Open another terminal:

```bash
npm run android
```

Ensure an emulator is running or your Android device is connected with USB debugging enabled.

## Available Features

- User registration and login
- Email verification and password reset
- Profile viewing and editing
- Professional discovery
- Membership plan selection
- PayPal Sandbox payment flow
- Admin user management
- Product browsing and shopping cart

## PayPal Testing

Use PayPal Sandbox buyer credentials when testing membership payments. Ensure the backend payment endpoints and app deep-link handling are configured correctly.

Do not use real payment credentials for Sandbox testing.

## Useful Commands

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run lint checks:

```bash
npm run lint
```

Install dependencies:

```bash
npm install
```

## Troubleshooting

- **API connection error:** Check the backend status and `baseURL` in `src/services/api.js`.
- **Android device not detected:** Check USB debugging and run `adb devices`.
- **Metro connection issue:** Ensure Metro is running and restart the app if necessary.
- **Login or payment issue:** Check backend logs and verify the API URL and local environment configuration.

## Security

Do not store backend secrets, database passwords, or PayPal client secrets in the mobile app. Keep sensitive credentials in the backend environment configuration.
