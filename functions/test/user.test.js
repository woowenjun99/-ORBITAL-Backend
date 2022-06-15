// Source: https://stackoverflow.com/questions/49359476/mock-a-function-from-another-file-jest
// Source: https://stackoverflow.com/questions/58695989/how-to-mock-mongoose-find-function-in-jest
import { test, expect, describe, vi } from "vitest";
const { User } = require("../service/Model");
import { getHandler, postHandler, putHandler } from "../handler/user";

describe("getHandler", async () => {
  // Border Case 1: No user found
  test("If no user is being passed through, return a status error of 404", async () => {
    const req = { query: { user: null } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(401);
  });

  // Border Case 2: A user is found
  test("If a user is found, return a status of 200", async () => {
    // Create a mock data
    User.findOne = vi.fn().mockResolvedValueOnce({
      _id: "62a08dbac9f1020a25ff6c0a",
      firebaseUID: "1smVW328GqhX3rrZrzn9SOOCLgw1",
      __v: 0,
    });

    const req = { query: { user: "1smVW328GqhX3rrZrzn9SOOCLgw1" } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(200);
  });

  // Border Case 3: No such user is found
  test("If no user is found, return a status of 400", async () => {
    User.findOne = vi.fn().mockResolvedValueOnce(null);
    const req = { query: { user: "1smVW328GqhX3rrZrzn9SOOCLgw1" } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(404);
    expect(result["message"]).toBe("No such user");
  });

  // Border Case 4: If the promise is rejected
  test("If the promise is rejected, return a status of 500", async () => {
    User.findOne = vi.fn().mockRejectedValueOnce("Rejected");
    const req = { query: { user: "1smVW328GqhX3rrZrzn9SOOCLgw1" } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(500);
  });
});

describe("putHandler", () => {
  test("If firebaseUID is not provided, throw a 400 error", async () => {
    const req = { body: { firebaseUID: null } };
    const result = await putHandler(req);
    expect(result["status"]).toBe(400);
    expect(result["message"]).toBe("Invalid request");
  });

  test("If a user is found and everything is successful, return a 200 status and the user info", async () => {
    User.findOneAndUpdate = vi.fn().mockResolvedValueOnce({
      _id: "62a08dbac9f1020a25ff6c0a",
      firebaseUID: "1smVW328GqhX3rrZrzn9SOOCLgw1",
      name: "John",
      __v: 0,
    });

    const req = {
      body: { firebaseUID: "1smVW328GqhX3rrZrzn9SOOCLgw1", name: "John" },
    };
    const result = await putHandler(req);
    expect(result["status"]).toBe(201);
    expect(result["message"]).toStrictEqual({
      _id: "62a08dbac9f1020a25ff6c0a",
      firebaseUID: "1smVW328GqhX3rrZrzn9SOOCLgw1",
      name: "John",
      __v: 0,
    });
  });

  test("If the findOneAndUpdate fails, return a 500 status", async () => {
    User.findOneAndUpdate = vi.fn().mockRejectedValueOnce("Failed");
    const req = {
      body: { firebaseUID: "1smVW328GqhX3rrZrzn9SOOCLgw1", name: "John" },
    };
    const result = await putHandler(req);
    expect(result["status"]).toBe(500);
  });
});

describe("postHandler", async () => {
  test("If the firebaseUID is not provided, return a status code of 401", async () => {
    const req = { body: {} };
    User.findOne = vi.fn().mockResolvedValueOnce(null);
    const result = await postHandler(req);
    expect(result["status"]).toBe(401);
    expect(result["message"]).toStrictEqual(
      "You do not have the permission to view this page."
    );
  });

  test("If the user already exists, return a status code of 409", async () => {
    const req = { body: { firebaseUID: "Test123" } };
    User.findOne = vi
      .fn()
      .mockResolvedValueOnce({ firebaseUID: "Test123", _id: "1" });

    const result = await postHandler(req);
    expect(result["status"]).toBe(409);
  });
});
