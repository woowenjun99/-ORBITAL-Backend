# ORBITAL 2022 BACKEND README

| Estimated Reading Time | Word Count |
| :--------------------: | :--------: |
|   15 min 00 seconds    | 3000 words |

## TABLE OF CONTENTS

[SECTION 0: PREFACE](#PREFACE)

[SECTION 1: SYSTEM DESIGN](#SYSTEM-DESIGN)

[SECTION 2: SOFTWARE ENGINEERING PRINCIPLES](#SWE)

[SECTION 3: CONTINUOUS INTEGRATION AND CONTINUOUS DEVELOPMENT](#CICD)

## SECTION 0: PREFACE <a name="PREFACE"></a>

As of the time that I am writing this README for the Backend, it would have already been the 3rd milestone. If you have been following this journey with me, whether it is willingly or not, you might have notice that the README contents are continuously changing. This is because I am picking up new knowledge as I read more books and watch more videos. I did not learn any new technology for Orbital because technology can be easily learnt. Within this half a year of coding, I have learnt quite a lot of technology. During my internship, I know how to schedule cron jobs using Express Server, as well as carry out Automated Web Testing with Selenium IDE. For the SWE side, I have learnt VueJS, Flutter, ExpressJS and Google Cloud Functions. Therefore, during this Orbital, I have just picked up skills and knowledge that I have not learnt yet and integrate it into the project, including System Design, Testings and CI/CD. Therefore, I have just taken this opportunity during Orbital to mix and match the skills that I have picked up and read up on System Design, Testings and CI/CD and incorporate it into this project. Special thanks to the following people who have guided me during these 7 months:

1. Marcus Ong Qin Yuan : My partner for Orbital

2. Viky: Our mentor for Orbital

3. Ni Jiaying: Our advisor for Orbital

4. Nobel Ang: My Raffles Hall Backend lead

5. Dianne Loh: CTO of VibeFam

6. Andrew: VP of Technology of Vault Dragon Medical

7. Joe: Senior Developer of Vault Dragon Medical

8. Vu Van Dung: FE Developer for Ezkomment and my friend

## 1. SYSTEM DESIGN <a name="SYSTEM-DESIGN"></a>

As the saying goes, if you fail to plan, you plan to fail. There is no one-size-fits-all solution when it comes to designing a system. There might be alternatives to doing so. However, I will be justifying the use of technology that were used in this project in this section, sharing what I have learnt as well as discussing the pros and cons. When we talk about system design, we need to consider the following parameters:

1. Scalability
2. Availability
3. Reliability
4. Maintainability
5. Fault Tolerant

### 1.1 SCALABILITY

**_SCALABILITY_** refers to the ability of our app to retain its performance when the workload increases. There are many ways that workload can increase, and these includes:

1. Increase in client requests to the server
2. Increase in the information being stored in the database.

Often, scalability is inversely proportional to performance. Therefore, it is always up to the user to decide how to balance between the performance and scalability when trying to create a backend system for the application.

#### 1.1.1. INTRODUCTION TO CLOUD COMPUTING

Before the era of Cloud Computing, we are only able to scale vertically. This means that most of the client's request are handled by one or several computers which are known as servers. There are many issues with such an infrastructure. Here are some examples of the issues:

- Supposed that we acquire an infrastructure and our application suddenly becomes popular. The load on the backend will spike. If the current infrastructure is unable to handle the sudden increase, we would need to acquire more infrastructure. This is known as **_PEAK LOAD PROVISIONING_**. It might be problematic if we are unable to acquire the infrastructure.

- Great! So we just acquire more infrastructure in advance. However, on some days like the weekdays, the number of people using our application might not be that much. What happens to the infrastructure right now? These servers are just left around idling when no one is using them, wasting both resources and money.

Here is where Cloud Computing comes in. Google Cloud Platform is a PAAS (Platform-As-A-Service), this means that we will only use Google Cloud Platform when we need them, and we are paying for it when we use them. If we do not use them at all, we do not have to pay for them. This is great as Firebase Cloud Functions are free for the first 2 million invocations and I do not have to pay money to acquire an infrastructure for this project.

#### 1.1.2. TYPES OF SCALABILITY

- **_VERTICAL SCALING_** -- Having one or a few computers or servers to manage the load of the users. We can scale up by adding resource to it, such as through upgrading the CPU or RAMs but there is a limit to which we can upgrade.

- **_HORIZONTAL SCALING_** -- Having many computers or servers to manage the load of the users. These computers do not necessarily need to be as good as the computers used in VERTICAL SCALING.

It is best if we choose to use a combination of both horizontal and vertical scaling. Unfortunately, I am unsure how to implement such an architecture. Therefore, I will only be using pure vertical scaling for this project.

#### 1.1.3. HOW HORIZONTAL SCALING WORKS (KNOWLEDGE SHARING)

Supposed that we have many clients and a pool of servers. How do we distribute the workload such that it is even? If we have many servers, how do we keep track of their IP addresses? The solution to this would be to have a middleman who has a public IP address and able to distribute the workload. This middleman is known as a **_LOAD BALANCER_**. One of the ways that the load balancer can distribute the workload is through a method called **_ROUND ROBIN_** via BIND. This means that it will first pass the work to server 1, then server 2 and so on until it finishes allocating to all the servers. Following which, it will go back and allocate the work to server 1 again. There are several limitations to ROUND ROBIN:

- There might be an uneven distribution amount of work. For instance, some servers will encounter power heavy users while some servers will encounter less power heavy users. Therefore, the load is technically not that evenly distributed.

- Sessions might not work since we are constantly jumping from server to server.

#### 1.1.4. CHOICE OF DATABASE

In terms of Scalability, NoSQL databases are more scalable as compared to their SQL counterparts. Therefore, we will be adopting a NoSQL for our project. The reason for why NoSQL Database is more scalable than their counterpart can be found here on StackOverflow.

https://stackoverflow.com/questions/8729779/why-nosql-is-better-at-scaling-out-than-rdbms

### 1.2. AVAILABILITY

Another parameter that we look out for when designing our system is the availability. Supposed that we set our region to be in US and our users are based in Singapore, the speed of the server response will significantly decrease. What happens if the data center in Singapore goes down? We need to plan all of these beforehand.

#### 1.2.1. Google Cloud Platform

Google Cloud Services is available in many regions around the world and is continuously expanding. In each region, there are 3 clusters and within each clusters, there are zones. Therefore, if any of the data center goes down, we are able to redirect the request to a nearby zone or cluster to ensure that our services keep running. To ensure that our server is as closed to home as possible, I have also set the region to be the one for Singapore. This can be seen in my code.

```js
exports.user = region("asia-southeast1").https.onRequest();
```

#### 1.3. RELIABILITY

To ensure that our system is reliable, I have created a Sandbox environment for me to trial and test. This sandbox environment is customizable through the environment variables which can be found throughout the whole application, such as:

```js
if (!connection.readyState) {
  connect(process.env.DB_URL, { dbName: process.env.DB_NAME });
}
```

This ensures that the staging and live database do not mix together when I develop and test on my side. Furthermore, Google Cloud Platform stores Image Artifacts about the previous versions of the APIs. Therefore, I am able to restore them quickly if I have broken something in the previous release.

#### 1.4. Calculations 

Estimated Number of Users = 100,000

**_ Transaction _**
Average Transaction Document Size = 0.22 kb

Estimated Number of Transactions a Day = 2000

Writes in 1 Day: 2000 X 0.22 kb = 440 kb

Writes in 1 Year = ~160.6 MB

**_ User _**

Average Item Size = 59 kb

Estimated number of new items a day = 1000

New Data Added a day: 1000 X 59 kb = 59 MB

New Data Added a year: ~ 21 GB

<img width="1960" alt="Untitled (1)" src="https://user-images.githubusercontent.com/88195289/180630195-32555797-a0fa-4fd0-a45c-b11d4cd30a6b.png">


## 2. SOFTWARE ENGINEERING PRINCIPLES <a name="SWE"></a>

### 2.1. DATABASE DESIGN

In Section 1.6, we mentioned that we will be using MongoDB as our main form of database. MongoDB is the top 5 database in the world, and it is the best NoSQL database available as of the date of writing. How MongoDB stores information is in the format known as BSON or Binary JavaScript Object Notation. Here is an image of how our Database ENTITY RELATIONSHIP DIAGRAM looks like.

![image](https://user-images.githubusercontent.com/88195289/180592520-23d6916f-6859-4aa4-9cbd-4a6ce1e0fa1f.png)

We use the **_ENTITY RELATIONSHIP DIAGRAM_** to highlight the relationships between each modal. For instance, we can tell from the ER Diagram that there is a one-to-many relationship between the user and the items as one person can have many items. Therefore, when we query for an item by their createdBy, we should expect a list of items to be returned. There are many more relationships present in this diagram but in view of the length of this README, I will not be mentioning all of them.

### 2.2. DATABASE SHARDING

Another reason why we use the MongoDB is due to its ease of carry out sharing. A database shard, or simply a shard, is a horizontal partition of data in a database or search engine. Each shard is held on a separate database server instance, to spread load. As seen in the code under 1.3, we are able to change the database name in the JavaScript Object with the value of dbName. We can create a different database for different countries if we were to expand into other countries. Therefore, MongoDB is scalable.

### 2.3. GITHUB VERSION CONTROL

I used GitHub as our application's main source of version control. However, I did not do feature branching because I do not see the need to. Unlike most groups, Marcus and I work separately on our own branches because we are in charge of different things. I am mainly in charge of server-side development while he is in-charge of the UIUX and Frontend development. Therefore, he will not understand my code and like-wise I do not understand his code. Nonetheless, we are following what is known as **_CONTINUOUS INTEGRATION_** which is the requirement for Artemis Team.

According to Martin Fowler, a famous SWE Blogger from Thoughtworks and where our mentor Viky came from, he mentions that "just because we run code after pushing to the main branch does not mean it is Continuous Integration". In fact, in Modern Software Engineering by David Farley, he posits that "Continuous Integration and Feature Branching are not compatible with each other. Continuous Integration seeks to expose change as early as possible while Feature Branching seeks to delay the change." (David, 2022) Therefore, as part of the requirement of Orbital, I did not do feature branching and did Continuous Integration instead.

### 2.4. TESTING

Testing is an important part of a SWE journey. It ensures that our code coverage and quality is good. According to Google, 60% code coverage is considered acceptable, 75% is considered commendable and 90% is considered exemplary. However, we should not be obsessed with getting code coverage from 90% to 95%, but rather we should take concrete steps on increasing our code coverage from 30% to 70%. Based on the recommendations of Viky, since this is just a small project, I am using 90% as a benchmark meaning that any change to the code will have a high chance of failing any tests. Furthermore, we will be adopting the Test Pyramid that is recommdend by Viky and Martin Fowler, focusing mainly on the Unit Tests and Integration Tests rather than the Manual Tests.

### 2.5. TEST DRIVEN DEVELOPMENT

Initially, I thought that TDD was difficult because I am not confident with writing test codes. However, for this milestone itself, I have adopted and tweaked TDD and I was seriously blown away by the results. Not only does TDD help me catch all the bugs before I deploy it, it has improved the quality of my code. I am grateful to my mentor Viky for promoting this approach and which had led to a significant improvement from where I am after the 2nd milestone. I am not confident enough to fully write TDD, so I tweaked it to suit me. Nonetheless, it still follows the **_RED, GREEN, REFACTOR_** principles of TDD.

- RED: Write test codes and watch it fail.
- GREEN: Write sufficient code for it to pass.
- REFACTOR: Improve the current code.

How I adopted TDD is as follows:

1. Think of ways that the backend code will fail. I used the **_BOUNDARY VALUE ANALYSIS_** approach for this.
2. Write the test code and watch it fail.

```js
test("POST_0001: If no headers is provided, return 401", async () => {
  const req = {};
  const { status } = await postUserHandler(req);
  expect(status).toBe(401);
});
```

3. Finally, just write the code that makes this test passes.

```js
if (!headers || !headers.uid) {
  return { status: 401, message: "No uid provided in the headers." };
}
```

4. Repeat the process until I have finished writing the code.

#### 2.5.1. HOW IT HELPED ME

1. Marcus told me that the /home API logic did not work. At first, I thought it was the code issue so I went to have a look at the test and realised that everything is working fine. I went to perform manual testing and I realised that it was a bug in another endpoint. I am able to pinpoint the errors quickly with the correct tests.

2. I am able to catch errors quickly. Previously, I would manually deploy. If the manual test fails, I will spend hours trying to debug it. After I have carried out TDD, the code does not have any more of these problems.

3. I managed to catch bugs that I did not catch before. Previously, I would just destructure uid from the headers like below without considering whether headers itself is null. As a result, this might lead to unexpected errors. However, with TDD, I am able to catch these errors early.

```js
// If headers is null, then this will throw a 500 error.
const { uid } = headers;
```

#### 2.5.2. INTEGRATION TESTING

Detractors of my argument might posit that we follow the test pyramid and carry out 70% unit tests, 20% integration tests and 10% of manual tests. However, I did a combination of both for the backend. For the validation of input such as whether the header or body is present, I did mainly unit tests. However, when the database logic is involved, I will use integration tests immediately.

One thing that I really enjoy about MongoDB is that there is a package called MongoDB-Memory-Server available for us to perform Integration Testing with. MongoDB-Memory-Server will spin up a local db uri which can be used to mimic a real database and I am able to perform CRUD operations just as it would be in the production environment. After each test, I will clear up all of the database data before moving on to the next test. Finally, after all the tests are completed, I can completely drop the database. The database code can be found here. To run tests, you can run the following command:

```bash
$ npm run test
```

#### 2.5.3. UNIT TESTING

The difference between Unit Testing and Integration Testing is that we do not involve any npm package libraries inside. This means that we will be doing mocks, spies and stubbing. The only 2 times that I did unit testings are as follows:

1. Checking whether the correct status code is returned after the database action fails. The process is actually very simple. I just spyOn the User mongoose model and make it fail.

```js
// To fail the Item.findOne() in the code
vi.spyOn(User, "findOne").mockRejectValueOnce({});
const req = { headers: { uid: "123456" } };
const { status } = await postUserHandler(req);
expect(status).toBe(500);
```

2. The second time that I did Unit Testing was to determine whether the state is consistent if the database action fails and the transaction is aborted. As the code is longer, you might have to go to the test directory to take a look at it yourself.

#### 2.5.4. TEST STATISTICS

| Test Cases (To Date) | Code Coverage |                                                                        Code Quality Badge                                                                         |
| :------------------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|          85          |      94%      | [![codecov](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend/branch/main/graph/badge.svg?token=kM9iPdOLlW)](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend) |

### 2.6. SINGLE RESPONSIBILITY PRINCIPLE

This principle was highly recommended by my advisor and I am really surprised by how simple this principle is and the software principles involved in it. **_SINGLE RESPONSIBILITY PRINCIPLE_** states that every software component should have one and only one responsibility or one reason to change. This principle actually brings in another 2 principles of SWE which are **_COUPLING_**, **_COHESION_** and **_MODULARITY_**.

For my code, there is not really a lot of cohesion involved but I have broken down my code into smaller modules (or rather modularise it) so that they are loosely coupled and there is only one reason to change. I have separated out the DB Logic into another function so that there is only one reason to change -- If the database that I am using changes.

### 2.7. REST API

We have adopted the conventional **_REPRESENTATIONAL STATE TRANSFER (REST)_** API for our project. This is evident from my folders and the following documentation, where I have adopted the conventional request methods such as GET, PUT, POST and DELETE. I did not adopt **_REMOTE PROCEDURE CALLS (RPC)_** as REST is more suitable for handling large quantity of data.

## SECTION 3: CONTINUOUS INTEGRATION AND CONTINUOUS DEVELOPMENT <a name="CICD"></a>

As mentioned under Section 2.3, I carried out Continuous Integration by commiting to the main branch for my work. This allows the backend to be exposed to changes as early as possible, instead of isolating changes. Of course, many people might feel that I should not do so, but I am the only one working on the Backend, so why not do that?

If you are looking for the CI code that is being executed, you can see it under .github/workflows directory. Everytime I push the commit to the main directory, I will run tests and send the test coverage to codecov, a 3rd party tool that is used to measure the code quality. Concurrently, I will attempt to deploy the code to the cloud. If any of these 2 GitHub actions fail, I will investigate the cause and try to remedy it.

## SOURCES:

1. Modern Software Engineering, David Farley

2. Udemy Google Cloud Architecture Course

3. GitHub System Design Primer Repo

4. Harvard CS75 Lecture 9: Scalability

5. Educative.io: System Design Course
