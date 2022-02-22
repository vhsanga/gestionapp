//moment.locale('es')  ;
const URL="http://192.168.100.65:8080";
//const URL="http://localhost:8080";
const _idcompania=1;
const _iconoError="warning";
const _colorTextoError="#ef5656";
const _iconoSucces="done";
const _colorTextoSucces="#4caf50";
const _KEY_USUARIO="usuario";
var _jsonUsuario=null;

const _ESTADOSOLICITUDINGRESADO='ING';
const _ESTADOSOLICITUDAPROBADO='APR';
const _ESTADOSOLICITUDNEGADO='NEG';
var modalMensaje= null;
var modalLoad= null;

document.addEventListener('DOMContentLoaded', function() {
    _jsonUsuario = JSON.parse(_getClaveValorLocal(_KEY_USUARIO));
    cargarComponentesHtml();    
    cargarMenuNav();
    disparadorPaginaInicial();  // esta funcion esta en caga pagina. es le primero en ejecutarse
  });




function _consultarCatalogo(jsonConsulta){
    var arrayConsulta=[];
    jQuery.each(jsonConsulta, function(idhtml, consultar ) {        
        arrayConsulta.push(consultar);
    });
    _post("/consultarlote",arrayConsulta, function(data){
        if(data.statusCode == 0){
            jQuery.each(data.data, function() {
                var catalogos = this;
                jQuery.each(catalogos, function(ccatalogo, array) {
                    jQuery.each(jsonConsulta, function(idhtml, jsonConsulta ) {
                        if(jsonConsulta.alias === ccatalogo ){                           
                            _llenarCombobox(idhtml, array);
                        }                        
                    });                  
                });
            });                
        }else{
            _mostrarMensajeError(data.error);  
        }          
    });    
}

function _llenarCombobox(idCombobox, array){
    for (var i =0;  i<array.length ;  i++) {               
        $(idCombobox).append($('<option>', {
            value: array[i]['codigo'],
            text: array[i]['nombre']
        }));                        
    M.FormSelect.init(document.querySelectorAll('select'), {});
} 
}


function _consultarEntidad(jsonConsulta, callback){
    var arrayConsulta=[];
    jQuery.each(jsonConsulta, function(index, item ) {        
        arrayConsulta.push(item);
    });
    _post("/consultarlote",arrayConsulta, function(data){        
        if(data.statusCode == 0){
            callback(data);               
        }else{
            _mostrarMensajeError(data.error);  
        }          
    });    
}


function _post(path, jsonSend, callback){
    $.ajax({
        url:URL+path,
        type:"POST",
        data:JSON.stringify(jsonSend),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        beforeSend:function(jqXHR, settings){                     
            modalLoad.open();
        },
        success: function(data){                   
            callback(data);
        },
        error: function(err){
            try{
                _mostrarMensajeError(err.responseJSON.error.description);
            }catch(e){
                _mostrarMensajeError("ERROR DE CONEXION CON EL SERVIDOR");
            }
          console.log(err);
        },
        complete: function(){
            modalLoad.close();
        }
      }); 
}


function _postArchivo(path, dataSend, callback){
    $.ajax({
        url:URL+path,
        type:"POST",
        data: dataSend,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend:function(jqXHR, settings){                     
            modalLoad.open();
        },
        success: function(data){                   
            callback(data);
        },
        error: function(err){
            try{
                _mostrarMensajeError(err.responseJSON.error.description);
            }catch(e){
                _mostrarMensajeError("ERROR DE CONEXION CON EL SERVIDOR");
            }
          console.log(err);
        },
        complete: function(){
            modalLoad.close();
        }
      }); 
}



function _mostrarMensajeError(mensaje){
    $("#txtMensaje").html(mensaje);
    $("#iconoMensaje").html(_iconoError);
    $("#iconoMensaje").css("color",_colorTextoError);                
    modalMensaje.open();
}

function _mostrarMensajeExito(mensaje){
    $("#txtMensaje").html(mensaje);
    $("#iconoMensaje").html(_iconoSucces);
    $("#iconoMensaje").css("color",_colorTextoSucces); 
    modalMensaje.open();
}

function _mostrarMensajeExito(mensaje, callback){
    $("#txtMensaje").html(mensaje);
    $("#iconoMensaje").html(_iconoSucces);
    $("#iconoMensaje").css("color",_colorTextoSucces); 
    $("#btnAceptarMensajexx").unbind();
    $("#btnAceptarMensajexx").click(function(event){
        callback();
    }); 
    
    modalMensaje.open();    
}


const removeAllListeners = function (targetNode, event) {
    // remove listeners from the matching nodes
    _eventHandlers[event]
      .filter(({ node }) => node === targetNode)
      .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture))
 
    // update _eventHandlers global
    _eventHandlers[event] = _eventHandlers[event].filter(
      ({ node }) => node !== targetNode,
    )
  }



