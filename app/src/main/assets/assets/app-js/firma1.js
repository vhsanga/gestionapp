


//======================================================================
// VARIABLES
//======================================================================
let miCanvas ;
let lineas ;
let correccionX;
let correccionY;
let pintarLinea;
// Marca el nuevo punto
let nuevaPosicionX;
let nuevaPosicionY;

let posicion;

function initVariablesF1(){
    miCanvas = document.querySelector('#firma1');
    lineas = [];
    correccionX = 0;
    correccionY = 0;
    pintarLinea = false;
    // Marca el nuevo punto
    nuevaPosicionX = 0;
    nuevaPosicionY = 0;

    posicion = miCanvas.getBoundingClientRect()
    correccionX = posicion.x;
    correccionY = posicion.y;

    miCanvas.width = 500;
    miCanvas.height = 500;
}

    //======================================================================
    // FUNCIONES
    //======================================================================

    /**
     * Funcion que empieza a dibujar la linea
     */
        function empezarDibujo() {
        pintarLinea = true;
        lineas.push([]);
    };

    /**
     * Funcion que guarda la posicion de la nueva línea
     */
    function guardarLinea() {
        lineas[lineas.length - 1].push({
            x: nuevaPosicionX,
            y: nuevaPosicionY
        });
    }

    /**
    * Funcion dibuja la linea
    */
    function dibujarLinea (event) {
        event.preventDefault();
        if (pintarLinea) {
            let ctx = miCanvas.getContext('2d')
            // Estilos de linea
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            // Color de la linea
            ctx.strokeStyle = '#0000d2';

            if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
                var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                nuevaPosicionX = touch.pageX -347 ;
                nuevaPosicionY = touch.pageY -423;
            } else if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove' || event.type == 'mouseover'|| event.type=='mouseout' || event.type=='mouseenter' || event.type=='mouseleave') {
                // Versión ratón
                nuevaPosicionX = event.layerX;
                nuevaPosicionY = event.layerY;
            }

            /*if (event.changedTouches == undefined) {
                
            } else {
                // Versión touch, pantalla tactil
                nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
                nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
            }*/
            // Guarda la linea
            guardarLinea();
            // Redibuja todas las lineas guardadas
            ctx.beginPath();
            lineas.forEach(function (segmento) {
                ctx.moveTo(segmento[0].x, segmento[0].y);
                segmento.forEach(function (punto, index) {
                    ctx.lineTo(punto.x, punto.y);
                });
            });
            ctx.stroke();
        }
    }

    /**
    * Funcion que deja de dibujar la linea
    */
    function pararDibujar () {
        pintarLinea = false;
        guardarLinea();
    }



    /**
     * Funcion que limpia el dibujo
     */
    function limpiarFirma1() {
        let context = firma1.getContext('2d')
        context.clearRect(0, 0, firma1.width, firma1.height);
    }

//======================================================================
// EVENTOS
//======================================================================

// Eventos raton
function eventosF1(){
    firma1.addEventListener('mousedown', empezarDibujo, false);
    firma1.addEventListener('mousemove', dibujarLinea, false);
    firma1.addEventListener('mouseup', pararDibujar, false);

    // Eventos pantallas táctiles
    firma1.addEventListener('touchstart', empezarDibujo, false);
    firma1.addEventListener('touchmove', dibujarLinea, false);
}
initVariablesF1();
eventosF1();