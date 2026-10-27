// ==========================================================================
// RESILIENTE MOCHE - LÓGICA INTERACTIVA EN JAVASCRIPT NATIVO (ES6+)
// ==========================================================================

// 1. CONFIGURACIÓN DEL NEGOCIO
// Código de país 51 (Perú) + 9 dígitos, sin espacios ni caracteres especiales
const numeroWhatsApp = "51926965029"; 

// 2. CATÁLOGO DE PRODUCTOS (10 artículos con categorías e imágenes oficiales)
const productos = [
  {
    id: 1,
    nombre: "Kit de emergencia familiar 72 horas",
    categoria: "Emergencia",
    descripcion: "Mochila con agua, linterna, silbato, manta y alimentos para 3 días.",
    precio: 129.00,
    imagen: "imagenes/kit-emergencia.jpg"
  },
  {
    id: 2,
    nombre: "Linterna solar recargable",
    categoria: "Energía",
    descripcion: "Se carga con el sol y dura unas 8 horas continuas de luz.",
    precio: 35.00,
    imagen: "imagenes/linterna-solar.jpg"
  },
  {
    id: 3,
    nombre: "Botas de jebe impermeables",
    categoria: "Inundación",
    descripcion: "Protegen los pies contra agua estancada, barro e infecciones.",
    precio: 55.00,
    imagen: "imagenes/botas-jebe.jpg"
  },
  {
    id: 4,
    nombre: "Poncho impermeable adulto",
    categoria: "Inundación",
    descripcion: "Liviano, con capucha ajustable y fácil de guardar doblado.",
    precio: 18.00,
    imagen: "imagenes/poncho-impermeable.jpg"
  },
  {
    id: 5,
    nombre: "Repelente de mosquitos 120 ml",
    categoria: "Dengue",
    descripcion: "Protección eficaz contra el zancudo transmisor del dengue.",
    precio: 14.00,
    imagen: "imagenes/repelente.jpg"
  },
  {
    id: 6,
    nombre: "Mosquitero para cama",
    categoria: "Dengue",
    descripcion: "Malla fina de alta densidad para cama familiar de 2 plazas.",
    precio: 45.00,
    imagen: "imagenes/mosquitero.jpg"
  },
  {
    id: 7,
    nombre: "Radio solar con manivela",
    categoria: "Energía",
    descripcion: "Funciona sin pilas convencionales; ideal para escuchar alertas oficiales.",
    precio: 69.00,
    imagen: "imagenes/radio-solar.jpg"
  },
  {
    id: 8,
    nombre: "Botiquín de primeros auxilios",
    categoria: "Emergencia",
    descripcion: "Equipado con gasas, vendas, alcohol, suero y guía médica rápida.",
    precio: 49.00,
    imagen: "imagenes/botiquin.jpg"
  },
  {
    id: 9,
    nombre: "Tabletas purificadoras de agua (50 und.)",
    categoria: "Emergencia",
    descripcion: "Potabilizan agua de lluvia o cisterna cuando el servicio se interrumpe.",
    precio: 25.00,
    imagen: "imagenes/tabletas-agua.jpg"
  },
  {
    id: 10,
    nombre: "Sacos para barrera contra inundación (pack de 10)",
    categoria: "Inundación",
    descripcion: "Sacos resistentes para rellenar con arena y desviar torrentes de agua.",
    precio: 22.00,
    imagen: "imagenes/sacos-barrera.jpg"
  }
];

// Clases de estilo e iconos asignados a cada categoría para el respaldo visual
const ESTILOS_CATEGORIA = {
  "Emergencia": { claseBadge: "badge-emergencia", icono: "🎒" },
  "Inundación": { claseBadge: "badge-inundacion", icono: "🌊" },
  "Dengue":     { claseBadge: "badge-dengue",     icono: "🦟" },
  "Energía":    { claseBadge: "badge-energia",    icono: "🔦" }
};

// 3. ESTADO Y PERSISTENCIA (localStorage)
let carrito = JSON.parse(localStorage.getItem("carritoResiliente")) || [];
let categoriaActual = "todos";
let textoBusqueda = "";

