[![codecov](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend/branch/main/graph/badge.svg?token=kM9iPdOLlW)](https://codecov.io/gh/woowenjun99/-ORBITAL-Backend)

# ORBITAL 2022 BACKEND README

| Estimated Reading Time | Word Count |
| :--------------------: | :--------: |
|    4 min 18 seconds    | 861 words  |

## 0. Introduction

To whoever is reading my GitHub repository, be it whether you are an employer, a friend or anyone on the Internet, I happily welcome you here. My name is Wen Jun and I am the backend engineer of the application Neigh. The following README will be broken down into the following sections:

1. System Design
2. Software Engineering Principles
3. Continuous Integration and Continuous Development.

Without further ado, let's begin.

## 1. System Design

Some big companies like Google will test System Design concepts during their interviews. Therefore, it is important for us as Software Engineers and Software Architects to understand how to design a system for any uses. When we design a system, there are 5 characteristics that we have to pay attention to. The 5 characteristics are:

1. Scalability
2. Availability
3. Reliability
4. Maintainability
5. Fault-Tolerant

### 1.1 Scalability

**Scalability** refers to the ability of our app to retain its performance when the workload increases. There are many ways that workload can increase, and some of these ways include:

1. Increase in client requests to the server
2. Increase in the information being stored in the database.

#### 1.1.1. Introduction to Cloud Computing

Before the era of Cloud Computing, there is only server computing. This means that there are physical data centers with computers known as servers that manages the requests coming from the client side. However, there are several problems with this.

1. Take a shopping center as an example. On the weekends, there are many people visiting the mall, and this will lead to an increase in the workload of the servers. However, on the weekdays, the number of patrons are relatively fewer. These servers will just be left around idling when no one uses them, thus it is a waste of resources.

2. Suppose we have a start-up and it suddenly becomes popular. The workload of the start up will increase. This means that the current infrastructure will not be able to handle the sudden spike in workload and we need to acquire more infrastructure. What happens if we are unable to acquire the infrastructure?

In the past, we would have to carry out what is known as **PEAK LOAD PROVISIONING**, and this will usually require forward planning. However, there is also an issue aforementioned in 1 where the infrastructure is just left idling when the load is low. Fortunately, the solution to that would be to have a server-less architecture which is **AUTO-SCALING**.

#### 1.1.2. Types of Scalability

1. **VERTICAL SCALING** -- Having one or a few computers or servers to manage the load of the users. We can scale up by upgrading the CPU or RAMs but there is a limit to which we can upgrade.

2. **HORIZONTAL SCALING** -- Having many computers or servers to manage the load of the users. These computers do not necessarily need to be as good as the computers used in VERTICAL SCALING.

#### 1.1.3. How horizontal scaling works

We have a pool of clients and a pool of servers. Now, we need a middleman to distribute the workload to the servers. The middleman is known as a **LOAD BALANCER**.

![Load Balancer](https://miro.medium.com/max/992/0*xaIymdUxmx-aH4fk.png)

One way that the load balancer can distribute the workload is **ROUND ROBIN** via BIND. This means that it will first pass the work to server 1, then server 2 and so on until it finishes allocating to all the servers. Following which, it will go back and allocate the work to server 1 again. There are several limitations to ROUND ROBIN:

1. There might be an uneven distribution amount of work. For instance, some servers will encounter power heavy users while some servers will encounter less power heavy users. Therefore, the load is technically not that evenly distributed.

2. Sessions might not work since we are constantly jumping from server to server.

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

With this approach, I have written a total number of **86 tests** for now. I have combined Unit Testing and Integration Testing together with the help of MongoDB-Memory-Server which allows me to connect to a local db and storing the information inside a real DB. This local db code can be found under functions/test/db.js. This is the **INTEGRATION TESTING** aspect of the code.

For the **UNIT TESTING** aspect, I will use the spyOn to make the database actions fail and see whether I get back status 500. A snippet of the unit test is as follows.

```js
vi.spyOn(Item, "findOne").mockRejectValueOnce({})
```
Through the use of TDD, Unit Testing and Integration Testing, I have managed to significantly improve the quality of my code and it will work 95% of the time every time I deploy, saving me a lot of time.

## References Used

1. https://miro.medium.com/max/992/0*xaIymdUxmx-aH4fk.png (SOURCE: GOOGLE IMAGE, used in Section 1.1.3.)
2. Modern Software Engineering, David Farley

## Resource References:

1. Harvard CS75 Scalability Lecture 2012: https://www.youtube.com/watch?v=-W9F__D3oY4&t=1916s

2.
