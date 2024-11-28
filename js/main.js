// Variables para el carrito y productos
const carrito = document.getElementById("carrito");
const productosCarrito = document.getElementById("productos-carrito");
const totalPriceElement = document.getElementById("total-price");

// Recuperar el carrito desde el localStorage (si existe)
let productosEnCarrito = JSON.parse(localStorage.getItem('carrito')) || {};

// Abrir el carrito al hacer clic en "Abrir carrito"
document.getElementById("abrir-carrito").addEventListener("click", function () {
    carrito.classList.add("abierto");
});

// Cerrar el carrito al hacer clic en "Cerrar carrito"
document.getElementById("cerrar-carrito").addEventListener("click", function () {
    carrito.classList.remove("abierto");
});

// Función para agregar productos al carrito
const agregarAlCarrito = (producto, precio) => {
    // Si el producto ya existe en el carrito, aumentar la cantidad
    if (productosEnCarrito[producto]) {
        productosEnCarrito[producto].cantidad += 1;
        productosEnCarrito[producto].precioTotal = productosEnCarrito[producto].cantidad * productosEnCarrito[producto].precioUnidad;
    } else {
        // Si no, agregarlo con cantidad 1
        productosEnCarrito[producto] = {
            cantidad: 1,
            precioUnidad: parseFloat(precio),
            precioTotal: parseFloat(precio)
        };
    }

    // Guardar el carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    // Actualizar el carrito con los nuevos datos
    actualizarCarrito();

    // Mostrar un mensaje con SweetAlert2
    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `El libro "${producto}" ha sido agregado al carrito.`,
        confirmButtonText: 'Cerrar'
    });
};

// Función para actualizar el carrito y mostrar la cantidad
const actualizarCarrito = () => {
    // Limpiar el carrito
    productosCarrito.innerHTML = '';

    let total = 0; // Variable para el total

    // Recorrer todos los productos en el carrito
    for (const producto in productosEnCarrito) {
        const { cantidad, precioTotal } = productosEnCarrito[producto];

        // Crear un nuevo elemento para el producto
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto");

        // Insertar la información del producto
        productoElemento.innerHTML = `
            <h4>${producto} x${cantidad}</h4>
            <span>$${precioTotal.toFixed(2)}</span>
            <button class="eliminar-btn">Eliminar</button>
        `;

        // Evento para eliminar el producto
        productoElemento.querySelector(".eliminar-btn").addEventListener("click", function () {
            eliminarProducto(producto);
        });

        // Agregar el producto al carrito
        productosCarrito.appendChild(productoElemento);

        // Sumar al total del carrito
        total += precioTotal;
    }

    // Actualizar el precio total
    totalPriceElement.textContent = total.toFixed(2);
};

// Función para eliminar productos del carrito
const eliminarProducto = (producto) => {
    // Si hay más de 1 unidad, disminuimos la cantidad
    if (productosEnCarrito[producto].cantidad > 1) {
        productosEnCarrito[producto].cantidad -= 1;
        productosEnCarrito[producto].precioTotal -= productosEnCarrito[producto].precioUnidad;
    } else {
        // Si es la última unidad, eliminamos el producto
        delete productosEnCarrito[producto];
    }

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    // Actualizar el carrito
    actualizarCarrito();
};

// Asignar el evento de agregar al carrito a los botones "Añadir al carrito"
const botonesAgregarCarrito = document.querySelectorAll(".add-to-cart");

botonesAgregarCarrito.forEach((boton) => {
    boton.addEventListener("click", function () {
        // Obtener el nombre y el precio del producto
        const producto = this.closest(".card").getAttribute("data-producto");
        const precio = this.closest(".card").getAttribute("data-precio");

        // Llamar a la función para agregar el producto al carrito
        agregarAlCarrito(producto, precio);
    });
});

// Mostrar formulario de pago al hacer clic en "Realizar compra"
document.getElementById("realizar-compra-btn").addEventListener("click", function () {
    // Mostrar el formulario de pago
    document.getElementById("formulario-pago").style.display = "flex";
});

// Cerrar formulario de pago
document.getElementById("cerrar-formulario").addEventListener("click", function () {
    // Ocultar el formulario de pago
    document.getElementById("formulario-pago").style.display = "none";
});

// Simular la compra y mostrar mensaje de éxito
document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío real del formulario
    
    // Obtener los datos del formulario
    const nombreTarjeta = document.getElementById("nombre-tarjeta").value;
    const numeroTarjeta = document.getElementById("numero-tarjeta").value;
    const fechaExpiracion = document.getElementById("fecha-expiracion").value;
    const codigoSeguridad = document.getElementById("codigo-seguridad").value;
    
    // Simular validación de los datos
    if (nombreTarjeta && numeroTarjeta && fechaExpiracion && codigoSeguridad) {
        // Crear una promesa para simular el proceso de compra
        realizarCompra().then(() => {
            Swal.fire({
                icon: 'success',
                title: '¡Compra realizada con éxito!',
                text: 'La compra ha sido procesada correctamente.',
                confirmButtonText: 'Cerrar'
            });

            // Vaciar el carrito
            productosEnCarrito = {}; // Vaciar carrito
            actualizarCarrito(); // Actualizar la vista del carrito (vaciarlo visualmente)
            
            // Cerrar el formulario de pago
            document.getElementById("formulario-pago").style.display = "none";
        }).catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
                confirmButtonText: 'Cerrar'
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            confirmButtonText: 'Cerrar'
        });
    }
});

// Función que simula el proceso de compra y devuelve una promesa
function realizarCompra() {
    return new Promise((resolve, reject) => {
        // Simulamos un retraso en el procesamiento de la compra (0.5 segundos)
        setTimeout(() => {
            const success = Math.random() > 0.15; // 85% de probabilidades de éxito

            if (success) {
                resolve(); // Si es exitoso, se resuelve la promesa
            } else {
                reject('Hubo un error procesando la compra. Intenta nuevamente.'); // Si falla, se rechaza la promesa
            }
        }, 500); // Simulamos un retraso de 0.5 segundos
    });
}
// Agregar evento para la barra de búsqueda
document.getElementById("search-bar").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();  // Convertir el texto a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
    filtrarProductos(searchText);
});

// Función para filtrar los productos
const filtrarProductos = (searchText) => {
    // Obtener todas las tarjetas de productos
    const tarjetasProductos = document.querySelectorAll(".card");
    
    // Recorrer las tarjetas y mostrar u ocultar según el nombre del producto
    tarjetasProductos.forEach((card) => {
        const nombreProducto = card.querySelector("h3").textContent.toLowerCase();  // Obtener el nombre del producto en minúsculas
        
        if (nombreProducto.includes(searchText)) {
            card.style.display = "block";  // Mostrar tarjeta si coincide con el texto de búsqueda
        } else {
            card.style.display = "none";  // Ocultar tarjeta si no coincide
        }
    });
};


