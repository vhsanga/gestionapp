
function disparadorPaginaInicial() {

    initAcciones();
    consultarData()
};


function initAcciones(){
    if(_jsonUsuario.idrol!="1"){
        $("#areaAdmin").hide();
     }
}




function consultarData(){
    var optionsConsulta= [        
        { alias:"frmUsuario", tabla:"usuario u inner join usuarioroles ur on u.id=ur.idusuario inner join roles r on r.id=ur.idrol ",  campos:"u.user, ur.fingreso, r.descripcion rol ",   filtro: "u.id="+_jsonUsuario.idusuario,  orderby:"u.id"  },        
        { alias:"frmSolicitudes", tabla:" dual",
           campos:"(select count(*) from solicitudcredito s  where s.idusuario = "+_jsonUsuario.idusuario+") total, (select count(*) from solicitudcredito s  where s.idusuario = "+_jsonUsuario.idusuario+" and s.estado='APR') aprobadas, (select count(*) from solicitudcredito s  where s.idusuario = "+_jsonUsuario.idusuario+" and s.estado='ING') ingresadas, (select count(*) from solicitudcredito s  where s.idusuario = "+_jsonUsuario.idusuario+" and s.estado='NEG') negadas",
           filtro: " 1=1 ",   orderby:" 1 " 
        },        
        { alias:"frmSolicitudesGeneral", tabla:" dual",
           campos:"(select count(*) from solicitudcredito s )  total, (select count(*) from solicitudcredito s  where  s.estado='APR') aprobadas, (select count(*) from solicitudcredito s  where  s.estado='ING') ingresadas, (select count(*) from solicitudcredito s  where  s.estado='NEG') negadas",
           filtro: " 1=1 ",   orderby:" 1 " 
        },
        { alias:"frmSolicitudesValor", tabla:" solicitudcredito s",
           campos:"concat('$ ', SUM(s.valortotal))  total  ",
           filtro: " s.estado='APR' ",   orderby:" 1 " 
        },
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

