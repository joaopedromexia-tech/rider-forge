import { EQUIPMENT_LIBRARY } from './src/data/equipmentLibrary.js';

console.log('Total FREE items:', EQUIPMENT_LIBRARY.FREE.length);
console.log('Total PRO items:', EQUIPMENT_LIBRARY.PRO.length);

// Verificar se Bricasti está na seção FREE
const bricasti = EQUIPMENT_LIBRARY.FREE.find(item => item.marca === 'Bricasti');
console.log('Bricasti FREE:', bricasti);

// Verificar se Bricasti está na seção PRO
const bricastiPro = EQUIPMENT_LIBRARY.PRO.find(item => item.marca === 'Bricasti');
console.log('Bricasti PRO:', bricastiPro);
