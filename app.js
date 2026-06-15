/* ----------------------------------------------------
   AetherFlow App Core JS
---------------------------------------------------- */

// Premium Web Audio Synthesizer for Retro Gamified Sound Effects
const soundEffects = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  play(type) {
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      
      switch (type) {
        case "click":
          this.click(now);
          break;
        case "coin":
          this.coin(now);
          break;
        case "swoosh":
          this.swoosh(now);
          break;
        case "tick":
          this.tick(now);
          break;
        case "success":
          this.success(now);
          break;
        case "burnout":
          this.burnout(now);
          break;
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  },

  click(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  },

  coin(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.setValueAtTime(0.08, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  },

  swoosh(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.13);
  },

  tick(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.04);
  },

  success(now) {
    const freqs = [261.63, 329.63, 392.00, 523.25];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.04, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  },

  burnout(now) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = "sawtooth";
    osc2.type = "sawtooth";
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.linearRampToValueAtTime(60, now + 0.6);
    osc2.frequency.setValueAtTime(123, now);
    osc2.frequency.linearRampToValueAtTime(62, now + 0.6);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.6);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }
};

/* ----------------------------------------------------
   Custom Modal Dialog Utilities (Android WebView Compatible)
   Replaces native prompt(), confirm(), alert() which
   may be blocked or broken in Android WebView/PWA
---------------------------------------------------- */
function showAppAlert(message, onClose) {
  const existing = document.getElementById("app-custom-alert-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "app-custom-alert-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "380px";
  dialog.innerHTML = `
    <div class="modal-content">
      <div style="padding: 1.5rem;">
        <p style="color: var(--text-main); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.25rem; word-break: break-word;">${message}</p>
        <div style="display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-primary" id="btn-app-alert-ok" style="padding: 0.5rem 1.5rem;">OK</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();

  const closeIt = () => { dialog.close(); dialog.remove(); if (onClose) onClose(); };
  dialog.querySelector("#btn-app-alert-ok").addEventListener("click", closeIt);
  dialog.addEventListener("cancel", closeIt);
}

function showAppConfirm(message, onResult) {
  const existing = document.getElementById("app-custom-confirm-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "app-custom-confirm-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "400px";
  dialog.innerHTML = `
    <div class="modal-content">
      <div style="padding: 1.5rem;">
        <p style="color: var(--text-main); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.25rem; word-break: break-word;">${message}</p>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" class="btn btn-secondary" id="btn-app-confirm-cancel" style="padding: 0.5rem 1.25rem;">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-app-confirm-ok" style="padding: 0.5rem 1.25rem;">Confirm</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();

  const close = (result) => { dialog.close(); dialog.remove(); onResult(result); };
  dialog.querySelector("#btn-app-confirm-ok").addEventListener("click", () => close(true));
  dialog.querySelector("#btn-app-confirm-cancel").addEventListener("click", () => close(false));
  dialog.addEventListener("cancel", () => close(false));
}

function showAppPrompt(message, defaultValue, onResult) {
  const existing = document.getElementById("app-custom-prompt-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "app-custom-prompt-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "420px";
  dialog.innerHTML = `
    <div class="modal-content">
      <div style="padding: 1.5rem;">
        <p style="color: var(--text-main); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem; word-break: break-word;">${message}</p>
        <input type="text" id="app-prompt-input" value="${defaultValue || ''}" placeholder="Enter name..." style="width: 100%; padding: 0.65rem 0.75rem; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-card); color: white; font-size: 0.9rem; margin-bottom: 1.25rem; outline: none;" />
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button type="button" class="btn btn-secondary" id="btn-app-prompt-cancel" style="padding: 0.5rem 1.25rem;">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-app-prompt-ok" style="padding: 0.5rem 1.25rem;">Save</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();

  const inputEl = dialog.querySelector("#app-prompt-input");
  inputEl.focus();
  inputEl.select();

  const close = (value) => { dialog.close(); dialog.remove(); onResult(value); };
  dialog.querySelector("#btn-app-prompt-ok").addEventListener("click", () => close(inputEl.value));
  dialog.querySelector("#btn-app-prompt-cancel").addEventListener("click", () => close(null));
  inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") close(inputEl.value); });
  dialog.addEventListener("cancel", () => close(null));
}

// Default mock tasks to make the board beautiful on first load

// Default mock tasks to make the board beautiful on first load
const defaultTasks = [
  {
    id: "mock-1",
    title: "🎨 Review Dashboard UI Design",
    description: "Go over visual style, color palettes, and glassmorphic aesthetics with the team.",
    date: getFormattedDateStr(new Date()),
    startTime: "09:30",
    duration: 60,
    category: "work",
    completed: false
  },
  {
    id: "mock-2",
    title: "⚡ Core Team Sync",
    description: "Align on tasks, weekly roadmap, and feature goals.",
    date: getFormattedDateStr(new Date()),
    startTime: "11:00",
    duration: 45,
    category: "work",
    completed: false
  },
  {
    id: "mock-3",
    title: "🥗 Lunch with Sarah",
    description: "Catch up at the botanical cafe.",
    date: getFormattedDateStr(new Date()),
    startTime: "12:30",
    duration: 60,
    category: "personal",
    completed: false
  },
  {
    id: "mock-4",
    title: "🏃‍♂️ Cardio Workout",
    description: "Run 5k and quick stretching session.",
    date: getFormattedDateStr(new Date()),
    startTime: "16:00",
    duration: 45,
    category: "health",
    completed: false
  },
  {
    id: "mock-5",
    title: "🌌 Read Science Paper",
    description: "Review recent findings on biological networks.",
    date: getFormattedDateStr(new Date(Date.now() + 86400000)), // tomorrow
    startTime: "14:00",
    duration: 90,
    category: "other",
    completed: false
  }
];

// Gamified Templates
const templates = [
  {
    id: "tpl-deep-work",
    title: "🎨 Deep Work Coding",
    category: "work",
    xp: 80,
    stress: 25,
    value: 150,
    duration: 60,
    groupId: "group-academic"
  },
  {
    id: "tpl-client-call",
    title: "📞 Client Sales Call",
    category: "work",
    xp: 50,
    stress: 15,
    value: 200,
    duration: 60,
    groupId: "group-academic"
  },
  {
    id: "tpl-meditation",
    title: "🧘 Mindful Meditation",
    category: "health",
    xp: 45,
    stress: -30,
    value: 0,
    duration: 60,
    groupId: "group-wellness"
  },
  {
    id: "tpl-workout",
    title: "💪 Gym Workout",
    category: "health",
    xp: 60,
    stress: -15,
    value: 0,
    duration: 60,
    groupId: "group-wellness"
  },
  {
    id: "tpl-nap",
    title: "😴 Power Nap",
    category: "other",
    xp: 20,
    stress: -20,
    value: 0,
    duration: 60,
    groupId: "group-breaks"
  },
  {
    id: "tpl-inbox",
    title: "📥 Clear Inbox",
    category: "personal",
    xp: 25,
    stress: 5,
    value: 20,
    duration: 60,
    groupId: "group-chores"
  },
  // Academic Recall & Prep
  {
    id: "tpl-anki-rev",
    title: "🧠 Anki Decks Revision (Active recall session for Semester 3 / Indian Knowledge System (IKS))",
    category: "work",
    xp: 45,
    stress: 15,
    value: 20,
    duration: 30,
    groupId: "group-academic"
  },
  {
    id: "tpl-lab-prep",
    title: "🧪 Lab Manual & Experiment Prep",
    category: "work",
    xp: 40,
    stress: 12,
    value: 15,
    duration: 45,
    groupId: "group-academic"
  },
  {
    id: "tpl-pack-bags",
    title: "🎒 Pack College Bags (Routines)",
    category: "personal",
    xp: 10,
    stress: -5,
    value: 5,
    duration: 10,
    groupId: "group-academic"
  },
  {
    id: "tpl-upload-hw",
    title: "📸 Upload Homework Photo (Submitting assignments)",
    category: "work",
    xp: 15,
    stress: 5,
    value: 25,
    duration: 10,
    groupId: "group-academic"
  },
  {
    id: "tpl-daily-routines-chores",
    title: "🔋 Daily Routines, Chores & Health (Breaks)",
    category: "health",
    xp: 20,
    stress: -15,
    value: 10,
    duration: 30,
    groupId: "group-chores"
  },
  // Focus Breaks & Refreshments
  {
    id: "tpl-lunch",
    title: "🥪 Lunch Break (Remote / Bottle)",
    category: "personal",
    xp: 15,
    stress: -20,
    value: 0,
    duration: 30,
    groupId: "group-breaks"
  },
  {
    id: "tpl-dinner",
    title: "🍽️ Dinner Break",
    category: "personal",
    xp: 15,
    stress: -20,
    value: 0,
    duration: 45,
    groupId: "group-breaks"
  },
  {
    id: "tpl-breakfast-bed",
    title: "🍳 Bed Making & Breakfast",
    category: "personal",
    xp: 15,
    stress: -10,
    value: 5,
    duration: 25,
    groupId: "group-breaks"
  },
  {
    id: "tpl-snacks-mango",
    title: "🍏 Snacks / Mango Break",
    category: "personal",
    xp: 10,
    stress: -15,
    value: 5,
    duration: 15,
    groupId: "group-breaks"
  },
  {
    id: "tpl-milk-tea",
    title: "🥛 Milk & Tea Break",
    category: "personal",
    xp: 10,
    stress: -15,
    value: 0,
    duration: 15,
    groupId: "group-breaks"
  },
  {
    id: "tpl-talk-break-social",
    title: "💬 Talk Break (Social refreshment)",
    category: "personal",
    xp: 15,
    stress: -15,
    value: 0,
    duration: 20,
    groupId: "group-breaks"
  },
  // Physical Wellness
  {
    id: "tpl-eye-exercise",
    title: "👀 Eye Exercises & Test (Quick 2-minute restorative visual drills)",
    category: "health",
    xp: 10,
    stress: -12,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-stretching",
    title: "🧘 Restorative Stretching (Post-study stretching)",
    category: "health",
    xp: 15,
    stress: -15,
    value: 0,
    duration: 10,
    groupId: "group-wellness"
  },
  {
    id: "tpl-yoga",
    title: "🧘 Yoga Session (Core exercises)",
    category: "health",
    xp: 35,
    stress: -25,
    value: 0,
    duration: 30,
    groupId: "group-wellness"
  },
  {
    id: "tpl-deep-breathing",
    title: "🌬️ Deep Breathing (4-7-8 Technique)",
    category: "health",
    xp: 15,
    stress: -15,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-lofi-music",
    title: "🎵 Listen to Lofi/Relaxing Music",
    category: "health",
    xp: 15,
    stress: -15,
    value: 0,
    duration: 10,
    groupId: "group-wellness"
  },
  {
    id: "tpl-hydration-break",
    title: "💧 Hydration Break (Drink water)",
    category: "health",
    xp: 10,
    stress: -10,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-short-walk",
    title: "🚶 Short Walk (Outdoor Refresh)",
    category: "health",
    xp: 20,
    stress: -20,
    value: 0,
    duration: 10,
    groupId: "group-wellness"
  },
  {
    id: "tpl-digital-detox",
    title: "📵 Screen-Free Digital Break",
    category: "health",
    xp: 25,
    stress: -25,
    value: 0,
    duration: 15,
    groupId: "group-wellness"
  },
  {
    id: "tpl-brain-dump",
    title: "✍️ Brain Dump Journaling",
    category: "health",
    xp: 15,
    stress: -15,
    value: 0,
    duration: 10,
    groupId: "group-wellness"
  },
  {
    id: "tpl-shoulder-roll",
    title: "🤸 Shoulder Rolls & Neck Stretch",
    category: "health",
    xp: 12,
    stress: -12,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-splash-water",
    title: "💦 Cold Water Face Wash",
    category: "health",
    xp: 10,
    stress: -10,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-gratitude-list",
    title: "🌸 Gratitude Check (3 Good Things)",
    category: "health",
    xp: 12,
    stress: -12,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  {
    id: "tpl-green-view",
    title: "🌿 Look at Green Plants/Trees",
    category: "health",
    xp: 10,
    stress: -10,
    value: 0,
    duration: 5,
    groupId: "group-wellness"
  },
  // Entertainment & Gaming
  {
    id: "tpl-genshin-resin",
    title: "🎮 Genshin Impact Resin Check (Quick resin spend & commissions)",
    category: "other",
    xp: 25,
    stress: -20,
    value: 0,
    duration: 15,
    groupId: "group-gaming"
  },
  {
    id: "tpl-youtube-break",
    title: "📺 YouTube Watch Break (Educational or general videos like Veritasium, Dhruv Rathee)",
    category: "other",
    xp: 15,
    stress: -10,
    value: 10,
    duration: 25,
    groupId: "group-gaming"
  },
  // Chores & Maintenance
  {
    id: "tpl-vacuum-clean",
    title: "🧹 Vacuuming & Room Cleaning",
    category: "personal",
    xp: 25,
    stress: -5,
    value: 10,
    duration: 30,
    groupId: "group-chores"
  },
  {
    id: "tpl-ola-wash",
    title: "🏍️ Ola Scooter Wash (Maintenance block)",
    category: "personal",
    xp: 30,
    stress: -5,
    value: 20,
    duration: 45,
    groupId: "group-chores"
  },
  {
    id: "tpl-mosquito-net",
    title: "🕸️ Mosquito Net & Raket Setup (End-of-day sleep preparation)",
    category: "other",
    xp: 15,
    stress: -15,
    value: 5,
    duration: 15,
    groupId: "group-chores"
  }
];

// Past Student Routines
const pastTemplates = [
  {
    id: "tpl-past-breakfast",
    title: "🍳 Bed Making / Breakfast",
    category: "personal",
    xp: 15,
    stress: -5,
    value: 0,
    duration: 20,
    past: true
  },
  {
    id: "tpl-past-page-ac",
    title: "📖 Page ac (Study)",
    category: "work",
    xp: 20,
    stress: 5,
    value: 0,
    duration: 25,
    past: true
  },
  {
    id: "tpl-past-dooki",
    title: "🚽 Dooki Break",
    category: "personal",
    xp: 5,
    stress: -10,
    value: 0,
    duration: 15,
    past: true
  },
  {
    id: "tpl-past-genshin",
    title: "🎮 Genshin Resin Break",
    category: "other",
    xp: 20,
    stress: -20,
    value: 0,
    duration: 15,
    past: true
  },
  {
    id: "tpl-past-snacks-yoga",
    title: "🧘 Snacks & Yoga",
    category: "health",
    xp: 15,
    stress: -10,
    value: 10,
    duration: 10,
    past: true
  },
  {
    id: "tpl-past-talk-break",
    title: "💬 Talk Break",
    category: "personal",
    xp: 10,
    stress: -5,
    value: 0,
    duration: 10,
    past: true
  },
  {
    id: "tpl-past-site-work",
    title: "💻 Site Work & Coding",
    category: "work",
    xp: 50,
    stress: 20,
    value: 30,
    duration: 90,
    past: true
  },
  {
    id: "tpl-past-homework",
    title: "📸 Upload Homework Photo",
    category: "work",
    xp: 25,
    stress: 15,
    value: 0,
    duration: 15,
    past: true
  },
  {
    id: "tpl-past-structure-assignment",
    title: "📐 Structure Assignment",
    category: "work",
    xp: 40,
    stress: 20,
    value: 0,
    duration: 60,
    past: true
  },
  {
    id: "tpl-past-math-mcq",
    title: "🔢 Maths MCQ Prep",
    category: "work",
    xp: 30,
    stress: 15,
    value: 0,
    duration: 45,
    past: true
  },
  {
    id: "tpl-past-bcm-mcq",
    title: "📝 BCM MCQ Practice",
    category: "work",
    xp: 30,
    stress: 15,
    value: 0,
    duration: 45,
    past: true
  },
  {
    id: "tpl-past-sheet-work",
    title: "✏️ Drawing Sheet Work",
    category: "work",
    xp: 20,
    stress: 10,
    value: 0,
    duration: 30,
    past: true
  }
];

const defaultGroups = [
  { id: "group-academic", title: "🧠 Academic Recall & Prep" },
  { id: "group-breaks", title: "🥪 Focus Breaks & Refreshments" },
  { id: "group-wellness", title: "🧘 Physical Wellness" },
  { id: "group-gaming", title: "🎮 Entertainment & Gaming" },
  { id: "group-chores", title: "🧹 Household Chores" },
  { id: "group-past", title: "⏳ Past Routines" }
];

// App State
const state = {
  currentDate: new Date(),
  currentView: "week", // 'day' | 'week' | 'month' | 'year' | 'simulation'
  tasks: [],
  filters: {
    work: true,
    personal: true,
    health: true,
    other: true
  },
  pomodoro: {
    duration: 25 * 60, // 25 minutes
    timeLeft: 25 * 60,
    isRunning: false,
    intervalId: null,
    mode: "work" // 'work' | 'break'
  },
  userStats: {
    xp: 120,
    level: 1,
    stress: 30,
    value: 50
  },
  templates: [...templates],
  hourRowHeight: 80,
  activeSimulation: null,
  groups: [],
  collapsedGroups: {},
  editingTemplateId: null,
  activeTemplateTab: "blocks"
};

// Order for switching zoom directions
const VIEW_ORDER = ["day", "week", "month", "year", "simulation", "journal"];

let activeAssignRoutine = null;
let isSyncingInProgress = false;
let journalSelection = {
  isSelecting: false,
  startIndex: null,
  endIndex: null
};

// Safely parse JSON from local storage with fallback
function safeJSONParse(str, fallback) {
  try {
    if (str === null || str === undefined || str === "") return fallback;
    return JSON.parse(str);
  } catch (e) {
    console.error("AetherFlow JSON parsing error:", e, "Input was:", str);
    return fallback;
  }
}

// Safe wrapper for Lucide icons to prevent crash if unpkg fails
const lucide = {
  createIcons: function() {
    if (typeof window !== "undefined" && window.lucide && typeof window.lucide.createIcons === "function") {
      try {
        window.lucide.createIcons();
      } catch (e) {
        console.error("Lucide icon generation error:", e);
      }
    } else {
      console.warn("Lucide library is not loaded.");
    }
  }
};

/* ----------------------------------------------------
   Initialization & Event Listeners
---------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Load tasks from localStorage or set defaults
  const savedTasks = localStorage.getItem("aetherflow_tasks");
  state.tasks = safeJSONParse(savedTasks, null);
  if (!state.tasks || !Array.isArray(state.tasks)) {
    state.tasks = [...defaultTasks];
    localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
  }

  // Load user stats
  const savedStats = localStorage.getItem("aetherflow_stats");
  state.userStats = safeJSONParse(savedStats, null);
  if (!state.userStats || typeof state.userStats !== "object") {
    state.userStats = { xp: 120, level: 1, stress: 30, value: 50 };
    localStorage.setItem("aetherflow_stats", JSON.stringify(state.userStats));
  }

  // Load Custom Groups
  const savedGroups = localStorage.getItem("aetherflow_template_groups");
  state.groups = safeJSONParse(savedGroups, null);
  if (!state.groups || !Array.isArray(state.groups)) {
    state.groups = [...defaultGroups];
    localStorage.setItem("aetherflow_template_groups", JSON.stringify(state.groups));
  }

  // Load Collapsed Groups state
  const savedCollapsed = localStorage.getItem("aetherflow_collapsed_groups");
  state.collapsedGroups = safeJSONParse(savedCollapsed, { "group-past": true });

  // Load custom templates & check for deleted built-ins
  const savedCustomTemplates = localStorage.getItem("aetherflow_custom_templates") || "[]";
  const deletedBuiltinIds = safeJSONParse(localStorage.getItem("aetherflow_deleted_templates"), []);
  const modifiedBuiltins = safeJSONParse(localStorage.getItem("aetherflow_modified_builtins"), {});
  
  // Combine all built-ins (regular and past templates)
  const allBuiltins = [
    ...templates,
    ...pastTemplates.map(t => ({ ...t, groupId: "group-past", past: true }))
  ];
  
  // Apply modified built-ins fields & filter out deleted built-ins
  const filteredBuiltins = allBuiltins.filter(t => !deletedBuiltinIds.includes(t.id)).map(t => {
    if (modifiedBuiltins[t.id]) {
      return { ...t, ...modifiedBuiltins[t.id] };
    }
    return t;
  });
  
  const parsedCustoms = safeJSONParse(savedCustomTemplates, []);
  state.templates = [...filteredBuiltins, ...parsedCustoms];

  // Initialize Lucide Icons
  lucide.createIcons();

  // Setup DOM Event Listeners
  setupNavigationListeners();
  setupViewModeListeners();
  setupFilterListeners();
  setupTaskFormListeners();
  setupTemplateFormListeners();
  setupPomodoroListeners();
  setupRoutineSavesListeners();
  setupSearchListeners();
  setupStatsDialogListeners();
  setupGroupDialogListeners();
  setupAssignRoutineDialogListeners();
  setupSoundEffectsListeners();
  setupMobileSidebar();
  setupSyncDialogListeners();
  setupCollegeNotifToggle();
  setupJournalDialogListeners();
  setupLoadTimetableListener();

  // Setup Zoom Slider Listener
  const zoomSlider = document.getElementById("zoom-slider");
  if (zoomSlider) {
    const savedZoom = localStorage.getItem("aetherflow_grid_zoom");
    if (savedZoom) {
      state.hourRowHeight = parseInt(savedZoom);
      zoomSlider.value = savedZoom;
      document.documentElement.style.setProperty("--hour-row-height", `${savedZoom}px`);
    }
    let lastZoomTick = savedZoom ? parseInt(savedZoom) : 80;
    zoomSlider.addEventListener("input", (e) => {
      const newZoom = parseInt(e.target.value);
      state.hourRowHeight = newZoom;
      localStorage.setItem("aetherflow_grid_zoom", newZoom);
      document.documentElement.style.setProperty("--hour-row-height", `${newZoom}px`);
      renderCalendar();
      
      // Play tactile tick sound every 8 units of change
      if (Math.abs(newZoom - lastZoomTick) >= 8) {
        soundEffects.play("tick");
        lastZoomTick = newZoom;
      }
    });
  }

  // Render Calendar for first time
  renderCalendar();
  updatePillPosition(false);
  updateAgendaList();
  
  // Render gamification widgets
  renderUserStats();
  renderActionTemplates();
  updateSuggestions();

  // Initialize college end-of-day notification system
  initCollegeNotifications();

  // Background Startup Pull (Stale-While-Revalidate)
  if (githubSync.isEnabled()) {
    console.log("Checking for remote sync updates...");
    githubSync.fetchFile().then(result => {
      if (result && result.content) {
        const remoteSyncTime = result.content.syncTime || 0;
        const localSyncTime = parseInt(localStorage.getItem("aetherflow_sync_time") || "0");
        if (remoteSyncTime > localSyncTime) {
          console.log(`Remote data is newer (${remoteSyncTime} > ${localSyncTime}). Applying updates.`);
          githubSync.applyState(result.content);
          localStorage.setItem("aetherflow_sync_time", remoteSyncTime);
          
          // Reload local states to UI state
          state.tasks = safeJSONParse(localStorage.getItem("aetherflow_tasks"), []);
          state.userStats = safeJSONParse(localStorage.getItem("aetherflow_stats"), { xp: 120, level: 1, stress: 30, value: 50 });
          state.groups = safeJSONParse(localStorage.getItem("aetherflow_template_groups"), []);
          state.collapsedGroups = safeJSONParse(localStorage.getItem("aetherflow_collapsed_groups"), {});
          
          const savedCustomTemplates = localStorage.getItem("aetherflow_custom_templates") || "[]";
          const deletedBuiltinIds = safeJSONParse(localStorage.getItem("aetherflow_deleted_templates"), []);
          const modifiedBuiltins = safeJSONParse(localStorage.getItem("aetherflow_modified_builtins"), {});
          const allBuiltins = [
            ...templates,
            ...pastTemplates.map(t => ({ ...t, groupId: "group-past", past: true }))
          ];
          const filteredBuiltins = allBuiltins.filter(t => !deletedBuiltinIds.includes(t.id)).map(t => {
            if (modifiedBuiltins[t.id]) return { ...t, ...modifiedBuiltins[t.id] };
            return t;
          });
          state.templates = [...filteredBuiltins, ...safeJSONParse(savedCustomTemplates, [])];
          
          // Re-render UI
          renderCalendar();
          updateAgendaList();
          renderUserStats();
          renderActionTemplates();
          console.log("Remote updates applied successfully.");
        } else {
          console.log("Local data is up to date.");
        }
      }
    }).catch(err => {
      console.warn("Background startup sync check failed:", err);
    });
  }

  // Intercept localStorage.setItem for Auto-Sync
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (typeof isSyncingInProgress !== "undefined" && isSyncingInProgress) return;
    const SYNC_KEYS = [
      "aetherflow_tasks",
      "aetherflow_stats",
      "aetherflow_custom_templates",
      "aetherflow_deleted_templates",
      "aetherflow_modified_builtins",
      "aetherflow_template_groups",
      "aetherflow_collapsed_groups"
    ];
    if (SYNC_KEYS.includes(key)) {
      triggerAutoSyncPush();
    }
  };
  
  // Start the live time updater (updates the line position every 60s)
  setInterval(() => {
    updateLiveTimeIndicator();
  }, 60000);
});

/* ----------------------------------------------------
   Navigation Controller (Prev, Today, Next)
---------------------------------------------------- */
function setupNavigationListeners() {
  const btnPrev = document.getElementById("btn-prev");
  const btnToday = document.getElementById("btn-today");
  const btnNext = document.getElementById("btn-next");

  btnPrev.addEventListener("click", () => {
    navigateCalendar(-1);
  });

  btnToday.addEventListener("click", () => {
    state.currentDate = new Date();
    triggerViewChange(() => {
      renderCalendar();
    });
  });

  btnNext.addEventListener("click", () => {
    navigateCalendar(1);
  });
}

function navigateCalendar(direction) {
  triggerViewChange(() => {
    const d = state.currentDate;
    if (state.currentView === "day") {
      d.setDate(d.getDate() + direction);
    } else if (state.currentView === "week") {
      d.setDate(d.getDate() + (direction * 7));
    } else if (state.currentView === "month") {
      d.setMonth(d.getMonth() + direction);
    } else if (state.currentView === "year") {
      d.setFullYear(d.getFullYear() + direction);
    }
    renderCalendar();
  });
}

/* ----------------------------------------------------
   View Selection Control & Smooth Switch
---------------------------------------------------- */
function setupViewModeListeners() {
  const buttons = document.querySelectorAll(".btn-view");
  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetView = e.currentTarget.getAttribute("data-view");
      if (targetView === state.currentView) return;

      switchViewMode(targetView);
    });
  });
}

function switchViewMode(targetView) {
  const oldIndex = VIEW_ORDER.indexOf(state.currentView);
  const newIndex = VIEW_ORDER.indexOf(targetView);
  
  // zoom-in happens when moving to smaller scopes (Year -> Month -> Week -> Day)
  // zoom-out happens when moving to broader scopes (Day -> Week -> Month -> Year)
  const transitionType = newIndex < oldIndex ? "zoom-in" : "zoom-out";

  const update = () => {
    // Remove active state from current
    document.querySelectorAll(".btn-view").forEach(b => b.classList.remove("active"));
    // Add to target
    document.getElementById(`btn-view-${targetView}`).classList.add("active");
    
    state.currentView = targetView;
    renderCalendar();
    updatePillPosition(true);

    // Close mobile sidebar if open
    const sidebar = document.querySelector(".app-sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("active");
    }
  };

  // Implement progressive enhancement for View Transitions API
  if (!document.startViewTransition) {
    update();
    return;
  }

  try {
    document.startViewTransition({
      update: update,
      types: [transitionType]
    });
  } catch (err) {
    // Standard older syntax compatibility fallback
    document.startViewTransition(update);
  }
}

// Custom trigger wrapper for simple navigating updates (no-types zoom, just cross-fade)
function triggerViewChange(updateDOM) {
  if (!document.startViewTransition) {
    updateDOM();
    return;
  }
  document.startViewTransition(updateDOM);
}

// Animates and positions the highlight pill behind view control tabs
function updatePillPosition(animate = true) {
  const activeBtn = document.querySelector(`.btn-view[data-view="${state.currentView}"]`);
  const pill = document.getElementById("view-indicator");
  
  if (!activeBtn || !pill) return;
  
  if (!animate) {
    pill.style.transition = "none";
  } else {
    pill.style.transition = "";
  }
  
  pill.style.width = `${activeBtn.offsetWidth}px`;
  pill.style.left = `${activeBtn.offsetLeft}px`;
}

/* ----------------------------------------------------
   Category Filter Manager
---------------------------------------------------- */
function setupFilterListeners() {
  const categories = ["work", "personal", "health", "other"];
  categories.forEach(cat => {
    const cb = document.getElementById(`filter-${cat}`);
    cb.addEventListener("change", (e) => {
      state.filters[cat] = e.target.checked;
      triggerViewChange(() => {
        renderCalendar();
      });
    });
  });
}

/* ----------------------------------------------------
   Render Dispatcher
---------------------------------------------------- */
function renderCalendar() {
  const container = document.getElementById("calendar-container");
  
  // Clear layout
  container.innerHTML = "";
  
  if (state.currentView === "day") {
    renderDayView(container);
  } else if (state.currentView === "week") {
    renderWeekView(container);
  } else if (state.currentView === "month") {
    renderMonthView(container);
  } else if (state.currentView === "year") {
    renderYearView(container);
  } else if (state.currentView === "simulation") {
    renderSimulationView(container);
  } else if (state.currentView === "journal") {
    renderJournalView(container);
  }

  // Adjust zoom container visibility
  const zoomContainer = document.querySelector(".zoom-slider-container");
  if (zoomContainer) {
    if (state.currentView === "day" || state.currentView === "week") {
      zoomContainer.style.display = "";
    } else {
      zoomContainer.style.display = "none";
    }
  }

  // Adjust Load Timetable button visibility
  const loadTimetableBtn = document.getElementById("btn-load-timetable");
  if (loadTimetableBtn) {
    if (state.currentView === "day" || state.currentView === "week") {
      loadTimetableBtn.style.display = "inline-flex";
    } else {
      loadTimetableBtn.style.display = "none";
    }
  }

  // Toggle Routine Saves widget display based on active simulation
  const routinesWidget = document.querySelector(".routines-widget");
  if (routinesWidget) {
    if (state.currentView === "simulation" && state.activeSimulation) {
      routinesWidget.style.display = "block";
    } else {
      routinesWidget.style.display = "none";
    }
  }

  // Update header title string
  updateRangeLabel();
  
  // Ensure icons are rendered
  lucide.createIcons();

  // Run initial layout line placing
  updateLiveTimeIndicator();

  // Keep sidebar template list updated
  renderActionTemplates();
}

function updateRangeLabel() {
  const label = document.getElementById("current-range-label");
  const d = state.currentDate;

  if (state.currentView === "day") {
    label.innerText = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } else if (state.currentView === "journal") {
    label.innerText = "Journal: " + d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } else if (state.currentView === "week") {
    const monday = getStartOfWeek(d);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    let options = { month: "short", day: "numeric" };
    if (monday.getFullYear() !== sunday.getFullYear()) {
      options.year = "numeric";
    }
    const startStr = monday.toLocaleDateString("en-US", options);
    const endStr = sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    label.innerText = `${startStr} — ${endStr}`;
  } else if (state.currentView === "month") {
    label.innerText = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } else if (state.currentView === "year") {
    label.innerText = d.getFullYear();
  } else if (state.currentView === "simulation") {
    label.innerText = "Simulation Ground";
  }
}

/* ----------------------------------------------------
   View Implementation: DAY
---------------------------------------------------- */
function renderDayView(parent) {
  const root = document.createElement("div");
  root.className = "day-view-container";
  
  // Headers row
  const headers = document.createElement("div");
  headers.className = "view-grid-headers";
  headers.style.gridTemplateColumns = "70px 1fr";
  
  const spacer = document.createElement("div");
  spacer.className = "header-time-spacer";
  
  const label = document.createElement("div");
  label.className = "header-day-label";
  if (isSameDay(state.currentDate, new Date())) {
    label.classList.add("is-today");
  }
  
  const dayName = document.createElement("span");
  dayName.className = "day-name";
  dayName.innerText = state.currentDate.toLocaleDateString("en-US", { weekday: "short" });
  
  const dayNum = document.createElement("span");
  dayNum.className = "day-num";
  dayNum.innerText = state.currentDate.getDate();
  
  label.appendChild(dayName);
  label.appendChild(dayNum);
  headers.appendChild(spacer);
  headers.appendChild(label);
  root.appendChild(headers);
  
  // Grid Body
  const body = document.createElement("div");
  body.className = "view-grid-body";
  
  // Hours Axis
  const axis = document.createElement("div");
  axis.className = "hours-axis-column";
  for (let i = 0; i < 24; i++) {
    const cell = document.createElement("div");
    cell.className = "hour-axis-cell";
    cell.innerText = formatHourLabel(i);
    axis.appendChild(cell);
  }
  body.appendChild(axis);
  
  // Columns Container
  const cols = document.createElement("div");
  cols.className = "grid-columns-container";
  cols.style.gridTemplateColumns = "1fr";
  
  const dayCol = document.createElement("div");
  dayCol.className = "grid-day-column";
  if (isSameDay(state.currentDate, new Date())) {
    dayCol.classList.add("is-today");
  }
  dayCol.setAttribute("data-date", getFormattedDateStr(state.currentDate));
  
  // Click column to add task
  dayCol.addEventListener("click", (e) => {
    // Only trigger if click is on column directly, not on a card
    if (e.target === dayCol) {
      const rect = dayCol.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const clickedHourFloat = clickY / state.hourRowHeight;
      const hour = Math.floor(clickedHourFloat);
      const minutes = Math.floor((clickedHourFloat - hour) * 60);
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const finalMinutes = roundedMinutes >= 60 ? 45 : roundedMinutes;
      
      const timeStr = `${String(hour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
      openTaskDialog(null, getFormattedDateStr(state.currentDate), timeStr);
    }
  });

  // HTML5 Drag and Drop Events
  dayCol.addEventListener("dragover", (e) => {
    e.preventDefault();
    dayCol.classList.add("drag-over");
  });
  
  dayCol.addEventListener("dragleave", () => {
    dayCol.classList.remove("drag-over");
  });
  
  dayCol.addEventListener("drop", (e) => {
    e.preventDefault();
    dayCol.classList.remove("drag-over");
    
    soundEffects.play("swoosh");
    const dropDataStr = e.dataTransfer.getData("text/plain");
    
    // Check if drop data is a Daily Routine
    let isDailyRoutine = false;
    let routineData = null;
    try {
      const parsed = JSON.parse(dropDataStr);
      if (parsed && parsed.type === "daily-routine") {
        isDailyRoutine = true;
        routineData = parsed;
      }
    } catch (err) {}
    
    const targetDate = dayCol.getAttribute("data-date");

    if (isDailyRoutine) {
      const monday = getStartOfWeek(state.currentDate);
      promptApplyRoutine(routineData.title, (choice) => {
        if (choice === "overwrite" || choice === "append") {
          applyRoutineStepsToDate(routineData.steps, targetDate, choice);
        } else if (choice === "week-overwrite" || choice === "week-append") {
          applyRoutineToEntireWeek(routineData.steps, monday, choice === "week-overwrite" ? "overwrite" : "append");
        }
      });
      return;
    }
    
    const templateId = dropDataStr;
    const template = state.templates.find(t => t.id === templateId) || pastTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const rect = dayCol.getBoundingClientRect();
    const dropY = e.clientY - rect.top;
    const dropHourFloat = dropY / state.hourRowHeight;
    const hour = Math.floor(dropHourFloat);
    const minutes = Math.floor((dropHourFloat - hour) * 60);
    const roundedMinutes = Math.round(minutes / 15) * 15;
    const finalMinutes = roundedMinutes >= 60 ? 45 : roundedMinutes;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
    
    const newTask = {
      id: generateUUID(),
      title: template.title,
      description: `Action Block: ${template.title}`,
      date: targetDate,
      startTime: timeStr,
      duration: template.duration,
      category: template.category,
      completed: false,
      xp: template.xp,
      stress: template.stress,
      value: template.value
    };
    
    state.tasks.push(newTask);
    localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
    
    triggerViewChange(() => {
      renderCalendar();
      updateAgendaList();
    });
  });

  // Layout tasks
  const dateStr = getFormattedDateStr(state.currentDate);
  const dayTasks = state.tasks.filter(t => t.date === dateStr && state.filters[t.category]);
  layoutTasksForDay(dayTasks);
  
  // Render Tasks
  dayTasks.forEach(task => {
    dayCol.appendChild(createTaskCard(task));
  });

  // Time indicator (drawn dynamically)
  cols.appendChild(dayCol);
  body.appendChild(cols);
  root.appendChild(body);
  parent.appendChild(root);
}

/* ----------------------------------------------------
   View Implementation: WEEK
---------------------------------------------------- */
function renderWeekView(parent) {
  const root = document.createElement("div");
  root.className = "week-view-container";
  
  const monday = getStartOfWeek(state.currentDate);
  
  // Headers row
  const headers = document.createElement("div");
  headers.className = "view-grid-headers";
  headers.style.gridTemplateColumns = "70px repeat(7, 1fr)";
  
  const spacer = document.createElement("div");
  spacer.className = "header-time-spacer";
  headers.appendChild(spacer);
  
  // HTML5 Drag and Drop Events on Week View headers (Drop to apply routine to entire week!)
  headers.addEventListener("dragover", (e) => {
    e.preventDefault();
    headers.classList.add("drag-over-week");
  });
  
  headers.addEventListener("dragleave", () => {
    headers.classList.remove("drag-over-week");
  });
  
  headers.addEventListener("drop", (e) => {
    e.preventDefault();
    headers.classList.remove("drag-over-week");
    
    const dropDataStr = e.dataTransfer.getData("text/plain");
    let isDailyRoutine = false;
    let routineData = null;
    try {
      const parsed = JSON.parse(dropDataStr);
      if (parsed && parsed.type === "daily-routine") {
        isDailyRoutine = true;
        routineData = parsed;
      }
    } catch (err) {}
    
    if (isDailyRoutine) {
      soundEffects.play("swoosh");
      promptApplyRoutineToWeek(routineData.title, (choice) => {
        if (choice !== "cancel") {
          applyRoutineToEntireWeek(routineData.steps, monday, choice);
        }
      });
    }
  });
  
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    daysOfWeek.push(day);
    
    const label = document.createElement("div");
    label.className = "header-day-label";
    label.title = "Switch to Day View";
    if (isSameDay(day, new Date())) {
      label.classList.add("is-today");
    }
    
    const dayName = document.createElement("span");
    dayName.className = "day-name";
    dayName.innerText = day.toLocaleDateString("en-US", { weekday: "short" });
    
    const dayNum = document.createElement("span");
    dayNum.className = "day-num";
    dayNum.innerText = day.getDate();
    
    label.appendChild(dayName);
    label.appendChild(dayNum);
    
    label.addEventListener("click", () => {
      soundEffects.play("click");
      state.currentDate = new Date(day);
      switchViewMode("day");
    });
    
    headers.appendChild(label);
  }
  root.appendChild(headers);
  
  // Grid Body
  const body = document.createElement("div");
  body.className = "view-grid-body";
  
  // Hours Axis
  const axis = document.createElement("div");
  axis.className = "hours-axis-column";
  for (let i = 0; i < 24; i++) {
    const cell = document.createElement("div");
    cell.className = "hour-axis-cell";
    cell.innerText = formatHourLabel(i);
    axis.appendChild(cell);
  }
  body.appendChild(axis);
  
  // Columns Container
  const cols = document.createElement("div");
  cols.className = "grid-columns-container";
  cols.style.gridTemplateColumns = "repeat(7, 1fr)";
  
  daysOfWeek.forEach(day => {
    const dayCol = document.createElement("div");
    dayCol.className = "grid-day-column";
    if (isSameDay(day, new Date())) {
      dayCol.classList.add("is-today");
    }
    dayCol.setAttribute("data-date", getFormattedDateStr(day));
    
    dayCol.addEventListener("click", (e) => {
      if (e.target === dayCol) {
        const rect = dayCol.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const clickedHourFloat = clickY / state.hourRowHeight;
        const hour = Math.floor(clickedHourFloat);
        const minutes = Math.floor((clickedHourFloat - hour) * 60);
        const roundedMinutes = Math.round(minutes / 15) * 15;
        const finalMinutes = roundedMinutes >= 60 ? 45 : roundedMinutes;
        
        const timeStr = `${String(hour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
        openTaskDialog(null, getFormattedDateStr(day), timeStr);
      }
    });

    // HTML5 Drag and Drop Events
    dayCol.addEventListener("dragover", (e) => {
      e.preventDefault();
      dayCol.classList.add("drag-over");
    });
    
    dayCol.addEventListener("dragleave", () => {
      dayCol.classList.remove("drag-over");
    });
    
    dayCol.addEventListener("drop", (e) => {
      e.preventDefault();
      dayCol.classList.remove("drag-over");
      
      soundEffects.play("swoosh");
      const dropDataStr = e.dataTransfer.getData("text/plain");
      
      // Check if drop data is a Daily Routine
      let isDailyRoutine = false;
      let routineData = null;
      try {
        const parsed = JSON.parse(dropDataStr);
        if (parsed && parsed.type === "daily-routine") {
          isDailyRoutine = true;
          routineData = parsed;
        }
      } catch (err) {}
      
      const targetDate = dayCol.getAttribute("data-date");

      if (isDailyRoutine) {
        promptApplyRoutine(routineData.title, (choice) => {
          if (choice === "overwrite" || choice === "append") {
            applyRoutineStepsToDate(routineData.steps, targetDate, choice);
          } else if (choice === "week-overwrite" || choice === "week-append") {
            applyRoutineToEntireWeek(routineData.steps, monday, choice === "week-overwrite" ? "overwrite" : "append");
          }
        });
        return;
      }
      
      const templateId = dropDataStr;
      const template = state.templates.find(t => t.id === templateId) || pastTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      const rect = dayCol.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      const dropHourFloat = dropY / state.hourRowHeight;
      const hour = Math.floor(dropHourFloat);
      const minutes = Math.floor((dropHourFloat - hour) * 60);
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const finalMinutes = roundedMinutes >= 60 ? 45 : roundedMinutes;
      const timeStr = `${String(hour).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
      
      const newTask = {
        id: generateUUID(),
        title: template.title,
        description: `Action Block: ${template.title}`,
        date: targetDate,
        startTime: timeStr,
        duration: template.duration,
        category: template.category,
        completed: false,
        xp: template.xp,
        stress: template.stress,
        value: template.value
      };
      
      state.tasks.push(newTask);
      localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
      
      triggerViewChange(() => {
        renderCalendar();
        updateAgendaList();
      });
    });

    // Layout overlapping tasks
    const dateStr = getFormattedDateStr(day);
    const dayTasks = state.tasks.filter(t => t.date === dateStr && state.filters[t.category]);
    layoutTasksForDay(dayTasks);
    
    // Render Tasks
    dayTasks.forEach(task => {
      dayCol.appendChild(createTaskCard(task));
    });
    
    cols.appendChild(dayCol);
  });
  
  body.appendChild(cols);
  root.appendChild(body);
  parent.appendChild(root);
}

/* ----------------------------------------------------
   View Implementation: MONTH
---------------------------------------------------- */
function renderMonthView(parent) {
  const root = document.createElement("div");
  root.className = "month-view-container";
  
  // Headers row
  const headers = document.createElement("div");
  headers.className = "month-grid-headers";
  
  // Week column header
  const weekLabel = document.createElement("div");
  weekLabel.className = "month-week-header-label";
  weekLabel.innerHTML = `<i data-lucide="calendar-days" style="width:14px;height:14px;color:var(--text-muted);"></i>`;
  headers.appendChild(weekLabel);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach(day => {
    const label = document.createElement("div");
    label.className = "month-header-label";
    label.innerText = day;
    headers.appendChild(label);
  });
  root.appendChild(headers);
  
  // Calculate day cells
  const d = new Date(state.currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  
  // First day of month
  const firstDay = new Date(year, month, 1);
  // Get day of week (Monday as index 0)
  let firstDayIndex = firstDay.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6; // Sunday index correction
  
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Total days in previous month
  const prevTotalDays = new Date(year, month, 0).getDate();
  
  const cells = document.createElement("div");
  cells.className = "month-grid-cells";
  
  // Render weeks (each row has 1 week nav cell + 7 day cells)
  for (let week = 0; week < 6; week++) {
    // 1. Create and append the week action cell
    const weekCell = document.createElement("div");
    weekCell.className = "month-week-nav-cell";
    
    // Calculate the Monday date of this week to jump to
    const offsetIndex = week * 7;
    let weekMondayDate;
    if (offsetIndex < firstDayIndex) {
      weekMondayDate = new Date(year, month - 1, prevTotalDays - (firstDayIndex - 1 - offsetIndex));
    } else if (offsetIndex < firstDayIndex + totalDays) {
      weekMondayDate = new Date(year, month, offsetIndex - firstDayIndex + 1);
    } else {
      weekMondayDate = new Date(year, month + 1, offsetIndex - firstDayIndex - totalDays + 1);
    }

    weekCell.innerHTML = `
      <button type="button" class="btn-month-week-nav" title="Switch to this Week View">
        <i data-lucide="arrow-right-left" style="width:14px;height:14px;transform:rotate(90deg);"></i>
        <span>W${week + 1}</span>
      </button>
    `;
    
    weekCell.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      state.currentDate = new Date(weekMondayDate);
      state.currentView = "week";
      
      // Update UI active view selectors
      document.querySelectorAll(".btn-view").forEach(btn => {
        if (btn.getAttribute("data-view") === "week") btn.classList.add("active");
        else btn.classList.remove("active");
      });
      updatePillPosition(true);
      
      renderCalendar();
      updateAgendaList();
    });
    
    cells.appendChild(weekCell);
    
    // 2. Append the 7 day cells for this week
    for (let day = 0; day < 7; day++) {
      const idx = week * 7 + day;
      let cellDate;
      let isDimmed = false;
      
      if (idx < firstDayIndex) {
        cellDate = new Date(year, month - 1, prevTotalDays - (firstDayIndex - 1 - idx));
        isDimmed = true;
      } else if (idx < firstDayIndex + totalDays) {
        cellDate = new Date(year, month, idx - firstDayIndex + 1);
        isDimmed = false;
      } else {
        cellDate = new Date(year, month + 1, idx - firstDayIndex - totalDays + 1);
        isDimmed = true;
      }
      
      cells.appendChild(createMonthCell(cellDate, isDimmed));
    }
  }
  
  root.appendChild(cells);
  parent.appendChild(root);
}

function createMonthCell(date, isOtherMonth) {
  const cell = document.createElement("div");
  cell.className = "month-day-cell";
  if (isOtherMonth) cell.classList.add("other-month");
  if (isSameDay(date, new Date())) cell.classList.add("is-today");
  
  const dateStr = getFormattedDateStr(date);
  cell.setAttribute("data-date", dateStr);
  
  // Day number
  const num = document.createElement("div");
  num.className = "month-day-num";
  num.innerText = date.getDate();
  cell.appendChild(num);
  
  // Container for tasks
  const tasksContainer = document.createElement("div");
  tasksContainer.className = "month-cell-tasks-container";
  
  // Tasks filtered for this day
  const dayTasks = state.tasks.filter(t => t.date === dateStr && state.filters[t.category]);
  // Sort tasks by time
  dayTasks.sort((a,b) => getMinutes(a.startTime) - getMinutes(b.startTime));
  
  dayTasks.forEach(task => {
    const mini = document.createElement("div");
    mini.className = `month-mini-task cat-${task.category}`;
    mini.innerText = `${task.startTime} ${task.title}`;
    mini.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent opening create dialog on cell
      openTaskDialog(task.id);
    });
    tasksContainer.appendChild(mini);
  });
  
  cell.appendChild(tasksContainer);
  
  // Click on cell opens dialog to add task
  cell.addEventListener("click", () => {
    openTaskDialog(null, dateStr, "09:00");
  });
  
  return cell;
}

