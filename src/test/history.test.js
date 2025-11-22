const { describe, it, expect, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../../index"); 
require("dotenv").config();

let createdId = null;
const testUserId = 1;


const testRoute = {
  originLat: 20.67,
  originLng: -103.35,
  destinationLat: 20.68,
  destinationLng: -103.36,
  distanceM: 3000,
  durationS: 600,
  mode: "car",
};

describe(" HISTORY ENDPOINTS", () => {
  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  // POST /history/:userId
  it("🟢 Should create a new route in the history", async () => {
    const res = await request(app).post(`/history/${testUserId}`).send(testRoute);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.mode).toBe("car");

    createdId = res.body.id; 
  });

  // GET /history/:userId
  it("🟢 Should get the route history for a user", async () => {
    const res = await request(app).get(`/history/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("originLat");
  });

  // DELETE /history/:userId/:id
  it("🟢 Should soft-delete a specific route", async () => {
    const res = await request(app).delete(`/history/${testUserId}/${createdId}`);

    expect([200, 404]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("deleted");
  });

  // GET /history/:userId 
  it("🟢 Should not include deleted routes", async () => {
    const res = await request(app).get(`/history/${testUserId}`);
    expect(res.statusCode).toBe(200);
    const deleted = res.body.find((r) => r.id === createdId);
    expect(deleted).toBeUndefined();
  });
});
  