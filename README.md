# work
This is the backend of the application for the Team Neigh. This repository is created using MongoDB and Firebase Cloud Functions. The main entry point of the Cloud Function is <b>index.js</b> which is the root of the functions folder. There are 4 other folders, namely:

1. API (Consists of Cloud Functions created with REST API.)
2. Cloud (Consists of Cloud Functions which can be called by the FE like a normal function.)
3. Service (Consists of Mongoose Models and Schemas)
4. Handlers for API

The reason why there are two different types of Cloud Function is because our Frontend Engineer Marcus is slightly slow in progress, so I am handling Cloud Functions via FE using Flutter. 
