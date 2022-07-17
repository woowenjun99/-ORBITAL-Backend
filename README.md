[![codecov](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend/branch/main/graph/badge.svg?token=kM9iPdOLlW)](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend)

# ORBITAL 2022 BACKEND README

| Estimated Reading Time | Word Count |
| :--------------------: | :--------: |
|    7 min 25 seconds    | 1289 words |

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

### 1.1 Scalability

**Scalability** refers to the ability of our app to retain its performance when the workload increases. There are many ways that workload can increase, and these includes:

1. Increase in client requests to the server
2. Increase in the information being stored in the database.

### 1.2. Introduction to Cloud Computing

Google Cloud Services are **_PAAS (Platform as a Service)_** while server architecture are **_IAAS (Infrastructure as a Service)_**. Before the era of Cloud Computing, there is only server infrastructure. This means that there are physical data centers with servers that manages the client's request. However, there are several problems with using a Server Architecture.

- Supposed that we acquire an infrastructure and our application suddenly becomes popular. The load on the backend will spike. If the current infrastructure is unable to handle the sudden increase, we would need to acquire more infrastructure. This is known as **_PEAK LOAD PROVISIONING_**. It might be problematic if we are unable to acquire the infrastructure.

- Great! So we just acquire more infrastructure in advance. However, on some days like the weekdays, the number of people using our application might not be that much. What happens to the infrastructure right now? These servers are just left around idling when no one is using them, wasting both resources and money.

With the rise in Cloud Computing, we would only need to pay for what we use, which is much cheaper and affordable. We have adopted a server-less architecture because it is scalable and easy to use.

### 1.3. WHY GCP AND NOT AWS OR MICROSOFT AZURE?

- I have experience in GCP Cloud Functions from my side job.

- Google is powering their services with GCP itself. If millions of users can use Google Services like www.google.com without any issue, why should we doubt Google Services?

### 1.4. Types of Scalability

- **_VERTICAL SCALING_** -- Having one or a few computers or servers to manage the load of the users. We can scale up by upgrading the CPU or RAMs but there is a limit to which we can upgrade.

- **_HORIZONTAL SCALING_** -- Having many computers or servers to manage the load of the users. These computers do not necessarily need to be as good as the computers used in VERTICAL SCALING.

### 1.5. How horizontal scaling works

Supposed that we have many clients and a pool of servers. How do we distribute the workload such that it is even? If we have many servers, how do we keep track of their IP addresses? The solution to this would be to have a middleman who has a public IP address and able to distribute the workload. This middleman is known as a **_LOAD BALANCER_**. One of the ways that the load balancer can distribute the workload is through a method called **_ROUND ROBIN_** via BIND. This means that it will first pass the work to server 1, then server 2 and so on until it finishes allocating to all the servers. Following which, it will go back and allocate the work to server 1 again. There are several limitations to ROUND ROBIN:

- There might be an uneven distribution amount of work. For instance, some servers will encounter power heavy users while some servers will encounter less power heavy users. Therefore, the load is technically not that evenly distributed.

- Sessions might not work since we are constantly jumping from server to server.

### 1.1.4. Issue with server-less architecture

Scalability and performance are inversely related. Therefore, it is important for us to balance between both the scalability and performance.

### 1.6. Conclusion

| Question # |      Question to ask       | Solution |
| :--------: | :------------------------: | :------: |
|     1      | How many users do we have? | 100,000  |

## 2. Software Engineering Principles

### 2.1. GitHub Version Control

Similar to most groups, we used GitHub as our application's main source of version control. However, I did not do feature branching because I do not see the need to. Unlike most groups, Marcus and I work separately on our own branches because we are in charge of different things. I am mainly in charge of server-side development while he is in-charge of the UIUX and Frontend development. Therefore, he will not understand my code and like-wise I do not understand his code. Nonetheless, we are following what is known as **_CONTINUOUS INTEGRATION_** which is the requirement for Artemis Team.

According to Martin Fowler, just because we run code after pushing to the main branch does not mean it is Continuous Integration. In fact, in Modern Software Engineering by David Farley, he posits that "Continuous Integration and Feature Branching are not compatible with each other. Continuous Integration seeks to expose change as early as possible while Feature Branching seeks to delay the change. (Martin, 2022)"

### 2.2. Test Driven Development

| Test Cases (To Date) |
| :------------------: |
|          86          |

I have adopted **_TEST DRIVEN DEVELOPMENT_** and I really love it! Essentially, it allows me to catch all the possible bugs that I have in my code before and improve the quality of my code. Under the functions/test directory, you can see the test code that I have written for the project.

I have modified TDD to my purposes because I am not very confident with completely using the TDD Approach of **_RED GREEN REFACTOR_**.

1. RED -- Write test code and watch it fail
2. GREEN -- Write enough code for the test to pass
3. REFACTOR -- Improve the current code

My approach for Test Driven Development is as follows:

1. Think of the ways that the code will fail using the **_BOUNDARY VALUE ANALYSIS_** approach.
2. Write code such that it will fail. For instance, I expect to have the uid parameter in the request headers. Therefore, I will write code that fails and stop.

```js
if (!headers || !headers.uid) {
  return { status: 404, message: "No uid provided in the headers." };
}
```

Before I adopt this approach, I would have just extracted the uid through `const {uid} = headers`. However, there is also a possibility that the headers is null too, which will make the Server fail. However, after I have adopted this approach, I realised my mistake and make changes to it. After I have watched the test code passes, I will proceed with the next line.

### 2.2.1. INTEGRATION TESTING

One thing that I really enjoy about MongoDB is that there is a package called MongoDB-Memory-Server available for us to perform Integration Testing with. MongoDB-Memory-Server will spin up a local db uri which can be used to mimic a real database and I am able to perform CRUD operations just as it would be in the production environment. After each test, I will clear up all of the database data before moving on to the next test. Finally, after all the tests are completed, I can completely drop the database. The database code can be found here.

> functions/**test**/db.js

### 2.2.2. UNIT TESTING

The only time that I did unit testing is when I will use the spyOn method of Vitest to make the database actions fail solely to see whether I get back status 500. A snippet of the unit test is as follows.

```js
// To fail the Item.findOne() in the code
vi.spyOn(Item, "findOne").mockRejectValueOnce({});
```

### 2.2.3. COMBINATION AND PROOF OF USE

Through the use of TDD, Unit Testing and Integration Testing, I have managed to significantly improve the quality of my code. It has also saved me a lot of time finding bugs. For instance, there was a time when Marcus told me that the Home API did not work for him. The first thing that I did was to check whether the tests passes and it did so I knew that the problem wasn't with the code. In the end, I realised that it was a bug on another file code. The bug was located within 10 minutes.

### 3. CONTINUOUS INTEGRATION AND CONTINUOUS DEPLOYMENT

Continuous Integration allows us to receive feedback as early as possible. I have integrated Continuous Integration into GitHub Actions using

## References Used

1. https://miro.medium.com/max/992/0*xaIymdUxmx-aH4fk.png (SOURCE: GOOGLE IMAGE, used in Section 1.1.3.)
2. Modern Software Engineering, David Farley

## Resource References:

1. Harvard CS75 Scalability Lecture 2012: https://www.youtube.com/watch?v=-W9F__D3oY4&t=1916s

2.