/* ----------------------------------------------------
   View Implementation: YEAR
---------------------------------------------------- */
function renderYearView(parent) {
  const root = document.createElement("div");
  root.className = "year-view-container";
  
  const year = state.currentDate.getFullYear();
  
  for (let m = 0; m < 12; m++) {
    const card = document.createElement("div");
    card.className = "year-month-card";
    
    // Header
    const title = document.createElement("div");
    title.className = "year-month-title";
    const dateObj = new Date(year, m, 1);
    title.innerText = dateObj.toLocaleDateString("en-US", { month: "long" });
    card.appendChild(title);
    
    // Grid Headers (S M T W T F S)
    const miniHeaders = document.createElement("div");
    miniHeaders.className = "year-mini-grid-headers";
    ["M","T","W","T","F","S","S"].forEach(day => {
      const l = document.createElement("span");
      l.innerText = day;
      miniHeaders.appendChild(l);
    });
    card.appendChild(miniHeaders);
    
    // Day mini-grid
    const miniDays = document.createElement("div");
    miniDays.className = "year-mini-grid-days";
    
    // Compute padding and offsets
    const firstDay = new Date(year, m, 1);
    let firstDayIndex = firstDay.getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;
    
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    
    // Render empty spacers
    for (let i = 0; i < firstDayIndex; i++) {
      const spacer = document.createElement("span");
      spacer.className = "year-mini-day empty";
      miniDays.appendChild(spacer);
    }
    
    // Render month day numbers
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, m, d);
      const span = document.createElement("span");
      span.className = "year-mini-day";
      span.innerText = d;
      
      if (isSameDay(curDate, new Date())) {
        span.classList.add("is-today");
      }
      
      // Draw indicator dot if this day has tasks
      const dateStr = getFormattedDateStr(curDate);
      const hasTasks = state.tasks.some(t => t.date === dateStr);
      if (hasTasks) {
        span.classList.add("has-tasks");
      }
      
      miniDays.appendChild(span);
    }
    
    card.appendChild(miniDays);
    
    // Clicking a month card navigates to Month view and centers on that month
    card.addEventListener("click", () => {
      state.currentDate = new Date(year, m, 1);
      switchViewMode("month");
    });
    
    root.appendChild(card);
  }
  
  parent.appendChild(root);
}

