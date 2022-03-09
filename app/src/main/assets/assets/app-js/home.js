var numReferencias=1;
var numReferenciasMax=3;
var IDPERSONA=0;
var IDSOLICITUDCREDITO=0;
var numFotoDomicilio=0;

var modalProducto = M.Modal.init(document.querySelector('#modalProducto'), {dismissible: false,});
var modalUbicacion = M.Modal.init(document.querySelector('#modalUbicacion'), {dismissible: false,});
var dropPersona = M.Dropdown.init(document.querySelector('#dropPersonaMenu'), {});

var tablaProductos;

var optionsConsulta= {
    "#estadocivildetalle": { alias:"EST_CIV", tabla:"catalogodetalle", campos:"codigo, nombre",  filtro:"ccatalogo = 'EST_CIV' and activo=1 ",  orderby:"orden"  },
    "#tipodirecciondetalle": { alias:"TIPODOM", tabla:"catalogodetalle", campos:"codigo, nombre",  filtro:"ccatalogo = 'TIPODOM' and activo=1 ",  orderby:"orden"  },
    "select[name='tipotelefonodetalle']": { alias:"TIPOTLF", tabla:"catalogodetalle", campos:"codigo, nombre",  filtro:"ccatalogo = 'TIPOTLF' and activo=1 ",  orderby:"orden"  },
    "#tipodomiciliogarante": { alias:"TIPODOMGAR", tabla:"catalogodetalle", campos:"codigo, nombre",  filtro:"ccatalogo = 'TIPODOM' and activo=1 ",  orderby:"orden"  },
    "#generodetalle": { alias:"GENER", tabla:"catalogodetalle", campos:"codigo, nombre",  filtro:"ccatalogo = 'GENER' and activo=1 ",  orderby:"nombre"  },
    "#ocupacion": { alias:"OCUPACION", tabla:"ocupacion", campos:"codigo, nombre",  filtro:" activo=1 ",  orderby:"nombre"  },
    "#cprovincia": { alias:"PROVINCIAS", tabla:"provincia", campos:"codigo, nombre",  filtro:"1=1",  orderby:"nombre"  },
    "#cciudad": { alias:"CIUDADES", tabla:"ciudad", campos:"codigo, nombre",  filtro:"1=1",  orderby:"secuencia"  },
}

function disparadorPaginaInicial() {

    initAcciones();
    
    var datepicker = document.querySelectorAll('#fnacimiento');
    var datepickerins = M.Datepicker.init(datepicker, {format:'yyyy-mm-dd', minDate: new Date(1930,1,1), maxDate:new Date(2018,1,1), defaultDate: new Date(1980,0,1), yearRange:40} );

    var select = document.querySelectorAll('select');
    var instancesselect = M.FormSelect.init(select, {});
    _consultarCatalogo(optionsConsulta);

    
};



