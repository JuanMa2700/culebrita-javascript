// Culebrita by JuanMa2700

const canvasJuego = document.getElementById("canvasJuego");
const cvs = canvasJuego.getContext("2d");

// Definimos tamaño de nuestro canvas
canvasJuego.width = 400;
canvasJuego.height = 300;

// Obtenemos el elemento en el que renderizaremos nuestro puntaje
const PUNTAJE = document.getElementById("puntaje");

// Objeto para manejo de direcciones con constantes
const DIRECCIONES = {
  ARRIBA: 1,
  ABAJO: 2,
  IZQUIERDA: 3,
  DERECHA: 4,
};

// Definición de variables que utilizaremos para el funcionamiento del juego
let permitirEvento = true,
  puntos,
  FPS = 1000 / 15,
  direccion,
  culebra,
  cabezaPosX,
  cabezaPosY,
  posicionCulebra,
  intervaloJuego,
  comida = crearComida();

// Dibujamos borde y texto inicial en nuestro canvas
dibujarBordeDelJuego(cvs);
dibujarTexto(cvs, "Enter para empezar!", {
  y: canvasJuego.height / 2 - 10,
});
dibujarTexto(cvs, "Muévete con ↑ ↓ → ←", {
  y: canvasJuego.height / 2 + 10,
});

// Agregamos evento para iniciar juego al presionar enter en el documento
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    culebra = [
      { posX: 40, posY: 10 },
      { posX: 30, posY: 10 },
      { posX: 20, posY: 10 },
      { posX: 10, posY: 10 },
      { posX: 0, posY: 10 },
    ];
    direccion = DIRECCIONES.DERECHA;
    (cabezaPosX = 40), (cabezaPosY = 10), (puntos = 0);
    canvasJuego.style.backgroundColor = "rgb(153, 199, 40)";
    PUNTAJE.innerText = `Puntos: ${puntos}`;
    intervaloJuego = setInterval(juego, FPS);
  }
});

// Loop del juego
function juego() {
  permitirEvento = true;
  limpiar();
  mover();
  dibujarCulebra();
  dibujarBordeDelJuego(cvs);
  revisarColisiones();
  dibujarComida();
}

// Dibujamos un cuadro en las coordenadas x y recibidas como parámetros
function dibujarUnidadCulebra(x, y) {
  cvs.beginPath();
  cvs.fillRect(x, y, 10, 10);
  cvs.stroke();
}

// Invocamos el método de dibujar unidad de culebra por cada objeto
// guardado en el objeto culebra con coordenadas x y
function dibujarCulebra() {
  for (let unidad of culebra) {
    dibujarUnidadCulebra(unidad.posX, unidad.posY);
  }
}

// Método para limpiar el canvas en cada loop de juego
function limpiar() {
  cvs.clearRect(0, 0, canvasJuego.clientWidth, canvasJuego.height);
}

// Método para revisar las colisiones en cada loop del juego
// y terminar el juego si hay una colisión
function revisarColisiones() {
  if (
    cabezaPosX < 0 ||
    cabezaPosX >= canvasJuego.width ||
    cabezaPosY < 0 ||
    cabezaPosY >= canvasJuego.height
  ) {
    finDelJuego();
    throw Error("Colision con la pared");
  }

  if (posicionCulebra.size < culebra.length) {
    finDelJuego();
    throw Error("Colision con cuerpo");
  }
}

// Método para dibujar la comida en cada loop de juego.
// También refrescamos el texto de los puntos y las coordenadas
// de la nueva comida en caso de que la culebra consuma una comida
function dibujarComida() {
  if (posicionCulebra.has(`${comida.posX}${comida.posY}`)) {
    puntos++;
    PUNTAJE.innerText = `Puntos: ${puntos}`;
    agrandarCulebra();
    comida = crearComida();
  }

  cvs.beginPath();
  cvs.fillRect(comida.posX, comida.posY, 10, 10);
  cvs.stroke();
}

// Método para dibujar un texto en un canvas
// Parámetros:
// ctx   -> El canvas en el que se dibujará
// texto -> El texto que dibujaremos
// x, y  -> coordenadas para dibujar el texto
function dibujarTexto(ctx, texto, { x, y } = {}) {
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000000";
  ctx.fillText(
    texto,
    x || Math.floor(canvasJuego.width / 2),
    y || Math.floor(canvasJuego.height / 2)
  );
}

