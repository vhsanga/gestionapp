var tablaUsuarios;
var modalUsuario = M.Modal.init(document.querySelector('#modalUsuario'), {dismissible: true,});
var modalCambiarRol = M.Modal.init(document.querySelector('#modalCambiarRol'), {dismissible: true,});
var modalBloquear = M.Modal.init(document.querySelector('#modalBloquear'), {dismissible: true,});
var modalEliminar = M.Modal.init(document.querySelector('#modalEliminar'), {dismissible: true,});

function disparadorPaginaInicial() {

    initAcciones();
    consultarListas()
    validarPermisos();
    var optionsConsulta= {
        "#idrol": { alias:"roles", tabla:"roles", campos:"id codigo, nombre",  filtro:"idcompania="+_idcompania,  orderby:"id"  },
        "#idrol_": { alias:"roles_", tabla:"roles", campos:"id codigo, nombre",  filtro:"idcompania="+_idcompania,  orderby:"id"  },
    }
    _consultarCatalogo(optionsConsulta);
};

function validarPermisos(){
    //1 es administrador
     if(_jsonUsuario.idrol!="1"){        
     }
}


function initAcciones(){
    tablaUsuarios = $('#tablaUsuarios').DataTable( {
        data: [],
        columns: [ 
            { data: 'user' },
            { data: 'nombres' },
            { data: 'rol' },
            { data: 'estadodetalle' }
        ],
        rowId: 'id',
        paging: false,
        searching: false,
        ordering:  false,
        language : {
            "zeroRecords": " "             
        },
        "bInfo" : false,
        columnDefs: [
            { targets: 1,"render": function ( data, type, row ) {
               return row.apellidos+ ' '+row.nombres;
                }, 
            },
            { targets: 2,"render": function ( data, type, row ) {
                return data;
                }, 
            },
            { targets: 4,"render": function ( data, type, row ) {
                return '<button class="btn green" type="button" onclick="mostrarCambiarRol('+row.id+')" ><i class="medium material-icons">group</i></button>'+
                       '<button class="btn orange" type="button" onclick="mostrarBloquear('+row.id+')" ><i class="medium material-icons">lock</i></button>'+
                       '<button class="btn red" type="button" onclick="mostrarEliminar('+row.id+')" ><i class="medium material-icons">delete_forever</i></button>';
                }, 
            }
          ]
    } );


    $("#btnAddUsuario").on("click", function(event){
        $('#frmUsuario').trigger("reset");
        modalUsuario.open();
    });
    
    $("#btnCrearUsuario").on("click", function(event){
        crearUsuario();
    });
    $("#btnCambiarRol").on("click", function(event){
        guardarRol();
    });
    $("#btnBloquear").on("click", function(event){
        bloquearUsuario();
    });
    $("#btnEliminar").on("click", function(event){
        eliminarUsuario();
    });

    
}

function mostrarCambiarRol( idUsuario){
    var row = tablaUsuarios.row('#'+idUsuario);
    var json = row.data();
    if(json.estadodetalle ==='BLOC'){
        _mostrarMensajeError("No se puede cambiar el Rol. el usuario "+json.user+" está bloqueado");
        return;
    }
    console.log(json)
    $("#idusuario_").val(json.id);
    $("#idrol_act").val(json.idrol);
    $("#nombres_").html(json.apellidos+" "+json.nombres);
    $("#usuario_").html(json.user);
    $("#rola_").html(json.roldescripcion);
    modalCambiarRol.open();
}

function guardarRol(){
    var dataSend=_getDataForm("frmUsuarioRolMod");
    if(dataSend == null){
        return;
    }
    var arrayInsert=[];
    var newPK= {id: {idusuario: dataSend.idusuario, idrol:dataSend.idrol } , activo:1} ; 
    var insert = {  alias:"usuarioroles", tabla:"usuarioroles",  obj:newPK }
    var oldPK= {id: {idusuario: dataSend.idusuario, idrol: $("#idrol_act").val() } , activo:0} ; 
    var caducar = {  alias:"usuarioroles", tabla:"usuarioroles",  obj:oldPK }
    arrayInsert.push(insert);
    arrayInsert.push(caducar);
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            modalCambiarRol.close();
            _mostrarMensajeExito("Se ha guardado el nuevo rol.", function(){           
                consultarListas();                    
            });              
            var email = {                                    
                user:dataSend.idusuario,
                rol:$("#frmUsuarioRolMod #idrol_").find(":selected").text()
            }
            _post("/emailcambiarrol",email, function(data){ });
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}

function mostrarBloquear( idUsuario){
    var row = tablaUsuarios.row('#'+idUsuario);
    var json = row.data();
    if(json.estadodetalle ==='BLOC'){
        _mostrarMensajeError("No se puede cambiar el Rol. el usuario "+json.user+" está bloqueado");
        return;
    }
    console.log(json)
    $("#frmBloquear #idusuario_").val(json.id);
    $("#frmMostrarBloquear #nombres_").html(json.apellidos+" "+json.nombres);
    $("#frmMostrarBloquear #usuario_").html(json.user);
    $("#estado_").html(json.estadodetalle);
    modalBloquear.open();
}

