import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

const productosSeed = [
  {nombre:"Camiseta Algodón Premium",descripcion:"Camiseta de algodón orgánico de alta calidad. Corte moderno y cómodo ideal para el día a día.",categoria:"camisetas",talla:"M",genero:"unisex",precio:349,stock:50,imagenUrl:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"},
  {nombre:"Pantalón Vaquero Clásico",descripcion:"Pantalón vaquero de corte recto. Mezclilla premium con elastano para mayor comodidad.",categoria:"pantalones",talla:"L",genero:"hombre",precio:699,stock:35,imagenUrl:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"},
  {nombre:"Vestido Floral Verano",descripcion:"Vestido ligero con estampado floral. Perfecto para días cálidos. Tela suave y fresca.",categoria:"vestidos",talla:"S",genero:"mujer",precio:549,stock:25,imagenUrl:"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"},
  {nombre:"Chaqueta Cuero Moderna",descripcion:"Chaqueta de cuero sintético de alta calidad. Diseño moderno con forro interior.",categoria:"chaquetas",talla:"M",genero:"hombre",precio:1299,stock:15,imagenUrl:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"},
  {nombre:"Zapatillas Deportivas Urbanas",descripcion:"Zapatillas con amortiguación avanzada. Suela antideslizante y diseño transpirable.",categoria:"zapatos",talla:"M",genero:"unisex",precio:899,stock:40,imagenUrl:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
  {nombre:"Camiseta Deportiva Dry-Fit",descripcion:"Camiseta transpirable de secado rápido. Ideal para entrenamiento y actividades al aire libre.",categoria:"deportivo",talla:"L",genero:"hombre",precio:399,stock:60,imagenUrl:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"},
  {nombre:"Pantalón Jogger Casual",descripcion:"Pantalón jogger de tela suave con puños elásticos. Cómodo y moderno.",categoria:"pantalones",talla:"M",genero:"unisex",precio:499,stock:45,imagenUrl:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400"},
  {nombre:"Vestido Elegante Noche",descripcion:"Vestido de gala con detalles en pedrería. Tela satinada de alta calidad.",categoria:"vestidos",talla:"M",genero:"mujer",precio:1599,stock:10,imagenUrl:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"},
  {nombre:"Chaqueta Deportiva Impermeable",descripcion:"Chaqueta ligera resistente al agua. Ideal para running y actividades al aire libre.",categoria:"chaquetas",talla:"L",genero:"unisex",precio:999,stock:30,imagenUrl:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"},
  {nombre:"Zapatos Casuales Cuero",descripcion:"Zapatos de cuero genuino. Diseño clásico y elegante para uso diario.",categoria:"zapatos",talla:"M",genero:"hombre",precio:1199,stock:20,imagenUrl:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400"},
  {nombre:"Camiseta Básica Algodón",descripcion:"Camiseta básica de algodón. Imprescindible en cualquier guardarropa.",categoria:"camisetas",talla:"S",genero:"mujer",precio:199,stock:100,imagenUrl:"https://images.unsplash.com/photo-1503341733017-1901578f9f1a?w=400"},
  {nombre:"Pantalón Formal Slim Fit",descripcion:"Pantalón de vestir corte slim fit. Tela de lino y algodón.",categoria:"pantalones",talla:"M",genero:"hombre",precio:799,stock:25,imagenUrl:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"},
  {nombre:"Vestido Casual Primavera",descripcion:"Vestido casual con corte en A. Ideal para el día a día.",categoria:"vestidos",talla:"L",genero:"mujer",precio:449,stock:30,imagenUrl:"https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400"},
  {nombre:"Leggings Deportivos",descripcion:"Leggings de compresión para entrenamiento. Tela elástica y transpirable.",categoria:"deportivo",talla:"M",genero:"mujer",precio:449,stock:55,imagenUrl:"https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400"},
  {nombre:"Chaqueta Mezclilla Clásica",descripcion:"Chaqueta de mezclilla clásica. Un básico atemporal para cualquier ocasión.",categoria:"chaquetas",talla:"M",genero:"unisex",precio:749,stock:20,imagenUrl:"https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400"},
  {nombre:"Zapatos Deportivos Running",descripcion:"Zapatillas profesionales para running. Tecnología de amortiguación avanzada.",categoria:"zapatos",talla:"L",genero:"hombre",precio:1399,stock:18,imagenUrl:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
  {nombre:"Camiseta Manga Larga",descripcion:"Camiseta térmica de manga larga. Perfecta para capas en clima frío.",categoria:"camisetas",talla:"L",genero:"hombre",precio:299,stock:70,imagenUrl:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"},
  {nombre:"Pantalón Corto Deportivo",descripcion:"Short deportivo ligero con bolsillos. Ideal para entrenamiento.",categoria:"deportivo",talla:"M",genero:"unisex",precio:299,stock:80,imagenUrl:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"},
  {nombre:"Gorra Urbana Snapback",descripcion:"Gorra estilo snapback con bordado. Ajustable y transpirable.",categoria:"accesorios",talla:"M",genero:"unisex",precio:199,stock:90,imagenUrl:"https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400"},
  {nombre:"Bufanda Tejida Invernal",descripcion:"Bufanda de lana tejida a mano. Suave y cálida para el invierno.",categoria:"accesorios",talla:"M",genero:"unisex",precio:249,stock:40,imagenUrl:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"},
  {nombre:"Camiseta Oversize Holgada",descripcion:"Camiseta de corte oversize. Tendencia urbana y máxima comodidad.",categoria:"camisetas",talla:"XL",genero:"unisex",precio:379,stock:45,imagenUrl:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"},
  {nombre:"Pantalón Cargo Militar",descripcion:"Pantalón cargo con múltiples bolsillos. Tela resistente y duradera.",categoria:"pantalones",talla:"L",genero:"hombre",precio:649,stock:28,imagenUrl:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"},
  {nombre:"Conjunto Deportivo 2 Piezas",descripcion:"Conjunto deportivo de sudadera y jogger. Algodón fleece de alta calidad.",categoria:"deportivo",talla:"L",genero:"hombre",precio:899,stock:22,imagenUrl:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400"},
  {nombre:"Bolso Bandolera Cuero",descripcion:"Bolso bandolera de cuero genuino. Compartimentos para organización.",categoria:"accesorios",talla:"M",genero:"mujer",precio:549,stock:35,imagenUrl:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"},
  {nombre:"Zapatos Tacón Elegantes",descripcion:"Zapatos de tacón con punta cerrada. Diseño elegante para ocasiones especiales.",categoria:"zapatos",talla:"S",genero:"mujer",precio:999,stock:15,imagenUrl:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"},
];

db.reset();

db.create("usuarios", {
  nombre: "Vendedor Demo", email: "vendedor@marketplace.com",
  passwordHash: hashPassword("demo123"), rol: "vendedor",
  fechaRegistro: new Date().toISOString(),
});

db.create("usuarios", {
  nombre: "Comprador Demo", email: "comprador@marketplace.com",
  passwordHash: hashPassword("demo123"), rol: "comprador",
  fechaRegistro: new Date().toISOString(),
});

for (const p of productosSeed) {
  db.create("productos", {
    ...p, vendedorId: 1, fechaPublicacion: new Date().toISOString(),
  });
}

console.log(`✅ Seed completado: 2 usuarios + ${productosSeed.length} productos`);
