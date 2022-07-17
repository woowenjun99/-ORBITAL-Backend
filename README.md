[![codecov](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend/branch/main/graph/badge.svg?token=kM9iPdOLlW)](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend)

# ORBITAL 2022 BACKEND README

| Estimated Reading Time | Word Count |
| :--------------------: | :--------: |
|    9 min 50 seconds    | 1969 words |

At the point of writing this README, it would have been the 3rd milestone and you would have noticed that I make changes to my README multiple times. Needless to say, this is because I have picked up new knowledge along the way. Unlike many groups in Orbital,
I do not learn new technology because technology can be easily learnt. As of date, I am able to do cron jobs, VueJS, Flutter Development, ExpressJS. I can also understand a bit of ReactJS code. However, the reason why I have not done any personal projects as of date is because I am busy. I work tirelessly for 7 days a week with the following commitments:

1. From Monday to Friday, I have internship which uses Vue2, Express and MongoDB.
2. I have a side job in another start up.
3. I have a NUS CCA which had already started work.

Therefore, I have just taken this opportunity during Orbital to mix and match the skills that I have picked up and read up on System Design, Testings and CI/CD and incorporate it into this project.

## 0. Introduction

To whoever is reading my GitHub repository, I happily welcome you here. My name is Wen Jun and I am the Backend Engineer for the application of the application Neigh. The following README will be broken down into the following sections:

1. System Design
2. Software Engineering Principles
3. Continuous Integration and Continuous Development.

## 1. System Design

For our app, we will be using the 5 parameters to design our application. There is no-one-size-fits-all solution for designing a system, so there might be better alternatives. However, we will be justifying the use of the technology in this README based on the 5 parameters, as well as discussing the pros and cons.

1. Scalability
2. Availability
3. Reliability
4. Maintainability
5. Fault-Tolerant

### 1.1 SCALABILITY

**Scalability** refers to the ability of our app to retain its performance when the workload increases. There are many ways that workload can increase, and these includes:

1. Increase in client requests to the server
2. Increase in the information being stored in the database.

#### 1.1.1. INTRODUCTION TO CLOUD COMPUTING

Google Cloud Services are **_PAAS (Platform as a Service)_** while server architecture are **_IAAS (Infrastructure as a Service)_**. Before the era of Cloud Computing, there is only server infrastructure. This means that there are physical data centers with servers that manages the client's request. However, there are several problems with using a Server Architecture.

- Supposed that we acquire an infrastructure and our application suddenly becomes popular. The load on the backend will spike. If the current infrastructure is unable to handle the sudden increase, we would need to acquire more infrastructure. This is known as **_PEAK LOAD PROVISIONING_**. It might be problematic if we are unable to acquire the infrastructure.

- Great! So we just acquire more infrastructure in advance. However, on some days like the weekdays, the number of people using our application might not be that much. What happens to the infrastructure right now? These servers are just left around idling when no one is using them, wasting both resources and money.

With the rise in Cloud Computing, we would only need to pay for what we use, which is much cheaper and affordable. We have adopted a server-less architecture because it is scalable and easy to use.

#### 1.1.2. WHY GCP AND NOT AWS OR MICROSOFT AZURE?

- I have experience in GCP Cloud Functions from my side job.

- Google is powering their services with GCP itself. If millions of users can use Google Services like www.google.com without any issue, why should we doubt Google Services?

#### 1.1.3. TYPES OF SCALABILITY

- **_VERTICAL SCALING_** -- Having one or a few computers or servers to manage the load of the users. We can scale up by upgrading the CPU or RAMs but there is a limit to which we can upgrade.

- **_HORIZONTAL SCALING_** -- Having many computers or servers to manage the load of the users. These computers do not necessarily need to be as good as the computers used in VERTICAL SCALING.

#### 1.1.4. HOW HORIZONTAL SCALING WORKS

Supposed that we have many clients and a pool of servers. How do we distribute the workload such that it is even? If we have many servers, how do we keep track of their IP addresses? The solution to this would be to have a middleman who has a public IP address and able to distribute the workload. This middleman is known as a **_LOAD BALANCER_**. One of the ways that the load balancer can distribute the workload is through a method called **_ROUND ROBIN_** via BIND. This means that it will first pass the work to server 1, then server 2 and so on until it finishes allocating to all the servers. Following which, it will go back and allocate the work to server 1 again. There are several limitations to ROUND ROBIN:

- There might be an uneven distribution amount of work. For instance, some servers will encounter power heavy users while some servers will encounter less power heavy users. Therefore, the load is technically not that evenly distributed.

- Sessions might not work since we are constantly jumping from server to server.

#### 1.1.5. DRAWBACKS WITH SERVER-LESS ARCHITECTURE

Scalability and performance are inversely related. Therefore, it is important for us to balance between both the scalability and performance.

#### 1.1.6. DATABASE

In terms of Scalability, NoSQL databases are more scalable as compared to their SQL counterparts. Therefore, we will be adopting a NoSQL for our project.

### 1.2. AVAILABILITY

Another parameter that we look out for when designing our system is the availability. Supposed that we set our region to be in US and our users are based in Singapore, the speed of the server response will significantly decrease. What happens if the data center in Singapore goes down? We need to plan all of these beforehand.

