const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// create
app.post('/insert', (request, response) => {
    // console.log(request.body);
    const {name } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewName(name);

    result
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));
});

//read
app.get('/getAll', (request, response) => {
    console.log('test');
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData(); 

    result
    .then(data => response.json({data  :data}))
    .catch(err => console.log(err));
});
  
// update
app.patch('/update', (request, response) => {
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name); 
    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) =>{
    // console.log(request.params);
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id); 
    result
    .then(data => response.json({sucess : data}))
    .catch(err => console.log(err));
})

app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();
})
app.listen(process.env.PORT, () => console.log('app is running'))