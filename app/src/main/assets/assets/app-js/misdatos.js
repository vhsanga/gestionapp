var tablaSolicitudes;
var modalSolicitud = M.Modal.init(document.querySelector('#modalSolicitud'), {dismissible: true,});

function disparadorPaginaInicial() {

    initAcciones();
    consultarData()
};



function initAcciones(){



    $("#btnGuardarMisDatos").on("click", function(event){
        guardarMisDatos();
    });
  
}




function consultarData(){
    var optionsConsulta= [
        { alias:"frmMisDatos", tabla:"persona ",  campos:"*",   filtro: "id="+_jsonUsuario.idpersona,  orderby:"id"  },        
        { alias:"frmUsuario", tabla:"usuario u inner join usuarioroles ur on u.id=ur.idusuario inner join roles r on r.id=ur.idrol ",  campos:"u.user, ur.fingreso, r.descripcion rol ",   filtro: "u.id="+_jsonUsuario.idusuario,  orderby:"u.id"  },        
    ]
    _consultarEntidad(optionsConsulta, function(data){
        jQuery.each(data.data, function() {
            var consultas = this; 
            jQuery.each(consultas, function(form, entidades) {
                jQuery.each(entidades, function() {
                    entidad = this    
                    jQuery.each(entidad, function(key, value ) {        
                        $("#"+form+" [name='"+key+"']").val(value).focus();          
                        $("#"+form+" #"+key).html(value);          
                    });
                });
            });            
        });
    });
}


function  guardarMisDatos(){    
    var dataSend=_getDataForm("frmMisDatos");
    if(dataSend == null){
        return;
    }
    dataSend.tipoidentifiacioncatalogo="TIPOID";
    dataSend.tipoidentifiaciondetalle="C";
    var insert = {  alias:"persona", tabla:"persona",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){             
            _mostrarMensajeExito("Guardado los Datos.", function(){          
            });  
            
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}