#### 1.2.1. Google Cloud Platform

Google Cloud Services is available in many regions around the world and is continuously expanding. In each region, there are 3 clusters (correct me if I am wrong) and within each clusters, there are zones. Therefore, if any of the data center goes down, we are able to redirect the request to a nearby zone or cluster to ensure that our services keep running. To ensure that our server is as closed to home as possible, I have also set the region to be the one for Singapore. This can be seen in my code.

```js
exports.user = region("asia-southeast1").https.onRequest();
```

### 1.6. Conclusion

| Question # |           Question to ask           |                      Solution                       |
| :--------: | :---------------------------------: | :-------------------------------------------------: |
|     1      |     How many users do we have?      |                       100,000                       |
|     2      | What if one of the servers crashed? | GCP can redirect the request to another zone for us |

## 2. SOFTWARE ENGINEERING PRINCIPLES

### 2.1. GITHUB VERSION CONTROL

Similar to most groups, we used GitHub as our application's main source of version control. However, I did not do feature branching because I do not see the need to. Unlike most groups, Marcus and I work separately on our own branches because we are in charge of different things. I am mainly in charge of server-side development while he is in-charge of the UIUX and Frontend development. Therefore, he will not understand my code and like-wise I do not understand his code. Nonetheless, we are following what is known as **_CONTINUOUS INTEGRATION_** which is the requirement for Artemis Team.

According to Martin Fowler, a famous SWE Blogger from Thoughtworks and where our Advisor Viky came from, he mentions that "just because we run code after pushing to the main branch does not mean it is Continuous Integration". In fact, in Modern Software Engineering by David Farley, he posits that "Continuous Integration and Feature Branching are not compatible with each other. Continuous Integration seeks to expose change as early as possible while Feature Branching seeks to delay the change." (David, 2022) Therefore, as part of the requirement of Orbital, I did not do feature branching and did Continuous Integration instead.

### 2.2. TEST DRIVEN DEVELOPMENT

Initially, I that TDD was difficult because I am not confident with writing code. However, for this milestone itself, I have adopted and tweaked TDD and I was seriously blown away by the results. Not only does TDD help me catch all the bugs before I deploy it, it has improved the quality of my code. I am grateful to my advisor Viky for promoting this approach and which had led to a significant improvement from where I am after the 2nd milestone. I am not confident enough to fully write TDD, so I tweaked it to suit me. Nonetheless, it still follows the **_RED, GREEN, REFACTOR_** principles of TDD.

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

#### 2.2.1. HOW IT HELPED ME

1. Marcus told me that the /home API logic did not work. At first, I thought it was the code issue so I went to have a look at the test and realised that everything is working fine. I went to perform manual testing and I realised that it was a bug in another endpoint. I am able to pinpoint the errors quickly with the correct tests.

2. I am able to catch errors quickly. Previously, I would manually deploy. If the manual test fails, I will spend hours trying to debug it. After I have carried out TDD, the code does not have any more of these problems.

3. I managed to catch bugs that I did not catch before. Previously, I would just destructure uid from the headers like below without considering whether headers itself is null. As a result, this might lead to unexpected errors. However, with TDD, I am able to catch these errors early.

```js
// If headers is null, then this will throw a 500 error.
const { uid } = headers;
```

### 2.2.2. INTEGRATION TESTING

Detractors of my argument might posit that we follow the test pyramid and carry out 70% unit tests, 20% integration tests and 10% of manual tests. However, I did a combination of both for the backend. For the validation of input such as whether the header or body is present, I did mainly unit tests. However, when the database logic is involved, I will use integration tests immediately.

One thing that I really enjoy about MongoDB is that there is a package called MongoDB-Memory-Server available for us to perform Integration Testing with. MongoDB-Memory-Server will spin up a local db uri which can be used to mimic a real database and I am able to perform CRUD operations just as it would be in the production environment. After each test, I will clear up all of the database data before moving on to the next test. Finally, after all the tests are completed, I can completely drop the database. The database code can be found here. To run tests, you can run the following command:

```bash
$ npm run test
```

### 2.2.3. UNIT TESTING

The difference between Unit Testing and Integration Testing is that we do not involve any npm package libraries inside. This means that we will be doing mocks, spies and stubbing. The only 2 times that I did unit testings are as follows:

1. Checking whether the correct status code is returned after the database action fails. The process is actually very simple:

```js
// To fail the Item.findOne() in the code
vi.spyOn(User, "findOne").mockRejectValueOnce({});
const req = { headers: { uid: "123456" } };
const { status } = await postUserHandler(req);
expect(status).toBe(500);
```

2. The second time that I did Unit Testing was to determine whether the state is consistent if the database action fails and the transaction is aborted. As the code is longer, you might have to go to the test directory to take a look at it yourself.

### 2.2.4. TEST STATISTICS

| Test Cases (To Date) | Code Coverage |
| :------------------: | :-----------: |
|          86          |      94%      |

## SOURCES:

1. Modern Software Engineering, David Farley

2. Udemy Google Cloud Architecture Course

3. GitHub System Design Primer Repo

4. Harvard CS75 Lecture 9: Scalability

5. Educative.io: System Design Course