function initAcciones(){
    $("#btnGuardar1").on("click", function(event){
        guardarTab1();
    });

    $("#btnGuardar2").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar la direccion, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab2();
    });
    $("#btnGuardar3").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar el conyuge, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab3();
    });
    $("#btnGuardar4").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar el garante, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab4();
    });

    $("#btnGuardar5").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar la Guardar Actividad Economica, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab5();
    });
    $("#btnGuardar6").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar los Ingresos y Egresos, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab6();
    });
    $("#btnGuardar7").on("click", function(event){
        if(IDPERSONA ==0 ){
            _mostrarMensajeError("No se puede guardar las firmas, primero debe ingresar los datos de la persona");
            return;
        }
        guardarTab7();
    });
    $("#btnGuardar8").on("click", function(event){        
        guardarTab8();
    });
    $("#btnRepetirFirma1").on("click", function(event){
        Android.abrirDialogoFirma('imgPersona');
        /*limpiarFirma1();
        $("#contF1").empty();
        $("#contF1").html('<canvas id="firma1"></canvas>');
        initVariablesF1();
        eventosF1();*/
    });
    $("#btnRepetirFirma2").on("click", function(event){
        limpiarFirma2();
        $("#contF2").empty();
        $("#contF2").html('<canvas id="firma2"></canvas>');
        initVariablesF2();
        eventosF2();
    });
    $("#btnFotoPersona").on("click", function(event){
        Android.tomarFoto('imgPersona');
    });

    $("#btnFotoDomicilio").on("click", function(event){
        numFotoDomicilio++;
        if(numFotoDomicilio <= 3){
            Android.tomarFoto('imgDireccion'+numFotoDomicilio);
        }else{
            M.toast({html: "Solo puede tomar hasta tres fotos", displayLength:5000});  
        }                
    });


    $("#btnCedulaAnversoSolicitante").on("click", function(event){
        Android.tomarFoto('imgCedulaAnversoSolicitante');
    });

    $("#btnCedulaReversoSolicitante").on("click", function(event){
        Android.tomarFoto('imgCedulaReversoSolicitante');
    });

    $("#btnServicioSolicitante").on("click", function(event){
        Android.tomarFoto('imgServicioSolicitante');
    });

    $("#btnCedulaAnversoGarante").on("click", function(event){
        Android.tomarFoto('imgCedulaAnversoGarante');
    });

    $("#btnCedulaReversoGarante").on("click", function(event){
        Android.tomarFoto('imgCedulaReversoGarante');
    });

    $("#btnServicioGarante").on("click", function(event){
        Android.tomarFoto('imgServicioGarante');
    });

    $("#btnImgAux1").on("click", function(event){
        Android.tomarFoto('imgAux1');
    });

    $("#btnImgAux2").on("click", function(event){
        Android.tomarFoto('imgAux2');
    });

    $("#btnImgAux3").on("click", function(event){
        Android.tomarFoto('imgAux3');
    });

    $("#btnAddReferencia").on("click", function(event){
        if(numReferencias < numReferenciasMax  ){
            $("#tblReferencias").append(
                '<tr id="itemReferencia'+numReferencias+'"   style="display:none;" > '+
                '   <td> <input  type="hidden" name="referenciaid" value="0" > <input  type="text" name="referencianombres" placeholder="Nombres y apellidos" > </td> '+
                '   <td style="width: 35%; padding-left: 25px;">  <input  type="number" name="referenciatelefono"  placeholder="Telfonos">  </td>'+
                '</tr>');
            $("#itemReferencia"+numReferencias).slideDown(1000);
            numReferencias++;
        }                
    });

    $("#linkTest2").on("click", function(event){
        jQuery("select[name='tipotelefonodetalle']").each(function() {                       
            if($(this).attr('id') === "tipoTelefono"){
                $(this).val('T')                
            }
            if($(this).attr('id') === "tipoCelular"){
                $(this).val('C')
            }
            if($(this).attr('id') === "tipoWhatsapp"){
                $(this).val('W')
            }    
        });
        M.FormSelect.init(document.querySelectorAll('select'), {});
        $( "input[name='tipotelefonocatalogo']" ).next().hide();
    });


    $("#btnBuscarPersona").on("click", function(e){
        consultarPersona();
    });
   
    $("#btnCancelar").on("click", function(e){
        window.location.reload(true);
    });

    $("#btnAddProducto").on("click", function(e){
        if(IDSOLICITUDCREDITO == 0){
            _mostrarMensajeError("Debe completar primero los datos informativos anteriores")
        }else{
            $("#datosAddProducto").trigger("reset");
            modalProducto.open();
        }
        
    });

    $("#btnGuardarProducto").on("click", function(e){
        guardarProducto();
    });
    
    $("#cantidad").keyup( function(e){
        $("#ptotal").val( parseFloat($("#cantidad").val()) * parseFloat($("#punitario").val())  );
        $("#ptotal").focus();
        $("#cantidad").focus();
    });


    $("#punitario").keyup( function(e){
        $("#ptotal").val( parseFloat($("#cantidad").val()) * parseFloat($("#punitario").val())  );
        $("#ptotal").focus();
        $("#punitario").focus();
    });

    $("#btnUbicacion").on("click", function(e){
        Android.obtenerUbicacion();
    });
    
    $("#btnGuardar9").on("click", function(event){        
        guardarTab9();
    });
    
    initDataTable();
    
}
function mostrarUbicacion(lat, lng){
    console.log(lat);
    console.log(lng);
    cambiarPosicion(lat, lng);
    modalUbicacion.open();
}

function initDataTable(){
    tablaProductos = $('#tablaProductos').DataTable( {
        data: [],
        columns: [ 
            { data: 'modelo' },
            { data: 'descripcion' },
            { data: 'punitario' },
            { data: 'cantidad' },
            { data: 'ptotal' }
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
            { targets: 2, className: 'dt-body-right' ,"render": function ( data, type, row ) {
                return parseFloat(data).toFixed(2);
                }, 
            },
            { targets: 3, className: 'dt-body-right' },
            { targets: 4, className: 'dt-body-right' ,"render": function ( data, type, row ) {
                return parseFloat(data).toFixed(2);
                },
            }
          ]
    } );
}

