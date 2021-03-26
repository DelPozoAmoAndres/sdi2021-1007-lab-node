module.exports = function (app) {
    app.post("/cancion", function (req, res) {
       res.send("Canción agragada: "+req.body.nombre +"<br>"
                + " genero: "+ req.body.genero +"<br>"
                + " precio: "+ req.body.precio);
    });

    app.get('/suma', function (req, res) {
        let respuesta = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(respuesta));
    });
    app.get('/canciones/:id', function (req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });
    app.get('/canciones/:genero/:id', function (req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>' + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });
};
