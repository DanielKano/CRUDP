document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript cargado correctamente!");
    cargarEnvios();
});

async function agregarEnvio() {
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !direccion || !estado || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const respuesta = await fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, direccion, estado, descripcion })
        });

        if (respuesta.ok) {
            alert("Envío agregado correctamente");
            cargarEnvios();  

            // **LIMPIAR LOS CAMPOS DESPUÉS DE AGREGAR UN ENVÍO**
            document.getElementById("nombre").value = "";
            document.getElementById("direccion").value = "";
            document.getElementById("estado").value = "";
            document.getElementById("descripcion").value = "";
        } else {
            alert("Error al agregar el envío");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}


// Función para cargar los envíos en la tabla
async function cargarEnvios() {
    try {
        const respuesta = await fetch("/envios");
        if (!respuesta.ok) throw new Error("Error al obtener los envíos");

        const data = await respuesta.json();
        console.log("Datos recibidos:", data); // Depuración

        let tabla = document.getElementById("tablaEnvios");
        tabla.innerHTML = ""; // Limpiar tabla antes de agregar filas nuevas

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No hay envíos en la base de datos.");
            return;
        }

        data.forEach(envio => {
            let fila = `
                <tr>
                    <td>${envio.id || "N/A"}</td>
                    <td>${envio.nombre || "N/A"}</td>
                    <td>${envio.direccion || "N/A"}</td>
                    <td>${envio.estado || "N/A"}</td>
                    <td>${envio.descripcion || "N/A"}</td>
                    <td><button class="btn-eliminar" data-id="${envio.id}">Eliminar</button></td>
                </tr>`;
            tabla.insertAdjacentHTML("beforeend", fila);
        });

        // Asignar eventos a los botones de eliminar
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", () => {
                eliminarEnvio(btn.getAttribute("data-id"));
            });
        });

    } catch (error) {
        console.error("Error al cargar envíos:", error);
    }
}

// Función para eliminar un envío
async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    try {
        const respuesta = await fetch(`/delete/${id}`, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Envío eliminado");
            cargarEnvios();
        } else {
            alert("Error al eliminar el envío");
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// Función para actualizar un campo específico en la tabla
async function actualizarEnvio(id, columna, valor) {
    try {
        const respuesta = await fetch(`/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [columna]: valor })
        });

        if (!respuesta.ok) {
            alert("Error al actualizar");
        }
    } catch (error) {
        console.error("Error en la actualización:", error);
    }
}
