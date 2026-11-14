const form = document.getElementById("jobForm");
const tradeSel = document.getElementById("trade");
const workerSel = document.getElementById("worker");
fillTrades(tradeSel);
document.getElementById("date").min = new Date().toISOString().split("T")[0];

function fillWorkers(selectedId) {
  workerSel.innerHTML = '<option value="">Choose a worker</option>';
  WORKERS.filter(w => w.trade === tradeSel.value).forEach(w => {
    const o = document.createElement("option");
    o.value = w.id;
    o.textContent = w.name + " (" + naira(w.rate) + "/day)" + (w.available ? "" : " - busy");
    workerSel.appendChild(o);
  });
  if (selectedId) workerSel.value = selectedId;
}
tradeSel.addEventListener("change", () => fillWorkers());

const pre = findWorker(new URLSearchParams(location.search).get("worker"));
if (pre) { tradeSel.value = pre.trade; fillWorkers(pre.id); document.getElementById("pay").value = pre.rate; }

const v = id => document.getElementById(id).value.trim();
function validate() {
  const tasks = v("tasks").split("\n").map(t => t.trim()).filter(Boolean);
  const r = [
    setError("client", v("client") ? "" : "Enter your name."),
    setError("phone", !v("phone") ? "Enter your phone number." : /^\d{7,15}$/.test(v("phone")) ? "" : "Use 7 to 15 digits only."),
    setError("trade", v("trade") ? "" : "Choose a trade."),
    setError("worker", v("worker") ? "" : "Choose a worker."),
    setError("address", v("address") ? "" : "Enter the site address."),
    setError("date", !v("date") ? "Choose a date." : v("date") < document.getElementById("date").min ? "Choose today or a later date." : ""),
    setError("time", v("time") ? "" : "Choose a start time."),
    setError("pay", /^\d+$/.test(v("pay")) && Number(v("pay")) > 0 ? "" : "Enter the pay as a number, like 15000."),
    setError("tasks", tasks.length ? "" : "Add at least one task.")
  ];
  return r.every(Boolean) ? tasks : null;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const tasks = validate();
  if (!tasks) return;
  const jobs = Store.get("sl_jobs");
  jobs.unshift({ id: Date.now(), client: v("client"), phone: v("phone"), trade: v("trade"), workerId: Number(v("worker")),
    address: v("address"), date: v("date"), time: v("time"), pay: Number(v("pay")),
    tasks: tasks.map(t => ({ text: t, done: false })), status: "booked", checkIn: null, checkOut: null, late: null, review: null });
  Store.set("sl_jobs", jobs);
  location.href = "jobs.html";
});
