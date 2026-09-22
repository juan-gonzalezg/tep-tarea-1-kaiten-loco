# 🍣 Kaiten Loco - Sushi en Cinta (Hostile UX Edition)

> **Tarea 1 — Tópicos Especiales de Programación**
> Aplicación web Full-Stack con TypeScript para la gestión y simulación de pedidos en un restaurante de sushi giratorio en cinta (_kaitenzushi_), diseñada bajo rigurosos patrones de **Diseño Hostil (Hostile UX)**, **Tortura Operativa**, **Patrones Oscuros** y **Agresión Sensorial**, conservando una lógica de negocio y persistencia 100% real en base de datos.

---

## 🌐 Enlace de Despliegue en Cloudflare

El proyecto se encuentra desplegado y accesible públicamente a través de **Cloudflare**:

🔗 **Enlace de la Aplicación en Cloudflare:**
👉 `https://tep-tarea-1-kaiten-loco.pages.dev/`

---

## 🛠️ Stack Tecnológico

El proyecto está construido íntegramente en **TypeScript** tanto en el frontend como en el backend:

### **Frontend**

- **Framework / Bundler:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) (con TypeScript en modo estricto).
- **Estilos y Animaciones:** CSS3 puro avanzado con keyframes personalizados (`blink`, `blink-fast`, `shake`, marquesinas opuestas, rotaciones de platos y filtros de contraste disonante).
- **Audio Sintetizado:** [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API) nativa (osciladores analógicos en tiempo real para generar pitidos de alta frecuencia al pasar el cursor y música ambiental de 8-bits sin depender de archivos de audio externos que puedan fallar).
- **Componentes Custom:** Selectores alfabéticos, sliders criptográficos a ciegas, calendarios secuenciales y modales bizantinos.