function consultarPersona(){
    var identificacion = $("#datosPersona #identificacion").val();
    if(identificacion.length < 10){
        return;
    }
    var optionsConsulta= [
        { alias:"datosPersona", tabla:"persona", campos:"*",  filtro: "identificacion= '"+identificacion+"' and   estadodetalle='ACT' ",  orderby:"id"  },
        { alias:"datosSolicitud", tabla:"solicitudcredito s inner join persona p on s.idpersona = p.id ", campos:"s.*",  filtro: "p.identificacion= '"+identificacion+"' and   p.estadodetalle='ACT' and estado ='ING' ",  orderby:"id"  },       
    ]
    _consultarEntidad(optionsConsulta, function(data){
        console.log(data.data)
        jQuery.each(data.data, function() {
            var consultas = this;      
            if(consultas.datosSolicitud != null){
                if(consultas.datosSolicitud.length > 0){
                    IDSOLICITUDCREDITO =  consultas.datosSolicitud[0].id;
                    
                }
            }
            if(consultas.datosPersona != null){
                if(consultas.datosPersona.length > 0){
                    IDPERSONA =  consultas.datosPersona[0].id;
                    if(consultas.datosPersona[0].estadocivildetalle == "SOL"  || consultas.datosPersona[0].estadocivildetalle == "UNI" ){
                        $("#liTab3").hide();
                    }else{
                        $("#liTab3").show();
                    }               
                }
            }

            jQuery.each(consultas, function(form, entidades) {
                jQuery.each(entidades, function() {
                    entidad = this    
                    jQuery.each(entidad, function(key, value ) {        
                        $("#"+form+" #"+key).val(value);
                        if(key !=  "identificacion"){
                            $("#"+form+" #"+key).focus();
                        }
                        M.FormSelect.init(document.querySelectorAll('select'), {});            
                    });
                });
            });
            
        });
        console.log("IDSOLICITUDCREDITO a:"+IDSOLICITUDCREDITO)
        console.log("IDPERSONA:"+IDPERSONA)    
        if(IDPERSONA > 0 ){
            consultarInfopersona();
            consultarListas();
        }
    });

    
}

function consultarInfopersona(){
    console.log("IDSOLICITUDCREDITO b:"+IDSOLICITUDCREDITO)
    var optionsConsulta= [
        { alias:"datosDireccion", tabla:"personadireccion", campos:"*",  filtro: " idpersona= "+IDPERSONA+" and   activo=1 ",  orderby:"id"  },
        { alias:"datosConyuge", tabla:"personaconyuge", campos:"*",  filtro: " idpersona= "+IDPERSONA+" and   activo=1 ",  orderby:"id"  },
        { alias:"datosGarante", tabla:"solicitudgarante", campos:"*",  filtro: " idsolicitud="+IDSOLICITUDCREDITO,  orderby:"id"  },
        { alias:"datosActividad", tabla:"personaactividadeconomica", campos:"*",  filtro: " idpersona="+IDPERSONA+" and   activo=1 ",  orderby:"id"  },
        { alias:"datosDeclaracionIngresos", tabla:"personaingresos", campos:"*",  filtro: " idpersona="+IDPERSONA+" and   activo=1 ",  orderby:"id"  },
        { alias:"datosDeclaracionEgresos", tabla:"personaegresos", campos:"*",  filtro: " idpersona="+IDPERSONA+" and   activo=1 ",  orderby:"id"  },
       
    ]
    _consultarEntidad(optionsConsulta, function(data){
        $("#personaCreditoInfo").hide().html($("#datosPersona #nombres").val()+" "+$("#datosPersona #apellidos").val() + " ("+ $("#datosPersona #identificacion").val()+")").slideDown(1000);
        jQuery.each(data.data, function() {
            var consultas = this;      
            console.log(consultas) 
            jQuery.each(consultas, function(form, entidades) {
                jQuery.each(entidades, function() {
                    entidad = this    
                    jQuery.each(entidad, function(key, value ) {        
                        $("#"+form+"  [name='"+key+"']").val(value).focus();                        
                        M.FormSelect.init(document.querySelectorAll('select'), {});            
                    });
                });
            });
        });
    });
}



