
//crear
async function crearProducto() {
  const nombre = document.getElementById("nombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const descripcion = document.getElementById("descripcionProducto").value;
  const medidas = document.getElementById("medidasProducto").value;
  const imagen = document.getElementById("imagenProducto").files[0];
  const cantidad = document.getElementById("cantidadProducto").value;

  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("precio", precio);
  formData.append("descripcion", descripcion);
  formData.append("medidas", medidas);
  formData.append("imagen", imagen);
  formData.append("cantidad", cantidad);

  try {
    const response = await fetch("https://localhost:7042/api/Productos", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      alert("Producto creado exitosamente.");
      document.getElementById("form-admin").reset();
      cargarProductos(); // 🔁 recarga productos dinámicamente
    } else {
      alert("Error al crear el producto.");
    }
  } catch (error) {
    console.error("Error al enviar producto:", error);
  }
}

// Función para cargar productos en modo CRUD visual
async function cargarProductos() {
  try {
    const res = await fetch("https://localhost:7042/api/Productos");
    const productos = await res.json();

    const container = document.getElementById("productos-container");
    container.innerHTML = ""; // Limpia antes de cargar

    productos.forEach(producto => {
      const div = document.createElement("div");
      div.className = "producto-crud";
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px";
      div.style.borderRadius = "8px";
      div.style.backgroundColor = "#f5f5f5";

      div.innerHTML = `
          <label>Nombre</label>
         <input class="nombre" value="${producto.nombre}" data-original="${producto.nombre}">
           <label>Precio</label>
        <input class="precio" type="number" value="${producto.precio}" data-original="${producto.precio}">
          <label>Descripcion</label>
        <input class="descripcion" value="${producto.descripcion}" data-original="${producto.descripcion}">
          <label>Medidas</label>
        <input class="medidas" value="${producto.medidas}" data-original="${producto.medidas}">
        <label>Cantidad</label>
        <input class="cantidad" type="number" value="${producto.cantidad}" data-original="${producto.cantidad}">
          <label>Imagen</label>
        <img src="https://localhost:7042/${producto.imagenUrl}" width="100">
        <br>
        <button onclick="actualizarProducto(${producto.id}, this)">Actualizar</button>
        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Actualizar producto
async function actualizarProducto(id, btn) {
  const div = btn.parentElement;

  const nombreInput = div.querySelector(".nombre");
  const precioInput = div.querySelector(".precio");
  const cantidadInput = div.querySelector(".cantidad");
  const descripcionInput = div.querySelector(".descripcion");
  const medidasInput = div.querySelector(".medidas");
  const imagen = div.querySelector("img").src;

  const nombre = nombreInput.value;
  const precio = parseFloat(precioInput.value);
  const cantidad = parseInt(cantidadInput.value);
  const descripcion = descripcionInput.value;
  const medidas = medidasInput.value;
  const imagenUrl = imagen.replace("https://localhost:7042/", "");

  // Comparar con valores originales
  const sinCambios =
    nombre === nombreInput.dataset.original &&
    precio == precioInput.dataset.original &&
    cantidad == cantidadInput.dataset.original &&
    descripcion === descripcionInput.dataset.original &&
    medidas === medidasInput.dataset.original;

  if (sinCambios) {
    alert("No se realizaron cambios.");
    return;
  }

  const data = {
    id,
    nombre,
    precio,
    cantidad,
    descripcion,
    medidas,
    imagenUrl
  };

  try {
    const res = await fetch(`https://localhost:7042/api/Productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Producto actualizado correctamente.");
      cargarProductos(); // Recargar productos para mostrar actualizados
    } else {
      alert("Error al actualizar el producto.");
    }
  } catch (error) {
    console.error("Error actualizando:", error);
  }
}


// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  try {
    const res = await fetch(`https://localhost:7042/api/Productos/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Producto eliminado correctamente.");
      cargarProductos(); // Recargar CRUD
    } else {
      alert("Error al eliminar el producto.");
    }
  } catch (error) {
    console.error("Error eliminando:", error);
  }
}

// Cargar productos cuando inicia la página
window.addEventListener("DOMContentLoaded", cargarProductos);



//usuarios
  function mostrarSeccion(seccion) {
      document.getElementById('seccion-productos').classList.add('hidden');
      document.getElementById('seccion-usuarios').classList.add('hidden');

      if (seccion === 'productos') {
        document.getElementById('seccion-productos').classList.remove('hidden');
      } else if (seccion === 'usuarios') {
        document.getElementById('seccion-usuarios').classList.remove('hidden');
        obtenerUsuarios(); // carga los usuarios al mostrar la sección
      }
    }

   async function obtenerUsuarios() {
  try {
    const res = await fetch('https://localhost:7042/api/Usuario');
    const usuarios = await res.json();
    const contenedor = document.getElementById('usuarios-container');
    contenedor.innerHTML = ''; // Limpiar antes

    usuarios.forEach(usuario => {
      const div = document.createElement('div');
      div.className = "usuario-crud";
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px";
      div.style.borderRadius = "8px";
      div.style.backgroundColor = "#f0f8ff";

      div.innerHTML = `
        <label>Email</label>
        <input class="email" value="${usuario.email}" data-original="${usuario.email}">
        
        <label>Nombre</label>
        <input class="nombre" value="${usuario.nombre}" data-original="${usuario.nombre}">
        
        <label>Apellido</label>
        <input class="apellido" value="${usuario.apellido}" data-original="${usuario.apellido}">
        
        <label>Teléfono</label>
        <input class="telefono" value="${usuario.telefono}" data-original="${usuario.telefono}">
        
        <label>Rol</label>
        <select class="rol" data-original="${usuario.rol}">
          <option value="Administrador" ${usuario.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
          <option value="Usuario" ${usuario.rol === 'Usuario' ? 'selected' : ''}>Usuario</option>
        </select>

        <br><br>
        <button onclick="actualizarUsuario(${usuario.id}, this)">Actualizar</button>
        <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
      `;

      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
  }
}


async function actualizarUsuario(id, btn) {
  const div = btn.parentElement;

  const emailInput = div.querySelector(".email");
  const nombreInput = div.querySelector(".nombre");
  const apellidoInput = div.querySelector(".apellido");
  const telefonoInput = div.querySelector(".telefono");
  const rolSelect = div.querySelector(".rol");

  const email = emailInput.value;
  const nombre = nombreInput.value;
  const apellido = apellidoInput.value;
  const telefono = telefonoInput.value;
  const rolNuevo = rolSelect.value;

  const cambiosProhibidos =
    email !== emailInput.dataset.original ||
    nombre !== nombreInput.dataset.original ||
    apellido !== apellidoInput.dataset.original ||
    telefono !== telefonoInput.dataset.original;

  // Eliminar mensaje anterior si existe
  let mensajeError = div.querySelector(".mensaje-error");
  if (mensajeError) {
    mensajeError.remove();
  }

  if (cambiosProhibidos) {
    mensajeError = document.createElement("p");
    mensajeError.className = "mensaje-error";
    mensajeError.style.color = "red";
    mensajeError.style.fontWeight = "bold";
    mensajeError.style.marginTop = "5px";
    mensajeError.textContent = "⚠️ Solo puedes modificar el ROL del usuario.";
    div.appendChild(mensajeError);
    return;
  }

  const rolOriginal = rolSelect.dataset.original;
  if (rolNuevo === rolOriginal) {
    mensajeError = document.createElement("p");
    mensajeError.className = "mensaje-error";
    mensajeError.style.color = "black";
    mensajeError.style.fontWeight = "bold";
    mensajeError.style.marginTop = "1px";
    mensajeError.textContent = "No se realizaron cambios en el rol.";
    div.appendChild(mensajeError);
    return;
  }

  try {
    const response = await fetch(`https://localhost:7042/api/Usuario/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ rol: rolNuevo })
    });

    if (response.ok) {
      alert("✅ Rol actualizado correctamente.");
      obtenerUsuarios();
    } else {
      alert("❌ Error al actualizar el rol.");
    }
  } catch (error) {
    console.error("Error actualizando rol:", error);
    alert("❌ Ocurrió un error al intentar actualizar el rol.");
  }
}





    function eliminarUsuario(id) {
      if (confirm("¿Estás seguro de eliminar este usuario?")) {
        fetch(`https://localhost:7042/api/Usuario/${id}`, {
          method: 'DELETE'
        }).then(res => {
          if (res.ok) {
            alert("Usuario eliminado");
            obtenerUsuarios(); // recargar lista
          }
        });
      }
    }