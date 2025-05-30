const cartIcon = document.querySelector('.carro-icon');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartItemsContainer = document.querySelector('.cart-items');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const closeCart = document.querySelector('.close-cart');




const cart = [];

// activar o desactivar al hacer click
cartIcon.addEventListener('click', () => {
  cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';

  
 
});

// Cerrar el cart-dropdown al hacer clic en la "X"
closeCart.addEventListener('click', () => {
  cartDropdown.style.display = 'none';
});

// añadir al carrito
addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const title = card.querySelector('.card-title').textContent;
    const description = card.querySelector('.card-text').textContent;
    const imgSrc = card.querySelector('img').src;
    const price=card.querySelector('.price').textContent;

    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ title, description, imgSrc,price, quantity: 1 });
    }

    renderCart();
  });
});

// recuperar items
function renderCart() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartDropdown.querySelector('.empty').style.display = 'block';
  } else {
    cartDropdown.querySelector('.empty').style.display = 'none';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.title}">
        <div class="info">
          <div>${item.title}</div>
          <div>${item.description}</div>
          <div>${item.price}</div>
          <div class="quantity">
            <button class="btn btn-sm btn-outline-primary decrease">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-outline-primary increase">+</button>
          </div>
             <button class="btn btn-sm btn-outline-black remove">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);

      cartItem.querySelector('.decrease').addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(cart.indexOf(item), 1);
        }
        renderCart();
        
        
      });

      cartItem.querySelector('.increase').addEventListener('click', () => {
        item.quantity++;
        renderCart();
      });
     
      
  // Evento para eliminar el producto
  cartItem.querySelector('.remove').addEventListener('click', () => {
    cart.splice(cart.indexOf(item), 1);
    renderCart();
  });
    });
    
  }
  

  // Calcular y actualizar el total
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity), 0);
  document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(0)}`;

   // Actualizar el contador del carrito
   updateCartCount();

}
// Función para actualizar el contador del carrito
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  } else {
    // Si el contador no existe, créalo
    const newCartCount = document.createElement('span');
    newCartCount.classList.add('cart-count');
    newCartCount.textContent = totalItems;
    cartIcon.parentElement.appendChild(newCartCount);
  }
}

// Inicializar el contador al cargar la página
updateCartCount();




//form validacion

const email= document.getElementById("email")
const pass= document.getElementById("password")
const button= document.getElementById("button")
const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const type = pass.getAttribute("type") === "password" ? "text" : "password";
  pass.setAttribute("type", type);

  // Cambiar el ícono de Bootstrap Icons
  if (type === "password") {
    togglePassword.innerHTML = '<i class="bi bi-eye"></i>'; // Ojo abierto
  } else {
    togglePassword.innerHTML = '<i class="bi bi-eye-slash"></i>'; // Ojo cerrado
  }
});

button.addEventListener("click", e=>{
    e.preventDefault();
// Limpiar mensajes de error previos
clearError(email);
clearError(pass);

if (expresionEmail.test(email.value)) {
    console.log("correo valido")
} else{
  showError(email, "Ingrese un email valido, por favor..");
}

if (pass.value.length <6) {
  showError(pass, "La contraseña debe ser superior a 5 caracteres");
} 

if (expresionEmail.test(email.value) && pass.value.length >= 6) {
      const loginData = {
        email: email.value.trim(),
        password: pass.value.trim()
      };

      fetch("https://localhost:7256/api/Usuario/login", {
        method: "POST",
        credentials: "include", //
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData),
        credentials: 'include'  // <- Aquí se agrego para enviar cookies
      })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(result => {
     if (result.status === 200) {
        
       const usuario = result.body.usuario;

        // Mostrar datos del usuario
        document.getElementById("userName").textContent = usuario.nombre + " " + usuario.apellido;
        document.getElementById("userEmail").textContent = usuario.email;
        document.getElementById("userTelefono").textContent = "Tel: " + usuario.telefono;


      

        // Ocultar botones de login y registro
        document.getElementById("button1").classList.add("d-none");
        document.getElementById("button").classList.add("d-none");
        document.getElementById("email").classList.add("d-none");
         document.getElementById("email4").classList.add("d-none");
          document.getElementById("password").classList.add("d-none")
           document.getElementById("password4").classList.add("d-none")
           document.getElementById("togglePassword").classList.add("d-none")
           document.getElementById("ocultar").classList.add("d-none")
          
           
           
  // Ocultar título del login y mostrar título del perfil
  document.getElementById("loginModalLabel")?.classList.add("d-none");
  document.getElementById("tituloPerfil")?.classList.remove("d-none");

      
 document.getElementById("userProfile").classList.remove("d-none");
       


        // Resetear formulario de login
        document.querySelector("#loginModal form").reset();
      } else {
        showError(email, result.body.mensaje || "Credenciales inválidas");
      }
    })
    .catch(error => {
      console.error("Error al iniciar sesión:", error);
    });
  }

  
});



const email1= document.getElementById("email1")
const pass1= document.getElementById("password1")
const button1= document.getElementById("button1")
const expresionEmail1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nombre= document.getElementById("nombre")
const apellido= document.getElementById("apellido")
const telefono= document.getElementById("telefono")
const togglePassword1 = document.getElementById("togglePassword1");

togglePassword1.addEventListener("click", () => {
  const type = pass1.getAttribute("type") === "password" ? "text" : "password";
  pass1.setAttribute("type", type);

  // Cambiar el ícono de Bootstrap Icons
  if (type === "password") {
    togglePassword1.innerHTML = '<i class="bi bi-eye"></i>'; // Ojo abierto
  } else {
    togglePassword1.innerHTML = '<i class="bi bi-eye-slash"></i>'; // Ojo cerrado
  }
});

button1.addEventListener("click", async (e) => {
  e.preventDefault();

  clearError(email1);
  clearError(pass1);
  clearError(nombre);
  clearError(apellido);
  clearError(telefono);
  let valid = true;

  // Validación frontend
  if (!expresionEmail1.test(email1.value)) {
    showError(email1, "Ingrese un email válido, por favor.");
    valid = false;
  }

  if (pass1.value.length < 6) {
    showError(pass1, "La contraseña debe ser superior a 5 caracteres");
    valid = false;
  }

  if(nombre.value.length <2){
    showError(nombre, "complete su nombre por favor");
    valid = false;
  }
  if(apellido.value.length <3){
    showError(apellido, "complete su apellido por favor");
    valid = false;
  }
  if(telefono.value.length <6){
    showError(telefono, "complete su telefono por favor");
    valid = false;
  }

  if (!valid) return;

  // Enviar al backend
  const usuario = {
    email: email1.value.trim(),
    password: pass1.value.trim(),
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    telefono: telefono.value.trim()
  };

 try {
    const response = await fetch('https://localhost:7256/api/Usuario', {
      method: 'POST',
      credentials: "include", //
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.mensaje || 'Usuario registrado correctamente.');

      // Ocultar formulario de registro
      document.getElementById("button1").classList.add("d-none");
      document.getElementById("button").classList.add("d-none");
      document.getElementById("email").classList.add("d-none");
      document.getElementById("email4").classList.add("d-none");
      document.getElementById("password").classList.add("d-none");
      document.getElementById("password4").classList.add("d-none");
      document.getElementById("togglePassword").classList.add("d-none");
      document.getElementById("ocultar").classList.add("d-none");

      // Ocultar título del login y mostrar título del perfil
      document.getElementById("loginModalLabel")?.classList.add("d-none");
      document.getElementById("tituloPerfil")?.classList.remove("d-none");

      // Mostrar perfil del usuario registrado
      document.getElementById("userProfile").classList.remove("d-none");
      document.getElementById("userName").textContent = usuario.nombre + " " + usuario.apellido;
      document.getElementById("userEmail").textContent = usuario.email;
      document.getElementById("userTelefono").textContent = "Tel: " + usuario.telefono;

      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('Modalregister'));
      if (modal) modal.hide();

      // Limpiar formulario de registro
      document.querySelector("#Modalregister form")?.reset();
    } else {
      showError(email1, data.mensaje || "Error al registrar el usuario.");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    showError(email1, "No se pudo conectar con el servidor.");
  }
});
////sesion
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://localhost:7256/api/Usuario/sesion-activa", {
      credentials: "include" // muy importante para que la sesión viaje
    });

    if (response.ok) {
      const data = await response.json();
      const userProfile = document.getElementById("userProfile");

      // Mostrar la vista de perfil
      document.getElementById("userName").innerText = `${data.nombre} ${data.apellido}`;
      document.getElementById("userEmail").innerText = data.email;
      document.getElementById("userTelefono").innerText = data.telefono || "Sin teléfono";
      
      userProfile.classList.remove("d-none");

      // Opcional: ocultar botón de login en navbar
      document.querySelector(".cuenta").parentElement.classList.add("d-none");
    }

  } catch (error) {
    console.error("Error al verificar sesión:", error);
  }
});



function showError(input, message) {
  // Limpiar errores previos
  clearError(input);

  // Crear el mensaje de error
  const errorElement = document.createElement("small");
  errorElement.className = "error-message text-danger mt-1 d-block"; // Clases de Bootstrap
  errorElement.textContent = message;

  // Insertar el mensaje de error después del campo de entrada o del input-group
  const inputGroup = input.closest(".input-group"); // Buscar el input-group padre (si existe)
  if (inputGroup) {
    // Si el campo está dentro de un input-group, insertar después del input-group
    inputGroup.insertAdjacentElement("afterend", errorElement);
  } else {
    // Si no hay input-group, insertar directamente después del campo de entrada
    input.insertAdjacentElement("afterend", errorElement);
  }
}
function clearError(input) {
  const inputGroup = input.closest(".input-group"); // Buscar el input-group padre (si existe)
  let errorElement;

  if (inputGroup) {
    // Si el campo está dentro de un input-group, buscar el mensaje de error después del input-group
    errorElement = inputGroup.nextElementSibling;
  } else {
    // Si no hay input-group, buscar el mensaje de error directamente después del campo de entrada
    errorElement = input.nextElementSibling;
  }

  // Eliminar el mensaje de error si existe
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.remove();
  }
}



