export function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export const ICON_KEYWORDS: Record<string, string> = {
  // 💰 Finanzas y dinero
  wallet: 'billetera, cartera, finanzas, gastos, dinero',
  'cash': 'billete, efectivo, dinero, pago',
  'currency-usd': 'dinero, dólar, ahorro, ingreso',
  'piggy-bank': 'ahorro, guardar, alcancía',
  'credit-card': 'tarjeta, crédito, débito, pagos',
  school: 'banco, institución, impuestos, préstamos',
  'chart-pie': 'gráfica, resumen, análisis, reporte',
  'chart-bar': 'barras, estadística, gráfico, progreso',
  calculator: 'cálculo, contabilidad, matemáticas',
  'circle-multiple': 'monedas, dinero, suelto, cambio',
  receipt: 'factura, recibo, comprobante, ticket',

  // 🛒 Compras
  'cart': 'carro, carrito, pedidos, compras',
  'shopping': 'bolsa, mercado, supermercado, tienda',
  'cart-plus': 'agregar, compra, añadir, supermercado',
  'cart-arrow-down': 'eliminar, quitar, descuento, compra',
  gift: 'regalo, obsequio, cumpleaños',
  box: 'caja, envíos, paquetes, objetos',
  'tag': 'etiqueta, precio, descuento, oferta',

  // 🍔 Comida y restaurantes
  'silverware-fork-knife': 'comida, restaurante, alimentos, cocina',
  coffee: 'café, bebida, desayuno, comida',
  apple: 'fruta, saludable, dieta, comida',
  'bottle-wine': 'vino, bebida, celebración',
  pizza: 'pizza, comida rápida, restaurante',

  // 🏠 Hogar y servicios
  home: 'hogar, casa, vivienda, alquiler',
  'sofa': 'sala, mueble, hogar',
  'lightbulb': 'energía, electricidad, servicio',
  bolt: 'energía, luz, electricidad, servicio',
  fire: 'gas, calor, cocina, energía',
  water: 'agua, servicio, limpieza, hogar',
  'broom': 'limpieza, hogar, aseo',
  'hammer': 'reparación, herramientas, mantenimiento',
  'tools': 'arreglar, mantenimiento, bricolaje',
  'trash-can': 'basura, limpieza, eliminar',
  'leaf': 'ecología, natural, verde, ahorro',

  // 🚗 Transporte
  car: 'auto, transporte, gasolina, vehículo',
  bus: 'bus, transporte, colectivo',
  'gas-station': 'gasolina, combustible, gasto',
  airplane: 'viaje, avión, vuelo, transporte',
  train: 'tren, transporte, viaje',
  'bicycle': 'bicicleta, transporte, ejercicio',

  // 💼 Trabajo y educación
  'briefcase': 'trabajo, oficina, empleo, empresa',
  'medical-bag': 'salud, medicina, seguro',
  laptop: 'computadora, trabajo, estudio, oficina',
  book: 'libro, estudio, educación, lectura',
  pen: 'escribir, notas, trabajo, firma',
  'account-school': 'estudios, universidad, logro',

  // ❤️ Familia y bienestar
  account: 'usuario, persona, perfil, personal',
  'account-multiple': 'familia, grupo, comunidad, equipo',
  heart: 'salud, bienestar, preferido, amor',
  baby: 'bebé, hijo, familia, cuidado',
  paw: 'mascota, animal, veterinario, perrija',
  bed: 'descanso, dormir, hotel, viaje',

  // 📅 Organización y tiempo
  clock: 'tiempo, hora, recordatorio, calendario',
  calendar: 'fecha, evento, agenda, planificar',
  bell: 'alarma, notificación, aviso, recordatorio',
  clipboard: 'tareas, lista, pendientes, notas',

  // 📨 Comunicación
  inbox: 'bandeja, recibir, ingresos, registrar',
  'email': 'correo, factura, recibo, mensaje',
  phone: 'llamada, contacto, comunicación, teléfono',
  'comment-multiple': 'chat, conversación, mensajes, comunicación',
  web: 'internet, global, mundial, red',
  wifi: 'conexión, red, servicio, internet',

  // 🌎 Otros
  camera: 'foto, cámara, recuerdo',
  music: 'música, entretenimiento, diversión',
  film: 'película, video, entretenimiento',
  star: 'favorito, destacado, mejor',
  trophy: 'logro, meta, éxito, recompensa',
  run: 'deporte, ejercicio, salud, actividad',
  'basket': 'compras, alimentos, supermercado',
  'tshirt-v-outline': 'ropa, vestimenta, tienda, moda',
  'tree': 'naturaleza, verde, ecología',
};