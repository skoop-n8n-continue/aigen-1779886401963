const classes = [
  {
    time: "6:00 AM",
    title: "HIIT Ignite",
    coach: "Maya",
    desc: "High-intensity intervals built to burn calories, boost stamina, and start the day strong.",
    intensity: "High",
    studio: "Zone 1",
    cta: "Reserve Spot",
    tag: "Morning Burn",
    role: "HIIT Specialist",
    tags: "Energy · Speed · Conditioning",
    seed: "Maya",
  },
  {
    time: "7:30 AM",
    title: "Strength Circuit",
    coach: "Andre",
    desc: "Full-body strength training using dumbbells, sleds, kettlebells, and functional stations.",
    intensity: "Medium-High",
    studio: "Strength Floor",
    cta: "Join Class",
    tag: "Build Power",
    role: "Strength Coach",
    tags: "Power · Form · Hypertrophy",
    seed: "Andre",
  },
  {
    time: "9:00 AM",
    title: "Power Yoga",
    coach: "Elena",
    desc: "A focused flow for mobility, balance, breath control, and active recovery.",
    intensity: "Medium",
    studio: "Mind Body Room",
    cta: "Book Mat",
    tag: "Recovery Flow",
    role: "Yoga Instructor",
    tags: "Mobility · Breath · Balance",
    seed: "Elena",
  },
  {
    time: "12:15 PM",
    title: "Lunch Break Ride",
    coach: "Chris",
    desc: "Fast indoor cycling with climbs, sprints, rhythm intervals, and motivating music.",
    intensity: "High",
    studio: "Cycle Room",
    cta: "Save Bike",
    tag: "Quick Sweat",
    role: "Cycle Pro",
    tags: "Endurance · Rhythm · Speed",
    seed: "Chris",
  },
  {
    time: "5:30 PM",
    title: "Total Body Burn",
    coach: "Jordan",
    desc: "A high-energy after-work class combining cardio bursts, resistance moves, and core work.",
    intensity: "High",
    studio: "Zone 2",
    cta: "Claim Spot",
    tag: "After-Work Favorite",
    role: "Performance Coach",
    tags: "Cardio · Core · Resistance",
    seed: "Jordan",
  },
  {
    time: "7:00 PM",
    title: "Boxing Conditioning",
    coach: "Tasha",
    desc: "Bag work, footwork, conditioning rounds, and athletic drills for total-body performance.",
    intensity: "High",
    studio: "Boxing Zone",
    cta: "Try Boxing",
    tag: "Fight Night Energy",
    role: "Combat Trainer",
    tags: "Agility · Power · Focus",
    seed: "Tasha",
  },
];

let activeIndex = 0;
let totalSeconds = 14 * 60 + 32; // 14 mins 32 secs to start

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  // Background arc line
  const bgArc = document.createElement("div");
  bgArc.className = "timeline-arc-bg";
  timeline.appendChild(bgArc);

  // Math for semi-circle
  const radius = 550;
  const cx = 460;
  const cy = 460;

  // Arc from roughly 135 deg to -45 deg
  const startAngle = 145;
  const endAngle = -35;
  const angleRange = startAngle - endAngle;

  classes.forEach((cls, i) => {
    // Calculate position along arc
    const ratio = i / (classes.length - 1);
    const angleDeg = startAngle - angleRange * ratio;
    const angleRad = angleDeg * (Math.PI / 180);

    // Position
    const x = cx + radius * Math.cos(angleRad) - 50;
    const y = cy - radius * Math.sin(angleRad) - 50;

    const node = document.createElement("div");
    node.className = `timeline-node ${i < activeIndex ? "past" : ""} ${i === activeIndex ? "active" : ""}`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    // Always horizontal text
    const rot = 0;

    node.innerHTML = `
      <div class="node-dot"></div>
      <div class="node-content" style="transform: scale(${i === activeIndex ? 1.1 : 0.9}) rotate(${rot > 90 && rot < 270 ? rot - 180 : rot}deg);">
        <div class="node-time">${cls.time}</div>
        <div class="node-title">${cls.title}</div>
        <div class="node-details">
          ${cls.coach} · ${cls.intensity} · ${cls.studio}
        </div>
        <div class="node-cta">${cls.cta}</div>
      </div>
    `;

    timeline.appendChild(node);
  });
}

function updateActiveState() {
  const cls = classes[activeIndex];

  document.getElementById("active-class-name").textContent =
    cls.title.toUpperCase();
  document.getElementById("active-class-details").textContent =
    `${cls.time} · Coach ${cls.coach} · ${cls.studio}`;

  document.getElementById("coach-name").textContent = cls.coach.toUpperCase();
  document.getElementById("coach-role").textContent = cls.role;
  document.getElementById("coach-avatar").src =
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${cls.seed}&style=circle`;

  renderTimeline();
}

function updateCountdown() {
  if (totalSeconds <= 0) {
    // Move to next class
    activeIndex = (activeIndex + 1) % classes.length;
    totalSeconds = 45 * 60; // reset to 45 mins for demo
    updateActiveState();
    return;
  }

  totalSeconds--;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  document.getElementById("main-timer").textContent =
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  // Update ring
  const circle = document.querySelector(".ring-fill");
  const circumference = 2 * Math.PI * 220; // r=220

  // Fake total duration for ring calc (45 mins)
  const maxSecs = 45 * 60;
  const offset = circumference - (totalSeconds / maxSecs) * circumference;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
}

// Tick marks for ring
function setupRingTicks() {
  const svg = document.querySelector(".progress-ring");
  const cx = 230,
    cy = 230,
    r = 210; // inner radius for ticks

  for (let i = 0; i < 60; i++) {
    const angle = i * 6 * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const length = isMajor ? 10 : 5;

    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + (r - length) * Math.cos(angle);
    const y2 = cy + (r - length) * Math.sin(angle);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", isMajor ? "#00E5FF" : "rgba(255,255,255,0.2)");
    line.setAttribute("stroke-width", isMajor ? "2" : "1");
    svg.appendChild(line);
  }
}

// Particle effect
function createParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.style.position = "absolute";
    p.style.width = Math.random() * 3 + "px";
    p.style.height = p.style.width;
    p.style.background = Math.random() > 0.5 ? "#B6FF00" : "#FFFFFF";
    p.style.opacity = Math.random() * 0.5;
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.borderRadius = "50%";
    p.style.animation = `float ${5 + Math.random() * 5}s ease-in-out infinite`;
    p.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(p);
  }
}

// Init
setupRingTicks();
createParticles();
updateActiveState();
setInterval(updateCountdown, 1000);
