const { describe, expect, it, beforeAll } = require("@jest/globals");
const request = require("supertest");
const index = require("../../index");
require("dotenv").config();

const userData = {
    gmail: 'test2@example.com', 
    password: 'unacontraseñavalida123'
};

let authToken; 
let testUser;
let testJourneyId;

beforeAll(async () => {
    // Iniciar sesión
    const loginResponse = await request(index)
        .post("/auth/")
        .send({
            email: userData.gmail,
            password: userData.password
        });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    
    authToken = loginResponse.body.token;
    testUser = loginResponse.body.user;
    const journeysResponse = await request(index)
        .get("/routes/all_journeys")
        .set("Authorization", `Bearer ${authToken}`);
    
    if (journeysResponse.body.journeys && journeysResponse.body.journeys.length > 0) {
        testJourneyId = journeysResponse.body.journeys[0].id;
    }
});

describe("GET - /routes/journeys/:id", () => {
    it("should return 403 if no token is provided", async () => {
        const response = await request(index)
            .get(`/routes/journey/${testJourneyId || 1}`);
        
        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Token no proporcionado");
    });

    it("should return 401 if invalid token is provided", async () => {
        const response = await request(index)
            .get(`/routes/journey/${testJourneyId || 1}`)
            .set("Authorization", "Bearer invalid_token");
        
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Token inválido");
    });

    it("should return 404 or error when journey ID does not exist", async () => {
        const nonExistentId = 999999;
        const response = await request(index)
            .get(`/routes/journey/${nonExistentId}`)
            .set("Authorization", `Bearer ${authToken}`);
        
        expect([404, 500]).toContain(response.status);
        expect(response.body.error).toBeDefined();
    });
});