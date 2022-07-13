import {
  Item,
  deleteItemRequest,
  getItemRequest,
  postItemRequest,
  User,
  putItemRequest,
} from "../../API/item";
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
      status: "AVAILABLE",
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
    expect(status).toBe(200);
    expect(message).toStrictEqual([]);
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
    expect(status).toBe(200);
    expect(message).toStrictEqual([]);
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
    expect(status).toBe(200);
    expect(message).toStrictEqual([]);
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

  test("ITEM_GET_0017 (getUserItemBasedOnListing): If no uid is provided, return 400.", async () => {
    const req = {
      method: "GET",
      query: { type: "getListingsBasedOnStatus", status: "Hi" },
    };
    const { status, message } = await getItemRequest(req);
    expect(message).toBe("Please provide status and uid in query.");
  });

  test("ITEM_GET_0018 (getUserItemBasedOnListing): If no status is provided, return 400.", async () => {
    const req = {
      method: "GET",
      query: { type: "getListingsBasedOnStatus", uid: "123456" },
    };
    const { status, message } = await getItemRequest(req);
    expect(message).toBe("Please provide status and uid in query.");
  });

  test("ITEM_GET_0019 (getUserItemBasedOnListing): If no status is provided, return 400.", async () => {
    const req = {
      method: "GET",
      query: { type: "getListingsBasedOnStatus", uid: "123456" },
    };
    const { status, message } = await getItemRequest(req);
    expect(message).toBe("Please provide status and uid in query.");
  });
});

describe("POST REQUEST", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("ITEM_POST_0001: If no request headers is provided, return 401.", async () => {
    const req = { method: "POST" };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_POST_0002: If no firebase uid is provided, return 401.", async () => {
    const req = { method: "POST", headers: {} };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_POST_0003: If no body is provided, return 400.", async () => {
    const req = { method: "POST", headers: { uid: "123456789" } };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Please provide a body.");
  });

  test("ITEM_POST_0004: If the uid does not exist, return 404.", async () => {
    const req = { method: "POST", headers: { uid: "123456789" }, body: {} };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No user found. Unable to proceed with posting item.");
  });

  test("ITEM_POST_0005: If request body is found but no name is provided, return 400.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        description: "This is a mock item",
        typeOfTransaction: "RENT",
        deliveryInformation: "Send to home",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(
      "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
    );
  });

  test("ITEM_POST_0006: If request body is found but no description is provided, return 400.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        typeOfTransaction: "RENT",
        deliveryInformation: "Send to home",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(
      "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
    );
  });

  test("ITEM_POST_0007: If request body is found but no typeOfTransaction is provided, return 400.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        deliveryInformation: "Send to home",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(
      "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
    );
  });

  test("ITEM_POST_0008: If request body is found but no typeOfTransaction is provided, return 400.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        typeOfTransaction: "RENT",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(
      "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
    );
  });

  test("ITEM_POST_0009: If the typeOfTransaction is not RENT or SELL, return 400.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        typeOfTransaction: "Hi",
        deliveryInformation: "Send to home",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("Invalid type of transaction.");
  });

  test("ITEM_POST_0010: If the price is provided, save the item but set the price to 0.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        typeOfTransaction: "RENT",
        deliveryInformation: "Send to home",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(201);
    expect(message.price).toBe(0);
  });

  test("ITEM_POST_0011: If the price is provided, save the item with the price", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        typeOfTransaction: "RENT",
        deliveryInformation: "Send to home",
        price: "2.00",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(201);
    expect(message.price).toBe(2);
  });

  test("ITEM_POST_0012: If the typeOfTransaction is RENT, the duration of rent should be defined.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "RENT",
        typeOfTransaction: "RENT",
        deliveryInformation: "Send to home",
        price: "2.00",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(201);
    expect(message.price).toBe(2);
    expect(message.durationOfRent).toBe(604800);
  });

  test("ITEM_POST_0013: If the typeOfTransaction is SELL, the duration of rent should be undefined.", async () => {
    const user = new User({ uid: "123456789" });
    await user.save();
    const req = {
      method: "POST",
      headers: { uid: "123456789" },
      body: {
        name: "This is a mock item",
        description: "SELL",
        typeOfTransaction: "SELL",
        deliveryInformation: "Send to home",
        price: "2.00",
      },
    };
    const { status, message } = await postItemRequest(req);
    expect(status).toBe(201);
    expect(message.price).toBe(2);
    expect(message.durationOfRent).toBe(undefined);
  });
});

describe("PUT REQUEST", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test("ITEM_PUT_0001: If no request.headers is provided, return 401.", async () => {
    const req = { method: "PUT" };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_PUT_0002: If uid is not provided, return 401.", async () => {
    const req = { method: "PUT", headers: {} };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(401);
    expect(message).toBe("No Firebase UID provided.");
  });

  test("ITEM_PUT_0003: If no req.body is provided, return 400.", async () => {
    const req = { method: "PUT", headers: { uid: "123456" } };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item_id provided");
  });

  test("ITEM_PUT_0004: If req.body does not contain item_id, return 400.", async () => {
    const req = { method: "PUT", headers: { uid: "123456" }, body: {} };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("No item_id provided");
  });

  test("ITEM_PUT_0005: If no user exists, return 404.", async () => {
    const req = {
      method: "PUT",
      headers: { uid: "123456" },
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
    };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No user found. Unable to proceed with update item.");
  });

  test("ITEM_PUT_0006: If no item is found, return 404", async () => {
    const user = new User({ uid: "123456" });
    await user.save();
    const req = {
      method: "PUT",
      headers: { uid: "123456" },
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
    };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(404);
    expect(message).toBe("No item found.");
  });

  test("ITEM_PUT_0007: If an item is found but the createdBy is not the user, return 400", async () => {
    const user = new User({ uid: "123456" });
    const item = new Item({ createdBy: "654321", _id: "62b7d1b7dd67e5f67cab0145" });
    await user.save();
    await item.save();
    const req = {
      method: "PUT",
      headers: { uid: "123456" },
      body: { item_id: "62b7d1b7dd67e5f67cab0145" },
    };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("You do not have permission to edit this item.");
  });

  test("ITEM_PUT_0008: If the change is successful, return 201", async () => {
    const user = new User({ uid: "123456" });
    const item = new Item({
      createdBy: "123456",
      _id: "62b7d1b7dd67e5f67cab0145",
      name: "Mock 1",
    });
    await user.save();
    await item.save();
    const req = {
      method: "PUT",
      headers: { uid: "123456" },
      body: { item_id: "62b7d1b7dd67e5f67cab0145", name: "Mock 2" },
    };
    const { status, message } = await putItemRequest(req);
    expect(status).toBe(201);
    expect(message.name).toBe("Mock 2");
  });
});
