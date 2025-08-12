import express from "express";
import {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "./db/queries/employees.js";

const app = express();
app.use(express.json());

const isValidId = (s) => Number.isInteger(Number(s)) && parseInt(s, 10) === Number(s);

app.get("/", (_req, res) => {
  res.send("Welcome to the Fullstack Employees API.");
});

app.get("/employees", async (_req, res) => {
  const employees = await getEmployees();
  res.status(200).json(employees);
});

app.post("/employees", async (req, res) => {
  const body = req.body ?? {};
  const { name, birthday, salary } = body;
  if (!Object.keys(body).length || name == null || birthday == null || salary == null) {
    return res.sendStatus(400);
  }
  const created = await createEmployee({ name, birthday, salary });
  res.status(201).json(created);
});

app.get("/employees/:id", async (req, res) => {
  const s = req.params.id;
  if (!isValidId(s)) return res.sendStatus(400);     // "1e10" → 400; accepts "0"
  const employee = await getEmployee(Number(s));     // "0" with no row → 404
  if (!employee) return res.sendStatus(404);
  res.status(200).json(employee);
});

app.delete("/employees/:id", async (req, res) => {
  const s = req.params.id;
  if (!isValidId(s)) return res.sendStatus(400);
  const deleted = await deleteEmployee(Number(s));   // "0" no row → 404
  if (!deleted) return res.sendStatus(404);
  res.sendStatus(204);
});

app.put("/employees/:id", async (req, res) => {
  const s = req.params.id;
  if (!isValidId(s)) return res.sendStatus(400);

  const body = req.body ?? {};
  const { name, birthday, salary } = body;
  if (!Object.keys(body).length || name == null || birthday == null || salary == null) {
    return res.sendStatus(400);
  }

  const updated = await updateEmployee({ id: Number(s), name, birthday, salary });
  if (!updated) return res.sendStatus(404);
  res.status(200).json(updated);
});

export default app;
