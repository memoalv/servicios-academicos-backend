const request = require("supertest");
const { app }= require("../../app.js");

describe("Pruba del ping al servidor", () => {
    test("Deberia responder correctamente", async () => {
        const response = await request(app).get("/api/status/ping");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("pong");
      });
});