function bloquearUsuario(){
    var dataSend=_getDataForm("frmBloquear");
    if(dataSend == null){
        return;
    }
    var arrayInsert=[]; 
    var modificar = {  alias:"usuario", tabla:"usuario",  obj:dataSend }
    arrayInsert.push(modificar);
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            modalBloquear.close();
            _mostrarMensajeExito("Se ha actualizado los datos.", function(){           
                consultarListas();                    
            });              
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}



function mostrarEliminar( idUsuario){
    var row = tablaUsuarios.row('#'+idUsuario);
    var json = row.data();
    console.log(json)
    $("#frmMostrarEliminar #nombres_").html(json.apellidos+" "+json.nombres);
    $("#frmMostrarEliminar #usuario_").html(json.user);
    $("#frmMostrarEliminar #id").val(json.id);
    modalEliminar.open();
}

function eliminarUsuario(){
    var dataSend=_getDataForm("frmMostrarEliminar");
    if(dataSend == null){
        return;
    }
    dataSend.estadodetalle ='DEL';
    var arrayInsert=[]; 
    var modificar = {  alias:"usuario", tabla:"usuario",  obj:dataSend }
    arrayInsert.push(modificar);
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            modalEliminar.close();
            _mostrarMensajeExito("Se ha eliminado al usuario.", function(){           
                consultarListas();                    
            });              
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}



function consultarListas(){
    tablaUsuarios.clear();
    var optionsConsulta= [  
        { alias:"usuario", tabla:"usuario u inner join persona p on u.idpersona = p.id left join usuarioroles ur on ur.idusuario=u.id left join roles r on r.id=ur.idrol ", 
          campos:"u.id, u.estadodetalle, u.user, u.idpersona, p. nombres, p.apellidos, ur.idrol, r.nombre rol, r.descripcion roldescripcion ",  
          filtro: "u.estadodetalle in ('ACT', 'BLOC', 'TEMP') and u.idcompania="+_idcompania +" and ur.activo=1",  orderby:"u.fingreso desc"  },        
    ]
    _consultarEntidad(optionsConsulta, function(data){
        console.log(data);
        for( var i =0 ; i < data.data.length ; i++){
            var entidad =data.data[i]; 
            jQuery.each(entidad, function(key, arrayJsonDatos ) {    
                // jsonDatos = [ {}, {}, {} ]   
               if(key === "usuario" ){
                console.log(arrayJsonDatos)
                tablaUsuarios.clear();
                tablaUsuarios.rows.add( arrayJsonDatos ).draw();
               }               
            }); 
        }
    });
}


function crearUsuario(){    
    var dataSend=_getDataForm("frmPersona");
    if(dataSend == null){
        return;
    }
    var dataSendUs=_getDataForm("frmUsuario");
    if(dataSendUs == null){
        return;
    }
    var dataSendRol=_getDataForm("frmUsuarioRol");
    if(dataSendRol == null){
        return;
    }
    dataSend.estadocatalogo='ESTPER';
    dataSend.estadodetalle='ACT';
    dataSend.uingreso=_jsonUsuario.idusuario;
    dataSend.idcompania=_idcompania;

    dataSendUs.idpersona='persona.id';
    dataSendUs.estadocatalogo='ESTUS';
    dataSendUs.estadodetalle='TEMP';
    dataSendUs.pass=_generarString();
    dataSendUs.idcompania=_idcompania;

    dataSendRol.activo=1;
    dataSendRol.idusuario='usuario.id';

    var arrayInsert=[];
    arrayInsert.push({  alias:"persona", tabla:"persona",  obj:dataSend });
    arrayInsert.push({  alias:"usuario", tabla:"usuario",  obj:dataSendUs});
    arrayInsert.push({  alias:"usuarioroles", tabla:"usuarioroles",  obj:dataSendRol});


    var optionsConsulta= [  
        { alias:"usuario", tabla:"usuario",  campos:"user",  
          filtro: "user='"+dataSendUs.user+"' and  idcompania="+_idcompania,  orderby:"user"  },        
    ]
    _consultarEntidad(optionsConsulta, function(data){        
        for( var i =0 ; i < data.data.length ; i++){
            var entidad =data.data[i]; 
            jQuery.each(entidad, function(key, arrayJsonDatos ) {    
                // jsonDatos = [ {}, {}, {} ]   
               if(arrayJsonDatos.length > 0 ){
                 _mostrarMensajeError("El usuario "+dataSendUs.user+" ya existe,  ingrese otro nombre de usuario")
               }else{
                    _post("/insertar",arrayInsert, function(data){
                        if(data.statusCode == 0){    
                            modalUsuario.close(); 
                            var email = {
                                nombre:dataSend.nombres,
                                user:dataSendUs.user,
                                pass:dataSendUs.pass,
                                destinatario:dataSend.email,
                                rol: $("#frmUsuarioRol #idrol").find(":selected").text()
                            }
                            _post("/emailbienvenida",email, function(data){ });

                            _mostrarMensajeExito("Se ha creado el usuario", function(){
                                consultarListas();
                            });              
                        }else{
                            _mostrarMensajeError(data.error);  
                        }   
                    });
               }
               
            }); 
        }
    });


}


