// Skills are stored in an array and rendered into the list (dynamic content)
const skills = ["HTML", "CSS", "JavaScript", "Python", "Mathematics", "Statistics", "AutoCAD basics", "Structural analysis basics", "Research and writing"];
const list = document.getElementById("skills");
skills.forEach(skill => {
  const li = document.createElement("li");
  li.textContent = skill;
  list.appendChild(li);
});
