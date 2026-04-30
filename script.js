// ── PALABRAS ESCOLARES (todas completas, verificadas, agrupadas por longitud) ─
const palabrasPorLongitud = {
  4: [
    "AULA","MESA","GOMA","TIZA","NOTA","BECA","ACTO","ARTE",
    "DATO","IDEA","OBRA","ORAL","PLAN","TEMA","TIPO","ZONA",
    "LEER","RIMA","ARCO","CASO","FASE","POLO","ROCA","SALA",
    "BASE","CERO","SUMA","FILA","HOJA","MAPA","QUIZ","SEDE",
    "LOGO","TONO"
  ],
  5: [
    "CLASE","BANCO","LAPIZ","REGLA","TURNO","LIBRO","SILLA",
    "MOTOR","LINEA","PLAZA","RITMO","CAMPO","CLAVE","CURVA",
    "DRAMA","FRASE","GRADO","HIELO","TESIS","TEXTO","VOCAL",
    "VERBO","SIGNO","PUNTO","PROSA","NIVEL","NORMA","MURAL",
    "LETRA","GENIO","DUETO","DICHO","CORAL","CANON","CANTO"
  ],
  6: [
    "ALUMNO","TITULO","RECREO","EXAMEN","FISICA","LENGUA",
    "MUSICA","TALLER","OFICIO","BLOQUE","CAMINO","DEBATE",
    "EFECTO","FIGURA","GENERO","HABITO","IDIOMA","JUICIO",
    "LIMITE","MANEJO","NUCLEO","OBJETO","PATRON","TEJIDO",
    "UNIDAD","VECTOR","ANGULO","NUMERO","COMPAS","ESCENA"
  ],
  7: [
    "CARPETA","TABLERO","MONITOR","TECLADO","ESCUELA",
    "PORTERO","TORNERO","CALCULO","FORMULA","GRAFICO",
    "IMPULSO","JORNADA","MATERIA","NUMERAL","OPINION",
    "PROCESO","RECURSO","SISTEMA","USUARIO","VENTAJA",
    "ALGEBRA","CIENCIA","JUVENIL","MANDATO","NEGOCIO",
    "TERMINO","DECIMAL","ABSCISA"
  ],
  8: [
    "BIOLOGIA","HISTORIA","CUADERNO","FILOSOFO","ABSOLUTO",
    "CONJUNTO","ELEMENTO","GRAVEDAD","INFINITO","LENGUAJE",
    "NEGATIVO","OPERADOR","SINGULAR","UNIVERSO","VARIABLE",
    "ALUMNADO","DIRECTOR","HORARIOS","INTERNET","JUVENTUD",
    "MAESTRIA","NOTEBOOK","OBJETIVO","REGISTRO","TEOREMAS"
  ]
};

// ── ELEMENTOS DOM ─────────────────────────────────────────────────────────────
const pantallaInicio    = document.getElementById("inicio");
const pantallaMenu      = document.getElementById("menu");
const pantallaSelector  = document.getElementById("selector");
const pantallaJuego     = document.getElementById("juego");
const pantallaMulti     = document.getElementById("multi");

const tablero           = document.getElementById("tablero");
const tablero1          = document.getElementById("tablero1");
const tablero2          = document.getElementById("tablero2");

const mensajeEl         = document.getElementById("mensaje");
const mensajeMultiEl    = document.getElementById("mensajeMulti");
const turnoTextoEl      = document.getElementById("turnoTexto");
const botonesJuego      = document.getElementById("botonesJuego");
const botonesMulti      = document.getElementById("botonesMulti");

const p1El              = document.getElementById("p1");
const p2El              = document.getElementById("p2");
const scoreJ1El         = document.getElementById("scoreJ1");
const scoreJ2El         = document.getElementById("scoreJ2");
const panelJ1El         = document.getElementById("panelJ1");
const panelJ2El         = document.getElementById("panelJ2");

const selectLetras      = document.getElementById("cantLetras");
const selectorIcono     = document.getElementById("selectorIcono");
const selectorTitulo    = document.getElementById("selectorTitulo");
const selectorHint      = document.getElementById("selectorHint");

// ── ESTADO SELECTOR ───────────────────────────────────────────────────────────
let modoSeleccionado = "individual";

// ── ESTADO INDIVIDUAL ─────────────────────────────────────────────────────────
let palabra        = "";
let filaActual     = 0;
let colActual      = 0;
let intento        = [];
let juegoTerminado = false;

// ── ESTADO MULTI ──────────────────────────────────────────────────────────────
let estado1        = {};
let estado2        = {};
let turno          = 1;
let p1Score        = 0;
let p2Score        = 0;
let multiTerminado = false;

