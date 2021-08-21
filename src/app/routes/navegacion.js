const app = require("../../config/server");
const bcryptjs = require("bcryptjs");
const connection = require("../../config/db");
const { render } = require("../../config/server");

module.exports = app => {
    app.get('/', (req, res) => {
        if(req.session.loggedin){
            res.render('Home.ejs',{
                login: true,
            });
        }else{
            res.render('Home.ejs',{
                login: false,
            });
        }
    });



    app.get('/Registro', (req, res) => {
         if(req.session.loggedin){
            res.render('Registro.ejs',{
                login: true,
            });
        }else{
            res.render('Registro.ejs',{
                login: false,
            });
        }
    });

    app.get('/Servicios', (req, res) => {
         if(req.session.loggedin){
            res.render('Servicios.ejs',{
                login: true,
            });
        }else{
            res.render('Servicios.ejs',{
                login: false,
            });
        }
    });


    app.get('/Administrador', (req, res) => {
        connection.query("SELECT * FROM contacto", (error, result) => {
            if(error){
                console.log("Error: "+ error);
            }else{
                if(req.session.loggedin){
                    res.render("Administrador.ejs",{
                        datos: result,
                        login: true,
                    });
                }else{
                    res.render("Inicio_sesion.ejs",{                        
                        login: false,
                    })
                }
            }
        });
    })


    app.get('/Contacto', (req, res) => {
        if(req.session.loggedin){
           res.render('Contacto.ejs',{
               login: true,
           });
       }else{
           res.render('Contacto.ejs',{
               login: false,
           });
       }
   });


    app.post('/Contacto', async (req, res) => {

        const {nombre ,correo ,celular , rol ,tema ,mensaje}= req.body;
        connection.query('INSERT INTO contacto SET ?', { 
            nombre: nombre, 
            correo: correo, 
            celular: celular, 
            rol: rol, 
            tema: tema, 
            mensaje: mensaje }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('Contacto');
            }
        })
    })

    app.post('/Registro', async (req, res) => {

        const {nombre, apellidos, usuario, contrasena} = req.body;
        let passwordHaash = await bcryptjs.hash(contrasena, 8);
        connection.query('INSERT INTO registro SET ?', { nombre: nombre, apellidos: apellidos, usuario: usuario, contrasena: passwordHaash }, async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                res.redirect('Registro')
            }
        })
    })

    app.get('/deleteAdministardor/:id',(req, res) => {
        const id= req.params.id;
        console.log(id);
        const queryDelete= ("DELETE FROM contacto WHERE idContacto = ?");
        connection.query(queryDelete,[id], (err, result)=>{
            if(err){
                res.send(err);
            }else{
                res.redirect("/Administrador");
            }
        })
    })

    app.get('/Inicio_sesion', (req, res) => {
        if(req.session.loggedin){
           res.render('Administrador.ejs',{
               login: true,
           });
       }else{
           res.render('Inicio_sesion.ejs',{
               login: false,
           });
       }
   });

    app.post("/Inicio_sesion", async (req, res) => {

        const { usuario, contrasena } = req.body;
        let passwordHaash = await bcryptjs.hash(contrasena, 8);
        console.log(req.body);
            connection.query('SELECT * FROM registro WHERE usuario =  ?', [usuario],
                    async (err, results) => {
                    if (await results.length === 0 || !(await bcryptjs.compare(contrasena, results[0].contrasena))) {
                        res.render("Inicio_sesion.ejs", {
                            login: false,
                        });
                    } else {
                        req.session.loggedin = true;
                        req.session.usuario = results[0].usuario;
                        res.redirect('/Administrador');
                    }
             })
    })

    app.get("/getLogout", (req, res) =>{
        req.session.destroy(() =>{
            res.redirect("/");
        });
    });
}