// 4. ELEMENTOS DEL DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const cuerpoTablaCarrito = document.getElementById("cuerpo-tabla-carrito");
const contenedorTablaCarrito = document.getElementById("carrito-tabla-contenedor");
const mensajeCarritoVacio = document.getElementById("carrito-vacio");
const montoTotalElemento = document.getElementById("monto-total");
const contadorCarritoNav = document.getElementById("contador-carrito");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnWhatsApp = document.getElementById("btn-whatsapp");
const botonesFiltro = document.querySelectorAll(".boton-filtro");
const tarjetasCategoriaVisuales = document.querySelectorAll(".tarjeta-categoria");
const inputBuscador = document.getElementById("buscador");

// 5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
function renderizarProductos() {
  contenedorProductos.innerHTML = "";

  // Filtramos por categoría Y por búsqueda en texto
  const productosFiltrados = productos.filter(p => {
    const coincideCat = (categoriaActual === "todos") || (p.categoria === categoriaActual);
    const coincideTexto = (p.nombre + " " + p.descripcion).toLowerCase().includes(textoBusqueda);
    return coincideCat && coincideTexto;
  });

  if (productosFiltrados.length === 0) {
    contenedorProductos.innerHTML = `
      <p class="sin-resultados">
        No encontramos productos que coincidan con tu búsqueda. Prueba con otra palabra o selecciona "Todos".
      </p>
    `;
    return;
  }

  // Generamos cada tarjeta <article> con proporción 4:3
  productosFiltrados.forEach(producto => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");

    const infoEstilo = ESTILOS_CATEGORIA[producto.categoria];

    tarjeta.innerHTML = `
      <div class="imagen-contenedor">
        <img 
          src="${producto.imagen}" 
          alt="${producto.nombre} - ${producto.descripcion}" 
          width="400" 
          height="300" 
          loading="lazy"
        >
      </div>
      <div class="tarjeta-cuerpo">
        <span class="categoria-etiqueta ${infoEstilo.claseBadge}">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="tarjeta-descripcion">${producto.descripcion}</p>
        <div class="tarjeta-pie">
          <span class="precio-texto">S/ ${producto.precio.toFixed(2)}</span>
          <button type="button" class="boton boton-amarillo btn-agregar" data-id="${producto.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;

    // Respaldo visual: si la foto no carga, se muestra el icono y color de su categoría
    const contenedorImg = tarjeta.querySelector(".imagen-contenedor");
    const imagen = tarjeta.querySelector("img");
    imagen.addEventListener("error", () => {
      imagen.remove();
      contenedorImg.classList.add("sin-foto", `fallback-${producto.categoria}`);
      contenedorImg.setAttribute("data-icono", infoEstilo.icono);
    });

    contenedorProductos.appendChild(tarjeta);
  });

  conectarBotonesAgregar();
}

function conectarBotonesAgregar() {
  const botones = document.querySelectorAll(".btn-agregar");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"), 10);
      agregarAlCarrito(id);
    });
  });
}

// 6. FUNCIONALIDAD DEL CARRITO DE COMPRAS
function guardarCarrito() {
  localStorage.setItem("carritoResiliente", JSON.stringify(carrito));
}

function mostrarAviso(mensaje) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  setTimeout(() => aviso.classList.remove("visible"), 1800);
}

function agregarAlCarrito(idProducto) {
  mostrarAviso("✔ Producto añadido al carrito");

  const productoExistente = carrito.find(item => item.id === idProducto);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    const info = productos.find(p => p.id === idProducto);
    carrito.push({
      id: info.id,
      nombre: info.nombre,
      precio: info.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarCarritoHTML();
}

function cambiarCantidad(idProducto, cambio) {
  const item = carrito.find(p => p.id === idProducto);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
    return;
  }

  guardarCarrito();
  actualizarCarritoHTML();
}

function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(p => p.id !== idProducto);
  guardarCarrito();
  actualizarCarritoHTML();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarritoHTML();
}

function actualizarCarritoHTML() {
  cuerpoTablaCarrito.innerHTML = "";

  let totalMonto = 0;
  let totalArticulos = 0;

  if (carrito.length === 0) {
    mensajeCarritoVacio.classList.remove("oculta");
    contenedorTablaCarrito.classList.add("oculta");
    btnWhatsApp.disabled = true;
  } else {
    mensajeCarritoVacio.classList.add("oculta");
    contenedorTablaCarrito.classList.remove("oculta");
    btnWhatsApp.disabled = false;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      totalMonto += subtotal;
      totalArticulos += item.cantidad;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><strong>${item.nombre}</strong></td>
        <td>S/ ${item.precio.toFixed(2)}</td>
        <td>
          <div class="controles-cantidad">
            <button type="button" class="boton-cantidad btn-disminuir" data-id="${item.id}" aria-label="Restar una unidad a ${item.nombre}">-</button>
            <span>${item.cantidad}</span>
            <button type="button" class="boton-cantidad btn-aumentar" data-id="${item.id}" aria-label="Sumar una unidad a ${item.nombre}">+</button>
          </div>
        </td>
        <td>S/ ${subtotal.toFixed(2)}</td>
        <td>
          <button type="button" class="boton-eliminar btn-quitar" data-id="${item.id}">Quitar</button>
        </td>
      `;
      cuerpoTablaCarrito.appendChild(fila);
    });
  }

  montoTotalElemento.textContent = `S/ ${totalMonto.toFixed(2)}`;
  contadorCarritoNav.textContent = totalArticulos;

  asignarEventosTabla();
}

