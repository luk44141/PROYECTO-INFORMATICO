// ── PALABRAS (50 palabras escolares) ──────────────────────────────────────────
const palabras = [
  // Materias
  "MATEMATICA","HISTORIA","BIOLOGIA","QUIMICA","FISICA",
  "LENGUA","INGLES","FILOSOFIA","GEOGRAFIA","MUSICA",
  // Elementos del aula
  "AULA","LIBRO","GOMA","CUADERNO","MESA",
  "SILLA","LAPIZ","REGLA","MOCHILA","PIZARRA",
  "TIZA","BANCO","BORRADOR","CARPETA","TIJERA",
  "COMPAS","PEGAMENTO","TUTOR","RECTOR","PORTERO",
  // Especialidades tecnicas y roles
  "TALLER","TORNERO","SOLDADOR","ELECTRONICA","CARPINTERIA",
  "DIBUJO","PROYECTO","PRACTICA","TECNICO","OFICIO",
  "PLANILLA","CALCULO","DISEÑO","MOTOR","CIRCUITO",
  // Vida escolar
  "EXAMEN","NOTA","TRIMESTRE","RECREO","PASILLO",
  "TURNO","PROFESOR","ALUMNO","BECA","TITULO",
  // Relleno para llegar a 50
  "CLASE","ZAPATO","TECLADO","MONITOR","ESCUELA"
];

// ── ELEMENTOS DOM ─────────────────────────────────────────────────────────────
const pantallaInicio  = document.getElementById("inicio");
const pantallaMenu    = document.getElementById("menu");
const pantallaJuego   = document.getElementById("juego");
const pantallaMulti   = document.getElementById("multi");

const tablero         = document.getElementById("tablero");
const tablero1        = document.getElementById("tablero1");
const tablero2        = document.getElementById("tablero2");

const mensajeEl       = document.getElementById("mensaje");
const mensajeMultiEl  = document.getElementById("mensajeMulti");
const turnoTextoEl    = document.getElementById("turnoTexto");
const botonesJuego    = document.getElementById("botonesJuego");
const botonesMulti    = document.getElementById("botonesMulti");

const p1El            = document.getElementById("p1");
const p2El            = document.getElementById("p2");
const scoreJ1El       = document.getElementById("scoreJ1");
const scoreJ2El       = document.getElementById("scoreJ2");
const panelJ1El       = document.getElementById("panelJ1");
const panelJ2El       = document.getElementById("panelJ2");

// ── ESTADO INDIVIDUAL ─────────────────────────────────────────────────────────
let palabra    = "";
let filaActual = 0;
let colActual  = 0;
let intento    = [];
let juegoTerminado = false;

// ── ESTADO MULTI ──────────────────────────────────────────────────────────────
// Cada jugador tiene su propio estado separado
let estado1 = {};
let estado2 = {};
let turno   = 1;
let p1Score = 0;
let p2Score = 0;
let multiTerminado = false;

// ── NAVEGACIÓN ────────────────────────────────────────────────────────────────
function ocultarTodo() {
  pantallaInicio.classList.add("oculto");
  pantallaMenu.classList.add("oculto");
  pantallaJuego.classList.add("oculto");
  pantallaMulti.classList.add("oculto");
}

function irMenu() {
  ocultarTodo();
  pantallaMenu.classList.remove("oculto");
}

// ── UTILIDADES ────────────────────────────────────────────────────────────────
function palabraAleatoria() {
  return palabras[Math.floor(Math.random() * palabras.length)];
}

function estadoInicial() {
  return { fila: 0, col: 0, intento: [], terminado: false };
}

// ── TABLERO ───────────────────────────────────────────────────────────────────
function crearTablero(tab, longitud) {
  tab.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const filaDiv = document.createElement("div");
    filaDiv.className = "fila";
    for (let j = 0; j < longitud; j++) {
      const celda = document.createElement("div");
      celda.className = "celda";
      filaDiv.appendChild(celda);
    }
    tab.appendChild(filaDiv);
  }
}

function actualizarCelda(tab, est) {
  const celdas = tab.children[est.fila].children;
  for (let i = 0; i < palabra.length; i++) {
    celdas[i].innerText = est.intento[i] || "";
    // resaltar celda activa
    if (est.intento[i]) {
      celdas[i].classList.remove("activa");
    } else if (i === est.col) {
      celdas[i].classList.add("activa");
    }
  }
}

