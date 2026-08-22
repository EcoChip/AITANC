# 🏭 Fábrica de Formas (Shapez-like Automation Game)

Un videojuego 2D de automatización industrial, producción geométrica y logística en vista cenital sobre cuadrícula, inspirado en **Shapez.io**.

---

## 🌟 Características Principales

- **50 Niveles Progresivos**: Desde la extracción básica hasta la manufactura del artefacto supremo *Omega*.
- **13 Tipos de Edificios y Máquinas**:
  - **Cintas Transportadoras**: Flujo continuo, compresión inteligente y curvas automáticas en 4 direcciones.
  - **Extractores**: Extracción infinita de yacimientos de formas y pigmentos distribuidos orgánicamente en el mapa.
  - **Hornos Térmicos**: Templado y cristalización de formas con halo brillante dorado.
  - **Pintores**: Aplicación de tintes líquidos a formas geométricas.
  - **Mezcladores de Color**: Síntesis de colores secundarios (Amarillo, Púrpura, Cian) y Blanco puro.
  - **Cortadores**: Disección de piezas en mitades izquierda y derecha.
  - **Rotadores**: Giro de 90° horario sobre cuadrantes.
  - **Ensambladores / Apiladores**: Fusión de cuadrantes complementarios y apilado en hasta 4 capas.
  - **Divisores y Fusionadores**: Balanceo de líneas y unión de flujos.
  - **Filtros Inteligentes**: Clasificación por forma, color o estado de calor.
  - **Túneles Subterráneos**: Cruce de cintas sin colisiones hasta 5 casillas de distancia.
  - **Triturador / Demolición**: Incineración de excedentes.
  - **Centro de Entrega (Hub)**: Plataforma central de 4x4 con 16 puertos de entrada simultáneos y medidor de caudal (uds/s).
- **Audio Procedural (Web Audio API)**: Cero dependencias externas. Generación en tiempo real de sintetizadores, acordes de victoria, chimes pentatónicos al entregar y música ambiental lofi relajante.
- **Gráficos Vectoriales de Alta Precisión**: Renderizado suave por cuadrantes, efectos de partículas (chispas de corte, spray de pintura, ascuas de horno y confeti).
- **Herramientas de Calidad de Vida**:
  - Trazado continuo de cintas con clic y arrastre.
  - Radar minimapa interactivo en tiempo real con viewport de cámara.
  - Controles de velocidad de simulación (Pausa, 1x, 2x, 4x).
  - Árbol interactivo de 50 niveles con saltos a niveles desbloqueados.
  - Códex con enciclopedia de formas, colores, maquinaria y atajos.
  - Sistema de 19 logros desbloqueables.
  - Panel de estadísticas en tiempo real.
  - Guardado automático en `localStorage` + Exportación / Importación de partidas en formato JSON.
  - Modo Sandbox opcional para construir libremente con todo desbloqueado.

---

## 🎮 Controles del Juego

| Control | Acción |
| :--- | :--- |
| **Clic Izquierdo** | Colocar edificio seleccionado / Arrastrar para crear líneas continuas de cintas. |
| **Clic Derecho / Q** | Demoler edificio bajo el cursor / Arrastrar para demolición rápida. |
| **R o Shift + Rueda** | Rotar el edificio seleccionado 90°. |
| **WASD o Flechas** | Mover la cámara por el mapa. |
| **Rueda del Ratón** | Zoom in / Zoom out centrado en el cursor. |
| **Botón Central (Arrastrar)** | Paneo rápido del mapa. |
| **1 - 9, 0, -, =** | Selección rápida de herramientas en la barra inferior. |
| **Espacio** | Pausar / Reanudar el flujo del juego. |
| **F** | Centrar la cámara inmediatamente en el Hub central. |

---

## 🚀 Cómo Ejecutar el Juego

El juego está desarrollado en **HTML5, CSS3 y JavaScript moderno (ES Modules)**, por lo que no requiere compilación ni instalación de dependencias pesadas.

Para ejecutarlo localmente en tu navegador:

### Opción 1: Con Python (Recomendado)
Abre una terminal en esta carpeta y ejecuta:
```bash
# Python 3
python -m http.server 8000
```
Luego abre en tu navegador: `http://localhost:8000`

### Opción 2: Con Node.js / npx
```bash
npx serve .
# o
npx http-server .
```

### Opción 3: Con la extensión Live Server de VS Code / IDE
Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## 🧩 Guía de Fórmulas de Mezcla de Color

| Insumo 1 | Insumo 2 | Resultado |
| :--- | :--- | :--- |
| **Rojo** (`r`) | **Verde** (`g`) | **Amarillo** (`y`) |
| **Rojo** (`r`) | **Azul** (`b`) | **Púrpura / Magenta** (`p`) |
| **Verde** (`g`) | **Azul** (`b`) | **Cian** (`c`) |
| **Cian** (`c`) | **Rojo** (`r`) | **Blanco** (`w`) |
| **Amarillo** (`y`) | **Azul** (`b`) | **Blanco** (`w`) |
| **Púrpura** (`p`) | **Verde** (`g`) | **Blanco** (`w`) |

---

¡Disfruta construyendo y optimizando tu fábrica geométrica!