function asignarEventosTabla() {
  document.querySelectorAll(".btn-disminuir").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"), 10);
      cambiarCantidad(id, -1);
    });
  });

  document.querySelectorAll(".btn-aumentar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"), 10);
      cambiarCantidad(id, 1);
    });
  });

  document.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"), 10);
      eliminarDelCarrito(id);
    });
  });
}

// 7. ENVÍO DE PEDIDO A WHATSAPP
function finalizarPedidoWhatsApp() {
  if (carrito.length === 0) return;

  let mensaje = "¡Hola! Quiero realizar este pedido en Resiliente Moche:\n\n";
  let totalGeneral = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    totalGeneral += subtotal;
    mensaje += `• ${item.cantidad} und. x ${item.nombre} (S/ ${item.precio.toFixed(2)}) = S/ ${subtotal.toFixed(2)}\n`;
  });

  mensaje += `\n*TOTAL A PAGAR: S/ ${totalGeneral.toFixed(2)}*\n\n`;
  mensaje += "Quedo atento(a) para coordinar el punto de entrega en Miramar/Moche y el pago en efectivo o Yape. ¡Muchas gracias!";

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// 8. SINCRONIZACIÓN DE BOTONES DE FILTRO
function seleccionarCategoria(categoria) {
  categoriaActual = categoria;

  // Actualizamos visualmente qué botón tiene la clase .activo
  botonesFiltro.forEach(b => {
    if (b.getAttribute("data-categoria") === categoria) {
      b.classList.add("activo");
    } else {
      b.classList.remove("activo");
    }
  });

  renderizarProductos();
}

// 9. EVENTOS AL CARGAR EL DOM
document.addEventListener("DOMContentLoaded", () => {
  // Renderizar estado inicial
  renderizarProductos();
  actualizarCarritoHTML();

  // Enlace del botón flotante de WhatsApp
  const waFlotante = document.getElementById("wa-flotante");
  if (waFlotante) {
    waFlotante.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent("¡Hola! Quiero hacer una consulta sobre los productos de prevención en Resiliente Moche.")}`;
  }

  // Evento del buscador
  if (inputBuscador) {
    inputBuscador.addEventListener("input", (e) => {
      textoBusqueda = e.target.value.trim().toLowerCase();
      renderizarProductos();
    });
  }

  // Filtros de categoría tradicionales (botones tipo píldora)
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
      const cat = boton.getAttribute("data-categoria");
      seleccionarCategoria(cat);
    });
  });

  // Tarjetas visuales de categoría ("Compra por categoría")
  tarjetasCategoriaVisuales.forEach(tarjeta => {
    tarjeta.addEventListener("click", () => {
      const categoria = tarjeta.getAttribute("data-categoria");
      seleccionarCategoria(categoria);

      // Desplazamiento suave hacia el catálogo
      const seccionCatalogo = document.getElementById("catalogo");
      if (seccionCatalogo) {
        seccionCatalogo.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Vaciar carrito con confirmación
  btnVaciarCarrito.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas vaciar tu carrito de compras?")) {
      vaciarCarrito();
    }
  });

  // Finalizar compra por WhatsApp
  btnWhatsApp.addEventListener("click", finalizarPedidoWhatsApp);
});