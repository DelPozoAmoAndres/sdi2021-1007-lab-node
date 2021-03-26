module.exports = function(app,swig) {
    app.get("/autores/agregar", function(req, res) {

        let respuesta = swig.renderFile('views/autores-agregar.html',{

        });
        res.send(respuesta);
    });
    app.post("/autores/agregar", function(req, res) {
        res.send("Autor agragado: "+req.body.nombre +"<br>"
            + " grupo: "+ req.body.grupo +"<br>"
            + " role: "+ req.body.rol);
    });
    app.get("/autores", function(req, res) {
        let autores = [{
            "nombre" : "NombreA",
            "grupo" : "grupoA",
            "rol" : "cantante"
        },{
            "nombre" : "NombreB",
            "grupo" : "grupoB",
            "rol" : "bajista"
        },{
            "nombre" : "NombreC",
            "grupo" : "grupoC",
            "rol" : "teclista"
        }];
        let respuesta = swig.renderFile('views/autores.html',{
            autores : autores
        });
        res.send(respuesta);
    });
    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    })
};