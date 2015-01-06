/**
 *
 * Created by Bastian on 19.12.2014.
 */

(function(){
    var Config = [
        {
            coordinates : {
                x: 2650,
                y: 135
            },
            img : "1.JPG",
            caption : "Erstes Bild",
            startDirection:30
        },
        {
            coordinates : {
                x: 2611,
                y: 154
            },
            img : "2.JPG",
            caption : "Zweites Bild",
            startDirection:0
        },
        {
            coordinates : {
                x: 2542,
                y: 190
            },
            img : "3.JPG",
            caption : "",
            startDirection:0
        },
        {
            coordinates : {
                x: 2602,
                y: 129
            },
            img : "4.JPG",
            caption : "",
            startDirection:0
        },
        {
            coordinates : {
                x: 2552,
                y: 89
            },
            img : "5.JPG",
            caption : "",
            startDirection:0
        },
        {
            coordinates : {
                x: 2452,
                y: 119
            },
            img : "6.JPG",
            caption : "",
            startDirection:0
        }
    ];


    var speed = 10;


    //----------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------


    /**
    *
    * @constructor
    */
    var Parkorama = function(){
        /**
         * Referenz auf alle erstellten Knoten
         * @type {Array}
         */
        var nodes = [];

        /**
         * @type {Parkorama}
         */
        var that = this;

        /**
         * Box, die mit Panoramabildern gefüllt wird
         * @type {jQuery}
         */
        this.$panoramaViewport = {};

        /**
         * JQuery-Referenz auf Overlay
         * @type {jQuery}
         */
        var $overlay = {};

        /**
         * jQuery Referenz auf Container
         * @type {{}}
         */
        var $container = {};

        /**
         * Konstruktor
         */
        this.init = function() {
            $container = $('#map');
            $overlay = $('#overlay');
            that.$panoramaViewport = $('#panorama-viewport');

            if($container.length > 0) {
                for(i in Config) {
                    nodes[i] = new Node( Config[i], i );
                    nodes[i].init();
                    $container.append(nodes[i].$element);
                }
            }
            $overlay.click(function() {
                that.fadeOutOverlay();
            });

            bindKeys();

        };

        /**
         * Promptet die aktuelle konfiguration
         */
        this.copyConfig = function() {
            endConfig();
            var configString = JSON.stringify(Config, undefined, 2);
            prompt("Kopieren via Strg+C:", configString);
        };

        /**
         * Entfernt die Auswahl aktiver Nodes
         */
        this.nothingSelected = function() {
            for(i in nodes){
                nodes[i].$element.removeClass('active');
            }
        }
        /**
         * Neuen Knoten auf der Karte anlegen
         */
        this.createNode = function(){
            var caption = prompt("Welche Beschriftung soll das Bild erhalten?");
            var img = prompt("Welches Bild im Stammverzeichnis soll verwendet werden?");
            var newNode = {
                coordinates : {
                    x: 100,
                    y: 100
                },
                img : img,
                caption : caption,
                startDirection:0
            };

            var i = Config.push(newNode) - 1;
            nodes[i] = new Node(Config[i], i);
            nodes[i].init();
            nodes[i].startDragging();
            $container.append(nodes[i].$element);
        };

        /**
         * Macht alle Nodes beweglich
         */
        this.reorder = function() {
            for(i in nodes){
                nodes[i].startDragging();
            }
        };

        /**
         * Beendet das Verschieben von Knoten und speichert die Config
         */
        var endDragging = function() {
            for(i in nodes){
                nodes[i].stopDragging();
            }
        };

        /**
         * Beendet alle Anpassungen
         */
        var endConfig = function() {
            for(i in nodes){
                nodes[i].stopDragging();
                nodes[i].stopRotation();
                nodes[i].
            }

        };

        /**
         * Tastaturbefehle
         */
        var bindKeys = function(){
            $(document).keydown(function(e){
                switch( e.which ){
                    case 13:
                        e.preventDefault();
                        endConfig();
                        break;
                    case 27:
                        e.preventDefault();
                        that.fadeOutOverlay();
                        break;
                    case 39:
                        e.preventDefault();
                        var activeImg = $('.panorama-img.active');
                        if(activeImg.length > 0) {
                            nodes[activeImg.data('i')].moveImgRight();
                        } else {
                            for(i in nodes){
                                nodes[i].rotate(5);
                            }
                        }
                        break;
                    case 37:
                        e.preventDefault();
                        var activeImg = $('.panorama-img.active');
                        if(activeImg.length > 0) {
                            nodes[activeImg.data('i')].moveImgLeft();
                        } else {
                            for(i in nodes){
                                nodes[i].rotate(-5);
                            }
                        }
                        break;
                    default:
                        console.log(e.which);
                        break;
                }
            });
        };

        /**
         * Blendet das Overlay ein
         */
        this.fadeInOverlay = function(){
            $overlay.fadeIn(300);
        };

        /**
         * Blendet das Overlay aus
         */
        this.fadeOutOverlay = function(){
            $overlay.fadeOut(300);
        };

        /**
         * Blendet alle Panoramabilder aus
         */
        this.hideAllPanoramas = function() {
            for(i in nodes) {
                nodes[i].$panoramaImg.css({
                    display: 'none',
                    marginLeft: 0
                });
                nodes[i].$panoramaImg.removeClass('active');
            }
        }
    };


    /**
     * Repräsentation jedes Knotens
     * @param config (Array)
     * @param i {int} Stellenreferenz im Nodes-Array
     * @constructor
     */
    var Node = function( config, i ) {
        /**
         * @type {Node}
         */
        var that = this;
        /**
         * Koordinaten auf der Karte
         * @type {{}}
         */
        var coordinates = {};

        /**
         * Bildpfad
         * @type {string}
         */
        var imgSrc = "";

        /**
         * Bildunterschrift
         * @type {string}
         */
        var caption = "";

        /**
         * Richtung, die der Anzeiger haben soll
         * @type {number}
         */
        var startDirection = 0;

        /**
         * Referenz auf den Kartenknoten
         * @type {jQuery}
         */
        this.$element = {};

        /**
         * Referenz auf das Bild
         * @type {jQuery}
         */
        this.$panoramaImg = {};

        /**
         * Konstruktor
         */
        this.init = function() {
            coordinates = config.coordinates;
            imgSrc = "img/panoramas/" + config.img;
            caption = config.caption;
            startDirection = config.startDirection;
            createElement();
        };

        /**
         * Macht das Objekt beweglich mit Jquery-UI
         */
        this.startDragging = function(){
            that.$element.draggable('enable');
        };

        /**
         * Beendet das Verschieben
         */
        this.stopDragging = function(){
            that.$element.draggable('disable');
            saveConfig();
        };

        /**
         * Speichert die aktuelle Position im Config-Array
         */
        var saveConfig = function() {
            coordinates = Config[i].coordinates = that.$element.position();
            Config[i].startDirection = startDirection = that.getRotationDegrees();
        };

        /**
         * Bewegt das PanoramaBild nach links
         */
        this.moveImgLeft = function(){
            if(parseInt(that.$panoramaImg.css('margin-left')) <= 0 ) {
                that.$panoramaImg.css('margin-left', function (index, curValue) {
                    return parseInt(curValue, 10) + speed + 'px';
                });
            }
        };

        /**
         * Bewegt das PanoramaBild nach rechts
         */
        this.moveImgRight = function() {
            var margin = parseInt(that.$panoramaImg.css('margin-left'));
            var imgWidth = parseInt(that.$panoramaImg.children().width());
            var viewportWidth = parseInt(bastianowicz.parkorama.$panoramaViewport.width());

            if(imgWidth + margin > viewportWidth ) {
                that.$panoramaImg.css('margin-left', function (index, curValue) {
                    return parseInt(curValue, 10) - speed + 'px';
                });
            }
        };

        this.stopRotation = function() {
            that.$element.removeClass('rotation');
            saveConfig();
        };

        /**
         *  Dreht den Node
         * @param deg {int} Gradzahl der Drehung
         */
        this.rotate = function(deg) {
            if(that.$element.hasClass('rotation')) {
                var newRotation = that.getRotationDegrees() + deg;
                var cssValue = 'rotate(' + newRotation + 'deg)';
                that.$element.css('transform', cssValue);
                saveConfig();
            }
        };

        /**
         * Wandelt den transform-String in eine Integer-Zahl um
         */
        this.getRotationDegrees = function() {
            var obj =that.$element;
            var matrix = obj.css("-webkit-transform") ||
                obj.css("-moz-transform")    ||
                obj.css("-ms-transform")     ||
                obj.css("-o-transform")      ||
                obj.css("transform");
            if(matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
            } else { var angle = 0; }
            return (angle < 0) ? angle +=360 : angle;
        }

        /**
         * Erstellt das jQuery-Element
         */
        var createElement = function() {
            // Kartenknoten erstellen
            that.$element = $('<a class="node arrow_box">');
            that.$element.css({
                top: coordinates.y,
                left: coordinates.x,
                transform: 'rotate(' + startDirection + 'deg)'
            });

            // Panorama-Bild erstellen
            var $img = $('<img>');
            $img.attr('src', imgSrc);
            that.$panoramaImg = $('<div class="panorama-img">');
            that.$panoramaImg.data('i', i);
            that.$panoramaImg.append($img);
            $caption = $('<span>');
            $caption.addClass('caption');
            $caption.text(caption);
            that.$panoramaImg.append($caption);
            bastianowicz.parkorama.$panoramaViewport.append(that.$panoramaImg);

            // Aktive Mausbereiche
            var $arrowRight = $('<div class="arrow-right">');
            var $arrowLeft = $('<div class="arrow-left">');
            $arrowLeft.text('<');
            $arrowRight.text('>');
            $arrowRight.mouseover(function(){
                mouseMove = window.setInterval(function() {
                    that.moveImgRight();
                },30);
            }).mouseleave(function(){
                clearInterval(mouseMove);
            });
            $arrowLeft.mouseover(function(){
                mouseMove = window.setInterval(function(){
                    that.moveImgLeft();
                }, 30);
            }).mouseleave(function(){
                clearInterval(mouseMove);
            });
            that.$panoramaImg.append($arrowLeft);
            that.$panoramaImg.append($arrowRight);

            // Bubbling DOM-Tree Prevention
            that.$element.mousedown(function(){
                return false;
            });

            // Bei Klick einblenden
            that.$element.click(function(){
                if(that.$element.hasClass('ui-draggable-disabled')) {
                    bastianowicz.parkorama.hideAllPanoramas();
                    that.$panoramaImg.css('display', 'block');
                    that.$panoramaImg.addClass('active');
                    bastianowicz.parkorama.fadeInOverlay();
                } else {
                    bastianowicz.parkorama.nothingSelected();
                    that.$element.toggleClass('rotation');
                }
            });

            // beweglich machen
            that.$element.draggable({
                    stop: function(){
                        saveConfig();
                    },
                    disabled: true
            });
        };
    };

    $(document).ready(function(){
        if(typeof bastianowicz == 'undefined') bastianowicz = {};
        bastianowicz = {
            parkorama : new Parkorama()
        };
        bastianowicz.parkorama.init();
    });
})();
