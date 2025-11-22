const { describe, expect, it } = require("@jest/globals");
const request = require("supertest");
const index = require("../../index");
require("dotenv").config();

const userData = {
    gmail: 'test2@example.com', 
    password: 'unacontraseñavalida123'
};

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

describe("POST - create new routes", () => {
    it("should create and retrieve a new journey", async () => {
        const journeyData = {
            start_location: "CUTonala",
            end_location: "Centro",
            distance: 15.5,
            duration: 45,
            date_time: new Date().toISOString()
        };

        const createResponse = await request(index)
            .post("/routes/new_journey")
            .set("Authorization", `Bearer ${authToken}`)
            .send(journeyData);

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.message).toBe("Viaje creado exitosamente");
        const getResponse = await request(index)
            .get("/routes/all_journeys")
            .set("Authorization", `Bearer ${authToken}`);

        expect(getResponse.status).toBe(200);
        expect(Array.isArray(getResponse.body.journeys)).toBe(true);
        expect(getResponse.body.journeys.length).toBeGreaterThan(0);

        // Verificar que el último journey creado esté en la lista
        const foundJourney = getResponse.body.journeys.find(j =>
            j.start_location === journeyData.start_location &&
            j.end_location === journeyData.end_location
        );
        expect(foundJourney).toBeDefined();
        expect(foundJourney.distance).toBe(journeyData.distance);
        expect(foundJourney.duration).toBe(journeyData.duration);
    });
});
