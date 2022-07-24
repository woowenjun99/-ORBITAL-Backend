import { postReservationRequest, User, Item } from "../../API/reservation";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { connectDatabase, clearDatabase, closeDatabase } from "../db";
import { AVAILABLE, POST, RENT, RENTED, SELL, OFFERED } from "../../API/types";

const uid = "123456";
const item_id = "62cd9bed402f1b79b13dd596";

describe("POST TRANSACTION", () => {
  beforeAll(connectDatabase);

  afterEach(clearDatabase);

  afterAll(closeDatabase);

  test("POST_0001: If the headers is not provided, return 401.", async () => {
    const req = { method: POST };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("Please provide a uid in the headers.");
    expect(status).toBe(401);
  });

  test("POST_0002: If the headers is not provided, return 401.", async () => {
    const req = { method: POST, headers: {} };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("Please provide a uid in the headers.");
    expect(status).toBe(401);
  });

  test("POST_0003: If the body is not provided, return 400.", async () => {
    const req = { method: POST, headers: { uid } };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("Please provide a body.");
    expect(status).toBe(400);
  });

  test("POST_0004: If the item_id is not provided, return 400.", async () => {
    const req = { method: POST, headers: { uid }, body: {} };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("Please provide a body.");
    expect(status).toBe(400);
  });

  test("POST_0005: If the user is not found, return 404.", async () => {
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("No user found.");
    expect(status).toBe(404);
  });

  test("POST_0006: If the item is not found, return 404.", async () => {
    const user = new User({
      uid,
    });
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("No item found.");
    expect(status).toBe(404);
  });

  test("POST_0007: If the item is currently on RENTED, return 400.", async () => {
    const user = new User({
      uid,
    });
    const item = new Item({
      _id: item_id,
      typeOfTransaction: RENT,
      status: RENTED,
    });
    await item.save();
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("The item cannot be reserved now.");
    expect(status).toBe(400);
  });

  test("POST_0008: If the item is currently on OFFERED, return 400.", async () => {
    const user = new User({
      uid,
    });
    const item = new Item({
      _id: item_id,
      typeOfTransaction: RENT,
      status: OFFERED,
    });
    await item.save();
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("The item cannot be reserved now.");
    expect(status).toBe(400);
  });

  test("POST_0009: If the item is the user's, return 400.", async () => {
    const user = new User({
      uid,
    });
    const item = new Item({
      _id: item_id,
      typeOfTransaction: RENT,
      status: AVAILABLE,
      createdBy: uid,
    });
    await item.save();
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("You cannot make offer for this item.");
    expect(status).toBe(400);
  });

  test("POST_0010: If the item is already offered by the user's, return 400.", async () => {
    const user = new User({
      uid,
    });
    const item = new Item({
      _id: item_id,
      typeOfTransaction: RENT,
      status: OFFERED,
      createdBy: "654321",
      offeredBy: uid,
    });
    await item.save();
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status, message } = await postReservationRequest(req);
    expect(message).toBe("You have already made an offer for this item.");
    expect(status).toBe(400);
  });

  test("POST_0011: If the post request is successful, return 200", async () => {
    const user = new User({
      uid,
    });
    const item = new Item({
      _id: item_id,
      typeOfTransaction: RENT,
      status: AVAILABLE,
      createdBy: "654321",
      offeredBy: null,
    });
    await item.save();
    await user.save();
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const results = await postReservationRequest(req);
    expect(results.status).toBe(200);

    const { status, offeredBy } = await Item.findById(item_id);
    expect(status).toBe(OFFERED);
    expect(offeredBy).toBe(uid);
  });

  test("POST_0012: If the post request fails, return an error of 500.", async () => {
    vi.spyOn(User, "findOne").mockRejectedValueOnce({});
    const req = {
      method: POST,
      headers: { uid },
      body: { item_id },
    };
    const { status } = await postReservationRequest(req);
    expect(status).toBe(500);
  });
});
