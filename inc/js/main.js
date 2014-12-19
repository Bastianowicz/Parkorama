/**
 *
 * Created by Bastian on 19.12.2014.
 */

(function(){
    var Config = [
        {
            coordinates : {
                x: 10,
                y: 10
            },
            img : "1.JPG",
            caption : "Erstes Bild"
        }
    ];


    var speed = 3;


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
         * @type {Jquery}
         */
        this.$panoramaViewport = {};

        /**
         * JQuery-Referenz auf Overlay
         * @type {{}}
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
        };

        /**
         * Blendet das Overlay ein
         */
        this.fadeInOverlay = function(){
            $overlay.fadeIn(300);
        }

        /**
         * Blendet das Overlay aus
         */
        this.fadeOutOverlay = function(){
            $overlay.fadeOut(300);
        }

        /**
         * Blendet alle Panoramabilder aus
         */
        this.hideAllPanoramas = function() {
            for(i in nodes) {
                nodes[i].$panoramaImg.css('display','none');
            }
        }
    };


    /**
     * Repräsentation jedes Knotens
     * @param config (Array)
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
         * Referenz auf den Kartenknoten
         * @type {jQuery}
         */
        this.$element = {};

        this.$panoramaImg = {};

        /**
         * Konstruktor
         */
        this.init = function() {
            coordinates = config.coordinates;
            imgSrc = "img/panoramas/" + config.img;
            caption = config.caption;

            createElement();

        };

        /**
         * Bewegt das PanoramaBild nach links
         */
        var moveImgLeft = function(){
            that.$panoramaImg.marginLeft -= speed;
        };

        /**
         * Bewegt das PanoramaBild nach rechts
         */
        var moveImgRight = function() {
            if(that.$panoramaImg.marginLeft <= 0 ) {
                that.$panoramaImg.marginLeft += speed;
            }
        };

        /**
         * Erstellt das jQuery-Element
         */
        var createElement = function() {
            // Kartenknoten erstellen
            that.$element = $('<a class="node">');
            that.$element.css({
                top: coordinates.y,
                left: coordinates.x
            });

            // Panorama-Bild erstellen
            var $img = $('<img>');
            $img.attr('src', imgSrc);
            that.$panoramaImg = $('<div class="panorama-img">');
            that.$panoramaImg.append($img);
            tds.parkorama.$panoramaViewport.append(that.$panoramaImg);

            // Bei Klick einblenden
            that.$element.click(function(){
                tds.parkorama.hideAllPanoramas();
                that.$panoramaImg.css('display','block');
                tds.parkorama.fadeInOverlay();
            });
        };
    };

    $(document).ready(function(){
        tds = {
            parkorama : {}
        };
        tds.parkorama = new Parkorama();
        tds.parkorama.init();
    });
})();
