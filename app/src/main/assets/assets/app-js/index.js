
$(function() {
    $('.modal').modal();
    initEventos();
    verificarSession();
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
                window.location.href = 'home.html';
            }else{
                _mostrarMensajeError(data.error);  
            }   
        });
    });

    $("#btnCrearCuenta").on("click", function(event){
        _mostrarMensajeExito("Contactese con el administrador para crear una cuenta");
    });
}


function verificarSession(){
    if(_getClaveValorLocal(_KEY_USUARIO ) != null){
        window.location.href = 'home.html';
    }
}