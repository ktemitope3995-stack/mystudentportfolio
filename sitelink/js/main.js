const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
