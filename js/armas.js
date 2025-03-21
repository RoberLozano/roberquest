//requiere inventario.js


const armasCuerpoACuerpo = new Map();

armasCuerpoACuerpo.set("Hacha de combate", new Arma("Hacha de combate", 1.0, 100, new Daño("1D8+2", "L")));
armasCuerpoACuerpo.set("Hacha de mano", new Arma("Hacha de mano", 0.5, 25, new Daño("1D6+1", "L")));
armasCuerpoACuerpo.set("Hacha de combate", new Arma("Hacha de combate", 1.0, 100, new Daño("1D8+2", "L")));
armasCuerpoACuerpo.set("Gran hacha", new Arma("Gran hacha", 2.0, 120, new Daño("2D6+2", "L")));
armasCuerpoACuerpo.set("Alabarda", new Arma("Alabarda", 3.0, 250, new Daño("3D6", "L"), new Daño("3D6", "P")));
armasCuerpoACuerpo.set("Hacha danesa", new Arma("Hacha danesa", 2.5, 150, new Daño("3D6", "L")));
armasCuerpoACuerpo.set("Daga", new Arma("Daga", 0.5, 33, new Daño("1D4+2", "L"), new Daño("1D4+2", "P")));
armasCuerpoACuerpo.set("Cuchillo", new Arma("Cuchillo", 0.2, 10, new Daño("1D3 + 1", "L")));
armasCuerpoACuerpo.set("Main gauche", new Arma("Main gauche", 0.5, 55, new Daño("1D4+2", "P")));
armasCuerpoACuerpo.set("Sai", new Arma("Sai", 1.0, 60, new Daño("1D6", "C")));
armasCuerpoACuerpo.set("Bola y cadena", new Arma("Bola y cadena", 2.0, 250, new Daño("1D10+1", "C")));
armasCuerpoACuerpo.set("Triple cadena", new Arma("Triple cadena", 2.0, 240, new Daño("1D6+2", "C")));
armasCuerpoACuerpo.set("Maza de grano", new Arma("Maza de grano", 1.0, 10, new Daño("1D6", "C")));
armasCuerpoACuerpo.set("Maza campesina militar", new Arma("Maza campesina militar", 2.5, 240, new Daño("2D6 + 2", "C")));
armasCuerpoACuerpo.set("Martillo de guerra", new Arma("Martillo de guerra", 2.0, 150, new Daño("1D6+2", "C"), new Daño("1D6+2", "P")));
armasCuerpoACuerpo.set("Gran martillo", new Arma("Gran martillo", 2.5, 250, new Daño("2D6+2", "C"), new Daño("2D6+2", "P")));
armasCuerpoACuerpo.set("Maza pesada", new Arma("Maza pesada", 2.5, 220, new Daño("1D10", "C")));
armasCuerpoACuerpo.set("Maza ligera", new Arma("Maza ligera", 1.0, 100, new Daño("1D8", "C")));
armasCuerpoACuerpo.set("Palo de madera", new Arma("Palo de madera", 0.5, 4, new Daño("1D6", "C")));
armasCuerpoACuerpo.set("Vara", new Arma("Vara", 0.5, 10, new Daño("1D6", "C")));
armasCuerpoACuerpo.set("Maza pesada", new Arma("Maza pesada", 2.5, 220, new Daño("1D10", "C")));
armasCuerpoACuerpo.set("Cayado", new Arma("Cayado", 1.5, 20, new Daño("1D8", "C")));
armasCuerpoACuerpo.set("Garrote", new Arma("Garrote", 2.5, 150, new Daño("1D10+2", "C")));
armasCuerpoACuerpo.set("Garrote de guerra", new Arma("Garrote de guerra", 4.0, 150, new Daño("2D6+2", "C")));
armasCuerpoACuerpo.set("Garrote de trabajo", new Arma("Garrote de trabajo", 4.0, 150, new Daño("2D6+2", "C")));
armasCuerpoACuerpo.set("Garrote de troll", new Arma("Garrote de troll", 5.5, 50, new Daño("2D8", "C")));
armasCuerpoACuerpo.set("Rapier", new Arma("Rapier", 1.0, 100, new Daño("1D6+1", "P")));
armasCuerpoACuerpo.set("Kukri", new Arma("Kukri", 0.5, 120, new Daño("1D4+3", "L")));
armasCuerpoACuerpo.set("Gladius", new Arma("Gladius", 1.0, 100, new Daño("1D6+1", "L"), new Daño("1D6+1", "P")));
armasCuerpoACuerpo.set("Pilum", new Arma("Pilum", 2.0, 125, new Daño("1D6+1", "P")));
armasCuerpoACuerpo.set("Lanza de torneo", new Arma("Lanza de torneo", 3.5, 150, new Daño("1D10+1", "P")));
armasCuerpoACuerpo.set("Lanza corta", new Arma("Lanza corta", 2.0, 20, new Daño("1D8+1", "P")));
armasCuerpoACuerpo.set("Lanza larga", new Arma("Lanza larga", 2.0, 30, new Daño("1D10+1", "P")));
armasCuerpoACuerpo.set("Lanza corta", new Arma("Lanza corta", 2.0, 20, new Daño("1D8+1", "P")));
armasCuerpoACuerpo.set("Pica", new Arma("Pica", 3.5, 65, new Daño("2D6+2", "P")));
armasCuerpoACuerpo.set("Naginata", new Arma("Naginata", 2.0, 150, new Daño("2D6+2", "L")));
armasCuerpoACuerpo.set("Espada bastarda", new Arma("Espada bastarda", 2.0, 230, new Daño("1D10+1", "L"), new Daño("1D10+1", "P")));
armasCuerpoACuerpo.set("Espada ancha", new Arma("Espada ancha", 1.5, 175, new Daño("1D8+1", "L"), new Daño("1D8+1", "C")));
armasCuerpoACuerpo.set("Cimitarra", new Arma("Cimitarra", 1.5, 200, new Daño("1D6+2", "L"), new Daño("1D6+2", "C")));
armasCuerpoACuerpo.set("Espada bastarda", new Arma("Espada bastarda", 2.0, 230, new Daño("1D10+1", "L"), new Daño("1D10+1", "P")));
armasCuerpoACuerpo.set("Espada de doble puño", new Arma("Espada de doble puño", 3.5, 320, new Daño("2D8", "L")));
armasCuerpoACuerpo.set("Azadón", new Arma("Azadón", 2.0, 5, new Daño("1D6", "C")));
armasCuerpoACuerpo.set("Guadaña", new Arma("Guadaña", 2.5, 50, new Daño("2D6", "L")));
armasCuerpoACuerpo.set("Hoz", new Arma("Hoz", 0.5, 40, new Daño("1D6", "L")));
armasCuerpoACuerpo.set("Pala", new Arma("Pala", 1.5, 20, new Daño("1D6+2", "C")));
armasCuerpoACuerpo.set("Cesto pesado", new Arma("Cesto pesado", 1.5, 100, new Daño("1D3+2", "C")));
armasCuerpoACuerpo.set("Cesto ligero", new Arma("Cesto ligero", 1.0, 100, new Daño("1D3 + 1", "C")));
armasCuerpoACuerpo.set("Garra de lucha", new Arma("Garra de lucha", 0.1, 100, new Daño("1D4+1", "L")));

