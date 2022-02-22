


//======================================================================
// VARIABLES
//======================================================================
let miCanvas2 ;
let lineas2 ;
let correccionX2;
let correccionY2;
let pintarLinea2;
// Marca el nuevo punto
let nuevaPosicionX2;
let nuevaPosicionY2;

let posicion2;

function initVariablesF2(){
    miCanvas2 = document.querySelector('#firma2');
    lineas2 = [];
    correccionX2 = 0;
    correccionY2 = 0;
    pintarLinea2 = false;
    // Marca el nuevo punto
    nuevaPosicionX2 = 0;
    nuevaPosicionY2 = 0;

    posicion2 = miCanvas2.getBoundingClientRect()
    correccionX2 = posicion2.x;
    correccionY2 = posicion2.y;

    miCanvas2.width = 500;
    miCanvas2.height = 500;
}

    //======================================================================
    // FUNCIONES
    //======================================================================

    /**
     * Funcion que empieza a dibujar la linea
     */
    function empezarDibujo2() {
        pintarLinea2 = true;
        lineas2.push([]);
    };

    /**
     * Funcion que guarda la posicion2 de la nueva línea
     */
    function guardarLinea2() {
        lineas2[lineas2.length - 1].push({
            x: nuevaPosicionX2,
            y: nuevaPosicionY2
        });
    }

    /**
    * Funcion dibuja la linea
    */
    function dibujarLinea2 (event) {
        event.preventDefault();
        if (pintarLinea2) {
            let ctx = miCanvas2.getContext('2d')
            // Estilos de linea
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.lineWidth = 1;
            // Color de la linea
            ctx.strokeStyle = '#0000d2';
            if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
                var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                nuevaPosicionX2 = touch.pageX -347 ;
                nuevaPosicionY2 = touch.pageY -423  - 575;
            } else if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove' || event.type == 'mouseover'|| event.type=='mouseout' || event.type=='mouseenter' || event.type=='mouseleave') {
                // Versión ratón
                nuevaPosicionX2 = event.layerX;
                nuevaPosicionY2 = event.layerY;
            }
            // Guarda la linea
            guardarLinea2();
            // Redibuja todas las lineas2 guardadas
            ctx.beginPath();
            lineas2.forEach(function (segmento) {
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
    function pararDibujar2 () {
        pintarLinea2 = false;
        guardarLinea2();
    }



    /**
     * Funcion que limpia el dibujo
     */
    function limpiarFirma2() {
        let context = firma2.getContext('2d')
        context.clearRect(0, 0, firma2.width, firma1.height);
    }

//======================================================================
// EVENTOS
//======================================================================

// Eventos raton
function eventosF2(){
    firma2.addEventListener('mousedown', empezarDibujo2, false);
    firma2.addEventListener('mousemove', dibujarLinea2, false);
    firma2.addEventListener('mouseup', pararDibujar2, false);

    // Eventos pantallas táctiles
    firma2.addEventListener('touchstart', empezarDibujo2, false);
    firma2.addEventListener('touchmove', dibujarLinea2, false);
}
initVariablesF2();
eventosF2();