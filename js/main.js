// Shared: mobile menu toggle and footer year
const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
document.getElementById("year").textContent = new Date().getFullYear();
