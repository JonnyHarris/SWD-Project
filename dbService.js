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
        console.log('db ' + err.message)
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response =  await new Promise((resolve, reject) => {
                // const query = "SELECT * FROM names WHERE id = ?";
                // connection.query(query, [id])
                const query = "SELECT * FROM names;";
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
            const insertDate = new Date();
            const insertRole = "new user";
            // console.log('dbservice insertnewname', name);
            
            const insertId =  await new Promise((resolve, reject) => {
                
                const query = "INSERT INTO names (name, date_added, role) VALUES (?,?,?);";
                
                //console.log(insertId);
                connection.query(query, [name, insertDate, insertRole], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            }); 
            console.log('insertId', insertId);
            return {
                id: insertId,
                name: name,
                role: insertRole,
                dateAdded: insertDate
            };
        } catch (error) {
            console.log(error)        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);  // Base 10 edge case for some  browsers
            const response =  await new Promise((resolve, reject) => {
            
            const query = "DELETE FROM names WHERE id = ?;";
            connection.query(query, [id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            });
        });
        // console.log(response);
        // If 1 row effected then sucess otherwise false
        return response === 1 ? true : false;
        } catch (error) {
            // If query incorrect or error
            return false;
        }
           
    }

    async updateNameByID(id, name) {
        try {
            id = parseInt(id, 10);  // Base 10 for some browsers
            const affectedRows =  await new Promise((resolve, reject) => {
            
            const query = "UPDATE names SET name = ? WHERE id = ?;";
            connection.query(query, [name, id], (err, result) => {
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

    async searchByName(name) {
        try {
            const response =  await new Promise((resolve, reject) => {
                // const query = "SELECT * FROM names WHERE id = ?";
                // connection.query(query, [id])
                const query = "SELECT * FROM names WHERE name = ?;";
                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
        
            return response;
        } catch (error) {
                console.log('dbService error',error);
        }
    }
};

module.exports = DbService;
