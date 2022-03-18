

function disparadorPaginaInicial() {
    initAcciones();
    validarPermisos();
};

function validarPermisos(){
    if(_jsonUsuario.estadodetalle ==='TEMP'){
        _mostrarMensajeInfo("Por Seguridad cambie su contraseña temporal");
    }
     if(_jsonUsuario.idrol!="1"){
         
     }
}

function initAcciones(){

    $("#btnCambiarClave").on("click", function(event){
        cambiarClave();
    });

    
}



function cambiarClave(){
    var pass1 = $("#pass1").val();
    var pass2 = $("#pass2").val();
        
    if(pass1.length == 0){
        _mostrarMensajeError("Ingrese la nueva clave");
        return;
    }
    if(pass2.length == 0){
        _mostrarMensajeError("Repita la nueva clave");
        return;
    }
    
    if(pass1 != pass2){
        _mostrarMensajeError("Las claves no coinciden");
        return;
    }
    var optionsConsulta= [
        { alias:"usuario", tabla:"usuario", campos:"*",  filtro: "id= '"+_jsonUsuario.idusuario+"'  ",  orderby:"id"  },
    ]
   
    _consultarEntidad(optionsConsulta, function(data){
        jQuery.each(data.data, function() {
            var consultas = this;      
            if(consultas.usuario != null){
                if(consultas.usuario.length > 0){
                    var usuario =  consultas.usuario[0];
                    usuario.pass=pass1;
                    usuario.estadodetalle="ACT";
                    var insert = {  alias:"usuario", tabla:"usuario",  obj:usuario }
                    var arrayInsert=[insert];
                    _post("/insertar",arrayInsert, function(data){
                        if(data.statusCode == 0){
                            _mostrarMensajeExito("Se ha Cambiado su contraseña", function(){
                                _jsonUsuario.estadodetalle='ACT'
                                _setClaveValorLocal(_KEY_USUARIO,JSON.stringify(_jsonUsuario)  );
                                window.location.href = 'dashboard.html';
                            }); 
                        }else{
                            _mostrarMensajeError(data.error);  
                        }   
                    });
                }else{
                    _mostrarMensajeError("No existe el usuario "+identificacion);  
                }
            }                        
        });
    });
   



}