// Para verificar el contenido del Map (opcional)
for (const [nombre, arma] of armasCuerpoACuerpo) {
  console.log(`${nombre}:`);
  console.log(`  Nombre: ${arma.nombre}`);
  console.log(`  Peso: ${arma.peso}`);
  console.log(`  Valor: ${arma.valor}`);
  console.log(`  Daños:`);
  arma.daños.forEach(daño => {
    console.log(`    Dado: ${daño.dado}, Tipo: ${daño.tipoDaño}`);
  });
}

//con valores revisados por Gemini
const armasCuerpoACuerpo2 = new Map();

armasCuerpoACuerpo2.set("Hacha de combate", new Arma("Hacha de combate", 1.5, 60, new Daño("1D8+2", "L")));
armasCuerpoACuerpo2.set("Hacha de mano", new Arma("Hacha de mano", 0.7, 20, new Daño("1D6+1", "L")));
armasCuerpoACuerpo2.set("Hacha de combate", new Arma("Hacha de combate", 2.0, 80, new Daño("1D8+2", "L")));
armasCuerpoACuerpo2.set("Gran hacha", new Arma("Gran hacha", 3.0, 100, new Daño("2D6+2", "L")));
armasCuerpoACuerpo2.set("Alabarda", new Arma("Alabarda", 3.5, 150, new Daño("3D6", "L"), new Daño("3D6", "P")));
armasCuerpoACuerpo2.set("Hacha danesa", new Arma("Hacha danesa", 2.5, 90, new Daño("3D6", "L")));
armasCuerpoACuerpo2.set("Daga", new Arma("Daga", 0.3, 15, new Daño("1D4+2", "L"), new Daño("1D4+2", "P")));
armasCuerpoACuerpo2.set("Cuchillo", new Arma("Cuchillo", 0.1, 5, new Daño("1D3 + 1", "L")));
armasCuerpoACuerpo2.set("Main gauche", new Arma("Main gauche", 0.4, 30, new Daño("1D4+2", "P")));
armasCuerpoACuerpo2.set("Sai", new Arma("Sai", 0.8, 40, new Daño("1D6", "C")));
armasCuerpoACuerpo2.set("Bola y cadena", new Arma("Bola y cadena", 4.0, 120, new Daño("1D10+1", "C")));
armasCuerpoACuerpo2.set("Triple cadena", new Arma("Triple cadena", 3.5, 100, new Daño("1D6+2", "C")));
armasCuerpoACuerpo2.set("Maza de grano", new Arma("Maza de grano", 1.2, 8, new Daño("1D6", "C")));
armasCuerpoACuerpo2.set("Maza campesina militar", new Arma("Maza campesina militar", 3.0, 90, new Daño("2D6 + 2", "C")));
armasCuerpoACuerpo2.set("Martillo de guerra", new Arma("Martillo de guerra", 2.0, 70, new Daño("1D6+2", "C"), new Daño("1D6+2", "P")));
armasCuerpoACuerpo2.set("Gran martillo", new Arma("Gran martillo", 3.0, 110, new Daño("2D6+2", "C"), new Daño("2D6+2", "P")));
armasCuerpoACuerpo2.set("Maza pesada", new Arma("Maza pesada", 2.5, 80, new Daño("1D10", "C")));
armasCuerpoACuerpo2.set("Maza ligera", new Arma("Maza ligera", 1.0, 50, new Daño("1D8", "C")));
armasCuerpoACuerpo2.set("Palo de madera", new Arma("Palo de madera", 0.6, 2, new Daño("1D6", "C")));
armasCuerpoACuerpo2.set("Vara", new Arma("Vara", 0.7, 5, new Daño("1D6", "C")));
armasCuerpoACuerpo2.set("Maza pesada", new Arma("Maza pesada", 3.0, 90, new Daño("1D10", "C")));
armasCuerpoACuerpo2.set("Cayado", new Arma("Cayado", 1.0, 10, new Daño("1D8", "C")));
armasCuerpoACuerpo2.set("Garrote", new Arma("Garrote", 2.0, 60, new Daño("1D10+2", "C")));
armasCuerpoACuerpo2.set("Garrote de guerra", new Arma("Garrote de guerra", 3.5, 70, new Daño("2D6+2", "C")));
armasCuerpoACuerpo2.set("Garrote de trabajo", new Arma("Garrote de trabajo", 3.0, 50, new Daño("2D6+2", "C")));
armasCuerpoACuerpo2.set("Garrote de troll", new Arma("Garrote de troll", 5.0, 30, new Daño("2D8", "C")));
armasCuerpoACuerpo2.set("Rapier", new Arma("Rapier", 1.0, 80, new Daño("1D6+1", "P")));
armasCuerpoACuerpo2.set("Kukri", new Arma("Kukri", 0.4, 60, new Daño("1D4+3", "L")));
armasCuerpoACuerpo2.set("Gladius", new Arma("Gladius", 0.8, 70, new Daño("1D6+1", "L"), new Daño("1D6+1", "P")));
armasCuerpoACuerpo2.set("Pilum", new Arma("Pilum", 2.0, 60, new Daño("1D6+1", "P")));
armasCuerpoACuerpo2.set("Lanza de torneo", new Arma("Lanza de torneo", 4.0, 100, new Daño("1D10+1", "P")));
armasCuerpoACuerpo2.set("Lanza corta", new Arma("Lanza corta", 1.5, 15, new Daño("1D8+1", "P")));
armasCuerpoACuerpo2.set("Lanza larga", new Arma("Lanza larga", 2.5, 20, new Daño("1D10+1", "P")));
armasCuerpoACuerpo2.set("Lanza corta", new Arma("Lanza corta", 1.5, 15, new Daño("1D8+1", "P")));
armasCuerpoACuerpo2.set("Pica", new Arma("Pica", 4.5, 40, new Daño("2D6+2", "P")));
armasCuerpoACuerpo2.set("Naginata", new Arma("Naginata", 2.0, 90, new Daño("2D6+2", "L")));
armasCuerpoACuerpo2.set("Espada bastarda", new Arma("Espada bastarda", 1.8, 150, new Daño("1D10+1", "L"), new Daño("1D10+1", "P")));
armasCuerpoACuerpo2.set("Espada ancha", new Arma("Espada ancha", 1.3, 120, new Daño("1D8+1", "L"), new Daño("1D8+1", "C")));
armasCuerpoACuerpo2.set("Cimitarra", new Arma("Cimitarra", 1.2, 130, new Daño("1D6+2", "L"), new Daño("1D6+2", "C")));
armasCuerpoACuerpo2.set("Espada bastarda", new Arma("Espada bastarda", 2.0, 170, new Daño("1D10+1", "L"), new Daño("1D10+1", "P")));
armasCuerpoACuerpo2.set("Espada de doble puño", new Arma("Espada de doble puño", 3.0, 200, new Daño("2D8", "L")));
armasCuerpoACuerpo2.set("Azadón", new Arma("Azadón", 2.5, 3, new Daño("1D6", "C")));
armasCuerpoACuerpo2.set("Guadaña", new Arma("Guadaña", 4.0, 30, new Daño("2D6", "L")));
armasCuerpoACuerpo2.set("Hoz", new Arma("Hoz", 1.0, 25, new Daño("1D6", "L")));
armasCuerpoACuerpo2.set("Pala", new Arma("Pala", 1.8, 10, new Daño("1D6+2", "C")));
armasCuerpoACuerpo2.set("Cesto pesado", new Arma("Cesto pesado", 1.5, 40, new Daño("1D3+2", "C")));
armasCuerpoACuerpo2.set("Cesto ligero", new Arma("Cesto ligero", 1.0, 30, new Daño("1D3 + 1", "C")));
armasCuerpoACuerpo2.set("Garra de lucha", new Arma("Garra de lucha", 0.2, 50, new Daño("1D4+1", "L")));