/* ----------------------------------------------------
   Task UI Component Generator
---------------------------------------------------- */
function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = `task-card-event cat-${task.category}`;
  if (task.completed) {
    card.classList.add("completed");
  }
  
  // Placement settings based on layoutTask calculations
  const startMin = getMinutes(task.startTime);
  const duration = parseInt(task.duration);
  
  const topPx = (startMin / 60) * state.hourRowHeight;
  const heightPx = (duration / 60) * state.hourRowHeight;
  
  card.style.top = `${topPx}px`;
  card.style.height = `${heightPx}px`;
  
  // Absolute overlapping layout values
  if (task.colWidth !== undefined) {
    card.style.width = `calc(${task.colWidth}% - 8px)`;
    card.style.left = `calc(${task.colLeft}% + 4px)`;
  }
  
  // Content
  const title = document.createElement("div");
  title.className = "task-card-title";
  title.innerText = task.title;
  
  const time = document.createElement("div");
  time.className = "task-card-time";
  time.innerHTML = `<i data-lucide="clock" style="width:10px;height:10px;"></i> ${formatTime12h(task.startTime)}`;
  
  card.appendChild(title);
  if (duration >= 30) {
    card.appendChild(time);
  }
  
  // Checkbox button for reward claiming
  const claimBtn = document.createElement("div");
  claimBtn.className = "btn-claim";
  claimBtn.innerHTML = `<i data-lucide="check" style="width:12px;height:12px;"></i>`;
  claimBtn.title = task.completed ? "Undo Completed" : "Claim Rewards / Complete";
  
  claimBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    claimRewards(task, card);
  });
  card.appendChild(claimBtn);
  
  // Hover details tooltip event bindings
  card.addEventListener("mouseenter", (e) => {
    showCalendarTooltip(task, e);
  });
  
  card.addEventListener("mouseleave", () => {
    hideCalendarTooltip();
  });
  
  card.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent columns add clicks
    openTaskDialog(task.id);
  });
  
  return card;
}

/* ----------------------------------------------------
   Real-Time Current Time Tracker Indicator
---------------------------------------------------- */
function updateLiveTimeIndicator() {
  // First clean up any existing indicator lines
  document.querySelectorAll(".live-time-indicator").forEach(el => el.remove());
  
  // Live line is only visual in Day and Week views
  if (state.currentView !== "day" && state.currentView !== "week") return;
  
  const todayStr = getFormattedDateStr(new Date());
  
  // Find column element targeting today
  const todayCol = document.querySelector(`.grid-day-column[data-date="${todayStr}"]`);
  if (!todayCol) return;
  
  // Compute line offset top position
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const topPx = (minutes / 60) * state.hourRowHeight;
  
  // Create indicator line
  const line = document.createElement("div");
  line.className = "live-time-indicator";
  line.style.top = `${topPx}px`;
  
  todayCol.appendChild(line);
}

/* ----------------------------------------------------
   Agenda Sidebar Controller
---------------------------------------------------- */
function updateAgendaList() {
  const container = document.getElementById("agenda-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const todayStr = getFormattedDateStr(new Date());
  const todayTasks = state.tasks.filter(t => t.date === todayStr && state.filters[t.category]);
  
  if (todayTasks.length === 0) {
    container.innerHTML = `<div class="empty-state">No events scheduled today.</div>`;
    return;
  }
  
  // Sort by time
  todayTasks.sort((a,b) => getMinutes(a.startTime) - getMinutes(b.startTime));
  
  todayTasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "agenda-item";
    item.style.setProperty("--cat-color", `var(--color-${task.category})`);
    
    const title = document.createElement("div");
    title.className = "agenda-title";
    title.innerText = task.title;
    
    const time = document.createElement("div");
    time.className = "agenda-time";
    time.innerText = `${formatTime12h(task.startTime)} (${task.duration} min)`;
    
    item.appendChild(title);
    item.appendChild(time);
    
    item.addEventListener("click", () => {
      openTaskDialog(task.id);
    });
    
    container.appendChild(item);
  });
}

/* ----------------------------------------------------
   Task Create / Edit Modal Operations
---------------------------------------------------- */
const taskDialog = document.getElementById("task-dialog");
const taskForm = document.getElementById("task-form");
const deleteBtn = document.getElementById("btn-delete-task");
const closeBtn = document.getElementById("btn-close-dialog");
const cancelBtn = document.getElementById("btn-cancel-dialog");

function setupTaskFormListeners() {
  closeBtn.addEventListener("click", () => taskDialog.close());
  cancelBtn.addEventListener("click", () => taskDialog.close());
  
  deleteBtn.addEventListener("click", () => {
    const taskId = document.getElementById("task-id").value;
    if (taskId) {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
      localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
      
      triggerViewChange(() => {
        renderCalendar();
        updateAgendaList();
      });
      taskDialog.close();
    }
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const id = document.getElementById("task-id").value || generateUUID();
    const title = document.getElementById("task-title").value.trim();
    const date = document.getElementById("task-date").value;
    const startTime = document.getElementById("task-time").value;
    const duration = parseInt(document.getElementById("task-duration").value);
    const category = document.getElementById("task-category").value;
    const desc = document.getElementById("task-desc").value.trim();
    
    const existingIndex = state.tasks.findIndex(t => t.id === id);
    
    const taskObj = {
      id,
      title,
      description: desc,
      date,
      startTime,
      duration,
      category,
      completed: existingIndex > -1 ? state.tasks[existingIndex].completed : false,
      xp: existingIndex > -1 ? (state.tasks[existingIndex].xp || 30) : 30,
      stress: existingIndex > -1 ? (state.tasks[existingIndex].stress || 10) : 10,
      value: existingIndex > -1 ? (state.tasks[existingIndex].value || 0) : 0
    };
    
    if (existingIndex > -1) {
      // Update
      state.tasks[existingIndex] = taskObj;
    } else {
      // Create
      state.tasks.push(taskObj);
    }
    
    localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
    
    triggerViewChange(() => {
      renderCalendar();
      updateAgendaList();
    });
    
    taskDialog.close();
  });
}

function openTaskDialog(taskId = null, defaultDateStr = null, defaultTimeStr = null, templateId = null) {
  taskForm.reset();
  
  const dialogTitle = document.getElementById("dialog-title");
  
  if (taskId) {
    // Edit Mode
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    dialogTitle.innerText = "Edit Event";
    document.getElementById("task-id").value = task.id;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-date").value = task.date;
    document.getElementById("task-time").value = task.startTime;
    document.getElementById("task-duration").value = task.duration;
    document.getElementById("task-category").value = task.category;
    document.getElementById("task-desc").value = task.description || "";
    
    deleteBtn.classList.remove("hidden");
  } else {
    // New Mode
    dialogTitle.innerText = "New Event / Task";
    document.getElementById("task-id").value = "";
    
    // Set default fields
    const today = new Date();
    document.getElementById("task-date").value = defaultDateStr || getFormattedDateStr(today);
    
    if (defaultTimeStr) {
      document.getElementById("task-time").value = defaultTimeStr;
    } else {
      const nowHour = today.getHours();
      const currentFormattedTime = `${String(nowHour).padStart(2, '0')}:00`;
      document.getElementById("task-time").value = currentFormattedTime;
    }
    
    let title = "";
    let duration = "60";
    let category = "work";
    let desc = "";
    
    if (templateId) {
      const template = state.templates.find(t => t.id === templateId) || pastTemplates.find(t => t.id === templateId);
      if (template) {
        title = template.title;
        category = template.category;
        duration = template.duration;
        desc = `Action Block: ${template.title}`;
      }
    }
    
    document.getElementById("task-title").value = title;
    document.getElementById("task-duration").value = duration;
    document.getElementById("task-category").value = category;
    document.getElementById("task-desc").value = desc;
    
    deleteBtn.classList.add("hidden");
  }
  
  // Show dialog using native method (enforces overlay and focus)
  taskDialog.showModal();
}

// Attach Quick Add listener
document.getElementById("btn-quick-add").addEventListener("click", () => {
  openTaskDialog();
});

/* ----------------------------------------------------
   Pomodoro Focus Timer Widget
---------------------------------------------------- */
function setupPomodoroListeners() {
  const toggleBtn = document.getElementById("btn-timer-toggle");
  const resetBtn = document.getElementById("btn-timer-reset");
  
  toggleBtn.addEventListener("click", () => {
    if (state.pomodoro.isRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  });

  resetBtn.addEventListener("click", () => {
    resetPomodoro();
  });
}

function startPomodoro() {
  const toggleBtn = document.getElementById("btn-timer-toggle");
  state.pomodoro.isRunning = true;
  toggleBtn.innerHTML = `<i data-lucide="pause"></i>`;
  lucide.createIcons();
  
  state.pomodoro.intervalId = setInterval(() => {
    state.pomodoro.timeLeft--;
    updatePomodoroDisplay();
    
    if (state.pomodoro.timeLeft <= 0) {
      clearInterval(state.pomodoro.intervalId);
      triggerPomodoroSessionComplete();
    }
  }, 1000);
}

function pausePomodoro() {
  const toggleBtn = document.getElementById("btn-timer-toggle");
  state.pomodoro.isRunning = false;
  toggleBtn.innerHTML = `<i data-lucide="play"></i>`;
  lucide.createIcons();
  
  clearInterval(state.pomodoro.intervalId);
}

function resetPomodoro() {
  pausePomodoro();
  
  // Reset seconds based on mode
  if (state.pomodoro.mode === "work") {
    state.pomodoro.duration = 25 * 60;
  } else {
    state.pomodoro.duration = 5 * 60;
  }
  
  state.pomodoro.timeLeft = state.pomodoro.duration;
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const display = document.getElementById("timer-time");
  const progressCircle = document.getElementById("pomodoro-progress");
  
  const m = Math.floor(state.pomodoro.timeLeft / 60);
  const s = state.pomodoro.timeLeft % 60;
  display.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  // Progress Ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // 326.72
  const progress = (state.pomodoro.duration - state.pomodoro.timeLeft) / state.pomodoro.duration;
  const offset = circumference * (1 - progress);
  
  progressCircle.style.strokeDashoffset = offset;
}

function triggerPomodoroSessionComplete() {
  // Toggle Mode
  if (state.pomodoro.mode === "work") {
    state.pomodoro.mode = "break";
    document.getElementById("pomodoro-mode").innerText = "Break";
    document.getElementById("pomodoro-mode").style.background = "rgba(16, 185, 129, 0.15)";
    document.getElementById("pomodoro-mode").style.color = "#10b981";
    state.pomodoro.duration = 5 * 60;
    
    // Play alert sound if available
    showAppAlert("⏰ Time to take a break!");
  } else {
    state.pomodoro.mode = "work";
    document.getElementById("pomodoro-mode").innerText = "Work";
    document.getElementById("pomodoro-mode").style.background = "rgba(99, 102, 241, 0.15)";
    document.getElementById("pomodoro-mode").style.color = "#818cf8";
    state.pomodoro.duration = 25 * 60;
    
    showAppAlert("🎯 Break finished, time to focus!");
  }
  
  state.pomodoro.timeLeft = state.pomodoro.duration;
  updatePomodoroDisplay();
  pausePomodoro();
}

/* ----------------------------------------------------
   Date Helper Utilities
---------------------------------------------------- */

// Returns starting Monday of the week containing the specified date
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Compare two Date objects (ignoring time)
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Returns YYYY-MM-DD local format string
function getFormattedDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Converts index (0-23) into clean label
function formatHourLabel(h) {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

// Converts 24h format HH:MM into AM/PM
function formatTime12h(time24) {
  if (!time24 || typeof time24 !== 'string') return "12:00 AM";
  const parts = time24.split(":");
  if (parts.length < 2) return "12:00 AM";
  const [h, m] = parts.map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// Converts HH:MM string to absolute minutes from start of day
function getMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(":");
  if (parts.length < 2) return 0;
  const [h, m] = parts.map(Number);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

// Generates simple unique key
function generateUUID() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Handles overlapping columns layout inside a single day
function layoutTasksForDay(dayTasks) {
  if (dayTasks.length === 0) return;
  
  // Sort tasks by startTime
  dayTasks.sort((a, b) => getMinutes(a.startTime) - getMinutes(b.startTime));
  
  const columns = [];
  
  dayTasks.forEach(task => {
    const start = getMinutes(task.startTime);
    const end = start + parseInt(task.duration);
    
    let colIndex = 0;
    while (true) {
      if (!columns[colIndex]) {
        columns[colIndex] = [];
      }
      
      const overlaps = columns[colIndex].some(t => {
        const tStart = getMinutes(t.startTime);
        const tEnd = tStart + parseInt(t.duration);
        return (start < tEnd && end > tStart);
      });
      
      if (!overlaps) {
        columns[colIndex].push(task);
        task.colIndex = colIndex;
        break;
      }
      colIndex++;
    }
  });
  
  const maxCols = columns.length;
  dayTasks.forEach(task => {
    task.colWidth = 100 / maxCols;
    task.colLeft = task.colIndex * task.colWidth;
  });
}

/* ----------------------------------------------------
   Gamification System & Smart Suggestions
---------------------------------------------------- */

// Render User Stats Widget
function renderUserStats() {
  const levelEl = document.getElementById("user-level");
  const xpTextEl = document.getElementById("xp-text");
  const xpFillEl = document.getElementById("xp-fill");
  const stressTextEl = document.getElementById("stress-text");
  const stressFillEl = document.getElementById("stress-fill");
  const valueTextEl = document.getElementById("value-text");

  if (!levelEl || !xpTextEl || !xpFillEl || !stressTextEl || !stressFillEl || !valueTextEl) return;

  const stats = state.userStats;

  // Level & XP
  levelEl.innerText = stats.level;
  xpTextEl.innerText = `${stats.xp} / 1000 XP`;
  const xpPercentage = Math.min(100, Math.max(0, (stats.xp / 1000) * 100));
  xpFillEl.style.width = `${xpPercentage}%`;

  // Stress Level
  stressTextEl.innerText = `${stats.stress}%`;
  stressFillEl.style.width = `${stats.stress}%`;
  
  // Highlight Stress alert if high
  if (stats.stress >= 65) {
    stressFillEl.style.background = "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)";
    stressFillEl.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.6)";
  } else {
    stressFillEl.style.background = "";
    stressFillEl.style.boxShadow = "";
  }

  // Value Generated Ticker (Handles negative currency)
  if (stats.value >= 0) {
    valueTextEl.innerText = `$${stats.value.toFixed(2)}`;
    valueTextEl.style.color = "#10b981"; // green
  } else {
    valueTextEl.innerText = `-$${Math.abs(stats.value).toFixed(2)}`;
    valueTextEl.style.color = "#ef4444"; // red
  }
}

// Render Draggable Templates List
// Render Draggable Templates List
function renderActionTemplates() {
  const container = document.getElementById("templates-container");
  if (!container) return;

  container.innerHTML = "";

  const sim = state.activeSimulation;
  const isWeeklySim = state.currentView === "simulation" && sim && sim.scenarioId === "weekly-simulator";
  
  // Manage Tabs Bar
  let tabsBar = document.getElementById("templates-tabs-bar");
  if (isWeeklySim) {
    if (tabsBar) tabsBar.style.display = "none";
  } else {
    if (!tabsBar) {
      tabsBar = document.createElement("div");
      tabsBar.id = "templates-tabs-bar";
      tabsBar.className = "templates-tabs-bar";
      tabsBar.style.display = "flex";
      tabsBar.style.background = "rgba(0,0,0,0.15)";
      tabsBar.style.borderRadius = "8px";
      tabsBar.style.padding = "3px";
      tabsBar.style.margin = "0.5rem 0";
      tabsBar.innerHTML = `
        <button class="templates-tab-btn" data-tab="blocks" style="flex: 1; text-align: center; padding: 6px 12px; font-size: 0.8rem; font-weight: 500; border-radius: 6px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s;">Action Blocks</button>
        <button class="templates-tab-btn" data-tab="routines" style="flex: 1; text-align: center; padding: 6px 12px; font-size: 0.8rem; font-weight: 500; border-radius: 6px; border: none; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s;">Daily Routines</button>
      `;
      
      const searchContainer = document.querySelector(".templates-search-container");
      if (searchContainer) {
        searchContainer.parentNode.insertBefore(tabsBar, searchContainer.nextSibling);
      }
      
      tabsBar.querySelectorAll(".templates-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          soundEffects.play("click");
          const tab = btn.getAttribute("data-tab");
          state.activeTemplateTab = tab;
          renderActionTemplates();
        });
      });
    } else {
      tabsBar.style.display = "flex";
    }

    // Always synchronize active class and styling on buttons every render
    tabsBar.querySelectorAll(".templates-tab-btn").forEach(btn => {
      const tab = btn.getAttribute("data-tab");
      if (tab === state.activeTemplateTab) {
        btn.classList.add("active");
        btn.style.background = "rgba(255,255,255,0.08)";
        btn.style.color = "white";
      } else {
        btn.classList.remove("active");
        btn.style.background = "transparent";
        btn.style.color = "var(--text-muted)";
      }
    });
  }

  // Ensure activeTemplateTab is initialized
  if (!state.activeTemplateTab) {
    state.activeTemplateTab = "blocks";
  }

  // Gather templates search query
  const searchInput = document.getElementById("templates-search-input");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  // If in Weekly Simulator, or active tab is "routines", hijack to display Daily Routines
  if (isWeeklySim || state.activeTemplateTab === "routines") {
    // Change templates widget title to "Daily Routines"
    const titleEl = document.querySelector(".templates-widget .widget-header h3");
    if (titleEl) {
      titleEl.innerHTML = `<i data-lucide="archive" style="color:#a855f7;width:16px;height:16px;"></i> Daily Routines`;
    }
    // Hide the action buttons
    const actions = document.querySelector(".templates-widget .widget-header-actions");
    if (actions) actions.style.display = "none";

    // Fetch daily routines and search query
    const routinesList = getAvailableDailyRoutines();
    const filteredRoutines = query 
      ? routinesList.filter(tpl => tpl.title.toLowerCase().includes(query))
      : routinesList;

    filteredRoutines.forEach(tpl => {
      const card = document.createElement("div");
      card.className = "draggable-action-card daily-routine-card";
      card.setAttribute("draggable", "true");

      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.innerHTML = `<i data-lucide="grip-vertical" style="width:14px;height:14px;"></i>`;
      card.appendChild(handle);

      const details = document.createElement("div");
      details.className = "card-details";

      const title = document.createElement("h4");
      title.innerText = tpl.title;
      details.appendChild(title);

      const metricsRow = document.createElement("div");
      metricsRow.className = "card-metrics";

      const totalSteps = tpl.steps.length;
      const totalXP = tpl.steps.reduce((acc, s) => acc + (s.xp || 0), 0);
      const totalValue = tpl.steps.reduce((acc, s) => acc + (s.value || 0), 0);
      
      const stepPill = document.createElement("span");
      stepPill.className = "metric-pill xp";
      stepPill.innerText = `${totalSteps} tasks`;
      metricsRow.appendChild(stepPill);

      const xpPill = document.createElement("span");
      xpPill.className = "metric-pill xp";
      xpPill.innerText = `+${totalXP} XP`;
      metricsRow.appendChild(xpPill);

      if (totalValue !== 0) {
        const valPill = document.createElement("span");
        if (totalValue > 0) {
          valPill.className = "metric-pill value metric-value-positive";
          valPill.innerText = `+$${totalValue}`;
        } else {
          valPill.className = "metric-pill value metric-value-negative";
          valPill.innerText = `-$${Math.abs(totalValue)}`;
        }
        metricsRow.appendChild(valPill);
      }

      details.appendChild(metricsRow);
      card.appendChild(details);

      // Drag start listener
      card.addEventListener("dragstart", (e) => {
        soundEffects.play("swoosh");
        card.style.opacity = "0.5";
        const dragData = {
          type: "daily-routine",
          title: tpl.title,
          steps: tpl.steps
        };
        e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = "copy";
      });

      card.addEventListener("dragend", () => {
        card.style.opacity = "";
      });

      card.addEventListener("click", () => {
        soundEffects.play("click");
        if (tpl.isFullWeek) {
          // Special: apply college timetable with per-day routines
          showAppConfirm("🎓 Apply your full college timetable (Mon–Fri) to this week?\\n\\nThis will add all lectures, labs, breaks, and sports for Batch-2 CV-5.", (confirmed) => {
            if (!confirmed) return;
            showAppConfirm("Overwrite existing tasks for this week, or append alongside them?\\n\\nChoose Confirm to OVERWRITE, or Cancel to APPEND.", (overwrite) => {
              const today = new Date();
              const dayOfWeek = today.getDay();
              const monday = new Date(today);
              monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
              monday.setHours(0, 0, 0, 0);
              applyCollegeTimetableToWeek(monday, overwrite ? "overwrite" : "append");
            });
          });
        } else if (isWeeklySim) {
          openAssignRoutineDialog(tpl);
        } else {
          openApplyRoutineCalendarDialog(tpl);
        }
      });

      container.appendChild(card);
    });

    lucide.createIcons();
    return;
  }

  // Restore templates widget header for standard views
  const titleEl = document.querySelector(".templates-widget .widget-header h3");
  if (titleEl) {
    titleEl.innerHTML = `<i data-lucide="layout-grid"></i> Action Blocks`;
  }
  const actions = document.querySelector(".templates-widget .widget-header-actions");
  if (actions) actions.style.display = "flex";

  // Prepare templates with correct groupId
  const allTpls = state.templates.map(t => ({ ...t, groupId: t.groupId || "group-academic" }));

  // Render group by group
  state.groups.forEach(group => {
    // Filter templates belonging to this group
    const groupTemplates = allTpls.filter(t => t.groupId === group.id);
    
    // Apply search query filter if typed
    const filteredTemplates = query 
      ? groupTemplates.filter(t => t.title.toLowerCase().includes(query))
      : groupTemplates;

    // If search is active and no items match, we skip rendering this group container
    if (query && filteredTemplates.length === 0) return;

    // Create group element
    const groupWrap = document.createElement("div");
    groupWrap.className = "group-container";
    
    // Determine collapsed state: if searching, auto-expand so items are visible!
    const isCollapsed = query ? false : !!state.collapsedGroups[group.id];
    if (isCollapsed) {
      groupWrap.classList.add("collapsed");
    }

    // Create group header
    const gHeader = document.createElement("div");
    gHeader.className = "group-header";
    gHeader.innerHTML = `
      <span class="group-toggle-arrow"><i data-lucide="chevron-down" style="width:12px;height:12px;"></i></span>
      <span class="group-title">${group.title}</span>
      <span class="group-badge">${filteredTemplates.length}</span>
    `;

    // Only allow editing/deleting custom groups (non-builtins)
    const isBuiltinGroup = ["group-academic", "group-breaks", "group-wellness", "group-gaming", "group-chores", "group-past"].includes(group.id);
    if (!isBuiltinGroup) {
      const gActions = document.createElement("div");
      gActions.className = "group-actions";
      
      const editBtn = document.createElement("button");
      editBtn.className = "btn-group-action";
      editBtn.title = "Rename Group";
      editBtn.innerHTML = `<i data-lucide="edit-3" style="width:10px;height:10px;"></i>`;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditGroupDialog(group);
      });
      gActions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-group-action";
      deleteBtn.title = "Delete Group & Keep Templates";
      deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width:10px;height:10px;"></i>`;
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteGroup(group.id);
      });
      gActions.appendChild(deleteBtn);

      gHeader.appendChild(gActions);
    }

    // Toggle collapse on click
    gHeader.addEventListener("click", () => {
      if (query) return; // Disable collapsing during active searches
      const currentlyCollapsed = groupWrap.classList.contains("collapsed");
      if (currentlyCollapsed) {
        groupWrap.classList.remove("collapsed");
        state.collapsedGroups[group.id] = false;
      } else {
        groupWrap.classList.add("collapsed");
        state.collapsedGroups[group.id] = true;
      }
      localStorage.setItem("aetherflow_collapsed_groups", JSON.stringify(state.collapsedGroups));
    });

    groupWrap.appendChild(gHeader);

    // Group Content list
    const gContent = document.createElement("div");
    gContent.className = "group-content";

    filteredTemplates.forEach(tpl => {
      const card = document.createElement("div");
      card.className = "draggable-action-card";
      card.setAttribute("draggable", "true");
      card.setAttribute("data-template-id", tpl.id);

      const handle = document.createElement("div");
      handle.className = "drag-handle";
      handle.innerHTML = `<i data-lucide="grip-vertical" style="width:14px;height:14px;"></i>`;
      card.appendChild(handle);

      const details = document.createElement("div");
      details.className = "card-details";

      const title = document.createElement("h4");
      title.innerText = tpl.title;
      details.appendChild(title);

      const metricsRow = document.createElement("div");
      metricsRow.className = "card-metrics";

      // XP
      const xpPill = document.createElement("span");
      xpPill.className = "metric-pill xp";
      xpPill.innerHTML = `+${tpl.xp} XP`;
      metricsRow.appendChild(xpPill);

      // Stress Color Tagging
      const stressPill = document.createElement("span");
      const stressVal = tpl.stress;
      if (stressVal < 0) {
        stressPill.className = "metric-pill stress metric-stress-negative";
        stressPill.innerHTML = `${stressVal} Stress`;
      } else {
        stressPill.className = "metric-pill stress metric-stress-positive";
        stressPill.innerHTML = `+${stressVal} Stress`;
      }
      metricsRow.appendChild(stressPill);

      // Value Color Tagging
      if (tpl.value !== 0) {
        const valPill = document.createElement("span");
        const valVal = tpl.value;
        if (valVal > 0) {
          valPill.className = "metric-pill value metric-value-positive";
          valPill.innerHTML = `+$${valVal}`;
        } else {
          valPill.className = "metric-pill value metric-value-negative";
          valPill.innerHTML = `-$${Math.abs(valVal)}`;
        }
        metricsRow.appendChild(valPill);
      }

      // Duration pill inside card metrics for direct clarity
      const durPill = document.createElement("span");
      durPill.className = "metric-pill duration";
      durPill.innerHTML = `<i data-lucide="clock" style="width:10px;height:10px;display:inline-block;vertical-align:middle;margin-right:2px;"></i>${tpl.duration}m`;
      metricsRow.appendChild(durPill);

      details.appendChild(metricsRow);
      card.appendChild(details);

      // Add edit & delete buttons for templates
      const editBtn = document.createElement("button");
      editBtn.className = "btn-edit-template";
      editBtn.title = "Edit Action Block";
      editBtn.innerHTML = `<i data-lucide="edit-3" style="width:12px;height:12px;"></i>`;
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditTemplateDialog(tpl);
      });
      card.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-delete-template";
      deleteBtn.title = "Delete Action Block";
      deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width:12px;height:12px;"></i>`;
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTemplate(tpl.id);
      });
      card.appendChild(deleteBtn);

      // Drag events
      card.addEventListener("dragstart", (e) => {
        soundEffects.play("swoosh");
        e.dataTransfer.setData("text/plain", tpl.id);
        e.dataTransfer.effectAllowed = "copy";
        card.style.opacity = "0.5";
      });

      card.addEventListener("dragend", () => {
        card.style.opacity = "";
      });

      // Click event for tap-to-add (mobile-friendly helper)
      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-edit-template") || e.target.closest(".btn-delete-template")) return;
        
        soundEffects.play("click");
        
        const sim = state.activeSimulation;
        if (state.currentView === "simulation" && sim) {
          if (sim.scenarioId === "weekly-simulator") {
            // Handled separately for daily routines templates
          } else {
            addTemplateToSimSteps(tpl);
          }
        } else {
          openTaskDialog(null, getFormattedDateStr(state.currentDate), null, tpl.id);
        }
      });

      gContent.appendChild(card);
    });

    groupWrap.appendChild(gContent);
    container.appendChild(groupWrap);
  });

  lucide.createIcons();
}

