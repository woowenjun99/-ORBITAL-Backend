import { testFunc } from "../API/test";
import { describe, test, expect } from "vitest";

describe("TEST", () => {
    test("HI", () => {
        expect(() => {
            testFunc("String")
        }).toThrow(TypeError)
    })
});
