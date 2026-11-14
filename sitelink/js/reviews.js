const jobSel = document.getElementById("jobSel");
const msg = document.getElementById("reviewMsg");
["r1", "r2", "r3", "r4"].forEach(id => {
  const s = document.getElementById(id);
  [5, 4, 3, 2, 1].forEach(n => s.add(new Option(n + " out of 5", n)));
});

function render() {
  const jobs = Store.get("sl_jobs");
  const open = jobs.filter(j => j.status === "completed" && !j.review);
  jobSel.innerHTML = open.length ? '<option value="">Choose a job</option>' : '<option value="">No completed jobs to review</option>';
  open.forEach(j => jobSel.add(new Option(j.trade + ": " + findWorker(j.workerId).name + " (" + j.date + ")", j.id)));

  const list = document.getElementById("reviewList");
  const rev = jobs.filter(j => j.review);
  list.innerHTML = rev.length ? "" : '<li>No reviews yet. Complete a job and approve it to leave one.</li>';
  rev.forEach(j => {
    const li = document.createElement("li");
    li.innerHTML = "<strong>" + esc(findWorker(j.workerId).name) + "</strong> &middot; " + j.review.avg.toFixed(1) + "/5<br>" + esc(j.review.comment) +
      '<br><span class="meta">Punctuality ' + j.review.punctuality + ", quality " + j.review.quality + ", communication " + j.review.communication + ", safety " + j.review.safety + "</span>";
    list.appendChild(li);
  });

  document.getElementById("rank").innerHTML = WORKERS.map(w => ({ w, s: getStats(w) })).sort((a, b) => b.s.score - a.s.score)
    .map(({ w, s }) => "<tr><td>" + esc(w.name) + "</td><td>" + w.trade + "</td><td>" + s.score + "</td></tr>").join("");
}

document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();
  msg.textContent = "";
  const comment = document.getElementById("comment").value.trim();
  const ok = [setError("jobSel", jobSel.value ? "" : "Choose a job to review."), setError("comment", comment ? "" : "Write a short comment about the job.")];
  if (!ok.every(Boolean)) return;
  const n = id => Number(document.getElementById(id).value);
  const jobs = Store.get("sl_jobs");
  const j = jobs.find(x => x.id === Number(jobSel.value));
  const r = { punctuality: n("r1"), quality: n("r2"), communication: n("r3"), safety: n("r4"), comment };
  r.avg = (r.punctuality + r.quality + r.communication + r.safety) / 4;
  j.review = r;
  Store.set("sl_jobs", jobs);
  e.target.reset();
  msg.textContent = "Review saved. The worker's score has been updated.";
  render();
});
render();