// Template Deletion Helper
function deleteTemplate(templateId) {
  state.templates = state.templates.filter(t => t.id !== templateId);
  
  const customList = JSON.parse(localStorage.getItem("aetherflow_custom_templates") || "[]").filter(t => t.id !== templateId);
  localStorage.setItem("aetherflow_custom_templates", JSON.stringify(customList));
  
  const deletedList = JSON.parse(localStorage.getItem("aetherflow_deleted_templates") || "[]");
  if (!deletedList.includes(templateId)) {
    deletedList.push(templateId);
    localStorage.setItem("aetherflow_deleted_templates", JSON.stringify(deletedList));
  }
  
  renderActionTemplates();
  updateSuggestions();
}

// Setup Custom Groups Creator/Editor listeners
function setupGroupDialogListeners() {
  const groupDialog = document.getElementById("group-dialog");
  const groupForm = document.getElementById("group-form");
  const addGroupBtn = document.getElementById("btn-add-group");
  const closeGroupBtn = document.getElementById("btn-close-group-dialog");
  const cancelGroupBtn = document.getElementById("btn-cancel-group-dialog");

  if (!groupDialog || !groupForm) return;

  if (addGroupBtn) {
    addGroupBtn.addEventListener("click", () => {
      groupForm.reset();
      document.getElementById("group-id").value = "";
      document.getElementById("group-dialog-title").innerText = "Create Custom Group";
      groupDialog.showModal();
    });
  }

  if (closeGroupBtn) closeGroupBtn.addEventListener("click", () => groupDialog.close());
  if (cancelGroupBtn) cancelGroupBtn.addEventListener("click", () => groupDialog.close());

  groupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("group-id").value;
    const title = document.getElementById("group-title").value.trim();

    if (id) {
      const idx = state.groups.findIndex(g => g.id === id);
      if (idx !== -1) {
        state.groups[idx].title = title;
      }
    } else {
      const newId = "group-custom-" + generateUUID();
      state.groups.push({ id: newId, title: title });
    }

    localStorage.setItem("aetherflow_template_groups", JSON.stringify(state.groups));
    populateGroupDropdowns();
    renderActionTemplates();
    groupDialog.close();
  });
}

function openEditGroupDialog(group) {
  const groupDialog = document.getElementById("group-dialog");
  if (!groupDialog) return;
  document.getElementById("group-id").value = group.id;
  document.getElementById("group-title").value = group.title;
  document.getElementById("group-dialog-title").innerText = "Rename Action Group";
  groupDialog.showModal();
}

function deleteGroup(groupId) {
  state.templates.forEach(t => {
    if (t.groupId === groupId) {
      t.groupId = "group-academic";
    }
  });
  
  const customList = JSON.parse(localStorage.getItem("aetherflow_custom_templates") || "[]");
  customList.forEach(t => {
    if (t.groupId === groupId) {
      t.groupId = "group-academic";
    }
  });
  localStorage.setItem("aetherflow_custom_templates", JSON.stringify(customList));

  const modifiedBuiltins = JSON.parse(localStorage.getItem("aetherflow_modified_builtins") || "{}");
  Object.keys(modifiedBuiltins).forEach(k => {
    if (modifiedBuiltins[k].groupId === groupId) {
      modifiedBuiltins[k].groupId = "group-academic";
    }
  });
  localStorage.setItem("aetherflow_modified_builtins", JSON.stringify(modifiedBuiltins));

  state.groups = state.groups.filter(g => g.id !== groupId);
  localStorage.setItem("aetherflow_template_groups", JSON.stringify(state.groups));

  populateGroupDropdowns();
  renderActionTemplates();
}

function populateGroupDropdowns() {
  const dropdown = document.getElementById("tpl-group");
  if (!dropdown) return;
  dropdown.innerHTML = "";
  
  state.groups.forEach(g => {
    if (g.id === "group-past") return;
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.innerText = g.title;
    dropdown.appendChild(opt);
  });
}

// Prefill and open template editor
function openEditTemplateDialog(tpl) {
  const dialog = document.getElementById("template-dialog");
  const form = document.getElementById("template-form");
  if (!dialog || !form) return;

  document.getElementById("template-dialog-title").innerText = "Edit Action Block";
  document.getElementById("btn-submit-template").innerText = "Save Changes";

  state.editingTemplateId = tpl.id;
  document.getElementById("tpl-title").value = tpl.title;
  document.getElementById("tpl-category").value = tpl.category;
  
  populateGroupDropdowns();
  document.getElementById("tpl-group").value = tpl.groupId || "group-academic";
  
  document.getElementById("tpl-duration").value = tpl.duration;
  document.getElementById("tpl-xp").value = tpl.xp;
  document.getElementById("tpl-stress").value = tpl.stress;
  document.getElementById("tpl-value").value = tpl.value;

  dialog.showModal();
}

// Setup stats manual editor listeners
function setupStatsDialogListeners() {
  const statsDialog = document.getElementById("stats-dialog");
  const statsForm = document.getElementById("stats-form");
  const editStatsBtn = document.getElementById("btn-edit-stats");
  const closeStatsBtn = document.getElementById("btn-close-stats-dialog");
  const cancelStatsBtn = document.getElementById("btn-cancel-stats-dialog");

  if (!statsDialog || !statsForm || !editStatsBtn) return;

  editStatsBtn.addEventListener("click", () => {
    document.getElementById("stats-level").value = state.userStats.level;
    document.getElementById("stats-xp").value = state.userStats.xp;
    document.getElementById("stats-stress").value = state.userStats.stress;
    document.getElementById("stats-value").value = state.userStats.value;
    statsDialog.showModal();
  });

  if (closeStatsBtn) closeStatsBtn.addEventListener("click", () => statsDialog.close());
  if (cancelStatsBtn) cancelStatsBtn.addEventListener("click", () => statsDialog.close());

  statsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    state.userStats.level = parseInt(document.getElementById("stats-level").value);
    state.userStats.xp = parseInt(document.getElementById("stats-xp").value);
    state.userStats.stress = parseInt(document.getElementById("stats-stress").value);
    state.userStats.value = parseFloat(document.getElementById("stats-value").value);

    localStorage.setItem("aetherflow_stats", JSON.stringify(state.userStats));
    renderUserStats();
    statsDialog.close();
  });
}

// Smart Recommendations Engine
function updateSuggestions() {
  const introEl = document.getElementById("suggestion-intro");
  const listContainer = document.getElementById("suggestions-list-container");

  if (!introEl || !listContainer) return;

  listContainer.innerHTML = "";
  const stats = state.userStats;

  let recommended = [];

  if (stats.stress >= 60) {
    introEl.innerHTML = "⚠️ <strong>High Stress Alert!</strong> Your mental fatigue is mounting. The co-pilot recommends active recovery sessions:";
    // Recommend stress <= 0 templates
    recommended = state.templates.filter(t => t.stress <= 0);
  } else if (stats.stress < 30) {
    introEl.innerHTML = "🚀 <strong>Productivity Prime!</strong> Your focus is high. The co-pilot suggests taking on deep sprints and client goals:";
    // Recommend high value/xp templates
    recommended = state.templates.filter(t => t.stress > 0).sort((a, b) => b.value - a.value);
  } else {
    introEl.innerHTML = "📊 <strong>Balance Stable.</strong> Work-life rhythm is steady. Keep maintaining the balance with a blend of tasks:";
    // Recommend general templates
    recommended = [state.templates[0], state.templates[2], state.templates[3]];
  }

  // Cap suggestions at 3
  recommended.slice(0, 3).forEach(tpl => {
    const card = document.createElement("div");
    card.className = "suggested-card";

    const info = document.createElement("div");
    info.className = "suggested-card-info";

    const title = document.createElement("h4");
    title.innerText = tpl.title;
    info.appendChild(title);

    const metrics = document.createElement("div");
    metrics.className = "suggested-card-metrics";
    
    const xpPill = document.createElement("span");
    xpPill.className = "metric-pill xp";
    xpPill.innerText = `+${tpl.xp} XP`;
    metrics.appendChild(xpPill);

    const stressPill = document.createElement("span");
    const stressVal = tpl.stress;
    if (stressVal < 0) {
      stressPill.className = "metric-pill stress metric-stress-negative"; // green
      stressPill.innerText = `${stressVal} Stress`;
    } else {
      stressPill.className = "metric-pill stress metric-stress-positive"; // red
      stressPill.innerText = `+${stressVal} Stress`;
    }
    metrics.appendChild(stressPill);

    info.appendChild(metrics);
    card.appendChild(info);

    // Quick Add button
    const qAdd = document.createElement("button");
    qAdd.className = "btn-quick-add-suggested";
    qAdd.title = "Schedule for Today";
    qAdd.innerHTML = `<i data-lucide="plus" style="width:14px;height:14px;"></i>`;
    
    qAdd.addEventListener("click", (e) => {
      e.stopPropagation();
      scheduleSuggestedAction(tpl);
    });

    card.appendChild(qAdd);
    
    card.addEventListener("click", () => {
      scheduleSuggestedAction(tpl);
    });

    listContainer.appendChild(card);
  });

  lucide.createIcons();
}

// Automatically places suggested task on the schedule
function scheduleSuggestedAction(template) {
  const todayStr = getFormattedDateStr(new Date());
  
  // Find next available hour today (starts at 9 AM or current hour, whichever is later)
  const now = new Date();
  let startHour = Math.max(9, now.getHours() + 1);
  if (startHour >= 22) startHour = 9; // rollover to 9 AM if too late

  const timeStr = `${String(startHour).padStart(2, '0')}:00`;

  const newTask = {
    id: generateUUID(),
    title: template.title,
    description: `AI Co-pilot Suggestion Block: ${template.title}`,
    date: todayStr,
    startTime: timeStr,
    duration: template.duration,
    category: template.category,
    completed: false,
    xp: template.xp,
    stress: template.stress,
    value: template.value
  };

  state.tasks.push(newTask);
  localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));

  triggerViewChange(() => {
    // switch to Day view today to highlight the item
    state.currentDate = new Date();
    state.currentView = "day";
    document.querySelectorAll(".btn-view").forEach(b => b.classList.remove("active"));
    document.getElementById("btn-view-day").classList.add("active");
    updatePillPosition(true);
    
    renderCalendar();
    updateAgendaList();
  });
}

// Completing a task and claiming rewards
function claimRewards(task, cardElement) {
  task.completed = !task.completed;
  
  // Save to tasks list
  localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
  
  if (task.completed) {
    cardElement.classList.add("completed");
    
    // Add stats rewards
    const xpGained = task.xp !== undefined ? task.xp : 30;
    const stressChange = task.stress !== undefined ? task.stress : 10;
    const valueGained = task.value !== undefined ? task.value : 0;
    
    state.userStats.xp += xpGained;
    state.userStats.stress = Math.max(0, Math.min(100, state.userStats.stress + stressChange));
    state.userStats.value += valueGained;
    
    // Level Up Check
    let leveledUp = false;
    while (state.userStats.xp >= 1000) {
      state.userStats.level += 1;
      state.userStats.xp -= 1000;
      leveledUp = true;
    }
    
    if (leveledUp) {
      soundEffects.play("success");
    } else {
      soundEffects.play("coin");
    }
    
    localStorage.setItem("aetherflow_stats", JSON.stringify(state.userStats));
    
    // Render feedback
    renderUserStats();
    updateSuggestions();
    
    // Animate floating rewards indicator
    const rect = cardElement.getBoundingClientRect();
    triggerFloatingRewards(rect, xpGained, stressChange, valueGained);
    
    if (leveledUp) {
      setTimeout(() => {
        showAppAlert(`🏆 LEVEL UP! You reached Level ${state.userStats.level}! Keep focus!`);
      }, 600);
    }
  } else {
    // Undo completion - retract rewards
    cardElement.classList.remove("completed");
    
    const xpLost = task.xp !== undefined ? task.xp : 30;
    const stressChange = task.stress !== undefined ? task.stress : 10;
    const valueLost = task.value !== undefined ? task.value : 0;
    
    state.userStats.xp = Math.max(0, state.userStats.xp - xpLost);
    state.userStats.stress = Math.max(0, Math.min(100, state.userStats.stress - stressChange));
    state.userStats.value = state.userStats.value - valueLost; // allows negative values
    
    soundEffects.play("click");
    
    localStorage.setItem("aetherflow_stats", JSON.stringify(state.userStats));
    renderUserStats();
    updateSuggestions();
  }
}

// Spawns rising notifications detailing earned metrics
function triggerFloatingRewards(rect, xp, stress, value) {
  const container = document.createElement("div");
  container.className = "floating-rewards";
  
  // Set position directly above clicked card
  container.style.left = `${rect.left + (rect.width / 2) - 40}px`;
  container.style.top = `${rect.top}px`;

  // XP Indicator
  const xpDiv = document.createElement("div");
  xpDiv.className = "reward-item";
  xpDiv.style.color = "#c084fc";
  xpDiv.innerText = `+${xp} XP`;
  container.appendChild(xpDiv);

  // Stress Indicator
  const stressDiv = document.createElement("div");
  stressDiv.className = "reward-item";
  if (stress > 0) {
    stressDiv.style.color = "#f87171";
    stressDiv.innerText = `+${stress} Stress`;
  } else if (stress < 0) {
    stressDiv.style.color = "#4ade80";
    stressDiv.innerText = `${stress} Stress`;
  }
  if (stress !== 0) {
    container.appendChild(stressDiv);
  }

  // Value Indicator
  if (value > 0) {
    const valDiv = document.createElement("div");
    valDiv.className = "reward-item";
    valDiv.style.color = "#34d399";
    valDiv.innerText = `+$${value}`;
    container.appendChild(valDiv);
  }

  document.body.appendChild(container);
  
  // Cleanup after animation completes
  setTimeout(() => {
    container.remove();
  }, 1400);
}

// Custom stepper value adjustments helper (makes it globally available)
function adjustInput(id, delta) {
  const input = document.getElementById(id);
  if (!input) return;
  let val = parseInt(input.value) || 0;
  val += delta;
  
  if (input.min !== "") val = Math.max(parseInt(input.min), val);
  if (input.max !== "") val = Math.min(parseInt(input.max), val);
  
  input.value = val;
}
window.adjustInput = adjustInput;

// Show hover tooltip logic
function showCalendarTooltip(task, event) {
  const tooltip = document.getElementById("calendar-tooltip");
  if (!tooltip) return;
  
  let descHTML = "";
  if (task.description) {
    descHTML = `<div class="tooltip-desc">${task.description}</div>`;
  }
  
  const stressVal = task.stress !== undefined ? task.stress : 10;
  const valueVal = task.value !== undefined ? task.value : 0;
  
  const stressClass = stressVal < 0 ? "metric-stress-negative" : (stressVal > 0 ? "metric-stress-positive" : "");
  const valueClass = valueVal > 0 ? "metric-value-positive" : (valueVal < 0 ? "metric-value-negative" : "");
  
  const stressText = `${stressVal > 0 ? "+" : ""}${stressVal} Stress`;
  
  let valueText = "";
  if (valueVal > 0) valueText = `+$${valueVal}`;
  else if (valueVal < 0) valueText = `-$${Math.abs(valueVal)}`;
  
  tooltip.innerHTML = `
    <div class="tooltip-title">${task.title}</div>
    <div class="tooltip-time">
      <i data-lucide="clock" style="width:12px;height:12px;color:var(--text-muted);display:inline-block;vertical-align:middle;"></i>
      <span>${formatTime12h(task.startTime)} (${task.duration} min)</span>
    </div>
    <div class="tooltip-metrics">
      <span class="metric-pill xp">+${task.xp !== undefined ? task.xp : 30} XP</span>
      <span class="metric-pill stress ${stressClass}">${stressText}</span>
      ${valueVal !== 0 ? `<span class="metric-pill value ${valueClass}">${valueText}</span>` : ""}
    </div>
    ${descHTML}
  `;
  
  lucide.createIcons();
  tooltip.className = "calendar-tooltip visible";
  
  const moveTooltip = (e) => {
    const xOffset = 15;
    const yOffset = 15;
    
    let xPos = e.clientX + xOffset;
    let yPos = e.clientY + yOffset;
    
    if (xPos + tooltip.offsetWidth > window.innerWidth) {
      xPos = e.clientX - tooltip.offsetWidth - xOffset;
    }
    if (yPos + tooltip.offsetHeight > window.innerHeight) {
      yPos = e.clientY - tooltip.offsetHeight - yOffset;
    }
    
    tooltip.style.left = `${xPos}px`;
    tooltip.style.top = `${yPos}px`;
  };
  
  moveTooltip(event);
  event.currentTarget.addEventListener("mousemove", moveTooltip);
}

function hideCalendarTooltip() {
  const tooltip = document.getElementById("calendar-tooltip");
  if (!tooltip) return;
  tooltip.className = "calendar-tooltip hidden";
}

// Custom Action Template dialog form listener
function setupTemplateFormListeners() {
  const templateDialog = document.getElementById("template-dialog");
  const templateForm = document.getElementById("template-form");
  const addTemplateBtn = document.getElementById("btn-add-template");
  const closeTemplateBtn = document.getElementById("btn-close-template-dialog");
  const cancelTemplateBtn = document.getElementById("btn-cancel-template-dialog");

  if (!templateDialog || !templateForm || !addTemplateBtn) return;

  addTemplateBtn.addEventListener("click", () => {
    templateForm.reset();
    state.editingTemplateId = null;
    document.getElementById("template-dialog-title").innerText = "Create Action Block";
    document.getElementById("btn-submit-template").innerText = "Create Block";
    
    populateGroupDropdowns();
    document.getElementById("tpl-group").value = "group-academic";
    
    // Set default fields
    document.getElementById("tpl-xp").value = "30";
    document.getElementById("tpl-stress").value = "10";
    document.getElementById("tpl-value").value = "0";
    document.getElementById("tpl-duration").value = "60";
    document.getElementById("tpl-category").value = "work";
    templateDialog.showModal();
  });

  closeTemplateBtn.addEventListener("click", () => templateDialog.close());
  cancelTemplateBtn.addEventListener("click", () => templateDialog.close());

  templateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("tpl-title").value.trim();
    const category = document.getElementById("tpl-category").value;
    const groupId = document.getElementById("tpl-group").value;
    const duration = parseInt(document.getElementById("tpl-duration").value);
    const xp = parseInt(document.getElementById("tpl-xp").value);
    const stress = parseInt(document.getElementById("tpl-stress").value);
    const value = parseFloat(document.getElementById("tpl-value").value);

    if (state.editingTemplateId) {
      // Editing Mode
      const tplId = state.editingTemplateId;
      const isCustom = tplId.startsWith("tpl-custom-");
      
      if (isCustom) {
        const customList = JSON.parse(localStorage.getItem("aetherflow_custom_templates") || "[]");
        const idx = customList.findIndex(t => t.id === tplId);
        if (idx !== -1) {
          customList[idx] = { ...customList[idx], title, category, groupId, duration, xp, stress, value };
          localStorage.setItem("aetherflow_custom_templates", JSON.stringify(customList));
        }
      } else {
        const modifiedBuiltins = JSON.parse(localStorage.getItem("aetherflow_modified_builtins") || "{}");
        modifiedBuiltins[tplId] = { title, category, groupId, duration, xp, stress, value };
        localStorage.setItem("aetherflow_modified_builtins", JSON.stringify(modifiedBuiltins));
      }

      // Update runtime state
      const idx = state.templates.findIndex(t => t.id === tplId);
      if (idx !== -1) {
        state.templates[idx] = { ...state.templates[idx], title, category, groupId, duration, xp, stress, value };
      }
      state.editingTemplateId = null;
    } else {
      // Creating Mode
      const id = "tpl-custom-" + generateUUID();
      const newTpl = {
        id,
        title,
        category,
        groupId,
        duration,
        xp,
        stress,
        value,
        custom: true
      };

      // Save custom template to local list
      const customList = JSON.parse(localStorage.getItem("aetherflow_custom_templates") || "[]");
      customList.push(newTpl);
      localStorage.setItem("aetherflow_custom_templates", JSON.stringify(customList));

      // Update runtime state
      state.templates.push(newTpl);
    }

    // Refresh views
    renderActionTemplates();
    updateSuggestions();
    
    templateDialog.close();
  });
}

// Setup Mobile Sidebar Drawer & Overlay
function setupMobileSidebar() {
  const toggleBtn = document.getElementById("btn-toggle-sidebar");
  const sidebar = document.querySelector(".app-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  
  if (toggleBtn && sidebar) {
    let overlayEl = overlay;
    if (!overlayEl) {
      overlayEl = document.createElement("div");
      overlayEl.className = "sidebar-overlay";
      overlayEl.id = "sidebar-overlay";
      document.body.insertBefore(overlayEl, document.body.firstChild);
    }
    
    const openSidebar = () => {
      sidebar.classList.add("open");
      overlayEl.classList.add("active");
      soundEffects.play("click");
    };
    
    const closeSidebar = () => {
      sidebar.classList.remove("open");
      overlayEl.classList.remove("active");
      soundEffects.play("click");
    };
    
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
    
    overlayEl.addEventListener("click", closeSidebar);
    
    // Auto-close sidebar on other click triggers
    const closeOnActionElements = document.querySelectorAll(".btn-view, #btn-quick-add, .btn-quick-add, .btn-close-template-dialog");
    closeOnActionElements.forEach(el => {
      el.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlayEl.classList.remove("active");
      });
    });
  }
}

// Setup Search Bar Listeners for Action Blocks
function setupSearchListeners() {
  const searchInput = document.getElementById("templates-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (clearBtn) {
      if (query) {
        clearBtn.classList.remove("hidden");
      } else {
        clearBtn.classList.add("hidden");
      }
    }
    renderActionTemplates();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.classList.add("hidden");
      renderActionTemplates();
      searchInput.focus();
    });
  }
}

// Setup Global Click Listener for premium audio feedback
function setupSoundEffectsListeners() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, .btn, .tab-btn, .btn-view, .btn-month-week-nav, .metric-pill, input[type='checkbox']");
    if (target) {
      if (target.type === "checkbox" && target.closest(".task-card")) return;
      soundEffects.play("click");
    }
  });
}

// College Notification Toggle Button
function setupCollegeNotifToggle() {
  const btn = document.getElementById("btn-toggle-college-notif");
  if (!btn) return;

  const updateVisual = () => {
    const isOn = localStorage.getItem("aetherflow_college_notif") !== "off";
    if (isOn) {
      btn.style.border = "1px solid #22c55e";
      btn.style.color = "#22c55e";
      btn.title = "🔔 College notifications ON (1:50 PM daily)";
    } else {
      btn.style.border = "";
      btn.style.color = "";
      btn.title = "🔕 College notifications OFF — click to enable";
    }
  };

  updateVisual();

  btn.addEventListener("click", () => {
    const isOn = localStorage.getItem("aetherflow_college_notif") !== "off";
    if (isOn) {
      localStorage.setItem("aetherflow_college_notif", "off");
      if (collegeNotifTimerId) clearTimeout(collegeNotifTimerId);
      showAppAlert("🔕 College end-of-day notifications turned OFF.");
    } else {
      localStorage.removeItem("aetherflow_college_notif");
      requestNotificationPermission();
      scheduleCollegeEndNotification();
      showAppAlert("🔔 College end-of-day notifications turned ON!\\n\\nYou'll get a reminder at 1:50 PM every weekday.");
    }
    updateVisual();
  });
}

