const grid = document.getElementById("workerGrid");
const count = document.getElementById("count");
const f = { trade: fTrade, area: fArea, rating: fRating, sort: fSort, avail: fAvail };
fillTrades(f.trade);
const preset = new URLSearchParams(location.search).get("trade");
if (preset) f.trade.value = preset;

function render() {
  const area = f.area.value.trim().toLowerCase();
  let list = WORKERS.map(w => ({ w, s: getStats(w) })).filter(({ w, s }) =>
    (!f.trade.value || w.trade === f.trade.value) &&
    (!area || w.area.toLowerCase().includes(area)) &&
    s.rating >= Number(f.rating.value) &&
    (!f.avail.checked || w.available));
  const key = f.sort.value;
  list.sort((a, b) => key === "rate" ? a.w.rate - b.w.rate : b.s[key] - a.s[key]);
  count.textContent = list.length + " worker" + (list.length === 1 ? "" : "s") + " found";
  grid.innerHTML = list.length ? "" : '<li class="empty">No workers match. Try a different trade or area.</li>';
  list.forEach(({ w, s }) => {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = '<div class="who"><span class="avatar" aria-hidden="true">' + esc(w.name.split(" ").map(p => p[0]).join("")) + '</span><div><h3>' + esc(w.name) + '</h3><p>' + w.trade + " &middot; " + esc(w.area) + "</p></div></div>" +
      '<p class="score"><span>Rating ' + s.rating + "/5</span><span>Score " + s.score + "</span></p>" +
      "<p>" + s.jobs + " jobs &middot; " + s.attendance + "% on time &middot; " + w.exp + " yrs</p>" +
      '<p><span class="badge ' + (w.verified ? "ok" : "no") + '">' + (w.verified ? "Verified" : "Not yet verified") + '</span> <span class="badge ' + (w.available ? "ok" : "no") + '">' + (w.available ? "Available" : "Busy") + "</span></p>" +
      "<p>" + naira(w.rate) + " per day</p>" +
      '<a class="btn small" href="hire.html?worker=' + w.id + '">Hire ' + esc(w.name.split(" ")[0]) + "</a>";
    grid.appendChild(li);
  });
}
document.getElementById("filters").addEventListener("input", render);
document.getElementById("filters").addEventListener("submit", e => e.preventDefault());
render();
