// Sections 12–13 exercise: the "Add a course" form, built by hand with the DOM.
// Run it:  npm run web   → open http://localhost:5500/web/
// Finish src/s11-catalog.js (departments) and src/s13-forms.js first.
import { courses } from "../data/courses.js";
import { departments } from "../src/s11-catalog.js";
import { isComplete, toCourse } from "../src/s13-forms.js";

// Step 1 — select the elements you need (querySelector / querySelectorAll).
const form = document.querySelector("#add-course");

// TODO: fields — every input AND the select inside the form, as a real ARRAY
const fields = Array.from(form.querySelectorAll("input, select"));

// TODO: submit — the submit button
const submitButton = form.querySelector("button[type='submit']");

// TODO: departmentSelect, list (#course-list), count (#count), status (#status)
const departmentSelect = form.querySelector("select");
const list = document.querySelector("#course-list");
const count = document.querySelector("#count");
const status = document.querySelector("#status");

// A closure that hands out ids after the catalogue's last one (20).
const nextId = (() => {
  let last = 20;
  return () => ++last;
})();

// Step 2 — fill the department dropdown from the data.
// Hint: departments(courses).map((name) => new Option(name, name))
departmentSelect.append(...departments(courses).map((name) => new Option(name, name)));

// Step 3 — read every field into one object: { code, title, department, credits }.
// Hint: reduce over fields with a computed key [field.name].
function readForm() {
  return fields.reduce((obj, field) => {
    obj[field.name] = field.value;
    return obj;
  }, {});
}

// Step 4 — enable the button only when the form is complete.
// Listen for "input" on the FORM (every field's event bubbles up to it).
form.addEventListener("input", () => {
  const Complete = isComplete(readForm());
  submitButton.disabled = !Complete;
});

// Step 5 — on "submit": stop the page reload, build the course with
// toCourse(values, nextId), append renderItem(course) to the list,
// update the count and status, reset the form, disable the button again.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const course = toCourse(readForm(), nextId);
  list.appendChild(renderItem(course));
  updateCountAndStatus();
  form.reset();
  submitButton.disabled = true;
});

// Step 6 — one list item per course. Clicking the item toggles the
// "selected" class; clicking Remove removes it WITHOUT also selecting it.
function renderItem(course) {
  const item = document.createElement("li");
  item.className = "item";
  item.innerHTML = `<span>${course.code} · ${course.title} · ${course.credits} cr</span><button>Remove</button>`;
  item.addEventListener("click", () => {
    item.classList.toggle("selected");
  });
  const removeButton = item.querySelector("button");
  removeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the click from toggling "selected"
    item.remove();
    updateCountAndStatus();
  });
  return item;
}