const { describe, expect, it } = require("@jest/globals");
const request = require("supertest");
const index = require("../../index");
require("dotenv").config();

describe("POST - login user", () => {
  it("should return error if the registered user is duplicated", async () => {
    const response = await request(index)
      .post("/auth/")
      .send({ email: "dan@gmail.com", password: "2323" });

    
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toContain("Error");
  });

  it("should return success if the user is registered successfully", async () => {
    const response = await request(index)
      .post("/auth/")
      .send({ email: "dan@gmail.com", password: "2323" });

    
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toContain("Usuario registrado");
  });
});