### **Backend**

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (v22+).
- **Framework Web:** [Express](https://expressjs.com/) con [TypeScript](https://www.typescriptlang.org/) compilado con `tsc` y ejecutado en desarrollo con `tsx`.
- **Persistencia de Datos:** Almacenamiento estructurado en formato JSON (`server/src/data/db.json` y `menu.json`), con soporte para usuarios, sesiones simuladas, registro de platos, pedidos e historial de facturación.
- **Middleware:** CORS habilitado y JSON body parser.

---

## 📋 ¿Qué hace la Página? (Lógica de Negocio y Funcionalidades)

A pesar de su diseño exasperante, la aplicación es **totalmente funcional** y gestiona un ciclo de compra completo:

1. **Catálogo de Sushi por Platos de Color:**
   - **Plato Amarillo ($120):** Opciones tradicionales (_Atún Rojo Clásico, Salmón Noruego Fresco, Tortilla Dulce Casera, Calamar Blanco, Gaseosa con Canica_).
   - **Plato Rojo Especial ($180):** Opciones intermedias (_Salmón Gratinado al Soplete, Anguila de Río Glaseada, Vieira del Norte Gigante, Langostino en Tempura, Sopa de Soja Roja, Flan Salado al Vapor_).
   - **Plato Negro Diamante ($360):** Opciones gourmet (_Atún Supremo Vientre Graso, Barqueta de Caviar de Salmón, Barqueta de Erizo de Mar Salvaje, Carne Suprema Flambeada, Copa Helada de Té Verde_).
   - Carrito de compras reactivo asociado al número de mesa del comensal.
2. **Autenticación y Registro:**
   - Inicio de sesión con validación de credenciales.
   - Registro con guardado persistente de datos personales y teléfono.
3. **Checkout y Simulación de Pedidos:**
   - Procesamiento de ítems seleccionados, desglose de subtotal, impuestos al consumo (10%) y personalización de salsas.
4. **Simulación de Pago Bancario:**
   - Pasarela de cobro ficticia con selección de tarjeta y comprobante de débito irreversible.
5. **Facturación e Historial:**
   - Generación de factura fiscal con desglose detallado.
   - Vista de historial de órdenes registradas en base de datos.

---

## 😈 Arquetipos de Diseño Hostil y Tortura Operativa Implementados

La aplicación aplica a cabalidad los 4 arquetipos de antipatrones solicitados:

### 1. Jerarquía Visual Caótica y Agresión Sensorial (UI)

- **Contraste destructivo:** Textos en amarillo fosforito y verde lima chillón sobre fondo blanco puro.
- **Tipografía desquiciante:** Párrafos que alternan cada dos palabras entre 6 tipografías incompatibles (_Comic Sans MS, Papyrus, Impact, Brush Script MT, Courier New, Times New Roman_) con tamaños caóticos intercalados (de 10px a 32px).
- **Sobrecarga de movimiento:** Marquesinas opuestas a diferentes velocidades, elementos con parpadeo agresivo (`blink`), temblores de pantalla (`shake`) e iconos girando permanentemente.
- **Inversión de metáforas visuales:**
   - Hipervínculos falsos decorados en azul subrayado con cursor de mano que no hacen nada.
   - Botones interactivos reales camuflados como texto plano negro sin subrayar (`cursor: default`).
   - Botones de acción principal en gris apagado (simulando estar deshabilitados).
   - Botones secundarios o de borrado en neón brillante fosforescente y parpadeante.

### 2. Formularios de Tortura Operativa (UX Funcional)

- **Selectores inadecuados:**
   - Selector de cantidades y calificaciones alfabético ordenado en español: `["Cero (0)", "Cinco (5)", "Cuatro (4)", "Diez (10)", "Dos (2)", "Nueve (9)", "Ocho (8)", "Seis (6)", "Siete (7)", "Tres (3)", "Uno (1)"]`.
   - Selector de fecha de nacimiento (`TortureDatePicker`) sin salto de año o década, obligando al usuario a retroceder mes a mes con clics individuales.
   - Selector de teléfono con un deslizador hipersensible de 0 a 9999 sin valor numérico visible al lado.
- **Validación hostil e inmediata:**
   - Error en rojo alarmista en tiempo real desde la primera letra tecleada.
   - Requisitos de contraseña no declarados que se revelan progresivamente tras cada intento fallido:
      1. _Al menos 8 caracteres y un número._
      2. _Nombre de un planeta del sistema solar (ej: Jupiter, Marte)._
      3. _No puede contener vocales consecutivas._
      4. _Debe contener un número romano en mayúscula (I, V, X, L, C, D, M)._
      5. _Debe contener el nombre de un pescado o marisco (ej: Salmon, Atun, Langostino, Calamar)._
- **Botón trampa "Borrar todo":**
   - Ubicado estratégicamente donde el usuario espera el botón de enviar, con diseño ultra llamativo y vaciando el formulario sin confirmación.

### 3. Navegación Elusiva y Patrones Oscuros

- **Menú fugitivo:** Menú desplegable con retardo nulo de cierre por hover (`delay: 0ms`); si el cursor sale 1px del contenedor, se esfuma.
- **Botón "Atrás" Saboteador:** En lugar de retroceder al paso anterior, traslada al comensal al _"Blog de Recetas del Maestro"_, obligándolo a buscar un enlace diminuto en gris claro para retomar.
- **Secuestro del botón Atrás nativo del navegador:** Interceptado con `popstate` para devolver al comensal al Paso 1 (Selección de piezas), conservando los datos pero obligándolo a pasar el túnel nuevamente.
- **Falso túnel de pasos (Breadcrumbs mentirosos):** Barra que retrocede caprichosamente del 60% al 40% al insertar pasos intermedios no anunciados:
   - _Paso 2.1: Selección obligatoria de salsas y gotas de té._
   - _Paso 2.2: Encuesta de satisfacción preventiva obligatoria._
   - _Paso 2.3: Confirmación de teléfono por frecuencia armónica de audio._
- **Dispersión espacial (Botones nómadas):** En la pantalla de datos el botón de avance está arriba a la izquierda camuflado como subtítulo; en el pago se divide en dos ("Confirmar" arriba y "Procesar cobro" en una tabla oculta con scroll horizontal).
- **Botón camuflado por contexto:** La celda plana de la tabla _"Total: $X (clic aquí para debitar)"_ actúa como disparador de cobro.
- **Modal Bizantino con opciones paradójicas:**
   - Título: _"¿Desea no interrumpir el proceso de no confirmación?"_
   - `Aceptar`: Cancela la orden y devuelve al inicio.
   - `Cancelar`: Procede con el cobro exitosamente.
   - `No`: Cierra el modal sin hacer nada.
   - Falsa urgencia: Cuenta regresiva de 30 segundos; si llega a cero, reordena los campos y reinicia el contador.
- **Cumulative Layout Shift (CLS) Deliberado:** Banner invasivo que se expande súbitamente 350ms antes del clic, provocando un clic erróneo.
- **Casillas con triple negación:** _"Marque aquí si no desea dejar de abstenerse de recibir correos..."_.

### 4. Sonido y Rendimiento Reactivo

- **Audio automático ineludible:** Generador de tonos y jingle de 8-bits continuo generado mediante Web Audio API, que arranca al primer gesto del usuario sin control de volumen visible.
- **Efectos por cursor:** Pitidos agudos de alta frecuencia en el evento `mouseenter` de todos los elementos interactivos.
- **Interrupción del flujo:** Cada cambio de micro-pantalla ejecuta `window.scrollTo(0,0)` y suspende la vista durante 1.5s con spinners falsos (_"Optimizando arroz...", "Afilando cuchillo yanagiba..."_).

---

## 📁 Estructura del Proyecto

```
tep-tarea-1-kaiten-loco/
├── package.json                 # Scripts unificados de construcción y ejecución
├── README.md                    # Documentación del proyecto
├── .gitignore                   # Exclusiones para git
│
├── server/                      # Backend API (Node.js + Express + TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # Servidor HTTP, lógica de endpoints y validaciones
│       ├── types/
│       │   └── index.ts         # Tipos e interfaces de datos
│       └── data/
│           ├── menu.json        # Catálogo de 16 platos de Kaiten Loco
│           └── db.json          # Persistencia de usuarios y órdenes
│
└── client/                      # Frontend SPA (React + TypeScript + Vite)
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts           # Configuración de proxy a /api
    ├── index.html
    └── src/
        ├── index.css            # Estilos hostiles, animaciones y tipografías caóticas
        ├── App.tsx              # Componente raíz y control de vistas
        ├── types.ts             # Tipos compartidos en frontend
        ├── sound/
        │   └── soundEffects.ts  # Sintetizador Web Audio API
        ├── services/
        │   └── api.ts           # Cliente HTTP hacia la API Express
        ├── components/
        │   ├── HostileHeader.tsx        # Encabezado, marquesinas y menú fugitivo
        │   ├── TortureInputs.tsx        # Selectores alfabéticos, slider ciego y fechas
        │   ├── ByzantineModal.tsx       # Modal de confirmación invertida y falsa urgencia
        │   ├── FakeSpinner.tsx          # Pantallas de carga ficticia
        │   └── InvoiceModal.tsx         # Factura oficial en amarillo sobre blanco
        └── pages/
            ├── CatalogPage.tsx          # Catálogo con platos por color
            ├── MicroScreensCheckout.tsx # Micro-pantallas A, B, C, D y pasos 2.1, 2.2, 2.3
            ├── PaymentPage.tsx          # Pago con botones nómadas y CLS deliberado
            ├── HistoryPage.tsx          # Historial de pedidos
            ├── LoginPage.tsx            # Login con validación hostil en tiempo real
            ├── RegisterPage.tsx         # Registro con reglas secretas progresivas
            └── RecipeBlogPage.tsx       # Blog gastronómico de desvío
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos

- Node.js v18 o superior instalado.
- npm v9 o superior.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/juan-gonzalezg/tep-tarea-1-kaiten-loco.git
cd tep-tarea-1-kaiten-loco
```

### 2. Instalar Dependencias

Desde la raíz del proyecto, instalar las dependencias del servidor y del cliente:

```bash
# Instalar en el servidor
cd server
npm install

# Instalar en el cliente
cd ../client
npm install

# Regresar a la raíz
cd ..
```

### 3. Compilación de TypeScript

Para verificar que todo compile sin errores:

```bash
npm run build
```

### 4. Iniciar la Aplicación en Desarrollo

Puedes abrir dos terminales en la carpeta raíz:

**Terminal 1 (Backend Express):**

```bash
npm run start:server
# Servidor escuchando en http://localhost:5000
```

**Terminal 2 (Frontend Vite):**

```bash
npm run dev:client
# Aplicación web disponible en http://localhost:5173
```

---

## 🔑 Credenciales de Prueba Preconfiguradas

Para probar el inicio de sesión sin pasar por el formulario de registro:

| Campo                  | Valor                   |
| ---------------------- | ----------------------- |
| **Correo Electrónico** | `cliente@kaitenloco.es` |
| **Contraseña**         | `Jupiter1SalmonX`       |