// Método que limpia el intervalo que ejecuta el loop del juego,
// cambia background del canvas y renderiza el mensaje de fin del
// juego cuando es invocado en el método revisarColisiones
function finDelJuego() {
  canvasJuego.style.backgroundColor = "red";
  clearInterval(intervaloJuego);
  dibujarTexto(cvs, `¡Fin del juego! Puntaje: ${puntos}`, {
    y: canvasJuego.height / 2 - 10,
  });
  dibujarTexto(cvs, "Enter para jugar de nuevo", {
    y: canvasJuego.height / 2 + 10,
  });
}

// Método que dibuja el borde del canvas que recive por parámetro en cada loop de juego
function dibujarBordeDelJuego(ctx) {
  ctx.beginPath();
  ctx.lineWidth = "5";
  ctx.rect(0, 0, canvasJuego.width, canvasJuego.height);
  ctx.stroke();
}

// Método que agranda la culebra en las coordenadas correctas cuando la culebra
// colisiona por la cabeza con la comida
function agrandarCulebra() {
  cola = culebra[culebra.length - 1];
  antesCola = culebra[culebra.length - 2];
  if (cola.posX === antesCola.posX + 10)
    culebra.push({ posX: cola.posX + 10, posY: cola.posY });
  else if (cola.posX === antesCola.posX - 10)
    culebra.push({ posX: cola.posX - 10, posY: cola.posY });
  else if (cola.posY === antesCola.posY + 10)
    culebra.push({ posX: cola.posX, posY: cola.posY + 10 });
  else if (cola.posX === antesCola.posX - 10)
    culebra.push({ posX: cola.posX, posY: cola.posY - 10 });
}

// Función que devuelve unas nuevas coordenadas aleatorias
// dentro del canvas para ubicar la nueva comida cuando la anterior
// ha sido alcanzada por la cabeza de la culebra
function crearComida() {
  minX = 0;
  maxX = canvasJuego.width / 10;
  minY = 0;
  maxY = canvasJuego.height / 10;
  posX = Math.floor(Math.random() * (maxX - minX) + minX) * 10;
  posY = Math.floor(Math.random() * (maxY - minY) + minY) * 10;

  if (posicionCulebra !== undefined && posicionCulebra.has(`${posX}${posY}`)) {
    return crearComida();
  }
  return { posX, posY };
}

// Método que actiualiza las coordenadas de la culebra dependiendo
// de la dirección activa en el loop de juego actual
function mover() {
  if (direccion === DIRECCIONES.DERECHA) cabezaPosX += 10;
  else if (direccion === DIRECCIONES.IZQUIERDA) cabezaPosX -= 10;
  else if (direccion === DIRECCIONES.ABAJO) cabezaPosY += 10;
  else if (direccion === DIRECCIONES.ARRIBA) cabezaPosY -= 10;
  else throw new Error("Dirección no válida");
  culebra.splice(0, 0, { posX: cabezaPosX, posY: cabezaPosY });
  culebra.pop();
  posicionCulebra = new Set();
  culebra.forEach((unidad) =>
    posicionCulebra.add(`${unidad.posX}${unidad.posY}`)
  );
}

// Agregamos evento para actualizar la dirección actual dependiendo
// de la tecla presionada por el usuario
document.addEventListener("keydown", (e) => {
  if (!permitirEvento) return;
  if (e.code === "ArrowUp" && direccion !== DIRECCIONES.ABAJO)
    direccion = DIRECCIONES.ARRIBA;
  else if (e.code === "ArrowDown" && direccion !== DIRECCIONES.ARRIBA)
    direccion = DIRECCIONES.ABAJO;
  else if (e.code === "ArrowLeft" && direccion !== DIRECCIONES.DERECHA)
    direccion = DIRECCIONES.IZQUIERDA;
  else if (e.code === "ArrowRight" && direccion !== DIRECCIONES.IZQUIERDA)
    direccion = DIRECCIONES.DERECHA;
  else return;
  permitirEvento = false;
});
