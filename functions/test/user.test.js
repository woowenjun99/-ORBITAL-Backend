// Source: https://stackoverflow.com/questions/49359476/mock-a-function-from-another-file-jest
import { test, expect, describe } from "vitest";
import { getHandler, putHandler } from "../handler/user";

describe("Testing addUser Module", async () => {
  test("If no user is being passed through, return a status error of 404", async () => {
    const req = { query: { user: null } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(404);
  });

  test("For putHandler, if no user query is being passed, return a status of 404", async () => {
    const req = { body: { firebaseUID: null } };
    const result = await putHandler(req);
    expect(result["status"]).toBe(400);
  });
});
