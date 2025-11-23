# Cookie Manager Backend

## Installations

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
-   Also install nodemon globally we can do that using the `npm install -g nodemon`
-   Migrate the tables using `npx prisma migrate deploy`
-   Using the seeder run `npm run seed_local_dev`
-   To run the server run the command `nodemon app.js`
-   On local machine it's on port 5000 so you can use `localhost:5000`

## ENVS

```
APP_BASE_URL="http:localhost:3000"
APP_BASE_URL_API="http:localhost:3000"
AUTH_REDIRECT_ENDPOINT="https://privy-cookie-manager.idfystaging.com/dashboard/login"
AUTH_SUCCESS_ENDPOINT="https://privy-cookie-manager.idfystaging.com/dashboard"
DATABASE_URL="postgresql://sanketsaboo:@localhost:5432/cookie_manager_meity?schema=public&connection_limit=10&connect_timeout=10&application_name=prisma-client"
FILE_SIZE_MB="10"
GOOGLE_APPLICATION_CREDENTIALS="/Users/sanketsaboo/Desktop/privy-labs/sanket-idfy-data-lake-staging-service-account.json"
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
ENABLE_CORS_URLS='https://cookie-manager.sanketsaboo.com,https://privytest.store,https://uat.axisbank.com,http://localhost:3001,http://localhost:5173'
OBFUSCATE_JS_FILE="true"
PROJECT_ID='idfy-data-lake-staging'
SCAN_ACCESS_ROLES='privy_cm_scan_operator'
EDITOR_ROLE='privy_cm_editor'
ARCHIVAL_ACCESS_ROLES='privy_cm_admin'
AUTH_SECRET='secret'
```
