const Func = require('./models/Funcionario');
const Sal = require('./models/Salario')

const database = require('./db');

async function runDb() {
    console.log('-- Sincronizando o banco --');
    try {
        await database.sync();
        console.log('-- Banco sincronizado --');
    } catch (e) {
        console.log(`-- Erro ao Sincronizar o banco --\n    -${e}`);
    }
};

async function migrateData() {
    try{
        Sal.create({
            salario_minimo: 980.00
        });
        
        Func.create({
            codFunc: 1,
            horasTrabalhadas: 160,
            turno: 'N',
            categoria: 'F', 
            salarioInicial: 3136 
        });
    }catch(e){
        console.log('Erro ao migrar dados: ' + e)
    }
}


module.exports = {
    runDb,
    migrateData
};