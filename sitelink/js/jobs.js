const box = document.getElementById("jobList");
const LABELS = { booked: "Booked", progress: "In progress", review: "Awaiting your approval", completed: "Completed and paid" };
const time = iso => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
let jobs = Store.get("sl_jobs");
const save = () => { Store.set("sl_jobs", jobs); render(); };

function render() {
  box.innerHTML = jobs.length ? "" : '<p class="empty">No jobs yet. <a href="hire.html">Post your first job</a>.</p>';
  jobs.forEach(j => {
    const w = findWorker(j.workerId);
    const done = j.tasks.filter(t => t.done).length;
    const pct = Math.round(done / j.tasks.length * 100);
    const el = document.createElement("article");
    el.className = "job " + j.status;
    const att = j.checkIn ? "Checked in " + time(j.checkIn) + (j.late ? " (" + j.late + " min late)" : " (on time)") + (j.checkOut ? ", out " + time(j.checkOut) : "") : "Not checked in yet";
    el.innerHTML = '<header><div><h3>' + esc(j.trade) + ": " + esc(w.name) + '</h3><p class="meta">' + esc(j.address) + " &middot; " + j.date + " at " + j.time + " &middot; " + naira(j.pay) + '</p></div><span class="tag">' + LABELS[j.status] + "</span></header>" +
      '<p class="meta">' + att + "</p>" +
      '<ul class="tasks">' + j.tasks.map((t, i) => '<li class="' + (t.done ? "done" : "") + '"><input type="checkbox" data-task="' + i + '" data-id="' + j.id + '"' + (t.done ? " checked" : "") + (j.status === "progress" ? "" : " disabled") + ' aria-label="' + esc(t.text) + '"><span>' + esc(t.text) + "</span></li>").join("") + "</ul>" +
      '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div><p class="meta">' + done + " of " + j.tasks.length + " tasks done</p>" +
      '<div class="acts">' + actions(j, done) + "</div>";
    box.appendChild(el);
  });
}

function actions(j, done) {
  const b = (act, label, cls) => '<button type="button" class="btn small ' + (cls || "") + '" data-act="' + act + '" data-id="' + j.id + '">' + label + "</button>";
  let out = "";
  if (j.status === "booked") out += b("in", "Worker checks in");
  if (j.status === "progress") {
    if (!j.checkOut) out += b("out", "Worker checks out", "ghost");
    out += b("submit", "Submit for approval") ;
  }
  if (j.status === "review") out += b("approve", "Approve and pay") + b("fix", "Request a fix", "ghost");
  if (j.status === "completed") out += '<a class="btn small" href="reviews.html">' + (j.review ? "Review saved" : "Leave a review") + "</a>";
  return out + b("del", "Delete", "warn");
}

box.addEventListener("click", e => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const j = jobs.find(x => x.id === Number(btn.dataset.id));
  const act = btn.dataset.act;
  if (act === "in") {
    const late = Math.max(0, Math.round((Date.now() - new Date(j.date + "T" + j.time)) / 60000));
    j.checkIn = new Date().toISOString(); j.late = late > 10 ? late : false; j.status = "progress";
  } else if (act === "out") j.checkOut = new Date().toISOString();
  else if (act === "submit") {
    if (j.tasks.some(t => !t.done)) { alert("Tick every task before submitting the job for approval."); return; }
    j.status = "review";
  } else if (act === "approve") j.status = "completed";
  else if (act === "fix") { j.status = "progress"; j.checkOut = null; }
  else if (act === "del") { if (!confirm("Delete this job?")) return; jobs = jobs.filter(x => x.id !== j.id); }
  save();
});
box.addEventListener("change", e => {
  if (!e.target.matches("[data-task]")) return;
  const j = jobs.find(x => x.id === Number(e.target.dataset.id));
  j.tasks[Number(e.target.dataset.task)].done = e.target.checked;
  save();
});
render();
