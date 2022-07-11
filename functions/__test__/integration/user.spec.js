import { describe, expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { connectDatabase, clearDatabase, closeDatabase } from "../db";
import { getUserRequest, putUserRequest, User, Item } from "../../API/user";

describe("GET Request", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("USER_GET_0001: If request.headers is not provided, return 400.", async () => {
    const req = { method: "GET" };
    const { status, message } = await getUserRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a uid.");
  });

  test("USER_GET_0002: If request.headers does not have uid, return 400.", async () => {
    const req = { method: "GET", headers: {} };
    const { status, message } = await getUserRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a uid.");
  });

  test("USER_GET_0003: If no user is found, return 404", async () => {
    const req = { method: "GET", query: { uid: "123456" } };
    const { status, message } = await getUserRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No user found.");
  });

  test("USER_GET_0004: If the user is found, return 200", async () => {
    const user = new User({ uid: "123456" });
    await user.save();
    const req = { method: "GET", query: { uid: "123456" } };
    const { status, message } = await getUserRequest(req);
    expect(status).toBe(200);
    expect(typeof message).toBe("object");
    expect(message.items).toStrictEqual([]);
  });

  test("USER_GET_0005: If the user is found, return 200", async () => {
    const user = new User({ uid: "123456" });
    const item = new Item({ createdBy: "123456" });
    await item.save();
    await user.save();
    const req = { method: "GET", query: { uid: "123456" } };
    const { status, message } = await getUserRequest(req);
    expect(status).toBe(200);
    expect(message.items.length).toBe(1);
  });
});

describe("PUT_REQUEST", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("USER_PUT_0001: If req.headers is not provided, return 400", async () => {
    const req = { method: "PUT" };
    const { status, message } = await putUserRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a uid.");
  });

  test("USER_PUT_0002: If req.headers does not have uid, return 400", async () => {
    const req = { method: "PUT", headers: {} };
    const { status, message } = await putUserRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a uid.");
  });

  test("USER_PUT_0003: If FE does not pass in a body, return 400", async () => {
    const req = { method: "PUT", headers: { uid: "123456" } };
    const { status, message } = await putUserRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please pass in a field.");
  });

  test("USER_PUT_0004: If user does not exist, we create a new user and return 201", async () => {
    const req = { method: "PUT", headers: { uid: "123456" }, body: {} };
    const { status, message } = await putUserRequest(req);
    expect(message.uid).toBe("123456");
    expect(status).toBe(201);
    const foundUser = await User.findOne({ uid: "123456" });
    expect(foundUser).toBeDefined();
  });

  test("USER_PUT_0005: If user already exists, we modify the user and return 201", async () => {
    const userBefore = new User({
      name: "John",
      uid: "123456",
    });
    await userBefore.save();
    const foundUserBefore = await User.findOne({ uid: "123456" });
    expect(foundUserBefore).toBeDefined();

    const req = {
      method: "PUT",
      headers: { uid: "123456" },
      body: { name: "Sammy" },
    };
    const { status } = await putUserRequest(req);
    expect(status).toBe(201);
    const foundUserAfter = await User.findOne({ uid: "123456" });
    expect(foundUserAfter.name).toBe("Sammy");
  });
});
