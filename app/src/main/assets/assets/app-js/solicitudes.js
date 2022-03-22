var tablaSolicitudes;
var modalSolicitud = M.Modal.init(document.querySelector('#modalSolicitud'), {dismissible: true,});

function disparadorPaginaInicial() {

    initAcciones();
    consultarListas()
    validarPermisos();
};

function validarPermisos(){
     console.log(_jsonUsuario);
     console.log(_jsonUsuario.idrol!="1");
     if(_jsonUsuario.idrol!="1"){
         $("#areaBotonesSolicitud").hide()
     }
}

function initAcciones(){
    tablaSolicitudes = $('#tablaSolicitudes').DataTable( {
        data: [],
        columns: [ 
            { data: 'id' },
            { data: 'identificacion' },
            { data: 'nombres' },
            { data: 'fingreso' },
            { data: 'valortotal' }
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
            { targets: 2,"render": function ( data, type, row ) {
               return row.apellidos+ ' '+row.nombres;
                }, 
            },
            { targets: 3,"render": function ( data, type, row ) {
                return data;
                }, 
            },
            { targets:4,  className: 'dt-body-right' ,"render": function ( data, type, row ) {
                return parseFloat(data).toFixed(2);
                },
            }
          ]
    } );


    $('#tablaSolicitudes tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tablaSolicitudes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var data = tablaSolicitudes.rows(['.selected']).data().toArray()[0];
            mostrarDataForm(data);
        }
    } );


    $("#btnAprobarSolicitud").on("click", function(event){
        guardarSolicitud("APR");
    });
    $("#btnNegarSolicitud").on("click", function(event){
        guardarSolicitud("NEG");
    });
    
}

function mostrarDataForm( json){
    jQuery.each(json, function(key, value){
        $("#frmSolicitudCredito  #"+key).html(value).focus();   
        $("#frmSolicitudCredito [name='"+key+"']").val(value);
    });
    modalSolicitud.open();
    $("#frmSolicitudCredito  #nombres").html(json.apellidos+ ' '+json.nombres).focus();   
    $("#comentario").focus();
    $("#btnDescargarSolicitudCredito").attr("href", URL+"/pdf?solicitud="+json.id );
}



function consultarListas(){
    tablaSolicitudes.clear();
    var optionsConsulta= [
        { alias:"solicitudcredito", tabla:"solicitudcredito s inner join persona p on s.idpersona = p.id ", 
          campos:"s.id, s.idpersona, s.fingreso, s.estado, s.valortotal, s.entrada, s.frecuencia, s.festado, s.comentario, p.identificacion, p.apellidos,  p.nombres",  
          filtro: "s.estado='ING' ",  orderby:"fingreso desc "  },        
    ]
    _consultarEntidad(optionsConsulta, function(data){
        for( var i =0 ; i < data.data.length ; i++){
            var entidad =data.data[i]; 
            jQuery.each(entidad, function(key, arrayJsonDatos ) {    
                // jsonDatos = [ {}, {}, {} ]   
               if(key === "solicitudcredito" ){
                tablaSolicitudes.clear();
                tablaSolicitudes.rows.add( arrayJsonDatos ).draw();
               }
            }); 
        }
    });
}


function guardarSolicitud(estado){    
    var dataSend=_getDataForm("frmSolicitudCredito");
    if(dataSend == null){
        return;
    }
    dataSend.estado=estado;
    var insert = {  alias:"solicitudcredito", tabla:"solicitudcredito",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){    
            modalSolicitud.close();          
            _mostrarMensajeExito("Guardado la Solicitud.", function(){
                consultarListas();            
            });  
            
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}