/* ----------------------------------------------------
   College Timetable — Darshan University CV-5 (Batch-2)
   w.e.f. 08-06-2026
---------------------------------------------------- */
const collegeTimetable = {
  monday: [
    { time: "07:45", duration: 55, title: "2301CV514 – ToA / 2301CV513 – Bridge & Tunnel (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-304 / G-203", faculty: "SGG / DAJ" },
    { time: "08:40", duration: 55, title: "2301CV514 – ToA / 2301CV513 – Bridge & Tunnel (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-304 / G-203", faculty: "SGG / DAJ" },
    { time: "09:35", duration: 15, title: "☕ Break", category: "personal", xp: 0, stress: -5, value: 0 },
    { time: "09:50", duration: 50, title: "2301CV502 – Engg Hydrology (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "MAJ" },
    { time: "10:40", duration: 50, title: "2301CV503 – Transportation Engg (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DAJ" },
    { time: "11:30", duration: 40, title: "🍽️ Lunch Break", category: "personal", xp: 0, stress: -10, value: 0 },
    { time: "12:10", duration: 100, title: "2301CV501 – ESD Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "G-203", faculty: "DDH" }
  ],
  tuesday: [
    { time: "07:45", duration: 55, title: "2301CV503 – Transportation Engg (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DAJ" },
    { time: "08:40", duration: 55, title: "2301CV502 – Engg Hydrology (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "MAJ" },
    { time: "09:35", duration: 15, title: "☕ Break", category: "personal", xp: 0, stress: -5, value: 0 },
    { time: "09:50", duration: 100, title: "2301ME591 – CADD Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "CC G-204", faculty: "DKP" },
    { time: "11:30", duration: 40, title: "🍽️ Lunch Break", category: "personal", xp: 0, stress: -10, value: 0 },
    { time: "12:10", duration: 100, title: "2301CV502 – Engg Hydrology Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "G-203", faculty: "MAJ" }
  ],
  wednesday: [
    { time: "07:45", duration: 55, title: "2301CV501 – ESD (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DDH" },
    { time: "08:40", duration: 55, title: "2301CV501 – ESD (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DDH" },
    { time: "09:35", duration: 15, title: "☕ Break", category: "personal", xp: 0, stress: -5, value: 0 },
    { time: "09:50", duration: 100, title: "2301CV514 – ToA / 2301CV513 – Bridge & Tunnel Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "G-203 / C-104", faculty: "SGG / DAJ" },
    { time: "11:30", duration: 40, title: "🍽️ Lunch Break", category: "personal", xp: 0, stress: -10, value: 0 },
    { time: "12:10", duration: 50, title: "2301CV503 – Transportation Engg (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DAJ" },
    { time: "13:00", duration: 50, title: "🏅 SPORTS", category: "fitness", xp: 20, stress: -15, value: 0 }
  ],
  thursday: [
    { time: "07:45", duration: 55, title: "2301CV501 – ESD (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DKJ" },
    { time: "08:40", duration: 55, title: "2301CV501 – ESD (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "DKJ" },
    { time: "09:35", duration: 15, title: "☕ Break", category: "personal", xp: 0, stress: -5, value: 0 },
    { time: "09:50", duration: 100, title: "2301CV503 – TE Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "Lab C-104", faculty: "DAJ" },
    { time: "11:30", duration: 40, title: "🍽️ Lunch Break", category: "personal", xp: 0, stress: -10, value: 0 },
    { time: "12:10", duration: 100, title: "2301ME591 – CADD Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "CC G-204", faculty: "DKP" }
  ],
  friday: [
    { time: "07:45", duration: 55, title: "2301CV502 – Engg Hydrology (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203", faculty: "MAJ" },
    { time: "08:40", duration: 55, title: "2301CV513 – Bridge & Tunnel / 2301CV514 – ToA (Lec)", category: "work", xp: 20, stress: 10, value: 0, room: "G-203 / G-304", faculty: "DAJ / SGG" },
    { time: "09:35", duration: 15, title: "☕ Break", category: "personal", xp: 0, stress: -5, value: 0 },
    { time: "09:50", duration: 100, title: "2301CV501 – ESD Lab (B2)", category: "work", xp: 35, stress: 15, value: 0, room: "G-203", faculty: "DDH" },
    { time: "11:30", duration: 40, title: "🍽️ Lunch Break", category: "personal", xp: 0, stress: -10, value: 0 },
    { time: "12:10", duration: 100, title: "🏅 SPORTS", category: "fitness", xp: 25, stress: -15, value: 0 }
  ]
};

// Map day-of-week index (0=Sun..6=Sat) to timetable day key
const timetableDayMap = { 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday" };

// Simulation Scenarios Datasets
// Simulation Scenarios Datasets
const simulationScenarios = {
  "weekend-sprint": {
    id: "weekend-sprint",
    title: "Weekend Academic Sprint",
    date: "Sunday, September 21, 2025",
    description: "Replay a heavy weekend study routine log. Track how stress builds up through continuous 'page' work, site additions, and how Resin cooldowns or talk breaks prevent burnout.",
    durationMeta: "27 activities • 24h cycle",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    initialStats: { xp: 120, stress: 30, value: 50, level: 1 },
    steps: [
      { time: "08:00", title: "🍳 Bed Making / Breakfast", category: "personal", xp: 15, stress: -5, value: 0, duration: 30 },
      { time: "08:30", title: "📖 Page ac (Study)", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "09:00", title: "🚽 Dooki Break", category: "personal", xp: 5, stress: -10, value: 0, duration: 30 },
      { time: "09:30", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "10:00", title: "🎮 Genshin Resin & Eye Exercises", category: "other", xp: 20, stress: -20, value: 0, duration: 30 },
      { time: "10:30", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "11:00", title: "🧘 Snacks & Yoga Session", category: "health", xp: 15, stress: -10, value: 10, duration: 20 },
      { time: "11:20", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "11:50", title: "💬 Talk Break & Clean Towel", category: "personal", xp: 10, stress: -5, value: 0, duration: 10 },
      { time: "12:00", title: "💻 Site Work & Coding Sprints", category: "work", xp: 50, stress: 20, value: 30, duration: 90 },
      { time: "13:30", title: "🥪 Lunch Break", category: "personal", xp: 15, stress: -10, value: 0, duration: 30 },
      { time: "14:00", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "14:30", title: "📖 Story or Material Study", category: "work", xp: 20, stress: 10, value: 0, duration: 30 },
      { time: "15:00", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "15:30", title: "👀 Eye test & Stretching", category: "health", xp: 10, stress: -5, value: 0, duration: 15 },
      { time: "15:45", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "16:15", title: "🎒 Snacks & pack bags", category: "personal", xp: 10, stress: -5, value: 0, duration: 15 },
      { time: "16:30", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "17:00", title: "🏖️ Afternoon Break", category: "personal", xp: 5, stress: -10, value: 0, duration: 30 },
      { time: "17:30", title: "🏃 Exercise Session", category: "health", xp: 25, stress: -15, value: 0, duration: 30 },
      { time: "18:00", title: "🍏 Snacks 2", category: "personal", xp: 10, stress: -5, value: 0, duration: 30 },
      { time: "18:30", title: "📚 Sem 3 review", category: "work", xp: 30, stress: 15, value: 0, duration: 50 },
      { time: "19:20", title: "💬 Talk Break", category: "personal", xp: 10, stress: -5, value: 0, duration: 10 },
      { time: "19:30", title: "💻 Exhaust fan, Site work & LMS Check", category: "work", xp: 40, stress: 15, value: 10, duration: 60 },
      { time: "20:30", title: "🍽️ Dinner Time", category: "personal", xp: 15, stress: -10, value: 0, duration: 30 },
      { time: "21:00", title: "📖 Page study", category: "work", xp: 20, stress: 5, value: 0, duration: 30 },
      { time: "21:30", title: "🕸️ Mosquito net (Weekend prep)", category: "other", xp: 5, stress: -5, value: 0, duration: 30 }
    ]
  },
  "midterm-mcq": {
    id: "midterm-mcq",
    title: "Midterm MCQ Study & Site Prep",
    date: "Thursday, January 16, 2025",
    description: "Replay a day packed with exam MCQ preparation sheets and design assignments. See if this routine triggers critical burnout alerts when studies pile up.",
    durationMeta: "17 activities • 24h cycle",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    initialStats: { xp: 120, stress: 25, value: 50, level: 1 },
    steps: [
      { time: "09:00", title: "🍳 Bed Making Or Breakfast", category: "personal", xp: 15, stress: -5, value: 0, duration: 30 },
      { time: "09:30", title: "✏️ Drawing Sheet Work", category: "work", xp: 20, stress: 10, value: 0, duration: 45 },
      { time: "10:15", title: "🚽 Dooki Break", category: "personal", xp: 5, stress: -10, value: 0, duration: 30 },
      { time: "10:45", title: "📐 Structure Assignment", category: "work", xp: 40, stress: 20, value: 0, duration: 75 },
      { time: "12:00", title: "🎮 Genshin Resin & Eye Exercises", category: "other", xp: 20, stress: -20, value: 0, duration: 30 },
      { time: "12:30", title: "✏️ Drawing Sheet Work", category: "work", xp: 20, stress: 10, value: 0, duration: 45 },
      { time: "13:15", title: "🧘 Snacks & Yoga Session", category: "health", xp: 15, stress: -10, value: 10, duration: 30 },
      { time: "13:45", title: "💬 Talk Break", category: "personal", xp: 10, stress: -5, value: 0, duration: 15 },
      { time: "14:00", title: "💻 Site Work & Coding Sprints", category: "work", xp: 50, stress: 20, value: 30, duration: 90 },
      { time: "15:30", title: "🍽️ Lunch (Remote & Bottle)", category: "personal", xp: 15, stress: -10, value: 0, duration: 45 },
      { time: "16:15", title: "🔢 Maths MCQ Prep", category: "work", xp: 30, stress: 15, value: 0, duration: 60 },
      { time: "17:15", title: "📝 BCM MCQ Practice", category: "work", xp: 30, stress: 15, value: 0, duration: 60 },
      { time: "18:15", title: "🏃 Exercise Session", category: "health", xp: 25, stress: -15, value: 0, duration: 45 },
      { time: "19:00", title: "📚 Sem 3 review", category: "work", xp: 30, stress: 15, value: 0, duration: 60 },
      { time: "20:00", title: "💻 Site Work & LMS check", category: "work", xp: 40, stress: 15, value: 10, duration: 60 },
      { time: "21:00", title: "🍽️ Dinner Time", category: "personal", xp: 15, stress: -10, value: 0, duration: 45 },
      { time: "21:45", title: "📸 Upload Homework Photo", category: "work", xp: 25, stress: 15, value: 0, duration: 30 }
    ]
  },
  "custom-sandbox": {
    id: "custom-sandbox",
    title: "Custom Routine Simulator Canvas",
    date: "Real-time Sandbox Mode",
    description: "Construct your own simulation routine by dragging and dropping action blocks directly onto the timeline canvas. Run the routine to check stress levels and burnout zones.",
    durationMeta: "Drag & Drop • Real-time",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    initialStats: { xp: 0, stress: 30, value: 0, level: 1 },
    steps: []
  },
  "weekly-simulator": {
    id: "weekly-simulator",
    title: "Weekly Routine Simulator",
    date: "7-Day Academic Cycle",
    description: "Plan a full 7-day academic cycle. Drag and drop your saved daily routines (Weekday, Weekend, or Custom variations) onto the days of the week, then run the simulation to check weekly stress accumulation and burnout levels.",
    durationMeta: "7 Days • Chronological Sequence",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    initialStats: { xp: 0, stress: 30, value: 0, level: 1 },
    steps: []
  }
};

// Global Template Tab Switch Handler
function switchTemplateTab(tab) {
  state.activeTemplateTab = tab;
  
  // Highlight tab button
  const btnCurrent = document.getElementById("tab-templates-current");
  const btnPast = document.getElementById("tab-templates-past");
  if (btnCurrent && btnPast) {
    if (tab === "current") {
      btnCurrent.classList.add("active");
      btnPast.classList.remove("active");
    } else {
      btnPast.classList.add("active");
      btnCurrent.classList.remove("active");
    }
  }
  
  renderActionTemplates();
}
window.switchTemplateTab = switchTemplateTab;

// Main Simulation View Renderer
function renderSimulationView(parent) {
  const root = document.createElement("div");
  root.className = "simulation-view-container";

  if (!state.activeSimulation) {
    // Render Scenario Selector Screen
    renderScenarioSelector(root);
  } else {
    // Render Simulation Active Sandbox Dashboard
    renderActiveSimulationDashboard(root);
  }

  parent.appendChild(root);
  
  // Generate icons
  lucide.createIcons();
}

// Scenario Selection Screen builder
function renderScenarioSelector(parent) {
  // Welcome Panel
  const welcome = document.createElement("div");
  welcome.className = "sim-welcome-panel";
  
  const icon = document.createElement("div");
  icon.className = "sim-welcome-icon";
  icon.innerHTML = `<i data-lucide="history" style="width:26px;height:26px;"></i>`;
  welcome.appendChild(icon);
  
  const title = document.createElement("h3");
  title.innerText = "Past Self Routine Simulator";
  welcome.appendChild(title);
  
  const desc = document.createElement("p");
  desc.innerText = "Step back in time to analyze your historic daily student routines from 2025. Replay study blocks and breaks sequentially to simulate stress buildup, reward acquisition, and identify burnout trigger zones (>75% stress).";
  welcome.appendChild(desc);
  
  parent.appendChild(welcome);

  // Cards Grid Selector
  const grid = document.createElement("div");
  grid.className = "sim-scenario-selector";

  Object.values(simulationScenarios).forEach(scen => {
    const card = document.createElement("div");
    card.className = "sim-scenario-card";
    card.style.setProperty("--card-gradient", scen.gradient);
    
    const h4 = document.createElement("h4");
    h4.innerText = scen.title;
    card.appendChild(h4);

    const meta = document.createElement("div");
    meta.className = "sim-scenario-meta";
    meta.innerHTML = `
      <span><i data-lucide="calendar" style="width:12px;height:12px;"></i> ${scen.date}</span>
      <span><i data-lucide="activity" style="width:12px;height:12px;"></i> ${scen.durationMeta}</span>
    `;
    card.appendChild(meta);

    const dText = document.createElement("p");
    dText.className = "sim-scenario-desc";
    dText.innerText = scen.description;
    card.appendChild(dText);

    const selectBtn = document.createElement("button");
    selectBtn.className = "btn btn-primary";
    selectBtn.innerHTML = `<span>Select Scenario</span> <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>`;
    selectBtn.addEventListener("click", () => {
      startSimulation(scen.id);
    });
    card.appendChild(selectBtn);

    grid.appendChild(card);
  });

  // Load custom simulation variations
  const savedSims = JSON.parse(localStorage.getItem("aetherflow_custom_sim_variations") || "[]");
  savedSims.forEach(simVar => {
    const card = document.createElement("div");
    card.className = "sim-scenario-card";
    card.style.setProperty("--card-gradient", "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)");
    
    const h4 = document.createElement("h4");
    h4.innerText = simVar.name;
    card.appendChild(h4);

    const meta = document.createElement("div");
    meta.className = "sim-scenario-meta";
    meta.innerHTML = `
      <span><i data-lucide="calendar" style="width:12px;height:12px;"></i> Custom variation save</span>
      <span><i data-lucide="activity" style="width:12px;height:12px;"></i> ${simVar.steps.length} activities</span>
    `;
    card.appendChild(meta);

    const dText = document.createElement("p");
    dText.className = "sim-scenario-desc";
    dText.innerText = `Custom simulation layout re-playable sequence. Runs stress checks and reward gains instantly.`;
    card.appendChild(dText);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";
    btnRow.style.marginTop = "8px";

    const selectBtn = document.createElement("button");
    selectBtn.className = "btn btn-primary";
    selectBtn.style.flex = "1";
    selectBtn.innerHTML = `<span>Run</span> <i data-lucide="play" style="width:12px;height:12px;"></i>`;
    selectBtn.addEventListener("click", () => {
      startCustomSimulation(simVar);
    });
    btnRow.appendChild(selectBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.style.width = "36px";
    deleteBtn.style.padding = "0";
    deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width:14px;height:14px;"></i>`;
    deleteBtn.title = "Delete Custom Simulation Variation";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showAppConfirm(`Are you sure you want to delete the simulation variation "${simVar.name}"?`, (confirmed) => {
        if (confirmed) {
          deleteCustomSimulationVariation(simVar.id);
        }
      });
    });
    btnRow.appendChild(deleteBtn);

    card.appendChild(btnRow);
    grid.appendChild(card);
  });

  parent.appendChild(grid);
}

// Active Sandbox Layout builder
// Active Sandbox Layout builder
function renderActiveSimulationDashboard(parent) {
  const sim = state.activeSimulation;
  const scen = simulationScenarios[sim.scenarioId];

  // Update routine saves sidebar widget configuration
  updateRoutineSavesWidget();

  const layout = document.createElement("div");
  layout.className = "sim-dashboard-layout";
  if (sim.scenarioId === "weekly-simulator") {
    layout.classList.add("weekly-view");
  }

  // LEFT COLUMN: Controls, stats, warning banners
  const ctrlPanel = document.createElement("div");
  ctrlPanel.className = "sim-control-panel";

  const header = document.createElement("div");
  header.className = "sim-header-row";
  header.innerHTML = `
    <div>
      <h3>${scen.title}</h3>
      <span style="font-size:0.75rem;color:var(--text-muted);display:block;margin-top:2px;">${sim.variationName ? 'Variation: ' + sim.variationName : scen.date}</span>
    </div>
  `;
  
  // Close / Exit button
  const exitBtn = document.createElement("button");
  exitBtn.className = "btn-close btn-icon btn-secondary";
  exitBtn.style.width = "32px";
  exitBtn.style.height = "32px";
  exitBtn.innerHTML = `<i data-lucide="x" style="width:14px;height:14px;"></i>`;
  exitBtn.addEventListener("click", () => {
    exitSimulation();
  });
  header.appendChild(exitBtn);
  ctrlPanel.appendChild(header);

  // Stats Display Boxes
  const statsGrid = document.createElement("div");
  statsGrid.className = "sim-stats-grid";

  // XP Box
  const xpBox = document.createElement("div");
  xpBox.className = "sim-stat-box";
  xpBox.innerHTML = `
    <div class="stat-label">Accumulated XP (Level <span id="sim-lvl">${sim.stats.level}</span>)</div>
    <div class="stat-value" id="sim-xp-val">${sim.stats.xp} XP</div>
    <div class="xp-bar-bg" style="margin-top:10px;">
      <div class="xp-bar-fill" id="sim-xp-fill" style="width:${(sim.stats.xp / 1000) * 100}%;"></div>
    </div>
  `;
  statsGrid.appendChild(xpBox);

  // Stress Box
  const stressBox = document.createElement("div");
  stressBox.className = "sim-stat-box stress-box";
  if (sim.stats.stress >= 75) stressBox.classList.add("stress-high");
  else if (sim.stats.stress >= 50) stressBox.classList.add("stress-warn");
  stressBox.innerHTML = `
    <div class="stat-label">${sim.scenarioId === "weekly-simulator" ? "Weekly Stress Fatigue" : "Stress Fatigue Level"}</div>
    <div class="stat-value" id="sim-stress-val">${sim.stats.stress}%</div>
    <div class="meter-bar-bg" style="margin-top:10px;">
      <div class="meter-bar-fill stress-fill" id="sim-stress-fill" style="width:${sim.stats.stress}%;"></div>
    </div>
  `;
  statsGrid.appendChild(stressBox);

  // Value Box
  const valueBox = document.createElement("div");
  valueBox.className = "sim-stat-box";
  const valVal = sim.stats.value;
  valueBox.innerHTML = `
    <div class="stat-label">Value Generated</div>
    <div class="stat-value" id="sim-value-val" style="color: ${valVal >= 0 ? '#10b981' : '#ef4444'};">
      ${valVal >= 0 ? '$' + valVal.toFixed(2) : '-$' + Math.abs(valVal).toFixed(2)}
    </div>
  `;
  statsGrid.appendChild(valueBox);

  ctrlPanel.appendChild(statsGrid);

  // Burnout check warning area
  const warningContainer = document.createElement("div");
  warningContainer.id = "sim-warning-container";
  updateBurnoutWarning(warningContainer, sim.stats.stress);
  ctrlPanel.appendChild(warningContainer);

  // Speed controls
  const speedCtrl = document.createElement("div");
  speedCtrl.className = "sim-speed-control";
  speedCtrl.innerHTML = `
    <span>Simulation Speed</span>
    <div class="sim-speed-btn-group">
      <button class="sim-speed-btn ${sim.speed === 1500 ? 'active' : ''}" onclick="adjustSimSpeed(1500)">0.5x</button>
      <button class="sim-speed-btn ${sim.speed === 800 ? 'active' : ''}" onclick="adjustSimSpeed(800)">1.0x</button>
      <button class="sim-speed-btn ${sim.speed === 300 ? 'active' : ''}" onclick="adjustSimSpeed(300)">2.5x</button>
    </div>
  `;
  ctrlPanel.appendChild(speedCtrl);

  // Control Buttons Play/Pause/Reset
  const runCtrls = document.createElement("div");
  runCtrls.className = "sim-runner-controls";
  
  const playBtn = document.createElement("button");
  playBtn.className = "btn btn-primary";
  playBtn.id = "btn-sim-play";
  playBtn.innerHTML = sim.isPlaying ? `<i data-lucide="pause"></i> Pause` : `<i data-lucide="play"></i> Run Routine`;
  playBtn.addEventListener("click", () => {
    if (sim.isPlaying) pauseSimulation();
    else playSimulation();
  });
  runCtrls.appendChild(playBtn);

  const stepBtn = document.createElement("button");
  stepBtn.className = "btn btn-secondary";
  stepBtn.id = "btn-sim-step";
  stepBtn.innerHTML = `<i data-lucide="skip-forward"></i> Step`;
  stepBtn.addEventListener("click", () => {
    pauseSimulation();
    runSimulationStep();
  });
  runCtrls.appendChild(stepBtn);

  const resetBtn = document.createElement("button");
  resetBtn.className = "btn btn-secondary";
  resetBtn.id = "btn-sim-reset";
  resetBtn.innerHTML = `<i data-lucide="rotate-ccw"></i> Reset`;
  resetBtn.addEventListener("click", () => {
    resetSimulation();
  });
  runCtrls.appendChild(resetBtn);

  // Add Save Sim button in custom sandbox mode
  if (sim.scenarioId === "custom-sandbox" && sim.steps.length > 0) {
    const saveSimBtn = document.createElement("button");
    saveSimBtn.className = "btn btn-secondary";
    saveSimBtn.id = "btn-save-sim-variation";
    saveSimBtn.style.borderColor = "var(--color-health)";
    saveSimBtn.style.color = "#34d399";
    saveSimBtn.innerHTML = `<i data-lucide="save"></i> Save Sim`;
    saveSimBtn.addEventListener("click", () => {
      saveCustomSimulationVariation();
    });
    runCtrls.appendChild(saveSimBtn);
  }

  ctrlPanel.appendChild(runCtrls);
  layout.appendChild(ctrlPanel);

  // RIGHT COLUMN: Timeline steps lists / Week Planner Grid
  const timelinePanel = document.createElement("div");
  timelinePanel.className = "sim-timeline-panel";
  
  const tHeader = document.createElement("h3");
  tHeader.innerText = sim.scenarioId === "weekly-simulator" ? "Weekly Simulation Planner" : "Routine Timeline Schedulers";
  timelinePanel.appendChild(tHeader);

  if (sim.scenarioId === "weekly-simulator") {
    renderWeeklyPlannerGrid(timelinePanel);
  } else {
    const list = document.createElement("div");
    list.className = "sim-timeline-list";
    list.id = "sim-timeline-list";

    // Bind dragover, dragleave, drop handlers to list to turn it into a drop canvas
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      list.classList.add("drag-over");
    });
    
    list.addEventListener("dragleave", () => {
      list.classList.remove("drag-over");
    });
    
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("drag-over");
      
      soundEffects.play("swoosh");
      
      const dropDataStr = e.dataTransfer.getData("text/plain");
      
      // Check if it's a Daily Routine drop (JSON with type: "daily-routine")
      let isDailyRoutine = false;
      let routineData = null;
      try {
        const parsed = JSON.parse(dropDataStr);
        if (parsed && parsed.type === "daily-routine") {
          isDailyRoutine = true;
          routineData = parsed;
        }
      } catch (err) {}
      
      if (isDailyRoutine && routineData && routineData.steps) {
        // Add all routine steps to the simulation timeline
        routineData.steps.forEach(step => {
          const fakeTemplate = {
            title: step.title,
            category: step.category || "other",
            xp: step.xp !== undefined ? step.xp : 20,
            stress: step.stress !== undefined ? step.stress : 5,
            value: step.value !== undefined ? step.value : 0,
            duration: step.duration || 30
          };
          addTemplateToSimSteps(fakeTemplate);
        });
        return;
      }
      
      // Otherwise handle as a regular Action Block template
      const templateId = dropDataStr;
      const template = state.templates.find(t => t.id === templateId) || pastTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      addTemplateToSimSteps(template);
    });

    if (sim.steps.length === 0) {
      const dropzone = document.createElement("div");
      dropzone.className = "sim-canvas-dropzone";
      dropzone.id = "sim-canvas-dropzone";
      dropzone.innerHTML = `
        <i data-lucide="download-cloud" style="width:36px;height:36px;margin-bottom:4px;"></i>
        <strong style="color:white;display:block;">Routine Canvas Blank</strong>
        <span style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;display:block;line-height:1.4;">
          Drag action blocks from the sidebar and drop them here to build your simulation routine.
        </span>
      `;
      list.appendChild(dropzone);
    } else {
      sim.steps.forEach((step, idx) => {
        const item = document.createElement("div");
        item.className = `sim-step-item cat-${step.category}`;
        item.id = `sim-step-${idx}`;

        if (idx < sim.currentStep) item.classList.add("completed");
        else if (idx === sim.currentStep) item.classList.add("active");

        const time = document.createElement("div");
        time.className = "sim-step-time";
        time.innerText = step.time;
        item.appendChild(time);

        const details = document.createElement("div");
        details.className = "sim-step-details";
        
        const title = document.createElement("div");
        title.className = "sim-step-title";
        title.innerText = step.title;
        details.appendChild(title);

        // Mini metrics row
        const metricsRow = document.createElement("div");
        metricsRow.className = "sim-step-metrics";

        const xpPill = document.createElement("span");
        xpPill.className = "metric-pill xp";
        xpPill.innerText = `+${step.xp} XP`;
        metricsRow.appendChild(xpPill);

        const stressPill = document.createElement("span");
        if (step.stress < 0) {
          stressPill.className = "metric-pill stress metric-stress-negative";
          stressPill.innerText = `${step.stress} Stress`;
        } else {
          stressPill.className = "metric-pill stress metric-stress-positive";
          stressPill.innerText = `+${step.stress} Stress`;
        }
        metricsRow.appendChild(stressPill);

        if (step.value !== 0) {
          const valPill = document.createElement("span");
          if (step.value > 0) {
            valPill.className = "metric-pill value metric-value-positive";
            valPill.innerText = `+$${step.value}`;
          } else {
            valPill.className = "metric-pill value metric-value-negative";
            valPill.innerText = `-$${Math.abs(step.value)}`;
          }
          metricsRow.appendChild(valPill);
        }

        details.appendChild(metricsRow);
        item.appendChild(details);

        // Delete button for daily simulation steps (all except weekly)
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete-sim-step";
        deleteBtn.title = "Remove step from timeline";
        deleteBtn.innerHTML = `<i data-lucide="trash-2" style="width:12px;height:12px;"></i>`;
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteSimStep(idx);
        });
        item.appendChild(deleteBtn);

        // Status label badge
        const badge = document.createElement("span");
        badge.className = "sim-step-status-badge";
        if (idx < sim.currentStep) badge.innerText = "Done";
        else if (idx === sim.currentStep) badge.innerText = "Running";
        else badge.innerText = "Upcoming";
        item.appendChild(badge);

        list.appendChild(item);
      });
    }
    timelinePanel.appendChild(list);
  }

  layout.appendChild(timelinePanel);
  parent.appendChild(layout);
}

// 7-Day Weekly Grid Renderer
function renderWeeklyPlannerGrid(parent) {
  const sim = state.activeSimulation;
  if (!sim) return;

  // Initialize selectedDayIdx if not set
  if (sim.selectedDayIdx === undefined) {
    sim.selectedDayIdx = sim.currentDayIdx;
  }

  // Force active day tab focus if the simulation is currently playing or in-progress
  const isRunning = sim.isPlaying || sim.currentStepIdx >= 0;
  if (isRunning) {
    sim.selectedDayIdx = sim.currentDayIdx;
  }

  // Create Horizontal Day Tabs Bar for Mobile
  const tabNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const tabsBar = document.createElement("div");
  tabsBar.className = "sim-week-tabs-bar";

  sim.weekDays.forEach((day, dayIdx) => {
    const tabBtn = document.createElement("button");
    tabBtn.className = "sim-week-tab";
    tabBtn.type = "button";
    tabBtn.innerText = tabNames[dayIdx];

    if (dayIdx === sim.selectedDayIdx) {
      tabBtn.classList.add("active");
    }
    if (dayIdx < sim.currentDayIdx) {
      tabBtn.classList.add("completed-day");
    } else if (dayIdx === sim.currentDayIdx) {
      tabBtn.classList.add("running-day");
    }

    tabBtn.addEventListener("click", () => {
      pauseSimulation();
      sim.selectedDayIdx = dayIdx;
      triggerViewChange(() => {
        renderCalendar();
      });
    });

    tabsBar.appendChild(tabBtn);
  });
  parent.appendChild(tabsBar);

  const grid = document.createElement("div");
  grid.className = "sim-week-grid";

  sim.weekDays.forEach((day, dayIdx) => {
    const card = document.createElement("div");
    card.className = "sim-week-day-card";
    
    // Add tab-active class for responsive rendering
    if (dayIdx === sim.selectedDayIdx) {
      card.classList.add("tab-active");
    }
    
    // Highlight if active, completed, or upcoming
    if (dayIdx < sim.currentDayIdx) {
      card.classList.add("completed");
    } else if (dayIdx === sim.currentDayIdx) {
      card.classList.add("active");
    }

    // Header
    const header = document.createElement("div");
    header.className = "sim-day-header";
    header.innerHTML = `<h4>${day.name}</h4>`;
    
    if (day.steps && day.steps.length > 0) {
      const clearBtn = document.createElement("button");
      clearBtn.className = "btn-clear-day";
      clearBtn.title = "Clear day routine";
      clearBtn.innerHTML = `<i data-lucide="trash-2" style="width:12px;height:12px;"></i>`;
      clearBtn.addEventListener("click", () => {
        pauseSimulation();
        day.title = "";
        day.steps = [];
        
        // Reset weekly simulation stats
        sim.currentDayIdx = 0;
        sim.currentStepIdx = -1;
        sim.stats = { xp: 0, stress: 30, value: 0, level: 1, consecutiveBurnoutDays: 0 };
        
        triggerViewChange(() => {
          renderCalendar();
        });
      });
      header.appendChild(clearBtn);
    }
    card.appendChild(header);

    // Dropzone listeners
    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      card.classList.add("drag-over");
    });

    card.addEventListener("dragleave", () => {
      card.classList.remove("drag-over");
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();
      card.classList.remove("drag-over");
      
      soundEffects.play("swoosh");
      
      const dragDataStr = e.dataTransfer.getData("text/plain");
      try {
        const dragData = JSON.parse(dragDataStr);
        if (dragData && dragData.type === "daily-routine") {
          pauseSimulation();
          day.title = dragData.title;
          day.steps = JSON.parse(JSON.stringify(dragData.steps));
          
          // Reset simulation play state
          sim.currentDayIdx = 0;
          sim.currentStepIdx = -1;
          sim.stats = { xp: 0, stress: 30, value: 0, level: 1, consecutiveBurnoutDays: 0 };
          
          triggerViewChange(() => {
            renderCalendar();
          });
        }
      } catch (err) {
        console.error("Error parsing dropped routine:", err);
      }
    });

    // Content: list steps or empty placeholder
    if (!day.steps || day.steps.length === 0) {
      const empty = document.createElement("div");
      empty.className = "sim-day-empty-placeholder";
      empty.innerHTML = `
        <i data-lucide="calendar" style="width:24px;height:24px;"></i>
        <span>Empty<br><span style="font-size:0.65rem;color:var(--text-muted);">Drag routine here</span></span>
      `;
      card.appendChild(empty);
    } else {
      // Info banner
      const info = document.createElement("div");
      info.className = "sim-day-routine-info";
      
      // Calculate daily metrics
      const totalXP = day.steps.reduce((acc, s) => acc + (s.xp || 0), 0);
      const avgStress = day.steps.length > 0 ? Math.round(day.steps.reduce((acc, s) => acc + (s.stress || 0), 0) / day.steps.length) : 0;
      
      info.innerHTML = `
        <div class="sim-day-routine-title" title="${day.title}">${day.title}</div>
        <div class="sim-day-routine-stats">${day.steps.length} tasks • +${totalXP} XP • Avg: ${avgStress > 0 ? '+' : ''}${avgStress} Stress</div>
      `;
      card.appendChild(info);

      // Compact steps list
      const list = document.createElement("div");
      list.className = "sim-day-steps-list";

      day.steps.forEach((step, stepIdx) => {
        const item = document.createElement("div");
        item.className = "sim-day-step-mini-item";
        
        // Highlight active task
        if (dayIdx < sim.currentDayIdx) {
          item.classList.add("completed");
        } else if (dayIdx === sim.currentDayIdx) {
          if (stepIdx < sim.currentStepIdx) {
            item.classList.add("completed");
          } else if (stepIdx === sim.currentStepIdx) {
            item.classList.add("active");
          }
        }

        item.innerHTML = `
          <span class="sim-day-step-mini-title" title="${step.title}">${step.title}</span>
          <span class="sim-day-step-mini-time">${step.time}</span>
        `;
        list.appendChild(item);
      });
      card.appendChild(list);
    }

    grid.appendChild(card);
  });

  parent.appendChild(grid);
  lucide.createIcons();
}

// Update Burnout warnings dynamically
function updateBurnoutWarning(container, stress) {
  if (!container) return;

  const sim = state.activeSimulation;
  const isWeekly = sim && sim.scenarioId === "weekly-simulator";
  const consecutiveDays = (sim && sim.stats && sim.stats.consecutiveBurnoutDays) || 0;

  if (isWeekly && consecutiveDays >= 2) {
    container.innerHTML = `
      <div class="sim-burnout-warning" style="background:rgba(239,68,68,0.2);border-color:#ef4444;color:#f87171;animation:pulse-border 1s infinite;">
        <i data-lucide="skull" style="width:16px;height:16px;flex-shrink:0;margin-top:2px;"></i>
        <div>
          <strong>🚨 Chronic Burnout Warning!</strong>
          <span style="display:block;margin-top:2px;font-size:0.75rem;">You have been in a high-stress state for ${consecutiveDays} days in a row. XP rewards halved! Insert rest days.</span>
        </div>
      </div>
    `;
  } else if (stress >= 75) {
    container.innerHTML = `
      <div class="sim-burnout-warning">
        <i data-lucide="alert-triangle" style="width:16px;height:16px;flex-shrink:0;margin-top:2px;"></i>
        <div>
          <strong>⚠️ Burnout State Alert!</strong>
          <span style="display:block;margin-top:2px;font-size:0.75rem;">Your stress index is ${stress}% (>75%). Fatigue reduces task productivity. Take restorative breaks!</span>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="sim-burnout-warning" style="background:rgba(16,185,129,0.06);border-color:rgba(16,185,129,0.2);color:#34d399;animation:none;">
        <i data-lucide="check-circle-2" style="width:16px;height:16px;flex-shrink:0;margin-top:2px;"></i>
        <div>
          <strong>Status Stable & Focused</strong>
          <span style="display:block;margin-top:2px;font-size:0.75rem;">Stress matches sustainable bounds. The task scheduling profile functions smoothly.</span>
        </div>
      </div>
    `;
  }
  lucide.createIcons();
}

// Start Simulator Scenario setup
function startSimulation(scenarioId) {
  const scen = simulationScenarios[scenarioId];
  if (!scen) return;

  if (scenarioId === "weekly-simulator") {
    state.activeSimulation = {
      scenarioId,
      variationId: null,
      variationName: null,
      currentDayIdx: 0,
      currentStepIdx: -1,
      selectedDayIdx: 0,
      isPlaying: false,
      speed: 800,
      intervalId: null,
      stats: {
        xp: 0,
        stress: 30,
        value: 0,
        level: 1,
        consecutiveBurnoutDays: 0
      },
      weekDays: [
        { name: "Monday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
        { name: "Tuesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
        { name: "Wednesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
        { name: "Thursday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
        { name: "Friday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
        { name: "Saturday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) },
        { name: "Sunday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) }
      ]
    };
  } else {
    state.activeSimulation = {
      scenarioId,
      variationId: null,
      variationName: null,
      currentStep: -1,
      isPlaying: false,
      speed: 800, // 800ms per step
      intervalId: null,
      stats: {
        xp: scen.initialStats.xp,
        stress: scen.initialStats.stress,
        value: scen.initialStats.value,
        level: scen.initialStats.level
      },
      steps: JSON.parse(JSON.stringify(scen.steps))
    };
  }

  triggerViewChange(() => {
    renderCalendar();
  });
}

// Run single simulation timeline step
function runSimulationStep() {
  const sim = state.activeSimulation;
  if (!sim) return;

  if (sim.scenarioId === "weekly-simulator") {
    runWeeklySimulationStep();
    return;
  }

  const steps = sim.steps;
  const nextStepIdx = sim.currentStep + 1;

  if (nextStepIdx >= steps.length) {
    pauseSimulation();
    soundEffects.play("success");
    setTimeout(() => {
      showAppAlert("🏆 Simulation Completed! Routine log has finished play cycle successfully.");
    }, 200);
    return;
  }

  // Execute stats incrementations
  sim.currentStep = nextStepIdx;
  const step = steps[sim.currentStep];

  const oldStress = sim.stats.stress;
  const newStress = Math.max(0, Math.min(100, oldStress + (step.stress || 0)));
  
  if (oldStress < 75 && newStress >= 75) {
    soundEffects.play("burnout");
  } else {
    soundEffects.play("tick");
  }

  sim.stats.xp += step.xp || 0;
  sim.stats.stress = Math.max(0, Math.min(100, sim.stats.stress + (step.stress || 0)));
  sim.stats.value += step.value || 0;

  // Level Up Check
  while (sim.stats.xp >= 1000) {
    sim.stats.level += 1;
    sim.stats.xp -= 1000;
  }

  // Render updates directly to DOM elements to keep it extremely fast
  const lvlEl = document.getElementById("sim-lvl");
  const xpValEl = document.getElementById("sim-xp-val");
  const xpFillEl = document.getElementById("sim-xp-fill");
  const stressValEl = document.getElementById("sim-stress-val");
  const stressFillEl = document.getElementById("sim-stress-fill");
  const valueValEl = document.getElementById("sim-value-val");
  const warningContainer = document.getElementById("sim-warning-container");

  if (lvlEl) lvlEl.innerText = sim.stats.level;
  if (xpValEl) xpValEl.innerText = `${sim.stats.xp} XP`;
  if (xpFillEl) xpFillEl.style.width = `${(sim.stats.xp / 1000) * 100}%`;
  
  if (stressValEl) stressValEl.innerText = `${sim.stats.stress}%`;
  if (stressFillEl) {
    stressFillEl.style.width = `${sim.stats.stress}%`;
    const box = stressFillEl.closest(".stress-box");
    if (box) {
      box.className = "sim-stat-box stress-box";
      if (sim.stats.stress >= 75) box.classList.add("stress-high");
      else if (sim.stats.stress >= 50) box.classList.add("stress-warn");
    }
  }

  if (valueValEl) {
    const valVal = sim.stats.value;
    if (valVal >= 0) {
      valueValEl.innerText = `$${valVal.toFixed(2)}`;
      valueValEl.style.color = "#10b981";
    } else {
      valueValEl.innerText = `-$${Math.abs(valVal).toFixed(2)}`;
      valueValEl.style.color = "#ef4444";
    }
  }

  updateBurnoutWarning(warningContainer, sim.stats.stress);

  // Update Timeline steps visual classes
  steps.forEach((s, idx) => {
    const item = document.getElementById(`sim-step-${idx}`);
    if (item) {
      item.className = `sim-step-item cat-${s.category}`;
      const badge = item.querySelector(".sim-step-status-badge");
      
      if (idx < sim.currentStep) {
        item.classList.add("completed");
        if (badge) badge.innerText = "Done";
      } else if (idx === sim.currentStep) {
        item.classList.add("active");
        if (badge) badge.innerText = "Running";
        
        // Scroll active item smoothly into view
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        if (badge) badge.innerText = "Upcoming";
      }
    }
  });
}

// Play single weekly routine simulation step
function runWeeklySimulationStep() {
  const sim = state.activeSimulation;
  if (!sim) return;

  // Find next step to execute
  let dayIdx = sim.currentDayIdx;
  let stepIdx = sim.currentStepIdx + 1;

  // Advance past empty days
  while (dayIdx < 7) {
    const dayObj = sim.weekDays[dayIdx];
    if (dayObj && dayObj.steps && dayObj.steps.length > 0) {
      if (stepIdx < dayObj.steps.length) {
        break;
      } else {
        // Finished this day's steps, carry over stress to the next day!
        // Fatigue Carryover formula: recovery overnight, but keep a fraction of previous day's ending stress
        // Next day start stress = Math.max(25, endingStress - 30)
        const endStress = sim.stats.stress;
        if (endStress >= 75) {
          sim.stats.consecutiveBurnoutDays = (sim.stats.consecutiveBurnoutDays || 0) + 1;
        } else {
          sim.stats.consecutiveBurnoutDays = 0;
        }
        
        sim.stats.stress = Math.max(25, Math.min(100, Math.round(endStress * 0.75)));
        dayIdx++;
        stepIdx = 0;
      }
    } else {
      // Empty day, reset consecutive days if there was one
      sim.stats.consecutiveBurnoutDays = 0;
      dayIdx++;
      stepIdx = 0;
    }
  }

  // If we exceeded Sunday, simulation completed!
  if (dayIdx >= 7) {
    pauseSimulation();
    soundEffects.play("success");
    setTimeout(() => {
      showAppAlert("🏆 Weekly Simulation Completed! The full 7-day academic cycle has finished playing successfully.");
    }, 200);
    return;
  }

  // Run this step
  sim.currentDayIdx = dayIdx;
  sim.currentStepIdx = stepIdx;

  const dayObj = sim.weekDays[dayIdx];
  const step = dayObj.steps[stepIdx];

  const oldStress = sim.stats.stress;
  const newStress = Math.max(0, Math.min(100, oldStress + (step.stress || 0)));
  
  if (oldStress < 75 && newStress >= 75) {
    soundEffects.play("burnout");
  } else {
    soundEffects.play("tick");
  }

  // Execute stats incrementations
  let xpGain = step.xp || 0;
  const consecutiveDays = sim.stats.consecutiveBurnoutDays || 0;
  if (consecutiveDays >= 2) {
    xpGain = Math.round(xpGain / 2); // XP reward halved under chronic burnout
  }
  sim.stats.xp += xpGain;
  sim.stats.stress = Math.max(0, Math.min(100, sim.stats.stress + (step.stress || 0)));
  sim.stats.value += step.value || 0;

  // Level Up Check
  while (sim.stats.xp >= 1000) {
    sim.stats.level += 1;
    sim.stats.xp -= 1000;
  }

  // Render stats updates directly to DOM to keep it responsive
  const lvlEl = document.getElementById("sim-lvl");
  const xpValEl = document.getElementById("sim-xp-val");
  const xpFillEl = document.getElementById("sim-xp-fill");
  const stressValEl = document.getElementById("sim-stress-val");
  const stressFillEl = document.getElementById("sim-stress-fill");
  const valueValEl = document.getElementById("sim-value-val");
  const warningContainer = document.getElementById("sim-warning-container");

  if (lvlEl) lvlEl.innerText = sim.stats.level;
  if (xpValEl) xpValEl.innerText = `${sim.stats.xp} XP`;
  if (xpFillEl) xpFillEl.style.width = `${(sim.stats.xp / 1000) * 100}%`;
  
  if (stressValEl) stressValEl.innerText = `${sim.stats.stress}%`;
  if (stressFillEl) {
    stressFillEl.style.width = `${sim.stats.stress}%`;
    const box = stressFillEl.closest(".stress-box");
    if (box) {
      box.className = "sim-stat-box stress-box";
      if (sim.stats.stress >= 75) box.classList.add("stress-high");
      else if (sim.stats.stress >= 50) box.classList.add("stress-warn");
    }
  }

  if (valueValEl) {
    const valVal = sim.stats.value;
    if (valVal >= 0) {
      valueValEl.innerText = `$${valVal.toFixed(2)}`;
      valueValEl.style.color = "#10b981";
    } else {
      valueValEl.innerText = `-$${Math.abs(valVal).toFixed(2)}`;
      valueValEl.style.color = "#ef4444";
    }
  }

  updateBurnoutWarning(warningContainer, sim.stats.stress);

  // Redraw the grid card highlights and active states
  triggerViewChange(() => {
    renderCalendar();
  });
}

// Play simulation controller loop
function playSimulation() {
  const sim = state.activeSimulation;
  if (!sim) return;

  sim.isPlaying = true;
  const playBtn = document.getElementById("btn-sim-play");
  if (playBtn) {
    playBtn.innerHTML = `<i data-lucide="pause"></i> Pause`;
    lucide.createIcons();
  }

  // Pre-trigger step immediately if starting
  runSimulationStep();

  sim.intervalId = setInterval(() => {
    runSimulationStep();
  }, sim.speed);
}

// Pause simulation
function pauseSimulation() {
  const sim = state.activeSimulation;
  if (!sim) return;

  sim.isPlaying = false;
  clearInterval(sim.intervalId);

  const playBtn = document.getElementById("btn-sim-play");
  if (playBtn) {
    playBtn.innerHTML = `<i data-lucide="play"></i> Run Routine`;
    lucide.createIcons();
  }
}

// Reset active simulation parameters
function resetSimulation() {
  const sim = state.activeSimulation;
  if (!sim) return;

  pauseSimulation();
  
  if (sim.scenarioId === "weekly-simulator") {
    sim.currentDayIdx = 0;
    sim.currentStepIdx = -1;
    sim.selectedDayIdx = 0;
    sim.stats = {
      xp: 0,
      stress: 30,
      value: 0,
      level: 1,
      consecutiveBurnoutDays: 0
    };
  } else {
    const scen = simulationScenarios[sim.scenarioId];
    sim.currentStep = -1;
    sim.stats = {
      xp: scen.initialStats.xp,
      stress: scen.initialStats.stress,
      value: scen.initialStats.value,
      level: scen.initialStats.level
    };
  }

  triggerViewChange(() => {
    renderCalendar();
  });
}

// Close Simulator completely
function exitSimulation() {
  const sim = state.activeSimulation;
  if (sim) {
    clearInterval(sim.intervalId);
  }
  state.activeSimulation = null;

  triggerViewChange(() => {
    renderCalendar();
  });
}

// Adjust play cycle rates
function adjustSimSpeed(speedMs) {
  const sim = state.activeSimulation;
  if (!sim) return;

  sim.speed = speedMs;

  // Toggle speed control active classes in DOM
  const buttons = document.querySelectorAll(".sim-speed-btn");
  buttons.forEach(btn => {
    btn.classList.remove("active");
  });

  const matchingBtn = Array.from(buttons).find(b => b.getAttribute("onclick").includes(speedMs));
  if (matchingBtn) matchingBtn.classList.add("active");

  if (sim.isPlaying) {
    clearInterval(sim.intervalId);
    sim.intervalId = setInterval(() => {
      runSimulationStep();
    }, sim.speed);
  }
}
window.adjustSimSpeed = adjustSimSpeed;

/* ----------------------------------------------------
   Routine Variations Manager (Schedule saves & load)
---------------------------------------------------- */

// Setup Routine Saves event listeners
// Setup Routine Saves event listeners
function setupRoutineSavesListeners() {
  updateRoutineSavesWidget();
}

// Fetch all default and saved daily routines for Weekly Routine Simulator
function getAvailableDailyRoutines() {
  const list = [];
  
  // 0. College Timetable — Per-Day Routines
  const dayNames = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };
  Object.entries(collegeTimetable).forEach(([dayKey, steps]) => {
    list.push({
      id: `college-tt-${dayKey}`,
      title: `🎓 ${dayNames[dayKey]} — College Timetable`,
      steps: steps,
      category: "work",
      isCollegeTimetable: true,
      dayKey: dayKey
    });
  });
  // Full-week college timetable (special)
  list.push({
    id: "college-tt-full-week",
    title: "🎓 College Timetable — Full Week",
    steps: collegeTimetable.monday, // placeholder; apply function uses per-day data
    category: "work",
    isCollegeTimetable: true,
    isFullWeek: true
  });

  // 1. Defaults
  list.push({
    id: "default-midterm",
    title: "Midterm MCQ Study & Site Prep (Default)",
    steps: simulationScenarios["midterm-mcq"].steps,
    category: "work"
  });
  list.push({
    id: "default-weekend",
    title: "Weekend Academic Sprint (Default)",
    steps: simulationScenarios["weekend-sprint"].steps,
    category: "personal"
  });

  // 2. Custom sandbox saved variations
  const customSaves = JSON.parse(localStorage.getItem("aetherflow_custom_sim_variations") || "[]");
  customSaves.forEach(v => {
    list.push({
      id: v.id,
      title: `${v.name} (Custom Sandbox)`,
      steps: v.steps,
      category: "other"
    });
  });

  // 3. Weekend Sprint saved variations
  const weekendSaves = JSON.parse(localStorage.getItem("aetherflow_sim_weekend_variations") || "[]");
  weekendSaves.forEach(v => {
    list.push({
      id: v.id,
      title: `${v.name} (Weekend Sprint Var)`,
      steps: v.steps,
      category: "personal"
    });
  });

  // 4. Midterm Study saved variations
  const midtermSaves = JSON.parse(localStorage.getItem("aetherflow_sim_midterm_variations") || "[]");
  midtermSaves.forEach(v => {
    list.push({
      id: v.id,
      title: `${v.name} (Midterm MCQ Var)`,
      steps: v.steps,
      category: "work"
    });
  });

  return list;
}

// Dynamic Routine Saves Widget Configuration
function updateRoutineSavesWidget() {
  const selectEl = document.getElementById("routine-variation-select");
  const saveBtn = document.getElementById("btn-save-routine");
  const revertBtn = document.getElementById("btn-revert-routine");
  if (!selectEl || !saveBtn || !revertBtn) return;

  const sim = state.activeSimulation;
  if (!sim) {
    const routinesWidget = document.querySelector(".routines-widget");
    if (routinesWidget) routinesWidget.style.display = "none";
    return;
  }

  const routinesWidget = document.querySelector(".routines-widget");
  if (routinesWidget) routinesWidget.style.display = "block";

  // Determine key and load variations
  let storageKey = "";
  let defaultSteps = [];
  let isWeekly = false;

  if (sim.scenarioId === "weekend-sprint") {
    storageKey = "aetherflow_sim_weekend_variations";
    defaultSteps = simulationScenarios["weekend-sprint"].steps;
  } else if (sim.scenarioId === "midterm-mcq") {
    storageKey = "aetherflow_sim_midterm_variations";
    defaultSteps = simulationScenarios["midterm-mcq"].steps;
  } else if (sim.scenarioId === "custom-sandbox") {
    storageKey = "aetherflow_sim_custom_variations";
    defaultSteps = [];
  } else if (sim.scenarioId === "weekly-simulator") {
    storageKey = "aetherflow_sim_week_variations";
    isWeekly = true;
    defaultSteps = [];
  }

  // Load variations for this scenario
  const variations = JSON.parse(localStorage.getItem(storageKey) || "[]");
  
  // Populate dropdown
  selectEl.innerHTML = `<option value="default">— Default Schedule —</option>`;
  variations.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.innerText = v.name;
    selectEl.appendChild(opt);
  });

  // Select current variation if loaded
  if (sim.variationId) {
    selectEl.value = sim.variationId;
  } else {
    selectEl.value = "default";
  }

  // Clone buttons & select elements to strip old listener bindings
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  const newRevertBtn = revertBtn.cloneNode(true);
  revertBtn.parentNode.replaceChild(newRevertBtn, revertBtn);

  const newSelectEl = selectEl.cloneNode(true);
  selectEl.parentNode.replaceChild(newSelectEl, selectEl);

  // Setup new listeners
  newSaveBtn.addEventListener("click", () => {
    showAppPrompt("Enter a name for this routine variation:", "", (name) => {
      if (!name || name.trim() === "") return;

      const trimmedName = name.trim();
      const existingIdx = variations.findIndex(v => v.name.toLowerCase() === trimmedName.toLowerCase());

      let variationObj = {};
      if (isWeekly) {
        variationObj = {
          id: existingIdx > -1 ? variations[existingIdx].id : "week-var-" + generateUUID(),
          name: trimmedName,
          weekDays: JSON.parse(JSON.stringify(sim.weekDays))
        };
      } else {
        variationObj = {
          id: existingIdx > -1 ? variations[existingIdx].id : "sim-var-" + generateUUID(),
          name: trimmedName,
          steps: JSON.parse(JSON.stringify(sim.steps))
        };
      }

      const doSave = () => {
        localStorage.setItem(storageKey, JSON.stringify(variations));
        sim.variationId = variationObj.id;
        sim.variationName = variationObj.name;
        updateRoutineSavesWidget();
        showAppAlert(`✅ Variation "${trimmedName}" saved successfully!`);
        if (sim.scenarioId === "weekly-simulator") {
          renderActionTemplates();
        }
      };

      if (existingIdx > -1) {
        showAppConfirm(`A variation named "${trimmedName}" already exists. Do you want to overwrite it?`, (confirmed) => {
          if (confirmed) {
            variations[existingIdx] = variationObj;
            doSave();
          }
        });
      } else {
        variations.push(variationObj);
        doSave();
      }
    });
  });

  newRevertBtn.addEventListener("click", () => {
    showAppConfirm("Are you sure you want to revert back to the default schedule? This will replace your current edits.", (confirmed) => {
      if (!confirmed) return;
      pauseSimulation();
      sim.variationId = null;
      sim.variationName = null;
      
      if (isWeekly) {
        sim.weekDays = [
          { name: "Monday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Tuesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Wednesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Thursday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Friday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Saturday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) },
          { name: "Sunday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) }
        ];
        sim.currentDayIdx = 0;
        sim.currentStepIdx = -1;
        sim.stats = { xp: 0, stress: 30, value: 0, level: 1 };
      } else {
        sim.steps = JSON.parse(JSON.stringify(defaultSteps));
        sim.currentStep = -1;
        const initStats = simulationScenarios[sim.scenarioId].initialStats;
        sim.stats = {
          xp: initStats.xp,
          stress: initStats.stress,
          value: initStats.value,
          level: initStats.level
        };
      }

      updateRoutineSavesWidget();
      triggerViewChange(() => {
        renderCalendar();
      });
      showAppAlert("✅ Reverted to default schedule.");
    });
  });

  newSelectEl.addEventListener("change", (e) => {
    const val = e.target.value;
    pauseSimulation();

    if (val === "default") {
      sim.variationId = null;
      sim.variationName = null;
      if (isWeekly) {
        sim.weekDays = [
          { name: "Monday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Tuesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Wednesday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Thursday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Friday", title: "Midterm MCQ Study & Site Prep (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["midterm-mcq"].steps)) },
          { name: "Saturday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) },
          { name: "Sunday", title: "Weekend Academic Sprint (Default)", steps: JSON.parse(JSON.stringify(simulationScenarios["weekend-sprint"].steps)) }
        ];
        sim.currentDayIdx = 0;
        sim.currentStepIdx = -1;
        sim.stats = { xp: 0, stress: 30, value: 0, level: 1 };
      } else {
        sim.steps = JSON.parse(JSON.stringify(defaultSteps));
        sim.currentStep = -1;
        const initStats = simulationScenarios[sim.scenarioId].initialStats;
        sim.stats = {
          xp: initStats.xp,
          stress: initStats.stress,
          value: initStats.value,
          level: initStats.level
        };
      }
    } else {
      const selectedVar = variations.find(v => v.id === val);
      if (selectedVar) {
        sim.variationId = selectedVar.id;
        sim.variationName = selectedVar.name;
        if (isWeekly) {
          sim.weekDays = JSON.parse(JSON.stringify(selectedVar.weekDays));
          sim.currentDayIdx = 0;
          sim.currentStepIdx = -1;
          sim.stats = { xp: 0, stress: 30, value: 0, level: 1 };
        } else {
          sim.steps = JSON.parse(JSON.stringify(selectedVar.steps));
          sim.currentStep = -1;
          const initStats = simulationScenarios[sim.scenarioId].initialStats;
          sim.stats = {
            xp: initStats.xp,
            stress: initStats.stress,
            value: initStats.value,
            level: initStats.level
          };
        }
      }
    }

    triggerViewChange(() => {
      renderCalendar();
    });
  });
}

/* ----------------------------------------------------
   Custom Canvas Simulation Engine Helpers
---------------------------------------------------- */

// Helper to convert minutes back to HH:MM format string
function minutesToTimeStr(totalMin) {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Append dragged action block templates onto custom sandbox simulator steps
function addTemplateToSimSteps(template) {
  const sim = state.activeSimulation;
  if (!sim) return;

  // Calculate sequential times starting from 09:00
  let timeStr = "09:00";
  if (sim.steps.length > 0) {
    const lastStep = sim.steps[sim.steps.length - 1];
    const lastMin = getMinutes(lastStep.time);
    const lastDur = parseInt(lastStep.duration || 60);
    timeStr = minutesToTimeStr(lastMin + lastDur);
  }

  const newStep = {
    time: timeStr,
    title: template.title,
    category: template.category,
    xp: template.xp !== undefined ? template.xp : 30,
    stress: template.stress !== undefined ? template.stress : 10,
    value: template.value !== undefined ? template.value : 0,
    duration: template.duration || 60
  };

  sim.steps.push(newStep);

  triggerViewChange(() => {
    renderCalendar();
  });
}

// Delete step from custom simulation timeline canvas
function deleteSimStep(idx) {
  const sim = state.activeSimulation;
  if (!sim) return;

  // Remove element
  sim.steps.splice(idx, 1);

  // Recalculate start times sequentially starting at 09:00 to keep it clean
  let currentMin = 9 * 60; // 09:00 AM
  sim.steps.forEach(step => {
    step.time = minutesToTimeStr(currentMin);
    currentMin += parseInt(step.duration || 60);
  });

  // Reset progress pointer to beginning if active index is affected
  const scen = simulationScenarios[sim.scenarioId];
  const initStats = scen ? scen.initialStats : { xp: 0, stress: 30, value: 0, level: 1 };
  sim.currentStep = -1;
  sim.stats = {
    xp: initStats.xp,
    stress: initStats.stress,
    value: initStats.value,
    level: initStats.level
  };

  triggerViewChange(() => {
    renderCalendar();
  });
}
window.deleteSimStep = deleteSimStep;

// Save current sandbox simulation canvas routine as reusable variation
function saveCustomSimulationVariation() {
  const sim = state.activeSimulation;
  if (!sim || sim.steps.length === 0) return;

  showAppPrompt("Enter a name for this custom simulation variation:", "", (name) => {
    if (!name || name.trim() === "") return;

    const trimmedName = name.trim();
    const savedSims = JSON.parse(localStorage.getItem("aetherflow_custom_sim_variations") || "[]");

    // Check if name already exists
    const existingIdx = savedSims.findIndex(v => v.name.toLowerCase() === trimmedName.toLowerCase());

    const simVarObj = {
      id: "sim-var-" + generateUUID(),
      name: trimmedName,
      steps: JSON.parse(JSON.stringify(sim.steps))
    };

    const doSave = () => {
      localStorage.setItem("aetherflow_custom_sim_variations", JSON.stringify(savedSims));
      showAppAlert(`✅ Simulation variation "${trimmedName}" saved successfully!`, () => {
        exitSimulation();
      });
    };

    if (existingIdx > -1) {
      showAppConfirm(`A simulation variation named "${trimmedName}" already exists. Do you want to overwrite it?`, (confirmed) => {
        if (confirmed) {
          simVarObj.id = savedSims[existingIdx].id; // preserve id
          savedSims[existingIdx] = simVarObj;
          doSave();
        }
      });
    } else {
      savedSims.push(simVarObj);
      doSave();
    }
  });
}

// Start simulation from loaded custom variation
function startCustomSimulation(simVar) {
  state.activeSimulation = {
    scenarioId: "custom-sandbox",
    variationId: simVar.id,
    variationName: simVar.name,
    currentStep: -1,
    isPlaying: false,
    speed: 800,
    intervalId: null,
    stats: {
      xp: 0,
      stress: 30,
      value: 0,
      level: 1
    },
    steps: JSON.parse(JSON.stringify(simVar.steps))
  };

  triggerViewChange(() => {
    renderCalendar();
  });
}

// Delete custom simulation variation card
function deleteCustomSimulationVariation(id) {
  const savedSims = JSON.parse(localStorage.getItem("aetherflow_custom_sim_variations") || "[]");
  const filtered = savedSims.filter(v => v.id !== id);
  localStorage.setItem("aetherflow_custom_sim_variations", JSON.stringify(filtered));
  
  triggerViewChange(() => {
    renderCalendar();
  });
}

// Setup assign routine dialog event listeners
function setupAssignRoutineDialogListeners() {
  const dialog = document.getElementById("assign-routine-dialog");
  if (!dialog) return;

  const closeBtn = document.getElementById("btn-close-assign-dialog");
  const cancelBtn = document.getElementById("btn-cancel-assign-dialog");
  const dayButtons = dialog.querySelectorAll(".btn-assign-day");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      dialog.close();
    });
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      dialog.close();
    });
  }

  dayButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const dayIdx = parseInt(btn.getAttribute("data-day-index"));
      const sim = state.activeSimulation;
      
      if (sim && sim.scenarioId === "weekly-simulator" && activeAssignRoutine) {
        pauseSimulation();
        
        const day = sim.weekDays[dayIdx];
        if (day) {
          day.title = activeAssignRoutine.title;
          day.steps = JSON.parse(JSON.stringify(activeAssignRoutine.steps));
          
          // Reset weekly simulation stats
          sim.currentDayIdx = 0;
          sim.currentStepIdx = -1;
          sim.stats = { xp: 0, stress: 30, value: 0, level: 1, consecutiveBurnoutDays: 0 };
          
          soundEffects.play("success");
          
          // Trigger view update
          triggerViewChange(() => {
            renderCalendar();
          });
        }
      }
      dialog.close();
    });
  });
}

// Open assign routine dialog for touch screens
function openAssignRoutineDialog(routine) {
  const dialog = document.getElementById("assign-routine-dialog");
  if (!dialog) return;
  
  activeAssignRoutine = routine;
  dialog.showModal();
}

// GitHub Cloud Sync Helper Object
const githubSync = {
  getCredentials() {
    return {
      username: localStorage.getItem("aetherflow_sync_username"),
      repo: localStorage.getItem("aetherflow_sync_repo"),
      token: localStorage.getItem("aetherflow_sync_token")
    };
  },
  
  setCredentials(username, repo, token) {
    localStorage.setItem("aetherflow_sync_username", username);
    localStorage.setItem("aetherflow_sync_repo", repo);
    localStorage.setItem("aetherflow_sync_token", token);
  },

  clearCredentials() {
    localStorage.removeItem("aetherflow_sync_username");
    localStorage.removeItem("aetherflow_sync_repo");
    localStorage.removeItem("aetherflow_sync_token");
    localStorage.removeItem("aetherflow_sync_time");
  },

  isEnabled() {
    const creds = this.getCredentials();
    return !!(creds.username && creds.repo && creds.token);
  },

  async fetchFile() {
    const creds = this.getCredentials();
    if (!creds.token) throw new Error("No sync token configured");

    // Add cache buster to URL to prevent browser caching stale 404s
    const url = `https://api.github.com/repos/${creds.username}/${creds.repo}/contents/data.json?t=${Date.now()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `token ${creds.token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to fetch file from GitHub");
    }

    const data = await response.json();
    let contentObj = null;
    try {
      if (data.content) {
        const decodedContent = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
        contentObj = JSON.parse(decodedContent);
      }
    } catch (parseErr) {
      console.warn("Failed to decode or parse existing data.json content from GitHub:", parseErr);
    }

    return {
      content: contentObj,
      sha: data.sha
    };
  },

  async uploadFile(payloadContent) {
    const creds = this.getCredentials();
    if (!creds.token) throw new Error("No sync token configured");

    let sha = null;
    try {
      const existing = await this.fetchFile();
      if (existing) {
        sha = existing.sha;
      }
    } catch (e) {
      console.error("Error checking existing file SHA:", e);
    }

    const url = `https://api.github.com/repos/${creds.username}/${creds.repo}/contents/data.json`;
    const jsonStr = JSON.stringify(payloadContent, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

    const body = {
      message: "Sync AetherFlow Data",
      content: base64Content
    };
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${creds.token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to push file to GitHub");
    }

    return await response.json();
  },

  getLocalState() {
    return {
      tasks: JSON.parse(localStorage.getItem("aetherflow_tasks") || "[]"),
      userStats: JSON.parse(localStorage.getItem("aetherflow_stats") || '{"xp":120,"level":1,"stress":30,"value":50}'),
      customTemplates: JSON.parse(localStorage.getItem("aetherflow_custom_templates") || "[]"),
      deletedTemplates: JSON.parse(localStorage.getItem("aetherflow_deleted_templates") || "[]"),
      modifiedBuiltins: JSON.parse(localStorage.getItem("aetherflow_modified_builtins") || "{}"),
      templateGroups: JSON.parse(localStorage.getItem("aetherflow_template_groups") || "[]"),
      collapsedGroups: JSON.parse(localStorage.getItem("aetherflow_collapsed_groups") || "{}")
    };
  },

  applyState(stateObj) {
    if (!stateObj) return;
    isSyncingInProgress = true;
    try {
      if (stateObj.tasks) localStorage.setItem("aetherflow_tasks", JSON.stringify(stateObj.tasks));
      if (stateObj.userStats) localStorage.setItem("aetherflow_stats", JSON.stringify(stateObj.userStats));
      if (stateObj.customTemplates) localStorage.setItem("aetherflow_custom_templates", JSON.stringify(stateObj.customTemplates));
      if (stateObj.deletedTemplates) localStorage.setItem("aetherflow_deleted_templates", JSON.stringify(stateObj.deletedTemplates));
      if (stateObj.modifiedBuiltins) localStorage.setItem("aetherflow_modified_builtins", JSON.stringify(stateObj.modifiedBuiltins));
      if (stateObj.templateGroups) localStorage.setItem("aetherflow_template_groups", JSON.stringify(stateObj.templateGroups));
      if (stateObj.collapsedGroups) localStorage.setItem("aetherflow_collapsed_groups", JSON.stringify(stateObj.collapsedGroups));
    } finally {
      isSyncingInProgress = false;
    }
  }
};

// Debounced Auto-Sync Trigger
let syncTimeoutId = null;
function triggerAutoSyncPush() {
  if (!githubSync.isEnabled()) return;

  const syncTime = Date.now();
  localStorage.setItem("aetherflow_sync_time", syncTime);

  if (syncTimeoutId) clearTimeout(syncTimeoutId);
  syncTimeoutId = setTimeout(async () => {
    try {
      console.log("Auto-syncing to GitHub...");
      const stateObj = githubSync.getLocalState();
      stateObj.syncTime = syncTime;
      await githubSync.uploadFile(stateObj);
      console.log("Auto-sync completed successfully!");
    } catch (err) {
      console.warn("Auto-sync failed:", err);
    }
  }, 5000);
}

// Setup Cloud Sync Dialog Listeners
function setupSyncDialogListeners() {
  const syncBtn = document.getElementById("btn-cloud-sync");
  const dialog = document.getElementById("sync-dialog");
  const closeBtn = document.getElementById("btn-close-sync-dialog");
  const form = document.getElementById("sync-form");
  const disconnectBtn = document.getElementById("btn-disconnect-sync");
  const pullBtn = document.getElementById("btn-pull-sync");
  const pushBtn = document.getElementById("btn-push-sync");

  if (!dialog || !form) return;

  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      soundEffects.play("click");
      
      // Load current credentials to pre-fill
      const creds = githubSync.getCredentials();
      document.getElementById("sync-github-username").value = creds.username || "";
      document.getElementById("sync-github-repo").value = creds.repo || "";
      document.getElementById("sync-github-token").value = creds.token || "";

      if (githubSync.isEnabled()) {
        if (disconnectBtn) disconnectBtn.style.display = "block";
      } else {
        if (disconnectBtn) disconnectBtn.style.display = "none";
      }

      dialog.showModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => dialog.close());
  }

  // Handle Push (Upload) Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    soundEffects.play("click");

    const username = document.getElementById("sync-github-username").value.trim();
    const repo = document.getElementById("sync-github-repo").value.trim();
    const token = document.getElementById("sync-github-token").value.trim();

    if (!username || !repo || !token) {
      showAppAlert("⚠️ Please fill in all sync settings fields.");
      return;
    }

    const originalText = pushBtn.innerText;
    pushBtn.disabled = true;
    pushBtn.innerText = "Syncing...";
    if (pullBtn) pullBtn.disabled = true;

    try {
      // Save credentials first so upload can read them
      githubSync.setCredentials(username, repo, token);
      
      // Upload local state
      const stateObj = githubSync.getLocalState();
      stateObj.syncTime = Date.now();
      localStorage.setItem("aetherflow_sync_time", stateObj.syncTime);
      
      await githubSync.uploadFile(stateObj);
      
      soundEffects.play("success");
      showAppAlert("🏆 Sync Successful! Local database uploaded to your GitHub repository.");
      dialog.close();
    } catch (err) {
      showAppAlert(`❌ Sync Failed: ${err.message}`);
    } finally {
      pushBtn.disabled = false;
      pushBtn.innerText = originalText;
      if (pullBtn) pullBtn.disabled = false;
    }
  });

  // Handle Pull (Download) Event
  if (pullBtn) {
    pullBtn.addEventListener("click", () => {
      soundEffects.play("click");
      
      const username = document.getElementById("sync-github-username").value.trim();
      const repo = document.getElementById("sync-github-repo").value.trim();
      const token = document.getElementById("sync-github-token").value.trim();

      if (!username || !repo || !token) {
        showAppAlert("⚠️ Please configure Username, Repo, and Token before pulling data.");
        return;
      }

      showAppConfirm("Are you sure you want to download remote sync data? This will overwrite your current local calendar data.", async (confirmed) => {
        if (!confirmed) return;

        const originalText = pullBtn.innerText;
        pullBtn.disabled = true;
        pullBtn.innerText = "Downloading...";
        if (pushBtn) pushBtn.disabled = true;

        try {
          githubSync.setCredentials(username, repo, token);
          const result = await githubSync.fetchFile();

          if (!result || !result.content) {
            showAppAlert("❌ No remote calendar data found. Push from your source device first.");
            return;
          }

          // Apply state
          githubSync.applyState(result.content);
          if (result.content.syncTime) {
            localStorage.setItem("aetherflow_sync_time", result.content.syncTime);
          }

          // Reload data from local storage
          state.tasks = JSON.parse(localStorage.getItem("aetherflow_tasks") || "[]");
          state.userStats = JSON.parse(localStorage.getItem("aetherflow_stats") || '{"xp":120,"level":1,"stress":30,"value":50}');
          state.groups = JSON.parse(localStorage.getItem("aetherflow_template_groups") || "[]");
          state.collapsedGroups = JSON.parse(localStorage.getItem("aetherflow_collapsed_groups") || "{}");

          // Reload templates
          const savedCustomTemplates = localStorage.getItem("aetherflow_custom_templates") || "[]";
          const deletedBuiltinIds = JSON.parse(localStorage.getItem("aetherflow_deleted_templates") || "[]");
          const modifiedBuiltins = JSON.parse(localStorage.getItem("aetherflow_modified_builtins") || "{}");
          const allBuiltins = [
            ...templates,
            ...pastTemplates.map(t => ({ ...t, groupId: "group-past", past: true }))
          ];
          const filteredBuiltins = allBuiltins.filter(t => !deletedBuiltinIds.includes(t.id)).map(t => {
            if (modifiedBuiltins[t.id]) return { ...t, ...modifiedBuiltins[t.id] };
            return t;
          });
          state.templates = [...filteredBuiltins, ...JSON.parse(savedCustomTemplates)];

          soundEffects.play("success");
          showAppAlert("🏆 Sync Successful! Remote calendar data downloaded and loaded successfully.");
          
          triggerViewChange(() => {
            renderCalendar();
            updateAgendaList();
            renderUserStats();
            renderActionTemplates();
          });

          dialog.close();
        } catch (err) {
          showAppAlert(`❌ Pull Failed: ${err.message}`);
        } finally {
          pullBtn.disabled = false;
          pullBtn.innerText = originalText;
          if (pushBtn) pushBtn.disabled = false;
        }
      });
    });
  }

  // Handle Disconnect Event
  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      soundEffects.play("click");
      showAppConfirm("Are you sure you want to disconnect sync? This will not delete your data on GitHub or locally, but your devices will stop syncing.", (confirmed) => {
        if (confirmed) {
          githubSync.clearCredentials();
          document.getElementById("sync-github-username").value = "";
          document.getElementById("sync-github-repo").value = "";
          document.getElementById("sync-github-token").value = "";
          disconnectBtn.style.display = "none";
          showAppAlert("✅ Sync disconnected successfully.");
          dialog.close();
        }
      });
    });
  }
}

