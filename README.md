[![codecov](https://codecov.io/gh/woowenjun99/work/branch/main/graph/badge.svg?token=kM9iPdOLlW)](https://codecov.io/gh/woowenjun99/work)

    

# work

This is the backend of the application for the Team Neigh. This repository is created using MongoDB and Firebase Cloud Functions. The main entry point of the Cloud Function is <b>index.js</b> which is the root of the functions folder. There are 4 other folders, namely:

1. API (Consists of Cloud Functions created with REST API.)
2. Cloud (Consists of Cloud Functions which can be called by the FE like a normal function.)
3. Service (Consists of Mongoose Models and Schemas)
4. Handlers for API

## Continuous Integration
In my GitHUb repository, I will be focusing on the code coverage for the Continuous Integration aspect of it.
In the Continuous Deployment aspect, I will be focusing on automated deployment to the Google Cloud Functions.

### Setup the environment for testing (For future reference)

1. Install vitest, vite and c8 inside of the working directory.
2. Add in a vite.config.ts file inside of the functions directory (i.e. working directory)
3. In package.json, change it to "vitest --run --reporter verbose --coverage --config ./vite.config.ts"
4. Everything should be configured. Write some tests and run npm run test.

### Setup the codecov

Source: https://docs.codecov.com/docs/codecov-uploader

1. Inside of the functions folder, run

```
curl -Os https://uploader.codecov.io/latest/macos/codecov

chmod +x codecov
./codecov -t ${CODECOV_TOKEN}

```
