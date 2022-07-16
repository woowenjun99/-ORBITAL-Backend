import {
  describe,
  expect,
  vi,
  test,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import {
  postTransactionRequest,
  Item,
  User,
  Transaction,
} from "../../API/transaction";
import {
  INVALID_BODY,
  NO_ITEM_FOUND,
  NO_UID_IN_HEADER,
  POST,
  SELL,
  RENTED,
  RENT,
  SOLD,
  OFFERED,
  AVAILABLE,
} from "../../API/types";
import {connectDatabase, clearDatabase, closeDatabase} from "../db";

const uid = "123456";
const item_id = "62cd9bed402f1b79b13dd596";

describe("postTransactionRequest", () => {
  beforeAll(connectDatabase);
  afterAll(closeDatabase);
  afterEach(clearDatabase);

  test("POST_0001: If the headers is not provided, return 401.", async () => {
    const req = {method: POST};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(401);
    expect(message).toBe(NO_UID_IN_HEADER);
  });

  test("POST_0002: If the uid is not provided, return 401.", async () => {
    const req = {method: POST, headers: {}};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(401);
    expect(message).toBe(NO_UID_IN_HEADER);
  });

  test("POST_0003: If the body is not provided, return 400.", async () => {
    const req = {method: POST, headers: {uid}};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(INVALID_BODY);
  });

  test("POST_0004: If the body does not contain the item_id, return 400.", async () => {
    const req = {method: POST, headers: {uid}, body: {}};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe(INVALID_BODY);
  });

  test("POST_0005: If the item does not exist, return 404.", async () => {
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(404);
    expect(message).toBe(NO_ITEM_FOUND);
  });

  test("POST_0006: If the function fails, return 500", async () => {
    const req = {method: POST, headers: {uid}, body: {item_id}};
    vi.spyOn(Item, "findById").mockRejectedValueOnce({message: "Hi"});
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(500);
    expect(message).toBe("Hi");
  });

  test("POST_0007: If the user is not found, return 404", async () => {
    const item = new Item({
      _id: item_id,
      status: SOLD,
      typeOfTransaction: SELL,
    });
    await item.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status, message} = await postTransactionRequest(req);
    expect(message).toBe("No user found");
    expect(status).toBe(404);
  });

  test("POST_0008: If the item is already rented or sold, return 400", async () => {
    const item = new Item({
      _id: item_id,
      status: SOLD,
      typeOfTransaction: SELL,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status, message} = await postTransactionRequest(req);
    expect(message).toBe("This item is not available for transaction.");
    expect(status).toBe(400);
  });

  test("POST_0009: If the item is already rented or sold, return 400", async () => {
    const item = new Item({
      _id: item_id,
      status: RENTED,
      typeOfTransaction: RENT,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status, message} = await postTransactionRequest(req);
    expect(status).toBe(400);
    expect(message).toBe("This item is not available for transaction.");
  });

  test("POST_0010: If the item is successfully rented out, return 201", async () => {
    const item = new Item({
      _id: item_id,
      status: OFFERED,
      typeOfTransaction: RENT,
      offeredBy: uid,
      price: 2,
      createdBy: "654321",
      offeredBy: "123456",
      currentOwner: null,
      nextAvailablePeriod: null,
      transactionNumber: null,
      durationOfRent: 604800,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status, message} = await postTransactionRequest(req);
    expect(message.status).toBe("RENTED");
    expect(status).toBe(201);

    const foundTransaction = await Transaction.findOne();
    const expectedOutput = {
      boardGameId: item_id,
      nextOwner: "123456",
      originalOwner: "654321",
      price: 2,
    };
    expect(foundTransaction).toContain(expectedOutput);
  });

  test("POST_0011: If the item is unsuccessful, we want the item to revert to original", async () => {
    const item = new Item({
      _id: item_id,
      status: OFFERED,
      typeOfTransaction: RENT,
      offeredBy: uid,
      price: 2,
      createdBy: "654321",
      offeredBy: "123456",
      currentOwner: "654321",
      nextAvailablePeriod: null,
      transactionNumber: null,
      durationOfRent: 604800,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    vi.spyOn(Transaction.prototype, "save").mockRejectedValueOnce({});
    const {status} = await postTransactionRequest(req);
    expect(status).toBe(500);
    const foundItem = await Item.findById(item_id);
    const expectedOutput = {
      createdBy: "654321",
      currentOwner: "654321",
      price: 2,
      status: OFFERED,
      nextAvailablePeriod: null,
      transactionNumber: null,
    };
    expect(foundItem).toContain(expectedOutput);
  });

  test("POST_0012: If the item is successfully sold out, return 201", async () => {
    const item = new Item({
      _id: item_id,
      status: AVAILABLE,
      typeOfTransaction: SELL,
      offeredBy: uid,
      price: 2,
      createdBy: "654321",
      currentOwner: "654321",
      transactionNumber: null,
      durationOfRent: 604800,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    const {status} = await postTransactionRequest(req);
    expect(status).toBe(201);

    const foundTransaction = await Transaction.findOne();
    const expectedOutputForTransaction = {
      boardGameId: item_id,
      nextOwner: "123456",
      originalOwner: "654321",
      price: 2,
    };
    expect(foundTransaction).toContain(expectedOutputForTransaction);

    const foundItem = await Item.findOne();
    const expectedOutputForItem = {
      status: SOLD,
      typeOfTransaction: SELL,
      currentOwner: "123456",
    };
    expect(foundItem).toContain(expectedOutputForItem);
  });

  test("POST_0013: If the item is unsuccessful, we want the item to revert to original", async () => {
    const item = new Item({
      _id: item_id,
      status: AVAILABLE,
      typeOfTransaction: SELL,
      offeredBy: uid,
      price: 2,
      createdBy: "654321",
      offeredBy: "123456",
      currentOwner: "654321",
      nextAvailablePeriod: null,
      transactionNumber: null,
      durationOfRent: 604800,
    });
    const user = new User({
      uid,
    });
    await item.save();
    await user.save();
    const req = {method: POST, headers: {uid}, body: {item_id}};
    vi.spyOn(Transaction.prototype, "save").mockRejectedValueOnce({});
    const {status} = await postTransactionRequest(req);
    expect(status).toBe(500);
    const foundItem = await Item.findById(item_id);
    const expectedOutput = {
      createdBy: "654321",
      currentOwner: "654321",
      price: 2,
      status: AVAILABLE,
      nextAvailablePeriod: null,
      transactionNumber: null,
    };
    expect(foundItem).toContain(expectedOutput);
  });
});
