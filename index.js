const app = require('./src/config/server'); 
const connection = require('./src/config/db'); 

require('./src/app/routes/navegacion')(app); 

app.listen(app.get('port'), () => {
    console.log("servidor en el puerto: ", app.get('port')); 
})
