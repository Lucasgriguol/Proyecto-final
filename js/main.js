// Variables
const carrito = document.getElementById("carrito");
const productosCarrito = document.getElementById("productos-carrito");
const totalPriceElement = document.getElementById("total-price");

// Recuperar el carrito desde el localStorage
let productosEnCarrito = JSON.parse(localStorage.getItem('carrito')) || {};

// Abrir el carrito
document.getElementById("abrir-carrito").addEventListener("click", function () {
    carrito.classList.add("abierto");
});

// Cerrar el carrito
document.getElementById("cerrar-carrito").addEventListener("click", function () {
    carrito.classList.remove("abierto");
});

// Agregar productos al carrito
const agregarAlCarrito = (producto, precio) => {
    if (productosEnCarrito[producto]) {
        productosEnCarrito[producto].cantidad += 1;
        productosEnCarrito[producto].precioTotal = productosEnCarrito[producto].cantidad * productosEnCarrito[producto].precioUnidad;
    } else {
        productosEnCarrito[producto] = {
            cantidad: 1,
            precioUnidad: parseFloat(precio),
            precioTotal: parseFloat(precio)
        };
    }

    // Guardar el carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    actualizarCarrito();

    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `El libro "${producto}" ha sido agregado al carrito.`,
        confirmButtonText: 'Cerrar'
    });
};

const actualizarCarrito = () => {
    // Limpiar el carrito
    productosCarrito.innerHTML = '';

    let total = 0;

    for (const producto in productosEnCarrito) {
        const { cantidad, precioTotal } = productosEnCarrito[producto];

        const productoElemento = document.createElement("div");
        productoElemento.classList.add("producto");

        productoElemento.innerHTML = `
            <h4>${producto} x${cantidad}</h4>
            <span>$${precioTotal.toFixed(2)}</span>
            <button class="eliminar-btn">Eliminar</button>
        `;

        productoElemento.querySelector(".eliminar-btn").addEventListener("click", function () {
            eliminarProducto(producto);
        });

        productosCarrito.appendChild(productoElemento);

        total += precioTotal;
    }

    // Actualizar el precio total
    totalPriceElement.textContent = total.toFixed(2);
};

// Eliminar productos del carrito
const eliminarProducto = (producto) => {
    if (productosEnCarrito[producto].cantidad > 1) {
        productosEnCarrito[producto].cantidad -= 1;
        productosEnCarrito[producto].precioTotal -= productosEnCarrito[producto].precioUnidad;
    } else {
        delete productosEnCarrito[producto];
    }

    // Guarda en el localStorage
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    actualizarCarrito();
};

// Agregar al carrito 
const botonesAgregarCarrito = document.querySelectorAll(".add-to-cart");

botonesAgregarCarrito.forEach((boton) => {
    boton.addEventListener("click", function () {
        const producto = this.closest(".card").getAttribute("data-producto");
        const precio = this.closest(".card").getAttribute("data-precio");

        agregarAlCarrito(producto, precio);
    });
});

document.getElementById("realizar-compra-btn").addEventListener("click", function () {
    if (Object.keys(productosEnCarrito).length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'No puedes realizar una compra si no has agregado productos al carrito.',
            confirmButtonText: 'Cerrar'
        });
    } else {
        document.getElementById("formulario-pago").style.display = "flex";
    }
});

// Cierra el formulario
document.getElementById("cerrar-formulario").addEventListener("click", function () {
    document.getElementById("formulario-pago").style.display = "none";
});

document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreTarjeta = document.getElementById("nombre-tarjeta").value;
    const numeroTarjeta = document.getElementById("numero-tarjeta").value;
    const fechaExpiracion = document.getElementById("fecha-expiracion").value;
    const codigoSeguridad = document.getElementById("codigo-seguridad").value;

    //Valida el nombre
    if (!nombreTarjeta || nombreTarjeta.trim() === "" || /[^a-zA-Z\s]/.test(nombreTarjeta)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingresa un nombre válido en la tarjeta.',
            confirmButtonText: 'Cerrar'
        });
        return;
    }    

    // Valida el número de la tarjeta 
    const numeroTarjetaRegex = /^\d{16}$/;
    if (!numeroTarjetaRegex.test(numeroTarjeta)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El número de tarjeta debe tener exactamente 16 dígitos.',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const fechaExpiracionRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    // Valida el formato
    if (!fechaExpiracionRegex.test(fechaExpiracion)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La fecha de expiración debe estar en el formato MM/AA.',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const [mes, anio] = fechaExpiracion.split("/").map(Number);

    // Fecha actual
    const fechaActual = new Date();
    const fechaExpiracionDate = new Date(`20${anio}-${mes < 10 ? '0' + mes : mes}-01`);

    if (fechaExpiracionDate < fechaActual) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tarjeta expirada.',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    // Valida el código de seguridad
    const codigoSeguridadRegex = /^\d{3}$/;
    if (!codigoSeguridadRegex.test(codigoSeguridad)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El código de seguridad (CVV) debe tener exactamente 3 dígitos.',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        text: 'Compra realizada con éxito.',
        confirmButtonText: 'Cerrar'
    });

    // Vacia el carrito despues de la compra
    productosEnCarrito = {};
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));
    actualizarCarrito();


    document.getElementById("formulario-pago").style.display = "none";


    document.getElementById("formulario").reset();
});

document.getElementById("search-bar").addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    filtrarProductos(searchText);
});

// Actualiza el carrito
window.addEventListener("load", function () {
    actualizarCarrito();
});
// Barra de busqueda
const filtrarProductos = (searchText) => {

    const productos = document.querySelectorAll('.card');

    const textoBusqueda = searchText.toLowerCase();

    productos.forEach((producto) => {
        const nombreProducto = producto.getAttribute('data-producto').toLowerCase();


        if (nombreProducto.includes(textoBusqueda)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
};