# Cookie Manager Backend

## Overview

Cookie Manager Backend is a comprehensive Node.js/Express application that manages cookie consent, banners, and domain configurations for the Privy Cookie Manager system. It provides APIs for managing cookie consents, templates, translations, and external integrations with a focus on data privacy and compliance.

## Features

-   **Cookie Consent Management**: Track and manage user cookie preferences across domains
-   **Banner Management**: Create, manage, and serve customizable cookie banners
-   **Domain Management**: Configure and manage domains for cookie consent
-   **Template System**: Template-based banner creation with customizable elements
-   **Multi-language Support**: Built-in translation support for banners and consents
-   **Scanning Capabilities**: Domain and cookie scanning functionality
-   **Authentication & Authorization**: Role-based access control with secure session management
-   **External API Integration**: Support for external services
-   **Archival System**: Archive and manage historical consent data
-   **Logging & Instrumentation**: Comprehensive event logging and monitoring

## Installations For Mac

-   Node.js
    -   To install Node.js, you can visit the [official website nodejs](https://nodejs.org/) and download the installer for your Nodejs.
-   PostgresSQl
    -   brew install postgresql
    -   to turn on the postgresql server automatically run
        -   brew services start postgresql
-   Homebrew
    -   to install homebrew use the command below
    -   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    -   If required any help use this [stackoverflow url](https://stackoverflow.com/questions/66666134/how-to-install-homebrew-on-m1-mac)

## Run the application

-   To install all the dependencies run the command `npm install`
-   Migrate the tables using `npx prisma migrate deploy`
-   To run the server run the command `node app.js`
-   On local machine it's on port 5000 so you can use `localhost:5000`

## Setup

### Prerequisites

-   Node.js v22 or higher
-   PostgreSQL v16 or higher
-   npm 

### Local Development Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd cookie-manager-backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    - Copy the ENV variables from the ENVS section below
    - Create a `.env` file in the root directory
    - Add all required environment variables

4. **Setup database**

    ```bash
    npx prisma migrate deploy
    ```

5. **Start the server**
    ```bash
    npm start
    # or for development with auto-reload
    npm run dev
    ```

### Development Mode

In development mode (`NODE_ENV=development`), a dummy session is automatically created for testing purposes with the `privy_cgp_admin` role.

## Tech Stack

**Framework**: Express.js (Node.js)
**Database**: PostgreSQL
**ORM**: Prisma
**API Authentication**: JWT (JSON Web Tokens)

## ENVS

```
APP_BASE_URL="http:localhost:3000"
APP_BASE_URL_API="http:localhost:3000"
AUTH_REDIRECT_ENDPOINT="https://privy-cookie-manager.idfystaging.com/dashboard/login"
AUTH_SUCCESS_ENDPOINT="https://privy-cookie-manager.idfystaging.com/dashboard"
DATABASE_URL="postgresql://user:@localhost:5432/cookie_manager_meity?schema=public&connection_limit=10&connect_timeout=10&application_name=prisma-client"
FILE_SIZE_MB="10"
GOOGLE_APPLICATION_CREDENTIALS="/Users/service-account.json"
INSTRUMENTER_LOG="true"
INSTRUMENTER_LOG_FALSE="false"
INSTRUMENTER_PUBLISH="true"
INSTRUMENTER_SERVICE_CATEGORY="CookieManager"
INSTRUMENTER_ASYNC="false"
UNIVERSE="delphinus"
INSTRUMENTER_EXCHANGE="idfy-instrumenter-topic"
INSTRUMENTER_AMQP_URL="amqp://127.0.0.1:5672"
PUBLISH_LOG_BY_DEFAULT="ON"
INSTRUMENTER_COMPONENT="CookieManager"
NODE_ENV="development"
PORT="3000"
VALID_ROLES='privy_cm_editor,privy_cm_admin,privy_cm_scan_operator'
ENABLE_CORS_URLS='http://localhost:3001,http://localhost:5173'
OBFUSCATE_JS_FILE="true"
PROJECT_ID='project-id'
SCAN_ACCESS_ROLES='privy_cm_scan_operator'
EDITOR_ROLE='privy_cm_editor'
ARCHIVAL_ACCESS_ROLES='privy_cm_admin'
AUTH_SECRET='secret'
```
