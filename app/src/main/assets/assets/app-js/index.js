var modalRecuperarClave;
$(function() {
    $('.modal').modal();
    modalRecuperarClave = M.Modal.init(document.querySelector('#modalRecuperarClave'), {dismissible: false,});
    initEventos();
    verificarSession();
    _mostrarPaginaInicial();
});


function initEventos(){
    $("#btnLogin").on("click", function(event){
        var user = $("#user").val();
        var pass = $("#pass").val();

        if(user.length == 0){
            _mostrarMensajeError("Ingrese el nombre de usuario");
            return;
        }
        if(user.length == 0){
            _mostrarMensajeError("Ingrese la contraseña");
            return;
        }
        var dataSend = {
            user:user,
            pass:pass,
            idcompania:_idcompania
        }
        _post("/login",dataSend, function(data){
            if(data.statusCode == 0){
                _setClaveValorLocal(_KEY_USUARIO,JSON.stringify(data.data)  );
                if(data.data.estadodetalle === 'TEMP'){
                    window.location.href = 'cambiarclave.html';
                }else{
                    window.location.href = 'dashboard.html';
                }

            }else{
                _mostrarMensajeError(data.error);
            }
        });
    });

    $("#btnCrearCuenta").on("click", function(event){
        _mostrarMensajeExito("Contactese con el administrador para crear una cuenta");
    });

    $("#btnOlvidoContrasenia").on("click", function(event){
        $("#recuperarClave #rusuario").val("");
        modalRecuperarClave.open();
    });

    $("#btnResetarClave").on("click", function(event){
        var identificacion = $("#recuperarClave #rusuario").val();
        console.log(identificacion);
        if(identificacion.length == 0){
            return;
        }
        var optionsConsulta= [
            { alias:"usuario", tabla:"usuario", campos:"*",  filtro: "user= '"+identificacion+"'  ",  orderby:"id"  },
        ]
        _consultarEntidad(optionsConsulta, function(data){
            jQuery.each(data.data, function() {
                var consultas = this;
                if(consultas.usuario != null){
                    if(consultas.usuario.length > 0){
                        var usuario =  consultas.usuario[0];
                        if(usuario.estadodetalle ==='BLOC' ){
                            _mostrarMensajeError("No puede recuperar la clave, el usuario esta Bloqueado");
                            return;
                        }
                        if(usuario.estadodetalle ==='DEL' ){
                            _mostrarMensajeError("No puede recuperar la clave, el usuario esta Eliminado");
                            return;
                        }
                        usuario.pass=_generarString();
                        usuario.estadodetalle='TEMP';
                        var insert = {  alias:"usuario", tabla:"usuario",  obj:usuario }
                        var arrayInsert=[insert];
                        _post("/insertar",arrayInsert, function(data){
                            if(data.statusCode == 0){
                                modalRecuperarClave.close();
                                _mostrarMensajeExito("Listo, te enviaremos una nueva clave temporal a tu correo, por favor revisalo.");
                                var email = {
                                    user:identificacion
                                }
                                _post("/emailrecuperarclave",email, function(data){ });
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
    });
}


function verificarSession(){
    if(_getClaveValorLocal(_KEY_USUARIO ) != null){
        window.location.href = 'dashboard.html';
    }
}