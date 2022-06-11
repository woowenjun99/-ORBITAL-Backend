// Source: https://stackoverflow.com/questions/49359476/mock-a-function-from-another-file-jest
import { test, expect, describe, vi } from "vitest";
import { getHandler } from "../handler/user";

///Testing without any DB Logic inside
describe("Testing addUser Module", async () => {
  test("If no user is being passed through, return a status error of 404", async () => {
    const req = { query: { user: null } };
    const result = await getHandler(req);
    expect(result["status"]).toBe(404);
  });

  test.concurrent("200 status code should be provided", async () => {
    const { connect, clearDatabase, closeDatabase } = require("./db");
    await connect();
    const req = { query: { user: "ABC" } };
    const result = getHandler(req);
    expect(result).toBe(200);
    await clearDatabase();
    await closeDatabase();
  }, 60000);
});

// describe("New Test", () => {
//   test("If the function succeeds, return a status error of 200", async () => {
//     vi.mock("../handler/user", () => {
//       return {
//         getHandler: vi.fn().mockResolvedValue({ status: 200 }),
//       };
//     });
//     const req = { query: { user: "Test123" } };
//     const result = await getHandler(req);
//     expect(result["status"]).toBe(200);
//     vi.clearAllMocks();
//   });
// });
