/* ============================================================
   BIRTHDAY INVITATION — script.js
   ============================================================

   ╔══════════════════════════════════════════════════════╗
   ║   ✏️  PERSONALIZACIÓN — EDITA SOLO ESTA SECCIÓN      ║
   ╚══════════════════════════════════════════════════════╝

   Cambia los datos de abajo sin tocar el resto del código.
*/

const invitationData = {
  // 🍽️  Nombre del restaurante
  restaurant: "El Universo Del Principito",

  // 📅  Fecha del evento (texto libre)
  date: "19 de Septiembre",

  // ⏰  Hora larga — aparece en la tarjeta de invitación
  time: "12:00 p.m.",

  // ⏰  Hora corta — aparece en el mensaje final
  shortTime: "12pm",

  // 📍  Dirección completa
  address: "Bogotá, Colombia",

  // 🔐  Nombre exacto que puede ingresar a la invitación
  //     (escríbelo tal cual, sin importar mayúsculas/tildes)
  allowedName: "Maria Fernanda",
};

/*
   ┌──────────────────────────────────────────────────────┐
   │  IMÁGENES — colócalas en la carpeta /images/         │
   │                                                      │
   │  images/meme-edad.png      → Paso 3 (meme de edad)  │
   │  images/restaurante.jpg    → Paso 4 (foto local)     │
   │  images/meme-felicidad.gif → Paso 5 (meme final)     │
   │                                                      │
   │  Si no existen, se muestran fallbacks automáticos.   │
   └──────────────────────────────────────────────────────┘
*/

/* ============================================================
   ESTADO INTERNO — no modificar
   ============================================================ */
let guestName = "";
let currentStep = 1;
let isTransitioning = false;
let memeTimersSet = false;
let maybePressCount = 0;

/* Mensajes graciosos para el botón "Tengo que pensarlo" */
const maybePhrases = [
  "¡Pero va a estar buenísimo! 🥺",
  "¿En serio? Piénsalo mejor... 🙃",
  "Ok, tú y yo sabemos que vas a venir 😂",
];

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  populateInvitationData();
  createStars();

  /* Permitir Enter en el campo de nombre */
  const input = document.getElementById("nameInput");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleStart();
    });
  }
});

/* ============================================================
   RELLENO DE DATOS EN EL DOM
   ============================================================ */
function populateInvitationData() {
  setText("invRestaurant", invitationData.restaurant);
  setText("invDate", invitationData.date);
  setText("invTime", invitationData.time);
  setText("invAddress", invitationData.address);
  setText("finalDate", invitationData.date);
  setText("finalTime", invitationData.shortTime);
}

function populateGuestName() {
  setText("cardGuestName", guestName);
  setText("cardGuestNameFoot", guestName);
  setText("finalGuestName", guestName);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ============================================================
   PASO 1 — NOMBRE
   ============================================================ */
function handleStart() {
  const input = document.getElementById("nameInput");
  const name = input ? input.value.trim() : "";
  const error = document.getElementById("nameError");

  /* 1. Campo vacío */
  if (!name) {
    showNameError("Primero dime tu nombre 😜", input, error);
    return;
  }

  /* 2. Verificar que el nombre coincida con el permitido
        (ignoramos mayúsculas, minúsculas y tildes) */
  const normalize = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const nameOk = normalize(name) === normalize(invitationData.allowedName);

  if (!nameOk) {
    showNameError("Esta invitación no es para ti... 🙈", input, error);
    return;
  }

  /* 3. Nombre correcto — continuar */
  if (error) error.classList.remove("visible");
  guestName =
    invitationData.allowedName; /* usamos el nombre exacto de la config */
  document.getElementById("nameError")?.classList.remove("visible");
  populateGuestName();

  showStep(2);
}

/* Muestra el error del campo de nombre con shake */
function showNameError(msg, input, errorEl) {
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add("visible");
  }
  if (input) {
    input.classList.add("shake");
    input.focus();
    setTimeout(() => input.classList.remove("shake"), 500);
  }
}

/* ============================================================
   NAVEGACIÓN ENTRE PASOS
   ============================================================ */
function showStep(n) {
  if (isTransitioning) return;
  isTransitioning = true;

  const currentEl = document.querySelector(".step.active");
  const nextEl = document.getElementById("step" + n);

  if (!nextEl || nextEl === currentEl) {
    isTransitioning = false;
    return;
  }

  /* Animar salida del paso actual */
  if (currentEl) {
    currentEl.classList.remove("active");
    currentEl.classList.add("exiting");
    setTimeout(() => currentEl.classList.remove("exiting"), 500);
  }

  /* Animar entrada del nuevo paso */
  const delay = currentEl ? 220 : 0;
  setTimeout(() => {
    nextEl.classList.add("active");
    nextEl.scrollTop = 0;
    onStepEnter(n);
    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }, delay);

  currentStep = n;
}

