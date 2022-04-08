var tablaSolicitudes;
var modalSolicitud = M.Modal.init(document.querySelector('#modalSolicitud'), {dismissible: true,});

function disparadorPaginaInicial() {

    initAcciones();
    consultarListas()
};



function initAcciones(){
    tablaSolicitudes = $('#tablaSolicitudes').DataTable( {
        data: [],
        columns: [
            { data: 'identificacion' },
            { data: 'nombres' },
            { data: 'fingreso' }
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
                return moment(data).calendar();
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
    $("#frmSolicitudCredito  #nombres").html(json.apellidos+ ' '+json.nombres);

    $("#frmSolicitudCredito  #valortotal").html( parseFloat($("#frmSolicitudCredito  #valortotal").html() ).toFixed(2) );
    $("#frmSolicitudCredito  #fingreso").html( $("#frmSolicitudCredito  #fingreso").html()+ " (" +moment($("#frmSolicitudCredito  #fingreso").html() ).calendar() +")");



    $("#btnDescargarSolicitudCredito").unbind();
        $("#btnDescargarSolicitudCredito").on("click", function(event){
            _mostrarMensajeConfirmacion("¿Desea generar el Reportge PDF?, esto podria tardar varios minutos",function(){
                 modalSolicitud.close();
                 _mostrarMensajeInfo("Espere mientras se genere el reporte, esto tardara varios minutos.");
                 location.href=URL+"/pdf?solicitud="+json.id;
            });

        });
    //$("#btnDescargarSolicitudCredito").attr("href", URL+"/pdf?solicitud="+json.id );
}



function consultarListas(){
    tablaSolicitudes.clear();
    var filtroUsuario ="";
    if(_jsonUsuario.idrol!="1"){
          filtroUsuario =" and s.idusuario="+_jsonUsuario.idusuario;
    }
    var optionsConsulta= [
        { alias:"solicitudcredito", tabla:"solicitudcredito s inner join persona p on s.idpersona = p.id ", 
          campos:"s.id, s.idpersona, s.fingreso, s.estado, s.valortotal, s.entrada, s.frecuencia, s.festado, s.comentario, p.identificacion, p.apellidos,  p.nombres",  
          filtro: "s.estado='NEG' "+filtroUsuario,  orderby:"fingreso desc "  },
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
        _mostrarPaginaInicial();
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