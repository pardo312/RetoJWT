let jwt = require('jsonwebtoken');
let config = require('./config');
const Mongolib = require("./db/Mongolib");
const MongolibData = require("./db/MongolibData");

// Clase encargada de la creación del token
class HandlerGenerator {

    login(req, res) {

        // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
        let username = req.body.username;
        let password = req.body.password;

        // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
        let found = false;

        Mongolib.getDatabase(db => {
            Mongolib.findDocuments(db, docs => {
                docs.forEach(element => {
                    if (username == element.username && password == element.password) {
                        found = true;
                    }
                });
                // Si se especifico un usuario y contraseña, proceda con la validación
                // de lo contrario, un mensaje de error es retornado
                if (username && password) {

                    // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
                    // de lo contrario, un mensaje de error es retornado
                    console.log(found)
                    if (found) {

                        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
                        let token = jwt.sign({ username: username },
                            config.secret, { expiresIn: '24h' });

                        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token
                        });

                    } else {

                        // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
                        res.send(403).json({
                            success: false,
                            message: 'Incorrect username or password'
                        });

                    }

                } else {

                    // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
                    res.send(400).json({
                        success: false,
                        message: 'Authentication failed! Please check the request'
                    });

                }
            });
        })



    }

    users(req, res) {
        MongolibData.getDatabase(db => {
            MongolibData.findDocuments(db, docs => {
                    // Retorna una respuesta exitosa con previa validación del token
                    res.json({
                        success: true,
                        message: docs[0].data
                    });
            });
        });

    }
}

module.exports = HandlerGenerator;