/* Acciones al entrar a cada paso */
function onStepEnter(n) {
  if (n === 3) setupMemeStep();
  if (n === 5) startCelebration();
}

/* ============================================================
   PASO 2 — ABRIR TARJETA (animación del sobre)
   ============================================================ */
function openCard() {
  const envelope = document.getElementById("envelope");
  const envScene = document.getElementById("envelopeScene");
  const envFlap = document.getElementById("envFlap");
  const card = document.getElementById("birthdayCard");
  const openBtn = document.getElementById("openCardBtn");

  if (!envelope) return;

  /* Desactivar botón de inmediato */
  if (openBtn) {
    openBtn.disabled = true;
    openBtn.style.opacity = "0.5";
  }

  /* 1. El sobre tiembla de emoción */
  envelope.classList.add("shaking");

  setTimeout(() => {
    envelope.classList.remove("shaking");

    /* 2. La solapa se abre hacia atrás */
    if (envFlap) envFlap.classList.add("flap-open");

    setTimeout(() => {
      /* 3. El sobre explota y desaparece */
      envelope.classList.add("popping");
      if (openBtn) {
        openBtn.style.transition = "opacity 0.3s ease";
        openBtn.style.opacity = "0";
      }

      setTimeout(() => {
        /* 4. Ocultar escena del sobre y revelar la tarjeta */
        if (envScene) envScene.style.display = "none";
        if (card) {
          card.style.display = "block";
          /* El CSS animation se activa al cambiar display */
        }
      }, 380);
    }, 680);
  }, 580);
}

/* ============================================================
   PASO 3 — MEME (timers de aparición)
   ============================================================ */
function setupMemeStep() {
  if (memeTimersSet) return;
  memeTimersSet = true;

  /* Segunda leyenda aparece a los 2.5s */
  setTimeout(() => {
    const cap2 = document.getElementById("memeCap2");
    if (cap2) {
      cap2.style.opacity = "1";
      cap2.style.animation = "fade-up 0.55s ease";
    }
  }, 2500);

  /* Botón "Ver la sorpresa" aparece a los 4s */
  setTimeout(() => {
    const btn = document.getElementById("memeBtn");
    if (btn) {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      btn.style.animation = "fade-up 0.5s ease";
    }
  }, 4000);
}

/* ============================================================
   PASO 4 — CONFIRMACIÓN
   ============================================================ */
function confirmYes() {
  showStep(5);
}

function confirmMaybe() {
  const responseEl = document.getElementById("maybeResponse");
  const acceptBtn = document.getElementById("acceptBtn");
  const maybeBtn = document.getElementById("maybeBtn");

  /* Mostrar frase graciosa */
  const phrase = maybePhrases[maybePressCount % maybePhrases.length];
  if (responseEl) {
    responseEl.textContent = phrase;
    responseEl.style.display = "block";
    /* Reiniciar animación */
    responseEl.style.animation = "none";
    void responseEl.offsetWidth;
    responseEl.style.animation = "fade-up 0.4s ease";
  }

  maybePressCount++;

  /* Al 3er intento: hacer el botón Sí más tentador y resetear */
  if (maybePressCount >= 3) {
    if (responseEl)
      responseEl.textContent = "Ok, te espero ahí 😂 ¡Sé que vas a venir!";
    if (acceptBtn) {
      acceptBtn.style.transition =
        "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";
      acceptBtn.style.transform = "scale(1.08)";
      setTimeout(() => {
        acceptBtn.style.transform = "";
      }, 500);
    }
    if (maybeBtn) {
      maybeBtn.style.opacity = "0.35";
      maybeBtn.style.fontSize = "0.82rem";
    }
    maybePressCount = 0;
  }
}

/* ============================================================
   PASO 5 — CELEBRACIÓN
   ============================================================ */
function startCelebration() {
  /* Pequeño delay para que el paso ya sea visible */
  setTimeout(() => {
    launchConfetti();
    launchBalloons();
    launchHearts();
  }, 150);
}

/* ============================================================
   CONFETI
   ============================================================ */
function launchConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;
  container.innerHTML = "";

  const colors = [
    "#ff2d87",
    "#ffd93d",
    "#c5a3ff",
    "#4affea",
    "#ff9f1c",
    "#ffffff",
    "#ff6eb5",
    "#7dff6b",
    "#2ec4b6",
    "#ff5757",
  ];

  const count = window.innerWidth < 480 ? 80 : 130;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";

    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 3.2;
    const dur = 2.5 + Math.random() * 2.5;
    const drift = (Math.random() - 0.5) * 220;
    const size = 7 + Math.random() * 9;
    const height = size * (0.35 + Math.random() * 0.65);
    const shapeR = Math.random();
    const radius = shapeR < 0.33 ? "50%" : shapeR < 0.66 ? "3px" : "1px";

    piece.style.cssText = `
      background: ${color};
      left: ${left}%;
      width: ${size}px;
      height: ${height}px;
      border-radius: ${radius};
      --dur: ${dur}s;
      --delay: ${delay}s;
      --drift: ${drift}px;
    `;
    container.appendChild(piece);
  }

  /* Limpiar después de que terminen las animaciones */
  setTimeout(() => {
    container.innerHTML = "";
  }, 8000);
}

/* ============================================================
   GLOBOS
   ============================================================ */
function launchBalloons() {
  const container = document.getElementById("balloons-container");
  if (!container) return;
  container.innerHTML = "";

  const colors = [
    "#ff2d87",
    "#ffd93d",
    "#c5a3ff",
    "#4affea",
    "#ff9f1c",
    "#ff5757",
    "#7dff6b",
    "#ff6eb5",
  ];

  const count = window.innerWidth < 480 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";

    const color = colors[i % colors.length];
    const left = 4 + Math.random() * 92;
    const delay = Math.random() * 4;
    const dur = 4.5 + Math.random() * 3;
    const sway = (Math.random() - 0.5) * 110;
    const size = 32 + Math.random() * 22;

    balloon.style.cssText = `
      background: ${color};
      left: ${left}%;
      width: ${size}px;
      height: ${size * 1.3}px;
      box-shadow: inset -5px -5px 0 rgba(0,0,0,0.14);
      --dur: ${dur}s;
      --delay: ${delay}s;
      --sway: ${sway}px;
    `;
    container.appendChild(balloon);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 10000);
}

/* ============================================================
   CORAZONES FLOTANTES
   ============================================================ */
function launchHearts() {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  const hearts = ["💖", "💗", "💕", "❤️", "💝", "💓"];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const left = 8 + Math.random() * 84;
    const delay = 0.3 + Math.random() * 2.5;
    const dur = 3.5 + Math.random() * 2;
    const size = 1.1 + Math.random() * 0.9;

    heart.style.cssText = `
      left: ${left}%;
      bottom: 0;
      font-size: ${size}rem;
      --dur: ${dur}s;
      --delay: ${delay}s;
    `;
    container.appendChild(heart);
  }
}

/* ============================================================
   ESTRELLAS DE FONDO (Paso 1)
   ============================================================ */
function createStars() {
  const layer = document.getElementById("starsLayer");
  if (!layer) return;

  const count = 65;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 1 + Math.random() * 2.5;
    const dur = 2.2 + Math.random() * 4;
    const delay = Math.random() * 6;
    const bright = 0.4 + Math.random() * 0.6;

    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --bright: ${bright};
    `;
    layer.appendChild(star);
  }
}

/* ============================================================

   📋 INSTRUCCIONES RÁPIDAS DE PERSONALIZACIÓN
   ─────────────────────────────────────────────
   
   1. NOMBRE DEL RESTAURANTE
      → invitationData.restaurant  (línea ~14)

   2. FECHA DEL EVENTO
      → invitationData.date        (línea ~17)

   3. HORA DEL EVENTO
      → invitationData.time        (larga, en la tarjeta)
      → invitationData.shortTime   (corta, en el mensaje final)

   4. DIRECCIÓN
      → invitationData.address     (línea ~26)

   5. MEME DE LA EDAD
      → Pon tu imagen en:  images/meme-edad.png
      (PNG, JPG o GIF — si no existe, se muestra un meme CSS)

   6. FOTO DEL RESTAURANTE
      → Pon tu foto en:    images/restaurante.jpg
      (JPG o PNG — si no existe, se muestra un ícono)

   7. MEME DE FELICIDAD FINAL
      → Pon tu GIF en:     images/meme-felicidad.gif
      (GIF animado recomendado — si no existe, aparecen emojis)

   8. MENSAJES DE LA TARJETA
      → Edita el HTML en index.html, dentro de #birthdayCard
        en la sección .card-message

   9. MENSAJES "TENGO QUE PENSARLO"
      → Array maybePhrases[]  (línea ~37 de este archivo)

   10. CANTIDAD DE CONFETI / GLOBOS
       → Variable count en launchConfetti() y launchBalloons()

   ─────────────────────────────────────────────
   El proyecto funciona abriendo index.html
   directamente en el navegador. Sin servidor.
   ============================================================ */
