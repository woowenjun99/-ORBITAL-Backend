import {
  describe,
  expect,
  vi,
  test,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { postTransactionRequest, Item } from "../../API/transaction";
import {
  INVALID_BODY,
  NO_ITEM_FOUND,
  NO_UID_IN_HEADER,
  POST,
  SELL,
  RENTED,
  RENT,
  SOLD,
} from "../../API/types";
import { connectDatabase, clearDatabase, closeDatabase } from "../db";

const uid = "123456";
const item_id = "62cd9bed402f1b79b13dd596";

describe("postTransactionRequest", () => {
  beforeAll(connectDatabase);
  afterAll(closeDatabase);
  afterEach(clearDatabase);

  test("POST_0001: If the headers is not provided, return 401.", async () => {
    const req = { method: POST };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(401);
    expect(message).toBe(NO_UID_IN_HEADER);
  });

  test("POST_0002: If the uid is not provided, return 401.", async () => {
    const req = { method: POST, headers: {} };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(401);
    expect(message).toBe(NO_UID_IN_HEADER);
  });

  test("POST_0003: If the body is not provided, return 400.", async () => {
    const req = { method: POST, headers: { uid } };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(INVALID_BODY);
  });

  test("POST_0004: If the body does not contain the item_id, return 400.", async () => {
    const req = { method: POST, headers: { uid }, body: {} };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(INVALID_BODY);
  });

  test("POST_0005: If the item does not exist, return 404.", async () => {
    const req = { method: POST, headers: { uid }, body: { item_id } };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(404);
    expect(message).toBe(NO_ITEM_FOUND);
  });

  test("POST_0006: If the function fails, return 500", async () => {
    const req = { method: POST, headers: { uid }, body: { item_id } };
    vi.spyOn(Item, "findById").mockRejectedValueOnce({ message: "Hi" });
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(500);
    expect(message).toBe("Hi");
  });

  test("POST_0007: If the item is already rented or sold, return 400", async () => {
    const item = new Item({
      _id: item_id,
      status: SOLD,
      typeOfTransaction: SELL,
    });
    await item.save();
    const req = { method: POST, headers: { uid }, body: { item_id } };
    const { status, message } = await postTransactionRequest(req);
    expect(message).toBe("This item is not available for transaction.");
    expect(status).toBe(400);
  });

  test("POST_0008: If the item is already rented or sold, return 400", async () => {
    const item = new Item({
      _id: item_id,
      status: RENTED,
      typeOfTransaction: RENT,
    });
    await item.save();
    const req = { method: POST, headers: { uid }, body: { item_id } };
    const { status, message } = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("This item is not available for transaction.");
  });
});
