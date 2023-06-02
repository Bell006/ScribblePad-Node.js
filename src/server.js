require("dotenv/config");

//Importando da biblioteca Express
require("express-async-errors");
const express = require('express');

const cors = require("cors");

const migrationsRun = require("./database/sqlite/migrations");

const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

//Automatically runs index.js
const routes = require('./routes');

//Executando banco de dados
migrationsRun();

//initializing express
const app = express();
app.use(cors());

app.use(express.json()) //telling server that it's dealing with a json data type

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
    //Se o erro for da  mesma instância que AppError, foi um erro gerado pelo cliente.
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    };

    //Caso o erro seja do servidor
    return [
        response.status(500).json({
                status: "error",
                message: "Internal server error"
            }),
        console.log(error)
    ]
        
})

//Defining port's number to send and receive requests
const PORT = 3333;
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));