function revelarFila(tab, est, palabraObj, cb) {
  const celdas = tab.children[est.fila].children;
  const letras = est.intento;

  // Contar frecuencia de letras en la palabra (para amarillos correctos)
  const freq = {};
  for (const c of palabraObj) freq[c] = (freq[c] || 0) + 1;

  const resultado = Array(letras.length).fill("incorrecta");

  // Primero marcar correctas
  for (let i = 0; i < letras.length; i++) {
    if (letras[i] === palabraObj[i]) {
      resultado[i] = "correcta";
      freq[letras[i]]--;
    }
  }
  // Luego presentes
  for (let i = 0; i < letras.length; i++) {
    if (resultado[i] !== "correcta" && freq[letras[i]] > 0) {
      resultado[i] = "presente";
      freq[letras[i]]--;
    }
  }

  // Aplicar con pequeño delay para animación tipo "flip por celda"
  for (let i = 0; i < letras.length; i++) {
    ((idx, cls) => {
      setTimeout(() => {
        celdas[idx].classList.add(cls);
        if (idx === letras.length - 1 && cb) setTimeout(cb, 150);
      }, idx * 120);
    })(i, resultado[i]);
  }
}

function shakeRow(tab, filaIdx) {
  const celdas = tab.children[filaIdx].children;
  for (const celda of celdas) {
    celda.classList.remove("shake-row");
    void celda.offsetWidth; // reflow
    celda.classList.add("shake-row");
  }
}

// ── MODO INDIVIDUAL ───────────────────────────────────────────────────────────
function modoIndividual() {
  ocultarTodo();
  pantallaJuego.classList.remove("oculto");
  palabra = palabraAleatoria();
  filaActual = 0;
  colActual  = 0;
  intento    = [];
  juegoTerminado = false;
  mensajeEl.innerText = "";
  botonesJuego.classList.add("oculto");
  crearTablero(tablero, palabra.length);
}

function reiniciar() {
  modoIndividual();
}

function manejarIndividual(e) {
  if (juegoTerminado) return;

  if (e.key === "Enter") {
    if (intento.length !== palabra.length) {
      shakeRow(tablero, filaActual);
      return;
    }

    revelarFila(tablero, { fila: filaActual, intento }, palabra, () => {
      const adivinada = intento.join("") === palabra;

      if (adivinada) {
        juegoTerminado = true;
        mensajeEl.innerText = "🎉 ¡GANASTE!";
        botonesJuego.classList.remove("oculto");
        return;
      }

      filaActual++;
      colActual = 0;
      intento   = [];

      if (filaActual === 6) {
        juegoTerminado = true;
        mensajeEl.innerText = "❌ Era: " + palabra;
        botonesJuego.classList.remove("oculto");
      }
    });
    return;
  }

  if (e.key === "Backspace") {
    if (colActual > 0) {
      colActual--;
      intento.pop();
      const celdas = tablero.children[filaActual].children;
      celdas[colActual].innerText = "";
      celdas[colActual].classList.add("activa");
      if (colActual > 0) celdas[colActual - 1].classList.remove("activa");
    }
    return;
  }

  if (/^[a-zA-ZñÑ]$/.test(e.key)) {
    if (colActual < palabra.length) {
      const letra = e.key.toUpperCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quitar tildes
      intento.push(letra);
      const celdas = tablero.children[filaActual].children;
      celdas[colActual].innerText = letra;
      celdas[colActual].classList.remove("activa");
      celdas[colActual].classList.add("pop");
      setTimeout(() => celdas[colActual] && celdas[colActual].classList.remove("pop"), 120);
      colActual++;
      if (colActual < palabra.length) celdas[colActual].classList.add("activa");
    }
  }
}

// ── MODO MULTI ────────────────────────────────────────────────────────────────
function modoMulti() {
  ocultarTodo();
  pantallaMulti.classList.remove("oculto");
  p1Score = 0;
  p2Score = 0;
  p1El.innerText = "0";
  p2El.innerText = "0";
  reiniciarMulti();
}

function reiniciarMulti() {
  palabra = palabraAleatoria();
  estado1 = estadoInicial();
  estado2 = estadoInicial();
  turno   = 1;
  multiTerminado = false;

  mensajeMultiEl.innerText = "";
  botonesMulti.classList.add("oculto");

  crearTablero(tablero1, palabra.length);
  crearTablero(tablero2, palabra.length);

  actualizarTurnoUI();
}

