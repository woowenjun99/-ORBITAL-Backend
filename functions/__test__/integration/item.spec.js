import { Item, deleteItemRequest, getItemRequest } from "../../API/item";
import { connectDatabase, clearDatabase, closeDatabase } from "../db";
import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";

describe("DELETE Request", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("ITEM_DELETE_0001: If no header is provided, return a 401 error", async () => {
    const req = { method: "DELETE", body: { item_id: "Test Item 1" } };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_DELETE_0002: If the headers does not have the uid tag, return a 401 error", async () => {
    const req = { method: "DELETE", body: { item_id: "Test Item 1" }, headers: {} };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_DELETE_0003: If there is no req.body, return a 400 error.", async () => {
    const req = {
      method: "DELETE",
      headers: { uid: "123456789" },
    };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item_id is provided in the body");
  });

  test("ITEM_DELETE_0004: If the req.body does not have item_id, return a 400 error", async () => {
    const req = { method: "DELETE", body: {}, headers: { uid: "123456789" } };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item_id is provided in the body");
  });

  test("ITEM_DELETE_0005: If the item does not exist, return a 404 error", async () => {
    const req = {
      method: "DELETE",
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
      headers: { uid: "123456789" },
    };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No matching item found");
  });

  test("ITEM_DELETE_0006: If the item does not belong to the user, return a 404 error", async () => {
    const item = new Item({
      _id: "62b7d1b7dd67e5f67cab0145",
      createdBy: "987654321",
      status: "available",
    });

    await item.save();
    const req = {
      method: "DELETE",
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
      headers: { uid: "123456789" },
    };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No matching item found");
  });

  test("ITEM_DELETE_0007: If the item is not available, return a 404 error", async () => {
    const item = new Item({
      _id: "62b7d1b7dd67e5f67cab0145",
      createdBy: "123456789",
      status: "sold",
    });

    await item.save();
    const req = {
      method: "DELETE",
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
      headers: { uid: "123456789" },
    };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No matching item found");
  });

  test("ITEM_DELETE_0008: Only delete the item if uid matches the createdBy, status is available and it can be found", async () => {
    const item = new Item({
      _id: "62b7d1b7dd67e5f67cab0145",
      createdBy: "123456789",
      status: "available",
    });

    await item.save();
    const req = {
      method: "DELETE",
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
      headers: { uid: "123456789" },
    };
    const { status, message } = await deleteItemRequest(req);
    expect(status).toBe(200);
    expect(typeof message).toBe("object");
  });
});

describe("GET Request", async () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("ITEM_GET_0001: If no query is provided, return a 400 error.", async () => {
    const req = { method: "GET" };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("I don't know what you want me to do.");
  });

  test("ITEM_GET_0002: If the request query does not contain a type, return a 400 error.", async () => {
    const req = { method: "GET", query: {} };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("I don't know what you want me to do.");
  });

  test("ITEM_GET_0003: If the request query type is unknown, return a 400 error.", async () => {
    const req = { method: "GET", query: { type: "Hi" } };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No such type.");
  });

  test("ITEM_GET_0004: Type (getItemById) -- If no id is provided in the query, return 400", async () => {
    const req = { method: "GET", query: { type: "getItemById" } };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item id provided.");
  });

  test("ITEM_GET_0005 (getItemById): If no id is provided in the query, return 400", async () => {
    const req = { method: "GET", query: { type: "getItemById" } };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item id provided.");
  });

  test("ITEM_GET_0006 (getItemById): If id is provided but no item is found, return 404", async () => {
    const req = {
      method: "GET",
      query: { type: "getItemById", id: "62b7d1b7dd67e5f67cab0145" },
    };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No item found.");
  });

  test("ITEM_GET_0007 (getItemById): If the item is found, return 200", async () => {
    const item = new Item({ _id: "62b7d1b7dd67e5f67cab0145" });
    await item.save();
    const req = {
      method: "GET",
      query: { type: "getItemById", id: "62b7d1b7dd67e5f67cab0145" },
    };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(200);
    expect(typeof message).toBe("object");
  });

  test("ITEM_GET_0008 (filterAndSearch): If no search and tags are provided, return status 400.", async () => {
    const req = {
      method: "GET",
      query: { type: "filterAndSearch" },
    };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a search query or tags.");
  });

  test("ITEM_GET_0009 (filterAndSearch): If the search does not match any object, return an empty array", async () => {
    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: "Test" },
    };
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No items found.");
  });

  test("ITEM_GET_0010 (filterAndSearch): If the search matches an object, return an array with the object.", async () => {
    const item = new Item({
      name: "Test",
      status: "available",
      typeOfTransaction: "Rent",
      createdBy: "456",
      currentOwner: "456",
    });

    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: "Test" },
    };

    await item.save();
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(200);
    expect(message.length).toBe(1);
  });

  test("ITEM_GET_0011 (filterAndSearch): If the search matches any object but the tags does not, return 404", async () => {
    const item = new Item({
      name: "Test",
      status: "available",
      typeOfTransaction: "Rent",
      createdBy: "456",
      currentOwner: "456",
      tags: ["1"],
    });

    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: "Test", tags: ["2"] },
    };

    await item.save();
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No items found.");
  });

  test("ITEM_GET_0012 (filterAndSearch): If the search matches any object but there is an additional tag, return 404", async () => {
    const item = new Item({
      name: "Test",
      status: "available",
      typeOfTransaction: "Rent",
      createdBy: "456",
      currentOwner: "456",
      tags: ["1"],
    });

    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: "Test", tags: ["1", "2"] },
    };

    await item.save();
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No items found.");
  });

  test("ITEM_GET_0013 (filterAndSearch): If the search matches any object but there is one less tag, return 200", async () => {
    const item = new Item({
      name: "Test",
      status: "available",
      typeOfTransaction: "Rent",
      createdBy: "456",
      currentOwner: "456",
      tags: ["1", "2"],
    });

    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: "Test", tags: ["1"] },
    };

    await item.save();
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(200);
    expect(message.length).toBe(1);
  });

  test("ITEM_GET_0014 (filterAndSearch): If the search is not provided but the tag is, return 200 if item is found", async () => {
    const item = new Item({
      name: "Test",
      status: "available",
      typeOfTransaction: "Rent",
      createdBy: "456",
      currentOwner: "456",
      tags: ["1", "2"],
    });

    const req = {
      method: "GET",
      query: { type: "filterAndSearch", tags: "1" },
    };

    await item.save();
    const { status, message } = await getItemRequest(req);
    expect(status).toBe(200);
    expect(message.length).toBe(1);
  });

  test("ITEM_GET_0015 (filterAndSearch): If multiple search queries are provided, return 400", async () => {
    const req = {
      method: "GET",
      query: { type: "filterAndSearch", search: ["1", "2"] },
    };

    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please do not provide multiple search queries");
  });

  test("ITEM_GET_0016 (filterAndSearch): If multiple types are provided, return 400", async () => {
    const req = {
      method: "GET",
      query: { type: ["filterAndSearch", "getItemById"] },
    };

    const { status, message } = await getItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("DO NOT PROVIDE MULTIPLE TYPES.");
  });
});
