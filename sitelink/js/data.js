// Sample data (arrays of objects) and shared helpers
const TRADES = ["Carpenter", "Electrician", "Plumber", "Mason", "Painter", "Tiler", "Welder", "General labourer"];
const WORKERS = [
  { id: 1, name: "Emeka Obi", trade: "Carpenter", area: "Ikeja", exp: 9, rate: 15000, rating: 4.8, jobs: 64, attendance: 96, verified: true, available: true },
  { id: 2, name: "Tunde Bello", trade: "Electrician", area: "Yaba", exp: 7, rate: 18000, rating: 4.6, jobs: 48, attendance: 93, verified: true, available: true },
  { id: 3, name: "Chinedu Okafor", trade: "Plumber", area: "Surulere", exp: 11, rate: 16000, rating: 4.7, jobs: 72, attendance: 95, verified: true, available: false },
  { id: 4, name: "Ibrahim Musa", trade: "Mason", area: "Ikeja", exp: 14, rate: 14000, rating: 4.5, jobs: 90, attendance: 91, verified: true, available: true },
  { id: 5, name: "Segun Adeyemi", trade: "Painter", area: "Lekki", exp: 5, rate: 12000, rating: 4.3, jobs: 31, attendance: 88, verified: false, available: true },
  { id: 6, name: "Peter Eze", trade: "Tiler", area: "Yaba", exp: 8, rate: 15000, rating: 4.9, jobs: 55, attendance: 98, verified: true, available: true },
  { id: 7, name: "Kunle Lawal", trade: "Welder", area: "Surulere", exp: 10, rate: 17000, rating: 4.4, jobs: 40, attendance: 90, verified: true, available: false },
  { id: 8, name: "Musa Garba", trade: "General labourer", area: "Lekki", exp: 3, rate: 8000, rating: 4.1, jobs: 22, attendance: 85, verified: false, available: true },
  { id: 9, name: "Bola Ade", trade: "Electrician", area: "Ikeja", exp: 12, rate: 20000, rating: 4.9, jobs: 83, attendance: 97, verified: true, available: true },
  { id: 10, name: "Femi Daniel", trade: "Carpenter", area: "Lekki", exp: 4, rate: 11000, rating: 4.2, jobs: 27, attendance: 87, verified: true, available: true }
];

const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }
};

const naira = n => "\u20A6" + Number(n).toLocaleString();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const findWorker = id => WORKERS.find(w => w.id === Number(id));

// Rating, attendance and score updated by completed jobs and reviews
function getStats(w) {
  const done = Store.get("sl_jobs").filter(j => j.workerId === w.id && j.status === "completed");
  const reviewed = done.filter(j => j.review);
  const onTime = done.filter(j => j.late === false).length;
  let rating = w.rating, attendance = w.attendance;
  if (reviewed.length) rating = (w.rating * w.jobs + reviewed.reduce((s, j) => s + j.review.avg, 0)) / (w.jobs + reviewed.length);
  if (done.length) attendance = (w.attendance * w.jobs + onTime * 100) / (w.jobs + done.length);
  const jobs = w.jobs + done.length;
  const score = Math.round(attendance * 0.5 + (rating / 5) * 100 * 0.4 + (Math.min(jobs, 50) / 50) * 100 * 0.1);
  return { rating: Math.round(rating * 10) / 10, jobs, attendance: Math.round(attendance), score };
}

function fillTrades(select) {
  TRADES.forEach(t => { const o = document.createElement("option"); o.value = t; o.textContent = t; select.appendChild(o); });
}
function renderTradeChips() {
  const ul = document.getElementById("tradeList");
  TRADES.forEach(t => { const li = document.createElement("li"); li.innerHTML = '<a href="workers.html?trade=' + encodeURIComponent(t) + '">' + t + "</a>"; ul.appendChild(li); });
}
function setError(id, msg) {
  document.getElementById(id).classList.toggle("invalid", msg !== "");
  document.getElementById(id + "Err").textContent = msg;
  return msg === "";
}
