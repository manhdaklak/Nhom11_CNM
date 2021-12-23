const btnXemLichs = document.querySelectorAll(".js-xem-lich-dkhp");
const model = document.querySelector(".model-xem-lich-dkhp");
const modelClose = document.querySelector(".js-close");
function openModelXemLich() {
  model.classList.add("open");
}
function removeModelXemLich() {
  model.classList.remove("open");
}
for (const btnXemLich of btnXemLichs) {
  btnXemLich.addEventListener("click", openModelXemLich);
}
modelClose.addEventListener("click", removeModelXemLich);
