/**
 * Der Park von Wurzen mit klickbaren Punkten, an denen Panorama-Bilder angezeigt werden
 *
 * Created by Bastian on 19.12.2014.
 * @todo: delete Nodes
 * @todo: Move Node by Arrow Keys / Rotate by Arrow Keys (States)
 * @todo: Better JSON-Output
 * @todo: Control-Help
 * @FIXME: Nodes move slightly up after saving new order
 */

(function(){

    /**
     * Scrollgeschwindigkeit der Panorama-Bilder
     * @type {number}
     */
    var speed = 15;

    /**
     * GUI anzeigen?
     * @type {boolean}
     */
    var showControls = false;

    /**
     * Anordnung der Nodes auf der Karte
     * @type {{coordinates: {top: number, left: number}, img: string, caption: string, startDirection: number}[]}
     */
    var Config =
            [{
                "coordinates": {"top": 312.683349609375, "left": 1371.683349609375},
                "img": "park-entrance.jpg",
                "caption": "Erstes Bild",
                "startDirection": 90
            }, {
                "coordinates": {"top": 297.3000030517578, "left": 1227.300048828125},
                "img": "2.jpg",
                "caption": "",
                "startDirection": 305
            }, {
                "coordinates": {"top": 230.60000610351562, "left": 1194.5999755859375},
                "img": "3.jpg",
                "caption": "",
                "startDirection": 115
            }, {
                "coordinates": {"top": 375.8666687011719, "left": 1227.86669921875},
                "img": "4.jpg",
                "caption": "",
                "startDirection": 115
            }, {
                "coordinates": {"top": 463.58331298828125, "left": 942.5833129882812},
                "img": "5.jpg",
                "caption": "",
                "startDirection": 65
            }, {
                "coordinates": {"top": 349.566650390625, "left": 957.566650390625},
                "img": "6.jpg",
                "caption": "",
                "startDirection": 150
            }, {
                "coordinates": {"top": 601.7166748046875, "left": 958.7166748046875},
                "img": "7.jpg",
                "caption": "",
                "startDirection": 300
            }, {
                "coordinates": {"top": 518.7333374023438, "left": 807.7333374023438},
                "img": "8.jpg",
                "caption": "",
                "startDirection": 155
            }, {
                "coordinates": {"top": 491.0333251953125, "left": 577.0333251953125},
                "img": "9.jpg",
                "caption": "",
                "startDirection": 200
            }, {
                "coordinates": {"top": 285.0500030517578, "left": 411.04998779296875},
                "img": "10.jpg",
                "caption": "",
                "startDirection": 80
            }, {
                "coordinates": {"top": 260.68333435058594, "left": 808.683349609375},
                "img": "11.jpg",
                "caption": "",
                "startDirection": 85
            }, {"coordinates": {"top": 463, "left": 768},
                "img": "12.jpg",
                "caption": "",
                "startDirection": 90
            }]
        ;

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
            if(showControls) {
                $('#menu').fadeIn(2000);
            }
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
        };
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
                            console.log("!");
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
            that.hideAllPanoramas();
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
            var oldScroll = that.$panoramaImg.scrollLeft();
            that.$panoramaImg.scrollLeft(oldScroll - 10);
        };

        /**
         * Bewegt das PanoramaBild nach rechts
         */
        this.moveImgRight = function() {
            var oldScroll = that.$panoramaImg.scrollLeft();
            that.$panoramaImg.scrollLeft(oldScroll + 10);
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
            console.log("?");
            if(that.$element.hasClass('rotation')) {
                console.log("!");
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
                top: coordinates.top,
                left: coordinates.left,
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
            that.$panoramaImg.click(function(){
                return false;
            })

            // drag_n_scroll auf Bild anwenden
            var draggable = new bastianowicz.Drag_n_Scroll();
            draggable.$context = that.$panoramaImg;
            draggable.init();

            // Bild hinzufügen
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
        bastianowicz.parkorama = new Parkorama();
        bastianowicz.parkorama.init();
    });
})();