// Custom Premium Dialog to prompt user on drop (Overwrite vs. Append)
function promptApplyRoutine(routineTitle, onChoice) {
  const existing = document.getElementById("apply-routine-prompt-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "apply-routine-prompt-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "400px";
  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3><i data-lucide="calendar" style="color:var(--primary);width:18px;height:18px;vertical-align:middle;margin-right:6px;"></i> Apply Routine</h3>
      </div>
      <div style="padding: 1rem 1.5rem 1.5rem 1.5rem;">
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4; margin-bottom: 1.25rem;">
          How would you like to apply <strong>${routineTitle}</strong>?
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button type="button" class="btn btn-primary" id="btn-apply-overwrite" style="padding: 0.75rem;">
            💥 Overwrite (This Day)
          </button>
          <button type="button" class="btn btn-secondary" id="btn-apply-append" style="padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-card);">
            ➕ Append (This Day)
          </button>
          <button type="button" class="btn btn-primary" id="btn-apply-week-overwrite" style="padding: 0.75rem; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); border: none;">
            📅 Apply to Entire Week (Overwrite)
          </button>
          <button type="button" class="btn btn-secondary" id="btn-apply-week-append" style="padding: 0.75rem; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); color: #c084fc;">
            📅 Apply to Entire Week (Append)
          </button>
          <button type="button" class="btn" id="btn-apply-cancel" style="padding: 0.5rem; margin-top: 10px; background: transparent; color: var(--text-muted);">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  lucide.createIcons();

  dialog.showModal();

  dialog.querySelector("#btn-apply-overwrite").addEventListener("click", () => {
    soundEffects.play("success");
    dialog.close();
    dialog.remove();
    onChoice("overwrite");
  });

  dialog.querySelector("#btn-apply-append").addEventListener("click", () => {
    soundEffects.play("click");
    dialog.close();
    dialog.remove();
    onChoice("append");
  });

  dialog.querySelector("#btn-apply-week-overwrite").addEventListener("click", () => {
    soundEffects.play("success");
    dialog.close();
    dialog.remove();
    onChoice("week-overwrite");
  });

  dialog.querySelector("#btn-apply-week-append").addEventListener("click", () => {
    soundEffects.play("click");
    dialog.close();
    dialog.remove();
    onChoice("week-append");
  });

  dialog.querySelector("#btn-apply-cancel").addEventListener("click", () => {
    soundEffects.play("click");
    dialog.close();
    dialog.remove();
    onChoice("cancel");
  });
}

// Custom Premium Dialog to prompt user when dropping directly onto Week headers (Apply to Entire Week)
function promptApplyRoutineToWeek(routineTitle, onChoice) {
  const existing = document.getElementById("apply-routine-prompt-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "apply-routine-prompt-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "400px";
  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3><i data-lucide="calendar-days" style="color:var(--primary);width:18px;height:18px;vertical-align:middle;margin-right:6px;"></i> Apply to Entire Week</h3>
      </div>
      <div style="padding: 1rem 1.5rem 1.5rem 1.5rem;">
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4; margin-bottom: 1.25rem;">
          How would you like to apply <strong>${routineTitle}</strong> to every day this week?
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button type="button" class="btn btn-primary" id="btn-apply-week-overwrite" style="padding: 0.75rem; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); border: none;">
            💥 Overwrite All Days (Clear week tasks)
          </button>
          <button type="button" class="btn btn-secondary" id="btn-apply-week-append" style="padding: 0.75rem; background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); color: #c084fc;">
            ➕ Append to All Days (Keep week tasks)
          </button>
          <button type="button" class="btn" id="btn-apply-cancel" style="padding: 0.5rem; margin-top: 10px; background: transparent; color: var(--text-muted);">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  lucide.createIcons();

  dialog.showModal();

  dialog.querySelector("#btn-apply-week-overwrite").addEventListener("click", () => {
    soundEffects.play("success");
    dialog.close();
    dialog.remove();
    onChoice("overwrite");
  });

  dialog.querySelector("#btn-apply-week-append").addEventListener("click", () => {
    soundEffects.play("click");
    dialog.close();
    dialog.remove();
    onChoice("append");
  });

  dialog.querySelector("#btn-apply-cancel").addEventListener("click", () => {
    soundEffects.play("click");
    dialog.close();
    dialog.remove();
    onChoice("cancel");
  });
}

// Apply steps of a daily routine to all 7 days of the viewed week
function applyRoutineToEntireWeek(steps, startOfWeekDate, mode) {
  if (mode === "cancel") return;
  
  // Generate date strings for all 7 days of the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeekDate);
    d.setDate(startOfWeekDate.getDate() + i);
    weekDates.push(getFormattedDateStr(d));
  }
  
  if (mode === "overwrite") {
    // Remove existing tasks for all dates in this week
    state.tasks = state.tasks.filter(t => !weekDates.includes(t.date));
  }
  
  // Create new tasks for each day of the week
  weekDates.forEach(targetDate => {
    steps.forEach(step => {
      const newTask = {
        id: generateUUID(),
        title: step.title,
        description: `Routine Block: ${step.title}`,
        date: targetDate,
        startTime: step.time || "09:00",
        duration: step.duration || 30,
        category: step.category || "other",
        completed: false,
        xp: step.xp !== undefined ? step.xp : 20,
        stress: step.stress !== undefined ? step.stress : 5,
        value: step.value !== undefined ? step.value : 0
      };
      state.tasks.push(newTask);
    });
  });
  
  // Save to local storage
  localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
  
  // Re-render calendar UI
  triggerViewChange(() => {
    renderCalendar();
    updateAgendaList();
    renderUserStats();
  });
}

// Apply the COLLEGE TIMETABLE to a week (different routine per day Mon-Fri)
function applyCollegeTimetableToWeek(startOfWeekDate, mode) {
  if (mode === "cancel") return;
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeekDate);
    d.setDate(startOfWeekDate.getDate() + i);
    weekDates.push({ date: getFormattedDateStr(d), dayOfWeek: d.getDay() });
  }
  
  if (mode === "overwrite") {
    const dateStrs = weekDates.map(w => w.date);
    state.tasks = state.tasks.filter(t => !dateStrs.includes(t.date));
  }
  
  // Apply per-day timetable (Mon=1..Fri=5, skip Sat/Sun)
  weekDates.forEach(({ date, dayOfWeek }) => {
    const dayKey = timetableDayMap[dayOfWeek];
    if (!dayKey) return; // Skip weekends
    
    const steps = collegeTimetable[dayKey];
    if (!steps) return;
    
    steps.forEach(step => {
      const desc = step.room
        ? `📍 Room: ${step.room} | 👨‍🏫 Faculty: ${step.faculty}`
        : `Routine Block: ${step.title}`;
      const newTask = {
        id: generateUUID(),
        title: step.title,
        description: desc,
        date: date,
        startTime: step.time || "09:00",
        duration: step.duration || 30,
        category: step.category || "other",
        completed: false,
        xp: step.xp !== undefined ? step.xp : 20,
        stress: step.stress !== undefined ? step.stress : 5,
        value: step.value !== undefined ? step.value : 0
      };
      state.tasks.push(newTask);
    });
  });
  
  localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
  
  triggerViewChange(() => {
    renderCalendar();
    updateAgendaList();
    renderUserStats();
  });
  
  showAppAlert("🎓 College timetable applied for the entire week (Mon–Fri)!");
}

