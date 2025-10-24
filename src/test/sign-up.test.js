const { describe, expect, it } = require("@jest/globals");
const request = require("supertest");
const index = require("../../index");
const { faker } = require('@faker-js/faker');
const { sequelize } = require("../../src/config/Authdatabase");
require("dotenv").config();
const unique = Date.now();

describe("POST - Sing up user", () => {
    it("should return success if the user is registered successfully", async () => {
        const response = await request(index)
            .post("/auth/signup")
            .send({ gmail: faker.internet.email(), password: `Aa1!${unique}`, name: `Test User ${unique}`, username: `user_${unique}`})

      expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuario registrado exitosamente");
        // expect(response.body).toEqual({
        //     message: "Usuario registrado exitosamente",
        // });
    });
    it("should return error if the registered user is duplicated", async () => {
        const response = await request(index)
            .post("/auth/signup")
            .send({ gmail: "test1@example.com", password: "unacontraseñavalida123", name: "Test User1", username: "testuser1" })
        expect([409, 400]).toContain(response.status);
    })
});