function _setClaveValorLocal(clave, valor){
    try{
        var localStorage = window.localStorage;
        localStorage.setItem(clave, valor);
    }catch(e){
        console.log(e);
    }
}


function _getClaveValorLocal(clave){
    try{
        var localStorage = window.localStorage;
        return localStorage.getItem(clave);
    }catch(e){
        return null;
    }
}


function _limpiarClaveValorLocal(){
    try{
        var localStorage = window.localStorage;
        localStorage.clear();
    }catch(e){
        console.log(e);
    }
}


function cargarComponentesHtml(){
    try{
        $("#areaAux").append(htmlModalMensaje);
        $("#areaAux").append(htmlModalLoad);
        modalMensaje = M.Modal.init(document.querySelector('#modalMensaje'), {dismissible: false,});
        modalLoad = M.Modal.init(document.querySelector('#modalLoad'), {dismissible: false, endingTop: '25%'});

    }catch(e){
        console.log(e);
    }
}

function cargarMenuNav(){
    if(_jsonUsuario == null){
        return;
    }
     try{
        $("#areaNav").append(htmlMenuNav);
        M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
        $("#btnSalir").click(function(event){
            _limpiarClaveValorLocal();
            window.location.href = 'index.html';
        });
        $("#spnNombreUsuario").html(_jsonUsuario.nombre);
        $("#spnRolUsuario").html(_jsonUsuario.rol);


    }catch(e){
        console.log(e);
    }
}


var htmlMenuNav=
    '<nav> '+
    ' <div class="nav-wrapper  navBar"> '+
    '   <a href="#" class="brand-logo"> '+
    '        <img class="responsive-img logo left" src="./assets/logo.png" /></a> '+
    '    <a href="#" data-target="slide-out" class="sidenav-trigger right"><i '+
    '      class="material-icons">menu</i></a>      '+
    '  </div> '+
    '</nav> '+
    '<ul id="slide-out" class="sidenav"> '+
    '  <li><div class="user-view"> '+
    '    <div class="background"> '+
    '      <img src="./assets/img/office.jpg"> '+
    '    </div> '+
    '    <a href="#user"><img class="circle" src="./assets/img/yuna.jpg"></a> '+
    '    <a href="#name"><span id="spnNombreUsuario" class="white-text name"></span></a> '+
    '    <a href="#email"><span id="spnRolUsuario" class="white-text email"></span></a> '+
    '  </div></li> '+
    '  <li><a href="home.html"><i class="material-icons">edit</i>Crear Solicitud de Credito</a></li> '+
    '  <li><a href="solicitudes.html"><i class="material-icons">list</i>Solicitudes de credito </a></li> '+
    '  <li><a href="solicitudesA.html"><i class="material-icons">check</i>Solicitudes Aprobadas </a></li> '+
    '  <li><a href="#!">Second Link</a></li> '+
    '  <li><div class="divider"></div></li> '+
    '  <li><a class="subheader">Subheader</a></li> '+
    '  <li><a class="waves-effect" href="#!">Third Link With Waves</a></li> '+
    '  <li><a class="waves-effect" id="btnSalir" href="#!">Salir</a></li> '+
    '</ul>';


var htmlModalMensaje=
    '<div id="modalMensaje" class="modal"> '+
    '    <div class="modal-content"> '+
    '        <i id="iconoMensaje" class="medium material-icons"></i> '+
    '        <p id="txtMensaje"></p> '+
    '    </div> '+
    '    <div class="modal-footer"> '+
    '        <a href="#!" id="btnAceptarMensajexx" class="modal-close waves-effect waves-green btn-flat">Aceptar</a> '+
    '    </div> '+
    '</div>';


var htmlModalLoad=
    '<div id="modalLoad" class="modal" style="width: 325px;"> '+
    '    <div class="modal-content"> '+
    '        <p> Por favor espere. </p> '+
    '        <div class="preloader-wrapper big active"> '+
    '        <div class="spinner-layer spinner-blue-only"> '+
    '          <div class="circle-clipper left"> '+
    '            <div class="circle"></div> '+
    '          </div><div class="gap-patch"> '+
    '            <div class="circle"></div> '+
    '          </div><div class="circle-clipper right"> '+
    '            <div class="circle"></div> '+
    '          </div> '+
    '        </div> '+
    '      </div> </br> </br> '+
    '    </div> '+
    '</div>';






