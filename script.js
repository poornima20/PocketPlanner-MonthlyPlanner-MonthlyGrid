/* ====================================================================
   Variable Initialization
======================================================================= */
let currentDay = null;
let currentDate = new Date();


const calendarGrid = document.getElementById("calendarGrid");
const modal = document.getElementById("dayModal");
const dayNote = document.getElementById("dayNote");
const monthLabel = document.getElementById("monthLabel");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");
const modalDay = document.getElementById("modalDay");
const modalWeekday = document.getElementById("modalWeekday");
const modalSubDate = document.getElementById("modalSubDate");

/* ====================================================================
   Local Storage Handling
======================================================================= */
const STORAGE_KEY = "fullmoon.pocketplanner.monthlygrid";
let notesData = { data: {},updatedAt: Date.now()};
let notes = {};

function loadNotes(){
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  console.log(saved);

  notesData = saved || {
    data: {},
    updatedAt: Date.now()
  };

  notes = notesData.data || {};
}

/* ====================================================================
   Opening Day Modal
======================================================================= */

function openDay(dateKey){
  currentDay = dateKey;
  const date =  new Date(dateKey);

  modalDay.textContent = date.getDate();
  modalWeekday.textContent = date.toLocaleDateString("en-US",
      {
        weekday:"long"
      }
    );

  modalSubDate.textContent = date.toLocaleDateString("en-US",
    {
      month:"short",
      year:"numeric"
    }
  );

  dayNote.value = notes[dateKey]?.note || "";
  modal.classList.add("active");
}

/* ====================================================================
   Creating Monthly Grid
======================================================================= */
function createDummyMonth() {
  loadNotes();
  calendarGrid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year,month,1).getDay();
  monthLabel.textContent = currentDate.toLocaleString("en-US", {
      month:"long",
      year:"numeric"
    }
  ).toUpperCase();
 

  for(let i = 0;i < firstDay;i++){
   const blank = document.createElement("div");
   blank.className = "day-card empty";
   calendarGrid.appendChild(blank);
   }

  for(let day = 1; day <= daysInMonth; day++)
    {
    const dateKey =`${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const card = document.createElement("div");
    card.className = "day-card";

    card.innerHTML = `
        <div class="mini-wrapper">

          <div class="mini-journal" id="preview-${dateKey}">
            <div class="mini-header"> ${day}  </div>
            <div class="mini-content"> ${notes[dateKey]?.note || ""} </div>
          </div>

        </div>`;

    card.addEventListener("click",  () => openDay(dateKey) );
    calendarGrid.appendChild(card);
  }

  
  const totalCells = firstDay + daysInMonth;
  const remaining = 42 - totalCells;
  for( let i = 0; i < remaining; i++){
    const blank = document.createElement("div");
    blank.className = "day-card empty";
    calendarGrid.appendChild( blank);
  }
}

todayBtn.addEventListener("click",() => {
  currentDate =  new Date();
  createDummyMonth();
  }
);

prevMonth.addEventListener("click",() => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    createDummyMonth();
  }
);

nextMonth.addEventListener("click",() => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    createDummyMonth();
  }
);


/* ====================================================================
  Startup
======================================================================= */
loadNotes();
createDummyMonth();

/* ====================================================================
   Handlers for Modal and Input
======================================================================= */

document.getElementById("closeModal").addEventListener("click",() => {
      modal.classList.remove("active");
    }
  );


dayNote.addEventListener("input", () => {

    if(currentDay === null) return;
    if(!notes[currentDay]){
      notes[currentDay] = {
        note: "",
        createdAt: Date.now()
      };
    }
    notes[currentDay].note = dayNote.value;
    notesData.updatedAt = Date.now();
    notesData.data = notes;

    localStorage.setItem(STORAGE_KEY,JSON.stringify(notesData));

    const preview = document.querySelector(`#preview-${currentDay}`);
    const content = preview.querySelector(".mini-content"  );

    if(content){
      content.textContent = dayNote.value;
    }
  }
);

const MAX_LINES = 8;

dayNote.addEventListener(
  "input",
  () => {

    const lines =
      dayNote.value.split("\n");

    if(lines.length > MAX_LINES){

      dayNote.value =
        lines
          .slice(0, MAX_LINES)
          .join("\n");
    }
  }
);