function guardarTab1(){
    var dataSend=_getDataForm("datosPersona");
    if(dataSend == null){
        return;
    }
    dataSend.tipoidentifiacioncatalogo='TIPOID';
    dataSend.tipoidentifiaciondetalle='C';
    dataSend.id=IDPERSONA;
    var insert = {  alias:"persona", tabla:"persona",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){
            var persona = data.data[0].persona;
            IDPERSONA = persona.id;
            if(IDSOLICITUDCREDITO == 0){
                crearSolicitud();
            }
            if(persona.estadocivildetalle == "SOL"  || persona.estadocivildetalle == "UNI" ){
               $("#liTab3").hide();
            }else{
                $("#liTab3").show();
            }
            let img = document.getElementById("imgPersona");
            let canvas = document.createElement('canvas');
            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
            let context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                if(blob == null){
                    _mostrarMensajeExito("Se ha guardado los datos de la persona", function(){
                        $("#linkTest2").click();
                        $("#personaCreditoInfo").hide().html(persona.nombres+" "+persona.apellidos + " ("+ persona.identificacion+")").slideDown(1000);
                    });
                    return;
                }
                var data = new FormData();
                data.append('idpersona', IDPERSONA);
                data.append('imagen', blob);
                data.append('tipoimagencatalogo', "TIPOIMG");
                data.append('tipoimagendetalle', "IMGPER");
                _postArchivo("/insertarImagen",data, function(dataRes){

                    if(dataRes.statusCode == 0){
                        _mostrarMensajeExito("Se ha guardado los datos de la persona", function(){
                            $("#linkTest2").click();
                            $("#personaCreditoInfo").hide().html(persona.nombres+" "+persona.apellidos + " ("+ persona.identificacion+")").slideDown(1000);
                        });
                    }else{
                        _mostrarMensajeError(dataRes.error);
                    }
                });
            });
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}

function guardarTab2(){    
    var dataSend=_getDataForm("datosDireccion");
    if(dataSend == null){
        return;
    }
    
    var arrayInsert=[];

    var telfono = $("[name='telfono']");
    var tipotelefonocatalogo = $("[name='tipotelefonocatalogo']");       
    var tipotelefonodetalle = $("[name='tipotelefonodetalle']");       
    var telefonoid = $("[name='telefonoid']");       
    var telefonos=[];
    for(i=0; i<telfono.length; i++){
        if($(telfono[i]).val().length > 0 ){
            telefonos.push({ 
                telfono :  $(telfono[i]).val(),
                tipotelefonocatalogo :  $(tipotelefonocatalogo[i]).val(),
                tipotelefonodetalle :  $(tipotelefonodetalle[i]).val(),
                id :  $(telefonoid[i]).val(),
                idpersona:IDPERSONA,
                activo:1
            });        
        }            
    }
    for(i=0; i<telefonos.length; i++){
        arrayInsert.push({  alias:"personatelefono"+i, tabla:"personatelefono",  obj:telefonos[i] });
    }


    var referencianombres = $("[name='referencianombres']");
    var referenciatelefono = $("[name='referenciatelefono']");       
    var referenciaid = $("[name='referenciaid']");       
    var referencias=[];
    for(i=0; i<referencianombres.length; i++){
        if($(referencianombres[i]).val().length > 0 ){
            referencias.push({ 
                nombre :  $(referencianombres[i]).val(),
                telefono :  $(referenciatelefono[i]).val(),
                id :  $(referenciaid[i]).val(),
                idpersona:IDPERSONA
            });        
        }            
    }

    if(referencias.length == 0){
        _mostrarMensajeError("Ingrese una referencia."); 
        return;
    }

    for(i=0; i<referencias.length; i++){
        arrayInsert.push({  alias:"referencia"+i, tabla:"personareferencia",  obj:referencias[i] });
    }
    dataSend.idpersona=IDPERSONA;
    dataSend.activo=1;
    arrayInsert.push({  alias:"personadireccion", tabla:"personadireccion",  obj:dataSend });


    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){

            $("#tblReferencias").empty();
            numReferencias= 0;
            var entidad = data.data;
            jQuery.each(entidad, function(i, jsonDatos ) {                                    
                jQuery.each(jsonDatos, function(key, json){   
                    if(key.indexOf("referencia") > -1){
                        $("#tblReferencias").append(
                            '<tr id="itemReferencia'+json.id+'" > '+
                            '   <td> <input  type="hidden" name="referenciaid" value="'+json.id+'" >  <input  type="text" name="referencianombres" placeholder="Nombres y apellidos" value="'+json.nombre+'" > </td> '+
                            '   <td style="width: 35%; padding-left: 25px;">  <input  type="number" name="referenciatelefono"  value="'+json.telefono+'" placeholder="Telfonos" maxlength="10">  </td>'+
                            '</tr>');
                        numReferencias++;
                    }                                
                });
            });

            var imgHtml= [];
            var tipoImagen= [];
            imgHtml.push("imgDireccion1");
            tipoImagen.push("IMDIR1");
            imgHtml.push("imgDireccion2");
            tipoImagen.push("IMDIR2");
            imgHtml.push("imgDireccion3");
            tipoImagen.push("IMDIR3");

            guardarImagenes(imgHtml, tipoImagen, 0, function(){
                _mostrarMensajeExito("Se ha guardado los datos de la Direccion", function(){
                    $("#linkTest3").click();
                });
            } )
            
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}



