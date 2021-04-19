module.exports = function (app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });
    app.get("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });
    app.delete("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.eliminarCancion(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });
    app.post("/api/cancion", function (req, res) {
        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
            autor: res.usuario
        }
        let error = false;
        let errorRespuesta = {};
        // ¿Validar nombre, genero, precio?
        if (cancion.nombre===null || cancion.nombre.length < 5) {
            error = true;
            errorRespuesta={
                errorNombre: "La longitud del nombre de la canción debe ser de 5 o más caracteres"
            }
        }
        else if (cancion.genero===null || cancion.genero.length < 3) {
            error = true;
            errorRespuesta={
                errorGenero:"La longitud del genero de la canción debe ser de 3 o más caracteres"}
        }
        else if (cancion.precio===null || parseInt((cancion.precio)) < 0) {
            error = true;
            errorRespuesta={
                errorPrecio:"El precio es un numero negativo"}
        }
        if (error) {
            res.json(errorRespuesta)
            return
        }
        gestorBD.insertarCancion(cancion, function (id) {
            if (id == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje: "canción insertada",
                    _id: id
                })
            }
        });

    });
    app.put("/api/cancion/:id", function (req, res) {

        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        let cancion = {}; // Solo los atributos a modificar
        if (req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if (req.body.genero != null)
            cancion.genero = req.body.genero;
        if (req.body.precio != null)
            cancion.precio = req.body.precio;

        let error = false;
        let errorRespuesta = {};
        // ¿Validar nombre, genero, precio?
        if (res.usuario===null || !res.usuario.localeCompare(cancion.autor)) {
            error = true;
            res.status(401);
            errorRespuesta = {error:"usuario no autorizado "+res.usuario};
        } else {
            if (cancion.nombre===null || cancion.nombre.length < 5 && cancion.nombre.length >24) {
                error = true;
                errorRespuesta ={ error:"La longitud del nombre de la canción debe ser de 5 a 10 caracteres"};
            }
            else if (cancion.genero===null || cancion.genero.length < 3 && cancion.genero.length >24) {
                error = true;
                errorRespuesta = {error:"La longitud del genero de la canción debe ser de 3 a 10 más caracteres"};
            }
            else if (cancion.precio===null || parseInt((cancion.precio)) < 0 && parseInt((cancion.precio)) > 999) {
                error = true;
                errorRespuesta = {error:"El precio es un numero negativo o mayor que 999"};
            }
        }
        if (error) {
            res.json({
                error: errorRespuesta
            })
            return
        }

        gestorBD.modificarCancion(criterio, cancion, function (result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje: "canción modificada",
                    _id: req.params.id
                })
            }
        });
    });

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }
        let error = false;
        let errorRespuesta = {};

        if (criterio.email===null || criterio.email.length<0) {
            error = true;
            errorRespuesta ={ error:"El email está vacio"};
        }
        else if (criterio.password===null || criterio.password.length<0) {
            error = true;
            errorRespuesta = {error:"La contraseña está vacia"};
        }
        if (error) {
            res.json(errorRespuesta)
            return
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401) //Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200)
                res.json({
                    autenticado: true,
                    token: token
                })
            }
        })
    })

}