function actualizarTurnoUI() {
  turnoTextoEl.className = "turno-texto";
  if (turno === 1) {
    turnoTextoEl.innerText = "🔵 Turno Jugador 1";
    turnoTextoEl.classList.add("t1");
    panelJ1El.classList.add("activo");
    panelJ2El.classList.remove("activo");
    scoreJ1El.classList.add("activo");
    scoreJ2El.classList.remove("activo");
  } else {
    turnoTextoEl.innerText = "🟠 Turno Jugador 2";
    turnoTextoEl.classList.add("t2");
    panelJ2El.classList.add("activo");
    panelJ1El.classList.remove("activo");
    scoreJ2El.classList.add("activo");
    scoreJ1El.classList.remove("activo");
  }
}

function manejarMulti(e) {
  if (multiTerminado) return;

  const tab = turno === 1 ? tablero1 : tablero2;
  const est = turno === 1 ? estado1 : estado2;

  // Si este jugador ya terminó su turno (adivinó o agotó intentos), no hace nada
  if (est.terminado) return;

  if (e.key === "Enter") {
    if (est.intento.length !== palabra.length) {
      shakeRow(tab, est.fila);
      return;
    }

    const intentoCopia = [...est.intento];
    const filaIdx      = est.fila;

    revelarFila(tab, { fila: filaIdx, intento: intentoCopia }, palabra, () => {
      const adivinada = intentoCopia.join("") === palabra;

      if (adivinada) {
        est.terminado = true;

        if (turno === 1) p1Score++;
        else             p2Score++;

        p1El.innerText = p1Score;
        p2El.innerText = p2Score;

        if (p1Score === 3 || p2Score === 3) {
          const ganador = p1Score === 3 ? 1 : 2;
          mensajeMultiEl.innerText = `🏆 ¡Jugador ${ganador} gana la partida!`;
          turnoTextoEl.innerText = "";
          multiTerminado = true;
          botonesMulti.classList.remove("oculto");
          return;
        }

        mensajeMultiEl.innerText = `✅ Punto para Jugador ${turno}!`;
        // Pausa breve y nueva ronda
        multiTerminado = true;
        botonesMulti.classList.remove("oculto");
        return;
      }

      // No adivinó: avanzar fila
      est.fila++;
      est.col     = 0;
      est.intento = [];

      if (est.fila === 6) {
        // Se quedó sin intentos
        est.terminado = true;
        mensajeMultiEl.innerText = `😓 Jugador ${turno} no adivinó. Turno del otro.`;
        turno = turno === 1 ? 2 : 1;
        actualizarTurnoUI();
        // Si el otro también terminó → nadie ganó la ronda
        const otroEst = turno === 1 ? estado1 : estado2;
        if (otroEst.terminado) {
          mensajeMultiEl.innerText = `❌ Nadie adivinó. La palabra era: ${palabra}`;
          multiTerminado = true;
          botonesMulti.classList.remove("oculto");
        }
        return;
      }

      // Cambiar turno
      turno = turno === 1 ? 2 : 1;
      actualizarTurnoUI();
    });
    return;
  }

  if (e.key === "Backspace") {
    if (est.col > 0) {
      est.col--;
      est.intento.pop();
      const celdas = tab.children[est.fila].children;
      celdas[est.col].innerText = "";
      celdas[est.col].classList.add("activa");
      if (est.col > 0) celdas[est.col - 1].classList.remove("activa");
    }
    return;
  }

  if (/^[a-zA-ZñÑ]$/.test(e.key)) {
    if (est.col < palabra.length) {
      const letra = e.key.toUpperCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      est.intento.push(letra);
      const celdas = tab.children[est.fila].children;
      celdas[est.col].innerText = letra;
      celdas[est.col].classList.remove("activa");
      celdas[est.col].classList.add("pop");
      setTimeout(() => celdas[est.col] && celdas[est.col].classList.remove("pop"), 120);
      est.col++;
      if (est.col < palabra.length) celdas[est.col].classList.add("activa");
    }
  }
}

// ── LISTENER GLOBAL ───────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (!pantallaJuego.classList.contains("oculto")) {
    manejarIndividual(e);
  }
  if (!pantallaMulti.classList.contains("oculto")) {
    manejarMulti(e);
  }
});
