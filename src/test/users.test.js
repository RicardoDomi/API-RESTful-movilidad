const { describe, it, expect, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../../index");
require("dotenv").config();


beforeAll(() => {
  process.env.DEMO_MODE = "true";
});

describe("USERS ENDPOINTS (modo demo)", () => {
  it("GET /users - debería regresar la lista de usuarios", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const user = res.body[0];
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("username");
    expect(user).toHaveProperty("gmail");
  });

  it("GET /users/1 - debería regresar un usuario específico", async () => {
    const res = await request(app).get("/users/1");

    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("gmail");
  });

  it("GET /users/999 - debería regresar 404 si el usuario no existe", async () => {
    const res = await request(app).get("/users/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario no encontrado (modo demo)"
    );
  });

  it("PUT /users/1 - debería actualizar un usuario", async () => {
    const payload = {
      username: "demo_actualizado",
      name: "Usuario Demo Actualizado",
      gmail: "demo_act@example.com",
      phone: "555-9999",
    };

    const res = await request(app)
      .put("/users/1")
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario actualizado (modo demo)"
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toMatchObject(payload);
  });

  it("PATCH /users/1/password - debería cambiar la contraseña", async () => {
    const res = await request(app)
      .patch("/users/1/password")
      .send({
        currentPassword: "cualquiera",
        newPassword: "NuevaSegura!2025",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Contraseña actualizada correctamente (modo demo)"
    );
  });

  it("PATCH /users/1/role - debería cambiar el rol del usuario", async () => {
    const res = await request(app)
      .patch("/users/1/role")
      .send({ role: "admin" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Rol actualizado correctamente (modo demo)"
    );
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("role", "admin");
  });

  it("DELETE /users/2 - debería eliminar un usuario", async () => {
    const res = await request(app).delete("/users/2");

   
    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty(
        "message",
        "Usuario eliminado correctamente (modo demo)"
      );
    } else {
      expect(res.body).toHaveProperty(
        "message",
        "Usuario no encontrado (modo demo)"
      );
    }
  });
});