// ── NAVEGACIÓN ────────────────────────────────────────────────────────────────
function ocultarTodo() {
  pantallaInicio.classList.add("oculto");
  pantallaMenu.classList.add("oculto");
  pantallaSelector.classList.add("oculto");
  pantallaJuego.classList.add("oculto");
  pantallaMulti.classList.add("oculto");
}

function irMenu() {
  ocultarTodo();
  pantallaMenu.classList.remove("oculto");
}

function irSelector(modo) {
  modoSeleccionado = modo;
  ocultarTodo();
  pantallaSelector.classList.remove("oculto");

  if (modo === "individual") {
    selectorIcono.textContent  = "👤";
    selectorTitulo.textContent = "Modo Individual";
  } else {
    selectorIcono.textContent  = "👥";
    selectorTitulo.textContent = "Multijugador";
  }

  selectLetras.value       = "";
  selectorHint.textContent = "";
}

selectLetras.addEventListener("change", () => {
  const n = parseInt(selectLetras.value);
  if (!n) { selectorHint.textContent = ""; return; }
  const disponibles = (palabrasPorLongitud[n] || []).length;
  selectorHint.textContent =
    `${disponibles} palabra${disponibles !== 1 ? "s" : ""} disponible${disponibles !== 1 ? "s" : ""}`;
});

function iniciarDesdeSelector() {
  const n = parseInt(selectLetras.value);
  if (!n) {
    selectorHint.textContent = "⚠ Elegí una opción primero.";
    return;
  }
  if (modoSeleccionado === "individual") {
    modoIndividual(n);
  } else {
    modoMulti(n);
  }
}

// ── UTILIDADES ────────────────────────────────────────────────────────────────
function palabraAleatoria(longitud) {
  const lista = palabrasPorLongitud[longitud] || [];
  return lista[Math.floor(Math.random() * lista.length)];
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

function revelarFila(tab, est, palabraObj, cb) {
  const celdas = tab.children[est.fila].children;
  const letras = est.intento;
  const freq   = {};
  for (const c of palabraObj) freq[c] = (freq[c] || 0) + 1;

  const resultado = Array(letras.length).fill("incorrecta");

  for (let i = 0; i < letras.length; i++) {
    if (letras[i] === palabraObj[i]) {
      resultado[i] = "correcta";
      freq[letras[i]]--;
    }
  }
  for (let i = 0; i < letras.length; i++) {
    if (resultado[i] !== "correcta" && freq[letras[i]] > 0) {
      resultado[i] = "presente";
      freq[letras[i]]--;
    }
  }

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
    void celda.offsetWidth;
    celda.classList.add("shake-row");
  }
}

// ── MODO INDIVIDUAL ───────────────────────────────────────────────────────────
function modoIndividual(longitud) {
  ocultarTodo();
  pantallaJuego.classList.remove("oculto");
  palabra        = palabraAleatoria(longitud);
  filaActual     = 0;
  colActual      = 0;
  intento        = [];
  juegoTerminado = false;
  mensajeEl.innerText = "";
  botonesJuego.classList.add("oculto");
  crearTablero(tablero, palabra.length);
}

function reiniciar() {
  modoIndividual(palabra.length);
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
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
function modoMulti(longitud) {
  ocultarTodo();
  pantallaMulti.classList.remove("oculto");
  p1Score        = 0;
  p2Score        = 0;
  p1El.innerText = "0";
  p2El.innerText = "0";
  reiniciarMulti(longitud);
}

function reiniciarMulti(longitud) {
  const len      = longitud || palabra.length || 5;
  palabra        = palabraAleatoria(len);
  estado1        = estadoInicial();
  estado2        = estadoInicial();
  turno          = 1;
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
  const est = turno === 1 ? estado1  : estado2;

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
          turnoTextoEl.innerText   = "";
          multiTerminado           = true;
          botonesMulti.classList.remove("oculto");
          return;
        }

        mensajeMultiEl.innerText = `✅ ¡Punto para Jugador ${turno}!`;
        multiTerminado           = true;
        botonesMulti.classList.remove("oculto");
        return;
      }

      est.fila++;
      est.col     = 0;
      est.intento = [];

      if (est.fila === 6) {
        est.terminado = true;
        mensajeMultiEl.innerText = `😓 Jugador ${turno} no adivinó. Turno del otro.`;
        turno = turno === 1 ? 2 : 1;
        actualizarTurnoUI();
        const otroEst = turno === 1 ? estado1 : estado2;
        if (otroEst.terminado) {
          mensajeMultiEl.innerText = `❌ Nadie adivinó. La palabra era: ${palabra}`;
          multiTerminado           = true;
          botonesMulti.classList.remove("oculto");
        }
        return;
      }

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
  if (!pantallaJuego.classList.contains("oculto")) manejarIndividual(e);
  if (!pantallaMulti.classList.contains("oculto"))  manejarMulti(e);
});
