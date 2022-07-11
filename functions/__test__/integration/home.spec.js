import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { connectDatabase, closeDatabase } from "../db";
import { getHomeRequest, Item } from "../../API/home";

describe("GET REQUEST", async () => {
  beforeAll(async () => {
    await connectDatabase();
    const item1 = new Item({ createdBy: "123456", name: "item1" });
    const item2 = new Item({ createdBy: "654321", name: "item2" });
    await item1.save();
    await item2.save();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test("HOME_GET_0001: If no headers is provider, return all of the items in the database.", async () => {
    const req = {};
    const { status, message } = await getHomeRequest(req);
    expect(status).toBe(200);
    expect(Array.isArray(message)).toBe(true);
    expect(message.length).toBe(2);
  });

  test("HOME_GET_0002: If the headers with uid is provided, only return the item that does not belong to the user.", async () => {
    const req = { headers: { uid: "123456" } };
    const { status, message } = await getHomeRequest(req);
    expect(status).toBe(200);
    expect(Array.isArray(message)).toBe(true);
    expect(message.length).toBe(1);
    expect(message[0].name).toBe("item2");
  });
});
