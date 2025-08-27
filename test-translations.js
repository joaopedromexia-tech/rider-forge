// Script de teste para verificar as traduções do PDF
import { getPDFTranslation } from './src/pdf/translations.ts'

console.log('=== Teste das Traduções do PDF ===\n')

// Teste em português
console.log('🇵🇹 PORTUGUÊS:')
console.log('PA:', getPDFTranslation('pt', 'sections', 'pa'))
console.log('FOH:', getPDFTranslation('pt', 'sections', 'foh'))
console.log('MON:', getPDFTranslation('pt', 'sections', 'mon'))
console.log('Sistemas de Escuta:', getPDFTranslation('pt', 'sections', 'listenSystems'))
console.log('Equipamento Auxiliar:', getPDFTranslation('pt', 'sections', 'auxEquipment'))
console.log('Input List:', getPDFTranslation('pt', 'sections', 'inputList'))
console.log('Output List:', getPDFTranslation('pt', 'sections', 'outputList'))
console.log('Observações Finais:', getPDFTranslation('pt', 'sections', 'finalNotes'))
console.log('Stage Plot:', getPDFTranslation('pt', 'sections', 'stagePlot'))

console.log('\nCabeçalhos Input List:')
console.log('Canal:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'channel'))
console.log('Fonte:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'source'))
console.log('Micro/DI:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'micDi'))
console.log('Stand:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'stand'))
console.log('Phantom:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'phantom'))
console.log('Notas:', getPDFTranslation('pt', 'tableHeaders', 'inputList', 'notes'))

console.log('\nTextos específicos:')
console.log('Sim:', getPDFTranslation('pt', 'texts', 'yes'))
console.log('Não:', getPDFTranslation('pt', 'texts', 'no'))
console.log('Página:', getPDFTranslation('pt', 'texts', 'page'))
console.log('de:', getPDFTranslation('pt', 'texts', 'of'))
console.log('Rider Forge:', getPDFTranslation('pt', 'texts', 'riderForge'))

console.log('\n' + '='.repeat(50) + '\n')

// Teste em inglês
console.log('🇺🇸 ENGLISH:')
console.log('PA:', getPDFTranslation('en', 'sections', 'pa'))
console.log('FOH:', getPDFTranslation('en', 'sections', 'foh'))
console.log('MON:', getPDFTranslation('en', 'sections', 'mon'))
console.log('Monitor Systems:', getPDFTranslation('en', 'sections', 'listenSystems'))
console.log('Auxiliary Equipment:', getPDFTranslation('en', 'sections', 'auxEquipment'))
console.log('Input List:', getPDFTranslation('en', 'sections', 'inputList'))
console.log('Output List:', getPDFTranslation('en', 'sections', 'outputList'))
console.log('Final Notes:', getPDFTranslation('en', 'sections', 'finalNotes'))
console.log('Stage Plot:', getPDFTranslation('en', 'sections', 'stagePlot'))

console.log('\nInput List Headers:')
console.log('Channel:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'channel'))
console.log('Source:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'source'))
console.log('Mic/DI:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'micDi'))
console.log('Stand:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'stand'))
console.log('Phantom:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'phantom'))
console.log('Notes:', getPDFTranslation('en', 'tableHeaders', 'inputList', 'notes'))

console.log('\nSpecific texts:')
console.log('Yes:', getPDFTranslation('en', 'texts', 'yes'))
console.log('No:', getPDFTranslation('en', 'texts', 'no'))
console.log('Page:', getPDFTranslation('en', 'texts', 'page'))
console.log('of:', getPDFTranslation('en', 'texts', 'of'))
console.log('Rider Forge:', getPDFTranslation('en', 'texts', 'riderForge'))

console.log('\n=== Teste Concluído ===')
