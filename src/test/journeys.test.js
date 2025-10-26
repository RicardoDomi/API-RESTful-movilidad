const { describe, expect, it, beforeAll } = require("@jest/globals");
const request = require("supertest");
const index = require("../../index");
const { faker } = require('@faker-js/faker');
require("dotenv").config();

let authToken;
let testUser;

// Configuración inicial - crear usuario y obtener token
beforeAll(async () => {
    // Crear un usuario de prueba
    const userData = {
        gmail: faker.internet.email(),
        password: "Test1234!",
        name: "Test User",
        username: `testuser_${Date.now()}`
    };

    // Registrar el usuario
    const signupResponse = await request(index)
        .post("/auth/signup")
        .send(userData);

    expect(signupResponse.status).toBe(201);

    // Iniciar sesión para obtener el token
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

    // Prueba adicional: Creación y obtención de un journey
    it("should create and retrieve a new journey", async () => {
        // Crear un nuevo journey
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

        // Obtener todos los journeys y verificar que incluya el nuevo
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