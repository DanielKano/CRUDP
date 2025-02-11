document.addEventListener("DOMContentLoaded", cargarEnvios); // Cargar envíos al iniciar la página

// Función para agregar un nuevo envío
async function agregarEnvio() {
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const estado = document.getElementById("estado").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!nombre || !direccion || !estado || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const respuesta = await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, direccion, estado, descripcion })
    });

    if (respuesta.ok) {
        alert("Envío agregado correctamente");
        setTimeout(cargarEnvios, 500);  // Esperar 0.5 segundos antes de actualizar
    } else {
        alert("Error al agregar el envío");
    }
}

// Función para cargar los envíos en la tabla
async function cargarEnvios() {
    try {
        const respuesta = await fetch("/envios");  // Verifica que esta ruta es correcta
        const data = await respuesta.json();

        console.log("Datos recibidos:", data); // Depuración en consola

        let tabla = document.getElementById("tablaEnvios");
        tabla.innerHTML = "";  // Limpia la tabla antes de agregar nuevos datos

        data.forEach(envio => {
            let fila = `
                <tr>
                    <td>${envio.id}</td>
                    <td>${envio.nombre}</td>
                    <td>${envio.direccion}</td>
                    <td>${envio.estado}</td>
                    <td>${envio.descripcion}</td>
                    <td><button onclick="eliminarEnvio(${envio.id})">Eliminar</button></td>
                </tr>`;
            tabla.insertAdjacentHTML("beforeend", fila);
        });

    } catch (error) {
        console.error("Error al cargar envíos:", error);
    }
}

// Función para eliminar un envío
async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    const respuesta = await fetch(`/delete/${id}`, {
        method: "DELETE"
    });

    if (respuesta.ok) {
        alert("Envío eliminado");
        cargarEnvios();
    } else {
        alert("Error al eliminar el envío");
    }
}

// Función para actualizar un campo específico en la tabla
async function actualizarEnvio(id, columna, valor) {
    const datos = { [columna]: valor };

    const respuesta = await fetch(`/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        alert("Error al actualizar");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript cargado correctamente!");
});
