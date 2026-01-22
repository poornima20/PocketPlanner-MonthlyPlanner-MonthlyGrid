const monthTitle = document.getElementById("monthTitle");
const grid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

let currentDate = new Date();

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function storageKey(year, month) {
  return `planner-${year}-${month}`;
}

function renderCalendar(date) {
  grid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const key = storageKey(year, month);
  const savedData = JSON.parse(localStorage.getItem(key)) || {};

  monthTitle.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  let dayCount = 1;

  for (let i = 0; i < 42; i++) {
    const cell = document.createElement("div");
    cell.className = "day";

    if (i >= startDay && dayCount <= daysInMonth) {
      const dateLabel = document.createElement("div");
      dateLabel.className = "date";
      dateLabel.textContent = dayCount;

const cellDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayCount).padStart(2, "0")}`;

const textarea = document.createElement("textarea");
textarea.value = savedData[cellDate] || "";

const save = () => {
  savedData[cellDate] = textarea.value;
  localStorage.setItem(key, JSON.stringify(savedData));
};

textarea.addEventListener("input", save);
textarea.addEventListener("blur", save);


      if (isCurrentMonth && dayCount === today.getDate()) {
        cell.classList.add("today");
      }

      cell.appendChild(dateLabel);
      cell.appendChild(textarea);
      dayCount++;
    }

    grid.appendChild(cell);
  }
}

/* NAVIGATION */
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

todayBtn.onclick = () => {
  currentDate = new Date();
  renderCalendar(currentDate);
};

/* MOBILE VERTICAL SWIPE */
const calendarEl = document.querySelector(".calendar");

let startY = 0;
let isSwiping = false;

calendarEl.addEventListener("touchstart", (e) => {
  if (e.target.tagName === "TEXTAREA") return;

  startY = e.touches[0].clientY;
  isSwiping = true;
}, { passive: true });

calendarEl.addEventListener("touchend", (e) => {
  if (!isSwiping) return;
  isSwiping = false;

  const endY = e.changedTouches[0].clientY;
  const deltaY = startY - endY;

  if (Math.abs(deltaY) > 60) {
    currentDate.setMonth(
      currentDate.getMonth() + (deltaY > 0 ? 1 : -1)
    );
    renderCalendar(currentDate);
  }
});



renderCalendar(currentDate);

window.addEventListener("beforeunload", () => {
  const active = document.activeElement;
  if (active && active.tagName === "TEXTAREA") {
    active.blur();
  }
});