/* ----------------------------------------------------
   End-of-College Notification System
   Sends a browser push notification at ~1:50 PM on weekdays
   to remind you to check your schedule.
---------------------------------------------------- */
let collegeNotifTimerId = null;

function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function scheduleCollegeEndNotification() {
  if (collegeNotifTimerId) clearTimeout(collegeNotifTimerId);
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Only schedule for weekdays (Mon-Fri)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // It's a weekend — schedule check for Monday
    const msUntilMonday = ((8 - dayOfWeek) % 7) * 86400000;
    const monday = new Date(now.getTime() + msUntilMonday);
    monday.setHours(0, 0, 0, 0);
    collegeNotifTimerId = setTimeout(scheduleCollegeEndNotification, monday.getTime() - now.getTime());
    return;
  }
  
  // Target time: 1:50 PM IST
  const target = new Date(now);
  target.setHours(13, 50, 0, 0);
  
  let delay = target.getTime() - now.getTime();
  
  if (delay < 0) {
    // Already past 1:50 PM today — schedule for tomorrow
    delay += 86400000;
  }
  
  collegeNotifTimerId = setTimeout(() => {
    fireCollegeEndNotification();
    // Re-schedule for next day
    setTimeout(scheduleCollegeEndNotification, 1000);
  }, delay);
}

