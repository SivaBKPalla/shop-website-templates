// EDIT: the shop's real mobile or front-desk number.
const phoneTel = "+14155550142";

const hours = {
  Sun: null,
  Mon: null,
  Tue: [9 * 60, 18 * 60],
  Wed: [9 * 60, 18 * 60],
  Thu: [9 * 60, 18 * 60],
  Fri: [9 * 60, 18 * 60],
  Sat: [9 * 60, 15 * 60],
};

const menuButton = document.querySelector(".menu");
const nav = document.querySelector("#nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

function pacificParts(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const hour = Number(parts.hour);
  return {
    day: parts.weekday,
    minute: (hour === 24 ? 0 : hour) * 60 + Number(parts.minute),
  };
}

function statusText(date = new Date()) {
  const now = pacificParts(date);
  const today = hours[now.day];
  if (today && now.minute >= today[0] && now.minute < today[1]) return "Open now · closes at the posted time";
  const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const start = order.indexOf(now.day);
  for (let step = 0; step < 7; step += 1) {
    const name = order[(start + step) % 7];
    const range = hours[name];
    if (!range) continue;
    if (step === 0 && now.minute >= range[1]) continue;
    const names = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };
    return step === 0 ? "Closed now · opens later today" : `Closed now · opens ${names[name]}`;
  }
  return "Hours posted below";
}

document.querySelector("#status").textContent = statusText();

const form = document.querySelector("#book-form");
const note = document.querySelector("#form-note");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const body = `Hi, I'd like to book a ${data.get("service")} ${data.get("when")}. My name is ${data.get("name")}.`;
  const link = `sms:${phoneTel}?&body=${encodeURIComponent(body)}`;
  document.querySelector("#text-link").href = link;
  note.textContent = "Your message is ready. Send it in the text window that just opened.";
  window.location.href = link;
});
