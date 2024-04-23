const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,

    port: process.env.DB_PORT
});
  
connection.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('db ' + connection.state)
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response =  await new Promise((resolve, reject) => {
                // const query = "SELECT * FROM users WHERE id = ?";
                // connection.query(query, [id])
                const query = "SELECT * FROM users;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            // console.log(response);
            return response;
        } catch (error) {
                console.log(error);
        }
    }
    
    async insertNewName (name) {
        try {
            const dateAdded = new Date();
            const insertId =  await new Promise((resolve, reject) => {
            
                const query = "INSERT INTO users VALUES (first_name, register_date) VALUES (?,?);";
                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });
            // console.log(insertId);
            return {
                id: insertId,
                name: first_name,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error)        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);  // Base 10 for some browsers
            const responseaffectedRow =  await new Promise((resolve, reject) => {
            
            const query = "DELETE FROM users WHERE id = ? VALUES (first_name, register_date) VALUES (?,?);";
            connection.query(query, [id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            });
        });
        // console.log(response);
        // If 1 row effected then sucess otherwise false
        return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            // If query incorrect or error
            return false;
        }
           
    }

    async updateNameByID(id, name) {
        try {
            id = parseInt(id, 10);  // Base 10 for some browsers
            const responseaffectedRow =  await new Promise((resolve, reject) => {
            
            const query = "UPDATE users SET first_name = ? WHERE id = ?;";
            connection.query(query, [name, id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            });
        });
        // console.log(response);
        // If 1 row effected then sucess otherwise false
        return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            // If query incorrect or error
            return false;
        }
    }

    async searchByName(id, name) {
        try {
            const response =  await new Promise((resolve, reject) => {
                // const query = "SELECT * FROM users WHERE id = ?";
                // connection.query(query, [id])
                const query = "SELECT * FROM users WHERE first_name = ?;";
                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        
            return response;
        } catch (error) {
                console.log(error);
        }
    }
};

module.exports = DbService;