//esta funcion debe ser llamada desde un boton para ser proceder a validar el formulario 
// sirve para validar input text, number, select, radio, checkbox, files, maxlength
function _getDataForm (idFormHtml, validar = true) {
    /* idFormHtml = id del formulario que desamos deserialziar
     *  todos los componentes que se desa deserializar debe tener un 'name' que sera el KEY del json
     *  todos los componente a deseralizar deben ser de la clase css '_formJSON'  
     *  en caso de que el parametro 'validar' =true, se debe hacer el proceso de validacion de campos
     *  input -> 'required=true'  es el tag que sirve para definir si el campo es obligatorio
     *  input -> 'requiredMessage' es el mensaje de alerta en caso de ser campo obligatorio  
     *  input -> 'maxLength' es el tag del input para especificar la longitud maxima que se permite.
     *  input -> 'onlyText' = true es el tag del input para especificar que solo se acepta texto.
     *  input -> 'onlyNumber' = true es el tag del input para especificar que solo se acepta números.
     *  todos los labels asociados a cada input debe pertenecer a la clase '.form-control-label', para poder cambiar de color
     *  cada input/select y su respectivo label debe estar dentro de un div de la clase'.form-group'
     *  returna 'false' en caso de haber error
     *  retorna json obtenido del form en caso de no haber conflicto	
     */

    var items = document.getElementById(idFormHtml).getElementsByClassName('_formJSON');
    var json = {};
    var valorRadio = '';
    for (var i = 0; i < items.length; i++) {
        if (items[i].nodeName === 'INPUT' || items[i].nodeName === 'SELECT' || items[i].nodeName === 'TEXTAREA') {
            if (items[i].getAttribute('type') === 'checkbox') {
                json[items[i].name] = [];
            } else {
                json[items[i].name] = '';
            }
        }
    }

    for (var i = 0; i < items.length; i++) {
        if (items[i].nodeName === 'INPUT' || items[i].nodeName === 'SELECT' || items[i].nodeName === 'TEXTAREA') {
            if (items[i].getAttribute('type') === 'radio') {
                if (items[i].checked) {
                    json[items[i].name] = items[i].value;
                }
            } else if (items[i].getAttribute('type') === 'checkbox') {
                if (items[i].checked) {
                    json[items[i].name].push(items[i].value);
                }
            } else {
                json[items[i].name] = items[i].value
            }
        }
    }

    
    if (validar) {
        var conflictos = {};
        var conflicto_num=0;
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('form-control-warning')
            items[i].parentNode.classList.remove('has-warning')
            var conflicto = false;

            if (items[i].getAttribute('required') === 'true') {
                if (items[i].getAttribute('type') === 'checkbox') {
                    if (json[items[i].name].length == 0) {
                        conflictos[items[i].name] = items[i];
                        conflicto_num++;
                    }
                } else if (json[items[i].name] === '') {
                    conflictos[items[i].name] = items[i];
                    conflicto_num++;
                }
            }

            if (items[i].getAttribute('maxLength') !=null) {
                try {
                    var maxLength=parseInt(items[i].getAttribute('maxLength'));
                    if(json[items[i].name].length > maxLength){
                        items[i].setAttribute('requiredMessage', "El valor el campo '"+items[i].name+"' es demasiado largo, (máximo= "+maxLength+")");
                        conflictos[items[i].name] = items[i];
                        conflicto_num++;
                    }
                } catch(e) {
                    console.log(e);
                }
                
            }
            if (items[i].getAttribute('onlyNumber') === 'true') {
                console.log(items[i])
                try {
                    
                    if (!/^([0-9])*$/.test(json[items[i].name])){
                        items[i].setAttribute('requiredMessage', "El campo '"+items[i].name+"' solo acepta números ");
                        conflictos[items[i].name] = items[i];
                        conflicto_num++;
                    }
                                            
                } catch(e) {
                    console.log(e);
                }
                
            }
            if (items[i].getAttribute('onlyText') === 'true') {
                try {
                    if (!/^[A-Z]+$/i.test(json[items[i].name])){
                        items[i].setAttribute('requiredMessage', "El campo '"+items[i].name+"' solo acepta texto ");
                        conflictos[items[i].name] = items[i];
                        conflicto_num++;
                    }
                } catch(e) {
                    console.log(e);
                }
                
            }
        }

        var tieneErrores=false;
        for (var i in  conflictos) {
            //mostrar mensaje de error. 
            tieneErrores=true;
            var mensaje = conflictos[i].getAttribute('requiredMessage') == null ? 'El campo "' + conflictos[i].name + '" es obligatorio' : conflictos[i].getAttribute('requiredMessage')
            M.toast({html: mensaje, displayLength:7000});            
            conflictos[i].classList.add('form-control-warning')
            conflictos[i].parentNode.classList.add('has-warning')
        }
        if(tieneErrores){
            return null;
        }

    }

    return json;
};