function fireCollegeEndNotification() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  
  const dayKey = timetableDayMap[new Date().getDay()];
  if (!dayKey) return; // Not a weekday
  
  const steps = collegeTimetable[dayKey] || [];
  const lectureCount = steps.filter(s => !s.title.includes("Break") && !s.title.includes("SPORTS")).length;
  
  const notif = new Notification("🎓 College Day Ending!", {
    body: `You had ${lectureCount} lectures/labs today (${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}). Check your AetherFlow calendar for pending tasks and tomorrow's schedule.`,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
    tag: "college-end-reminder",
    requireInteraction: true
  });
  
  notif.onclick = () => {
    window.focus();
    notif.close();
  };
}

// Initialize notification system on page load
function initCollegeNotifications() {
  requestNotificationPermission();
  
  // Check if user has opted in
  const notifEnabled = localStorage.getItem("aetherflow_college_notif") !== "off";
  if (notifEnabled) {
    scheduleCollegeEndNotification();
  }
}

// Apply steps of a daily routine to a specific date
function applyRoutineStepsToDate(steps, targetDate, mode) {
  if (mode === "cancel") return;
  
  if (mode === "overwrite") {
    // Remove existing tasks for this date
    state.tasks = state.tasks.filter(t => t.date !== targetDate);
  }

  // Create new tasks from steps
  steps.forEach(step => {
    const desc = step.room
      ? `📍 Room: ${step.room} | 👨‍🏫 Faculty: ${step.faculty}`
      : `Routine Block: ${step.title}`;
    const newTask = {
      id: generateUUID(),
      title: step.title,
      description: desc,
      date: targetDate,
      startTime: step.time || "09:00",
      duration: step.duration || 30,
      category: step.category || "other",
      completed: false,
      xp: step.xp !== undefined ? step.xp : 20,
      stress: step.stress !== undefined ? step.stress : 5,
      value: step.value !== undefined ? step.value : 0
    };
    state.tasks.push(newTask);
  });

  // Save to local storage
  localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));

  // Re-render calendar UI
  triggerViewChange(() => {
    renderCalendar();
    updateAgendaList();
    renderUserStats();
  });
}

// Click/Tap to Decide Calendar Routine Assigner for Touch Devices
function openApplyRoutineCalendarDialog(routine) {
  // If in simulation mode, route to standard weekly sim dialog
  const sim = state.activeSimulation;
  if (state.currentView === "simulation" && sim && sim.scenarioId === "weekly-simulator") {
    openAssignRoutineDialog(routine);
    return;
  }

  // Otherwise, get the date list for current viewed week
  const current = new Date(state.currentDate);
  const dayOfWeek = current.getDay(); // 0 Sunday, 1 Monday...
  const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMon);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(getFormattedDateStr(d));
  }

  const existing = document.getElementById("apply-routine-calendar-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("dialog");
  dialog.id = "apply-routine-calendar-dialog";
  dialog.className = "task-modal";
  dialog.style.maxWidth = "480px";

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  let buttonsHtml = "";
  weekdays.forEach((dayName, idx) => {
    const dateStr = weekDates[idx];
    const displayDate = new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const isSpan = idx === 6 ? "grid-column: span 2;" : "";
    buttonsHtml += `
      <button class="btn btn-secondary btn-apply-cal-day" data-date="${dateStr}" style="padding: 0.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 500; height: auto; gap: 4px; ${isSpan}">
        <span>${dayName}</span>
        <span style="font-size: 0.75rem; opacity: 0.6; font-weight: normal;">${displayDate}</span>
      </button>
    `;
  });

  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3><i data-lucide="calendar-range" style="color:var(--primary);width:18px;height:18px;vertical-align:middle;margin-right:6px;"></i> Apply Routine to Calendar</h3>
        <button class="btn btn-icon btn-close" id="btn-close-apply-cal-dialog" aria-label="Close Dialog">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 1rem 1.5rem 1.5rem 1.5rem;">
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">
          Select a day in the current week to apply <strong>${routine.title}</strong>:
        </p>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic;">
          Week of ${new Date(weekDates[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        
        <button type="button" class="btn" id="btn-apply-entire-week" style="width: 100%; padding: 0.85rem; margin-bottom: 1rem; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); border: none; border-radius: 10px; color: white; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(168,85,247,0.3);">
          <i data-lucide="calendar-range" style="width:16px;height:16px;"></i> Apply to Entire Week
        </button>

        <div class="weekday-buttons-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
          ${buttonsHtml}
        </div>

        <div style="margin-bottom: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-card); border-radius: 8px; padding: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.85rem; font-weight: 500;">Clear existing tasks for that day?</span>
          <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 22px;">
            <input type="checkbox" id="chk-apply-overwrite" checked style="opacity: 0; width: 0; height: 0;">
            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: .4s; border-radius: 22px; border: 1px solid var(--border-card);"></span>
          </label>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-card); padding-top: 1rem;">
          <div style="display: flex; gap: 8px; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
            <i data-lucide="info" style="width: 14px; height: 14px;"></i>
            <span>Or apply to a custom date:</span>
          </div>
          <input type="date" id="input-apply-custom-date" style="padding: 0.4rem 0.6rem; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-card); color: white; font-size: 0.8rem;">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" id="btn-cancel-apply-cal" style="padding: 0.5rem 1.25rem;">Cancel</button>
          <button type="button" class="btn btn-primary" id="btn-submit-apply-custom-date" style="padding: 0.5rem 1.25rem; display: none;">Apply</button>
        </div>
      </div>
    </div>
  `;

  // Inject switch toggle styles dynamically if not present
  if (!document.getElementById("apply-switch-styles")) {
    const style = document.createElement("style");
    style.id = "apply-switch-styles";
    style.innerHTML = `
      .switch input:checked + .slider { background-color: var(--primary) !important; }
      .switch input:checked + .slider:before { transform: translateX(20px); }
      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(dialog);
  lucide.createIcons();
  dialog.showModal();

  const overwriteCheckbox = dialog.querySelector("#chk-apply-overwrite");
  const customDateInput = dialog.querySelector("#input-apply-custom-date");
  const submitCustomBtn = dialog.querySelector("#btn-submit-apply-custom-date");

  customDateInput.addEventListener("change", () => {
    if (customDateInput.value) {
      submitCustomBtn.style.display = "block";
    } else {
      submitCustomBtn.style.display = "none";
    }
  });

  const closeDialog = () => {
    dialog.close();
    dialog.remove();
  };

  dialog.querySelector("#btn-close-apply-cal-dialog").addEventListener("click", closeDialog);
  dialog.querySelector("#btn-cancel-apply-cal").addEventListener("click", closeDialog);

  // Apply to Entire Week button
  dialog.querySelector("#btn-apply-entire-week").addEventListener("click", () => {
    soundEffects.play("click");
    closeDialog();
    const overwrite = overwriteCheckbox.checked;
    const monday = new Date(weekDates[0]);
    applyRoutineToEntireWeek(routine.steps, monday, overwrite ? "overwrite" : "append");
  });

  dialog.querySelectorAll(".btn-apply-cal-day").forEach(btn => {
    btn.addEventListener("click", () => {
      const dateStr = btn.getAttribute("data-date");
      const overwrite = overwriteCheckbox.checked;
      applyRoutineStepsToDate(routine.steps, dateStr, overwrite ? "overwrite" : "append");
      closeDialog();
    });
  });

  submitCustomBtn.addEventListener("click", () => {
    const dateStr = customDateInput.value;
    if (!dateStr) return;
    const overwrite = overwriteCheckbox.checked;
    applyRoutineStepsToDate(routine.steps, dateStr, overwrite ? "overwrite" : "append");
    closeDialog();
  });
}

/* ----------------------------------------------------
   View Implementation: JOURNAL (5-Minute Grid Timeboxing)
   ---------------------------------------------------- */
function slotToTime24(slotIndex) {
  const h = Math.floor(slotIndex / 12);
  const m = (slotIndex % 12) * 5;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function slotToTime12h(slotIndex) {
  const h = Math.floor(slotIndex / 12);
  const m = (slotIndex % 12) * 5;
  if (h === 24) return "12:00 AM";
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function openJournalAssignDialog(minSlot, maxSlot) {
  const dialog = document.getElementById("journal-assign-dialog");
  if (!dialog) return;

  const startStr = slotToTime24(minSlot);
  const endStr = slotToTime24(maxSlot + 1);
  const duration = (maxSlot - minSlot + 1) * 5;

  const activeDateStr = getFormattedDateStr(state.currentDate);
  state.tempJournalSelection = {
    date: activeDateStr,
    startTime: startStr,
    duration: duration
  };

  const rangeText = document.getElementById("journal-time-range-text");
  if (rangeText) {
    rangeText.innerText = `${slotToTime12h(minSlot)} — ${slotToTime12h(maxSlot + 1)} (${duration} min)`;
  }

  const titleInput = document.getElementById("journal-task-title");
  if (titleInput) {
    titleInput.value = "";
  }

  // Check default radio button
  const defaultRadio = dialog.querySelector('input[name="journal-category"][value="work"]');
  if (defaultRadio) defaultRadio.checked = true;

  dialog.showModal();
  soundEffects.play("click");
}

function renderJournalView(parent) {
  const root = document.createElement("div");
  root.className = "journal-view-container";

  const activeDateStr = getFormattedDateStr(state.currentDate);

  // 1. Header
  const header = document.createElement("div");
  header.className = "journal-header";

  const title = document.createElement("h3");
  title.className = "journal-header-title";
  title.innerHTML = `<i data-lucide="clock" style="color:var(--primary);width:22px;height:22px;vertical-align:middle;"></i> Timebox Journal`;

  const actions = document.createElement("div");
  actions.className = "journal-header-actions";

  // Clear Day button
  const clearBtn = document.createElement("button");
  clearBtn.className = "btn btn-danger";
  clearBtn.innerHTML = `<i data-lucide="trash-2" style="width:14px;height:14px;margin-right:6px;vertical-align:middle;"></i> Clear Day`;
  clearBtn.addEventListener("click", () => {
    soundEffects.play("click");
    showAppConfirm("Are you sure you want to delete all tasks for this day?", (confirmed) => {
      if (!confirmed) return;
      state.tasks = state.tasks.filter(t => t.date !== activeDateStr);
      localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));
      triggerViewChange(() => {
        renderCalendar();
        updateAgendaList();
      });
    });
  });

  actions.appendChild(clearBtn);
  header.appendChild(title);
  header.appendChild(actions);
  root.appendChild(header);

  // 2. Grid Wrapper
  const gridWrap = document.createElement("div");
  gridWrap.className = "journal-grid-wrapper";

  // Column Headers (Hour + :00, :05, :10, ..., :55)
  const colHeaders = document.createElement("div");
  colHeaders.className = "journal-column-headers";
  colHeaders.innerHTML = `<div class="journal-hour-header-label">Hour</div>`;
  for (let m = 0; m < 60; m += 5) {
    const colLabel = document.createElement("div");
    colLabel.innerText = `:${String(m).padStart(2, '0')}`;
    colHeaders.appendChild(colLabel);
  }
  gridWrap.appendChild(colHeaders);

  // 3. Grid Cells Processing
  const dayTasks = state.tasks.filter(t => t.date === activeDateStr);
  const filteredTasks = dayTasks.filter(t => state.filters[t.category || "other"]);

  // Map tasks to 288 slots
  const cellTasks = new Array(288).fill(null);
  filteredTasks.forEach(task => {
    if (!task.startTime) return;
    const parts = task.startTime.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    const startSlot = (hours * 12) + Math.floor(minutes / 5);
    const durationSlots = Math.ceil((task.duration || 30) / 5);
    
    for (let i = 0; i < durationSlots; i++) {
      const idx = startSlot + i;
      if (idx < 288) {
        cellTasks[idx] = {
          task: task,
          isStart: i === 0,
          isEnd: i === durationSlots - 1,
          isMiddle: i > 0 && i < durationSlots - 1,
          slotOffset: i,
          totalSlots: durationSlots
        };
      }
    }
  });

  // 4. Render 24 rows
  for (let h = 0; h < 24; h++) {
    const row = document.createElement("div");
    row.className = "journal-row";

    // Hour label (e.g. 09:00 AM)
    const hourLabel = document.createElement("div");
    hourLabel.className = "journal-hour-label";
    hourLabel.innerText = formatHourLabel(h);
    row.appendChild(hourLabel);

    // 12 cells for 5-minute slots
    for (let m = 0; m < 12; m++) {
      const cellIdx = (h * 12) + m;
      const cell = document.createElement("div");
      cell.className = "journal-cell";
      cell.setAttribute("data-index", cellIdx);

      const cellData = cellTasks[cellIdx];
      if (cellData) {
        // Cell is occupied by a task
        cell.classList.add("occupied");
        
        // Add category class
        const cat = cellData.task.category || "other";
        let catClass = "type-other";
        if (cat === "work") catClass = "type-work";
        else if (cat === "health") catClass = "type-break";
        else if (cat === "personal") catClass = "type-chore";
        cell.classList.add(catClass);

        // Add continuity classes
        if (cellData.totalSlots === 1) {
          cell.classList.add("occupied-single");
        } else if (cellData.isStart) {
          cell.classList.add("occupied-start");
        } else if (cellData.isEnd) {
          cell.classList.add("occupied-end");
        } else {
          cell.classList.add("occupied-middle");
        }

        // Render title inside first cell
        if (cellData.isStart) {
          const labelSpan = document.createElement("span");
          labelSpan.className = "journal-cell-label";
          labelSpan.innerText = cellData.task.title;
          cell.appendChild(labelSpan);
        }

        cell.title = `${cellData.task.title} (${cellData.task.startTime}, ${cellData.task.duration} min)`;

        // Clicking occupied cell opens standard edit/delete modal
        cell.addEventListener("click", () => {
          soundEffects.play("click");
          openTaskDialog(cellData.task.id);
        });

      } else {
        // Cell is empty - attach drag-select and touch-swipe handlers
        
        // Mouse Down (Start Selection)
        cell.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return; // Only left click
          soundEffects.play("click");
          journalSelection.isSelecting = true;
          journalSelection.startIndex = cellIdx;
          journalSelection.endIndex = cellIdx;
          updateSelectionHighlight();
        });

        // Mouse Enter (Update Selection)
        cell.addEventListener("mouseenter", () => {
          if (journalSelection.isSelecting) {
            journalSelection.endIndex = cellIdx;
            updateSelectionHighlight();
          }
        });
      }

      row.appendChild(cell);
    }
    gridWrap.appendChild(row);
  }

  root.appendChild(gridWrap);
  parent.appendChild(root);

  // Selection visual feedback update
  function updateSelectionHighlight() {
    const cells = root.querySelectorAll(".journal-cell");
    const min = Math.min(journalSelection.startIndex, journalSelection.endIndex);
    const max = Math.max(journalSelection.startIndex, journalSelection.endIndex);

    cells.forEach(c => {
      const idx = parseInt(c.getAttribute("data-index"), 10);
      if (idx >= min && idx <= max && !c.classList.contains("occupied")) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });
  }

  // Global mouseup release listener
  const handleMouseUp = () => {
    if (journalSelection.isSelecting) {
      journalSelection.isSelecting = false;
      const min = Math.min(journalSelection.startIndex, journalSelection.endIndex);
      const max = Math.max(journalSelection.startIndex, journalSelection.endIndex);
      openJournalAssignDialog(min, max);
    }
  };

  // Touch Swipe Handlers for Mobile Devices
  root.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elem ? elem.closest('.journal-cell') : null;
    if (cell && !cell.classList.contains("occupied")) {
      const cellIdx = parseInt(cell.getAttribute("data-index"), 10);
      soundEffects.play("click");
      journalSelection.isSelecting = true;
      journalSelection.startIndex = cellIdx;
      journalSelection.endIndex = cellIdx;
      updateSelectionHighlight();
      e.preventDefault(); // Prevent scrolling while swiping
    }
  }, { passive: false });

  root.addEventListener("touchmove", (e) => {
    if (!journalSelection.isSelecting) return;
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elem ? elem.closest('.journal-cell') : null;
    if (cell && !cell.classList.contains("occupied")) {
      const cellIdx = parseInt(cell.getAttribute("data-index"), 10);
      journalSelection.endIndex = cellIdx;
      updateSelectionHighlight();
    }
    e.preventDefault(); // Prevent scrolling while swiping
  }, { passive: false });

  root.addEventListener("touchend", () => {
    if (journalSelection.isSelecting) {
      journalSelection.isSelecting = false;
      const min = Math.min(journalSelection.startIndex, journalSelection.endIndex);
      const max = Math.max(journalSelection.startIndex, journalSelection.endIndex);
      openJournalAssignDialog(min, max);
    }
  });

  // Attach and cleanup global pointerup listener
  window.addEventListener("mouseup", handleMouseUp);
  
  // Clean up when leaving view
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.removedNodes.forEach(n => {
        if (n === root) {
          window.removeEventListener("mouseup", handleMouseUp);
          observer.disconnect();
        }
      });
    });
  });
  if (parent) {
    observer.observe(parent, { childList: true });
  }

  lucide.createIcons();
}

function setupJournalDialogListeners() {
  const dialog = document.getElementById("journal-assign-dialog");
  if (!dialog) return;

  const form = document.getElementById("journal-assign-form");
  const cancelBtn = document.getElementById("btn-journal-cancel");
  const closeBtn = document.getElementById("btn-close-journal-dialog");

  const clearSelectionStyles = () => {
    document.querySelectorAll(".journal-cell.selected").forEach(c => {
      c.classList.remove("selected");
    });
  };

  closeBtn.addEventListener("click", () => {
    clearSelectionStyles();
    dialog.close();
  });

  cancelBtn.addEventListener("click", () => {
    clearSelectionStyles();
    dialog.close();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    soundEffects.play("coin");

    const titleInput = document.getElementById("journal-task-title");
    const categoryInput = form.querySelector('input[name="journal-category"]:checked');

    if (!titleInput || !categoryInput || !state.tempJournalSelection) {
      dialog.close();
      clearSelectionStyles();
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: titleInput.value.trim(),
      date: state.tempJournalSelection.date,
      startTime: state.tempJournalSelection.startTime,
      duration: state.tempJournalSelection.duration,
      category: categoryInput.value,
      completed: true
    };

    state.tasks.push(newTask);
    localStorage.setItem("aetherflow_tasks", JSON.stringify(state.tasks));

    // Close and reset
    dialog.close();
    clearSelectionStyles();

    // Re-render and auto-sync
    triggerViewChange(() => {
      renderCalendar();
      updateAgendaList();
    });
  });
}

function setupLoadTimetableListener() {
  const btn = document.getElementById("btn-load-timetable");
  if (!btn) return;
  
  btn.addEventListener("click", () => {
    soundEffects.play("click");
    
    if (state.currentView === "week") {
      const monday = getStartOfWeek(state.currentDate);
      showAppConfirm("🎓 Load college timetable for this week (Mon-Fri)?", (confirmed) => {
        if (!confirmed) return;
        showAppConfirm("Overwrite existing tasks for this week, or append alongside them?\n\nChoose Confirm to OVERWRITE, or Cancel to APPEND.", (overwrite) => {
          applyCollegeTimetableToWeek(monday, overwrite ? "overwrite" : "append");
        });
      });
    } else if (state.currentView === "day") {
      const activeDateStr = getFormattedDateStr(state.currentDate);
      const d = new Date(state.currentDate);
      const dayOfWeek = d.getDay();
      const dayKey = timetableDayMap[dayOfWeek];
      
      if (!dayKey) {
        showAppAlert("No lectures scheduled for weekends!");
        return;
      }
      
      showAppConfirm(`🎓 Load college lectures for ${dayKey.toUpperCase()}?`, (confirmed) => {
        if (!confirmed) return;
        showAppConfirm("Overwrite existing tasks for today, or append alongside them?\n\nChoose Confirm to OVERWRITE, or Cancel to APPEND.", (overwrite) => {
          const steps = collegeTimetable[dayKey];
          applyRoutineStepsToDate(steps, activeDateStr, overwrite ? "overwrite" : "append");
          showAppAlert(`🎓 Lectures loaded for ${dayKey.toUpperCase()}!`);
        });
      });
    }
  });
}




