using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Permitir solicitudes CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend",
        policy => policy.WithOrigins("http://127.0.0.1:5500")
                         .AllowAnyHeader()
                         .AllowAnyMethod()
                         .AllowCredentials()
                         );


});

// Conexión a la base de datos (usa tu appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Otros servicios
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Tiempo de vida de la sesión
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Asegura que solo se envíe por HTTPS
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();



app.UseCors("PermitirFrontend");

app.UseHttpsRedirection();
// 2) Middleware: servir archivos estáticos desde wwwroot/
app.UseStaticFiles();
app.UseSession();
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles(); 

app.Run();