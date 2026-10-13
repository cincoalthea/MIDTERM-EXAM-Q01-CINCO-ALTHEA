const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

//retrieve
app.get("/api/tickets", (req, res) => {
  const tickets = readData();
  res.status(200).json(tickets);
});

//retrieve
app.get("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const tickets = readData();
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.status(200).json(ticket);
});

//insert
app.post("/api/tickets", (req, res) => {
  const { customer_name, problem, priority } = req.body;

  if (!customer_name || !problem || !priority) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const tickets = readData();
  const newId = tickets.length > 0 ? tickets[tickets.length - 1].id + 1 : 1;

  const newTicket = {
    id: newId,
    customer_name: customer_name,
    problem: problem,
    priority: priority,
    status: "Pending"
  };

  tickets.push(newTicket);
  writeData(tickets);

  res.status(201).json(newTicket);
});

//delete
app.delete("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);
  const tickets = readData();
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  tickets.splice(index, 1);
  writeData(tickets);

  res.status(200).json({ message: "Ticket deleted" });
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});