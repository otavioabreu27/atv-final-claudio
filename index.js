const { where } = require('sequelize');
const {runDb, migrateData} = require('./db');
const funcionario = require('./db/models/Funcionario');
const salario = require('./db/models/Salario')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var base_url = "http://localhost:3000"

app.set('view engine', 'ejs');
app.set('views', './templates');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --------------------- Front
app.get('/', async (req, res) => {

    let funcData = await fetch(`${base_url}/back/funcionarios`)
        .then(response => response.json())
        .then(data => {
            return(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    let salData = await fetch(`${base_url}/back/salario`)
        .then(response => response.json())
        .then(data => {
            return(data.salario_minimo);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    funcData.map((funcionario)=>{
        if (funcionario.categoria == 'G' && funcionario.turno == 'M' || funcionario.turno == 'V'){
            funcionario['valorHora'] = salData * 0.04;
        } else if (funcionario.categoria == 'F' && funcionario.turno == 'N'){
            funcionario['valorHora'] = salData * 0.02;
        } else if (funcionario.categoria == 'F' && funcionario.turno == 'M' || funcionario.turno == 'V'){
            funcionario['valorHora'] = salData * 0.01;
        }

        if (funcionario.salarioInicial <= 800){
            funcionario['alimentacao'] = funcionario.salarioInicial * 0.25
        } else if (funcionario.salarioInicial > 800 && funcionario.salarioInicial <= 1200){
            funcionario['alimentacao'] = funcionario.salarioInicial * 0.20
        } else if (funcionario.salarioInicial > 1200){
            funcionario['alimentacao'] = funcionario.salarioInicial * 0.15
        }
    });

    console.log(funcData);
    console.log(salData)

    res.render('home', {
        funcionarios: funcData,
        salario: salData
    });
})

app.get('/funcionario', async (req, res) => {

    res.render('funcionario');
})

app.get('/salario', async (req, res) => {
    let salario = await fetch(`${base_url}/back/salario`)
        .then(response => response.json())
        .then(data => {
            return(data.salario_minimo);
        })
        .catch(error => {
            console.error('Error:', error);
    });

    res.render('salario', {salario: salario})
})

// --------------------- Back
app.get('/back/funcionarios', async (req, res)=> {
    let funcs = await funcionario.findAll();
    res.send(funcs)
});

app.get('/back/salario', async (req, res)=> {
    let sal = await salario.findOne({
        where: {
            id: 1
        }
    });
    res.send(sal)
});

app.post('/funcionario', async (req, res) => {
    const cod = parseInt(req.body.codigo);
    const hrsTrab = parseInt(req.body.numHoras);
    const turno = req.body.turno;
    const cat = req.body.categoria;

    let salario_minimo = await fetch(`${base_url}/back/salario`)
        .then(response => response.json())
        .then(data => {
            return(data.salario_minimo);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    if (cat == 'G' && turno == 'M' || turno == 'V'){
        var valorHora = salario_minimo * 0.04;
    } else if (cat == 'F' && turno == 'N'){
        var valorHora = salario_minimo * 0.02;
    } else if (cat == 'F' && turno == 'M' || turno == 'V'){
        var valorHora = salario_minimo * 0.01;
    }

    let salarioInicial = valorHora * hrsTrab;
    
    await funcionario.create({
        codFunc: cod,
        horasTrabalhadas: hrsTrab,
        turno: turno,
        categoria: cat, 
        salarioInicial: salarioInicial
    });

    res.redirect('/');
})

app.post('/salario', async (req, res) => {
    const valSal = parseInt(req.body.salario);
    await salario.update(
        { salario_minimo: valSal },
        { where: { id: 1 } } 
    )

    res.redirect('/');
})


app.listen(port, async () => {
    await runDb()
    // .then(async ()=>{
    //     await migrateData();
    // });
    console.log('-- Pronto para Execução --')
    console.log(`   - Ouvindo a porta: ${port}`)
})


