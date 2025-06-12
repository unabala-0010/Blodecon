﻿namespace backend.models
{
    public class ProductoDTO
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Cantidad { get; set; }
        public string Medidas { get; set; }
        public IFormFile Imagen { get; set; }
    }
}
