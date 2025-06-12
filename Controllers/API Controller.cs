using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.models;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuarioController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuario/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // POST: api/Usuario
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            // Verifica si ya existe
            var existe = await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email);
            if (existe)
            {
                return Conflict(new { mensaje = "El correo ya está registrado." });
            }

            // Encriptar la contraseña antes de guardar
            var hasher = new PasswordHasher<Usuario>();
            usuario.Password = hasher.HashPassword(usuario, usuario.Password);


            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario creado correctamente.", usuario });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginData)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == loginData.Email);

            if (usuario == null)
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas" });
            }

            var hasher = new PasswordHasher<Usuario>();
            var resultado = hasher.VerifyHashedPassword(usuario, usuario.Password, loginData.Password);

            if (resultado == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas" });
            }

            // Guardar info en sesión
            HttpContext.Session.SetInt32("usuarioId", usuario.Id);
            HttpContext.Session.SetString("usuarioNombre", usuario.Nombre);
            HttpContext.Session.SetString("usuarioApellido", usuario.Apellido);
            HttpContext.Session.SetString("usuarioEmail", usuario.Email);
            HttpContext.Session.SetString("usuarioTelefono", usuario.Telefono ?? "");
            HttpContext.Session.SetString("usuarioRol", usuario.Rol);


            return Ok(new
            {
                mensaje = "Sesión iniciada correctamente",
                usuario = new
                {
                    usuario.Id,
                    usuario.Nombre,
                    usuario.Apellido,
                    usuario.Telefono,
                    usuario.Email,
                    usuario.Rol
                }
            });
        }
        //sesion activa
        [HttpGet("sesion-activa")]
        public IActionResult VerificarSesion()
        {
            var id = HttpContext.Session.GetInt32("usuarioId");
            var email = HttpContext.Session.GetString("usuarioEmail");
            var nombre = HttpContext.Session.GetString("usuarioNombre");
            var apellido = HttpContext.Session.GetString("usuarioApellido");
            var telefono = HttpContext.Session.GetString("usuarioTelefono");
            var rol = HttpContext.Session.GetString("usuarioRol");

            if (id == null || string.IsNullOrEmpty(email))
            {
                return Unauthorized(new { mensaje = "No hay sesión activa" });
            }

            return Ok(new
            {
                id,
                email,
                nombre,
                apellido,
                telefono,
                rol
            });
        }
        //cerrar
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok(new { mensaje = "Sesión cerrada correctamente" });
        }


        // PUT: api/Usuario/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Usuario/{id}/rol
        [HttpPut("{id}/rol")]
        public async Task<IActionResult> ActualizarRol(int id, [FromBody] ActualizarRolDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            usuario.Rol = dto.Rol;

            _context.Entry(usuario).Property(u => u.Rol).IsModified = true;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Rol actualizado correctamente" });
        }

        // DELETE: api/Usuario/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