function guardarTab3(){    
    var dataSend=_getDataForm("datosConyuge");
    if(dataSend == null){
        return;
    }
    dataSend.idpersona=IDPERSONA;
    dataSend.activo=1;
    var insert = {  alias:"personaconyuge", tabla:"personaconyuge",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            _mostrarMensajeExito("Se ha guardado los datos del conyuge", function(){
                $("#linkTest8").click();                     
            });  
            
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}



function crearSolicitud(){    
    var dataSend = {   estado :  1, idpersona:IDPERSONA, estado:_ESTADOSOLICITUDINGRESADO };              
    var insert = {  alias:"solicitudcredito", tabla:"solicitudcredito",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            var solicitudcredito = data.data[0].solicitudcredito;   
            IDSOLICITUDCREDITO = solicitudcredito.id;                               
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}


function guardarTab4(){    
    var dataSend=_getDataForm("datosGarante");
    if(dataSend == null){
        return;
    }
    dataSend.idsolicitud=IDSOLICITUDCREDITO;
    var insert = {  alias:"solicitudgarante", tabla:"solicitudgarante",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            _mostrarMensajeExito("Se ha guardado los datos del Garante", function(){
                $("#linkTest5").click();                     
            });  
            
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}


function guardarTab5(){    
    var dataSend=_getDataForm("datosActividad");
    if(dataSend == null){
        return;
    }
    dataSend.idpersona=IDPERSONA;
    dataSend.activo=1;
    var insert = {  alias:"personaactividadeconomica", tabla:"personaactividadeconomica",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            _mostrarMensajeExito("Se ha guardado los datos de la Actividad Economica", function(){
                $("#linkTest6").click();                     
            });  
            $("#datosDeclaracionIngresos #ingresos").val($("#datosActividad #sueldo").val())
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}


function guardarTab6(){    
    var dataSendI=_getDataForm("datosDeclaracionIngresos");
    if(dataSendI == null){
        return;
    }
    var dataSendE=_getDataForm("datosDeclaracionEgresos");
    if(dataSendE == null){
        return;
    }
    var sumIngresos=0;
    var sumEgresos=0;

    jQuery.each(dataSendI, function(i, val) {
        sumIngresos = sumIngresos + parseFloat(val)
    });
    
    jQuery.each(dataSendE, function(i, val) {
        sumEgresos = sumEgresos + parseFloat(val)
    });

    dataSendI.totalingresos=sumIngresos;
    dataSendE.totalegresos=sumEgresos;
    dataSendI.idpersona=IDPERSONA;
    dataSendE.idpersona=IDPERSONA;
    dataSendI.activo=1;
    dataSendE.activo=1;
    var arrayInsert=[];
    arrayInsert.push({  alias:"personaingresos", tabla:"personaingresos",  obj:dataSendI });
    arrayInsert.push({  alias:"personaegresos", tabla:"personaegresos",  obj:dataSendE });
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            _mostrarMensajeExito("Se ha guardado los datos de INGRESOS Y EGRESOS", function(){
                $("#linkTest7").click();                     
            });  
            
        }else{
            _mostrarMensajeError(data.error);  
        }  
    });
}




function guardarTab7(){    
    var firma1 = document.getElementById('firma1');
    var firma2 = document.getElementById('firma2');
    console.log(firma1)
    
    var blobFirma1 = null;   
    var blobFirma2 = null;
    
    firma1.toBlob(function(blob) {
        blobFirma1 = blob;
        firma2.toBlob(function(blob) {
            blobFirma2 = blob;
            if(blobFirma1.size < 7000){
                _mostrarMensajeError("Ingrese la firma del solicitante");
                return;
            }
            if(blobFirma2.size < 7000){
                _mostrarMensajeError("Ingrese la firma del garante o conyuge");
                return;
            }
            
            var data = new FormData();
            data.append('idpersona', IDPERSONA);
            data.append('imagen', blobFirma1);
            data.append('tipoimagencatalogo', "TIPOIMG");
            data.append('tipoimagendetalle', "FIRSOL");
            _postArchivo("/insertarImagen",data, function(dataRes){
                if(dataRes.statusCode == 0){     
                    var data = new FormData();
                    data.append('idpersona', IDPERSONA);
                    data.append('imagen', blobFirma2);
                    data.append('tipoimagencatalogo', "TIPOIMG");
                    data.append('tipoimagendetalle', "FIGAR");       
                    _postArchivo("/insertarImagen",data, function(dataRes){
                        if(dataRes.statusCode == 0){            
                            _mostrarMensajeExito("Se han guardado las Firmas.", function(){
                                   
                            });                              
                        }else{
                            _mostrarMensajeError(dataRes.error);  
                        }  
                    });                      
                }else{
                    _mostrarMensajeError(dataRes.error);  
                }  
            });
        });
    });


}


function guardarTab8(){    
    if(IDSOLICITUDCREDITO == 0){
        _mostrarMensajeError("Debe completar primero los datos informativos anteriores")
        return;
    }else{
        var dataProductos = tablaProductos.rows().data();
        if(dataProductos.length <1 ){
            _mostrarMensajeError("Ingrese al menos un producto");
            return;
        }
    }

    var dataSend=_getDataForm("datosSolicitud");
    if(dataSend == null){
        return;
    }
    dataSend.id= IDSOLICITUDCREDITO;
    dataSend.estado= _ESTADOSOLICITUDINGRESADO;
    dataSend.idpersona= IDPERSONA;           
    var insert = {  alias:"solicitudcredito", tabla:"solicitudcredito",  obj:dataSend }
    var arrayInsert=[insert];
    _post("/insertar",arrayInsert, function(data){
        if(data.statusCode == 0){            
            _mostrarMensajeExito("Se han guardado los productos.", function(){
                $("#linkTest5").click();        
            });
        }else{
            _mostrarMensajeError(data.error);  
        }   
    });
}



function mostrarFoto(strBase64, html){
    $("#"+html).attr("src", "data:image/png;base64,"+strBase64);
}


function consultarListas(){
    tablaProductos.clear();
    var optionsConsulta= [
        { alias:"creditoproducto", tabla:"creditoproducto", campos:"*",  filtro: "idsolicitudcredito= "+IDSOLICITUDCREDITO+" and   activo=1 ",  orderby:"id"  },        
        { alias:"personatelefono", tabla:"personatelefono", campos:"id, telfono, tipotelefonodetalle",  filtro: "idpersona= "+IDPERSONA+" and   activo=1 ",  orderby:"id"  },        
        { alias:"personareferencia", tabla:"personareferencia", campos:"*",  filtro: "idpersona= "+IDPERSONA,  orderby:"id"  },        
    ]
    _consultarEntidad(optionsConsulta, function(data){
        for( var i =0 ; i < data.data.length ; i++){
            var entidad =data.data[i]; 
            jQuery.each(entidad, function(key, arrayJsonDatos ) {    
                // jsonDatos = [ {}, {}, {} ]   
               if(key === "creditoproducto" ){
                tablaProductos.clear();
                tablaProductos.rows.add( arrayJsonDatos ).draw();
               }
               if(key === "personatelefono" ){
                    $('input[name^="telfono"]').each(function(i, item){
                        $(this).val(arrayJsonDatos[i].telfono);
                    });
                    $('input[name^="telefonoid"]').each(function(i, item){
                        $(this).val(arrayJsonDatos[i].id);
                    });
               }
               if(key === "personareferencia" ){
                console.log(arrayJsonDatos)
                $("#tblReferencias").empty();
                numReferencias= 0;
                jQuery.each(arrayJsonDatos, function(i, json){                    
                    $("#tblReferencias").append(
                        '<tr id="itemReferencia'+json.id+'" > '+
                        '   <td> <input  type="hidden" name="referenciaid" value="'+json.id+'" >  <input  type="text" name="referencianombres" placeholder="Nombres y apellidos" value="'+json.nombre+'" > </td> '+
                        '   <td style="width: 35%; padding-left: 25px;">  <input  type="number" name="referenciatelefono"  value="'+json.telefono+'" placeholder="Telfonos">  </td>'+
                        '</tr>');
                    numReferencias++;
                });
           }

            });

            
        }
        
    });
}


function guardarProducto(){
    var dataSend=_getDataForm("datosAddProducto");
    if(dataSend == null){
        return;
    }
    dataSend.activo=1;
    dataSend.idsolicitudcredito=IDSOLICITUDCREDITO;
    var arrayInsert=[];
    arrayInsert.push({  alias:"creditoproducto", tabla:"creditoproducto",  obj:dataSend });
    _post("/insertar",arrayInsert, function(data){
        modalProducto.close();  
        if(data.statusCode == 0){    
            var p=data.data[0].creditoproducto; 
            _mostrarMensajeExito("Se ha guardado el producto", function(){
                
                tablaProductos.rows.add( [p] ).draw();
                console.log(tablaProductos.rows().data().length)
                
                /*$("#tablaProductos").append(
                '<tr id="'+p.id+'" >'+
                '  <td >'+p.modelo+'</td>'+
                '  <td >'+p.descripcion+'</td> '+
                '  <td class="dt-body-right">'+ parseFloat(p.punitario).toFixed(2)+'</td> '+                
                '  <td class="dt-body-right">'+p.cantidad+'</td> '+
                '  <td class="dt-body-right">'+ parseFloat(p.ptotal).toFixed(2)+'</td> '+
                '</tr>         ');*/
            });  
            $("#valortotal").val( parseFloat($("#valortotal").val()) + parseFloat(p.ptotal) );
            $("#entrada").focus();
            
            
           
        }else{
            _mostrarMensajeError(data.error);  
        }  
    });
}

function guardarTab9(){
    var imgHtml= [];
    var tipoImagen= [];
    imgHtml.push("imgCedulaAnversoSolicitante");
    tipoImagen.push("CEDAS");
    imgHtml.push("imgCedulaReversoSolicitante");
    tipoImagen.push("CEDRS");
    imgHtml.push("imgServicioSolicitante");
    tipoImagen.push("SERSOL");
    imgHtml.push("imgCedulaAnversoGarante");
    tipoImagen.push("CEDAG");
    imgHtml.push("imgCedulaReversoGarante");
    tipoImagen.push("CEDRG");
    imgHtml.push("imgServicioGarante");
    tipoImagen.push("SERGAR");
    imgHtml.push("imgAux1");
    tipoImagen.push("AUX1");
    imgHtml.push("imgAux2");
    tipoImagen.push("AUX2");
    imgHtml.push("imgAux3");
    tipoImagen.push("AUX3");


    guardarImagenes(imgHtml, tipoImagen, 0, function(){
        _mostrarMensajeExito("Se han guardado las Imagenes.", function(){
            $("#test7").click();        
        });
    } )
}


function guardarImagenes(imgHtml, tipoImagen, i,  callback){
    let img = document.getElementById(imgHtml[i]);
    let canvas = document.createElement('canvas');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    canvas.toBlob(function(blob) {
        if(blob == null){
            i++;
            if(i < imgHtml.length ){
                guardarImagenes(imgHtml, tipoImagen, i++,  callback);                    
            }else{
                callback();
            }
        }
        var data = new FormData();
        data.append('idpersona', IDPERSONA);
        data.append('imagen', blob);
        data.append('tipoimagencatalogo', "TIPOIMG");
        data.append('tipoimagendetalle', tipoImagen[i]);
        console.log('guardar '+i + '  - '+imgHtml[i]);
        _postArchivo("/insertarImagen",data, function(dataRes){
            i++;
            if(dataRes.statusCode == 0){
                if(i < imgHtml.length ){
                    console.log('continuar '+i);
                    guardarImagenes(imgHtml, tipoImagen, i,  callback);
                }else{
                    console.log('finalizar '+i);
                    callback();
                }
            }else{
                _mostrarMensajeError(dataRes.error);
            }
        });
    });
}