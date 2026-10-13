const API_URL = "/api/tickets";

//retrieve
async function loadTickets() {
  const response = await fetch(API_URL);
  const tickets = await response.json();

  let rows = "";
  tickets.forEach((t) => {
    rows += `
      <tr>
        <td>${t.id}</td>
        <td>${t.customer_name}</td>
        <td>${t.problem}</td>
        <td>${t.priority}</td>
        <td>${t.status}</td>
        <td><button onclick="deleteTicket(${t.id})">Delete</button></td>
      </tr>
    `;
  });

  document.getElementById("ticketTable").innerHTML = rows;
}

//insert
async function addTicket() {
  const ticket = {
    customer_name: document.getElementById("customer_name").value,
    problem: document.getElementById("problem").value,
    priority: document.getElementById("priority").value
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket)
  });
  const data = await response.json();

  if (response.ok) {
    document.getElementById("message").innerText = "Ticket added with ID " + data.id;
    document.getElementById("customer_name").value = "";
    document.getElementById("problem").value = "";
    document.getElementById("priority").value = "";
    loadTickets();
  } else {
    document.getElementById("message").innerText = data.message;
  }
}

async function searchTicket() {
  const id = document.getElementById("searchId").value;
  const response = await fetch(API_URL + "/" + id);
  const data = await response.json();

  if (response.ok) {
    document.getElementById("result").innerHTML = `
      <p>ID: ${data.id}</p>
      <p>Customer Name: ${data.customer_name}</p>
      <p>Problem: ${data.problem}</p>
      <p>Priority: ${data.priority}</p>
      <p>Status: ${data.status}</p>
    `;
  } else {
    document.getElementById("result").innerHTML = "<p>" + data.message + "</p>";
  }
}

//delete
async function deleteTicket(id) {
  const response = await fetch(API_URL + "/" + id, { method: "DELETE" });
  const data = await response.json();
  alert(data.message);
  loadTickets();
}

loadTickets();
