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
});

describe("GET - /routes/all_journeys", () => {
    it("should return 403 if no token is provided", async () => {
        const response = await request(index)
            .get("/routes/all_journeys");
        
        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Token no proporcionado");
    });

    it("should return 401 if invalid token is provided", async () => {
        const response = await request(index)
            .get("/routes/all_journeys")
            .set("Authorization", "Bearer invalid_token");
        
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Token inválido");
    });

    it("should return an array of journeys when valid token is provided", async () => {
        const response = await request(index)
            .get("/routes/all_journeys")
            .set("Authorization", `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Viajes obtenidos exitosamente");
        expect(Array.isArray(response.body.journeys)).toBe(true);
        
        // Verificar estructura de los journeys si hay alguno
        if (response.body.journeys.length > 0) {
            const journey = response.body.journeys[0];
            expect(journey).toHaveProperty("id");
            expect(journey).toHaveProperty("start_location");
            expect(journey).toHaveProperty("end_location");
            expect(journey).toHaveProperty("distance");
            expect(journey).toHaveProperty("duration");
        }
    });
});