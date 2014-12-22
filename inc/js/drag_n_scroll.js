/**
 * Created by Bastian on 21.12.2014.
 */

/**
 * jQuery-Selector to bind the Drag-Behaivour
 * @type {string}
 */
var context = "body";

/**
 * Speed-Factor for scrollspeed
 * @type {number}
 */
var scrollSpeed = 1;

// self-calling anonymous function
(function(context) {
    /**
     * Class that provides Click&Scroll-Behaivour
     */
    var drag_n_scroll = function () {

        /**
         * Where to apply behaivour
         * @type {jQuery}
         */
        this.$context = {};

        /**
         * alias
         * @type {drag_n_scroll}
         */
        var that = this;

        /**
         * Is left mouse button currently clicked?
         * @type {boolean}
         */
        var clicked = false;

        /**
         * Where did the Drag start?
         * @type {{x: number, y: number}}
         */
        var startClickPos = {x:0,y:0};

        /**
         * Scroll-Position at beginning of dragging
         * @type {{x: number, y: number}}
         */
        var scrollPos = {x:0,y:0};

        /**
         * Preset the values
         * Bind the events
         */
        this.init = function () {
            that.$context.mousedown(function (e) {
                e.preventDefault();
                scrollPos = {
                    x: that.$context.parent().scrollLeft(),
                    y: that.$context.parent().scrollTop()
                };
                startClickPos.x = e.screenX;
                startClickPos.y = e.screenY;
                clicked = true;
            });

            $(document).mouseup(function (e){
                e.preventDefault();
                clicked = false;
                startClickPos = {x:0,y:0};
            });

            $(window).mousemove(function(e){
                scroll(e);
            });
        };

        /**
         * Here is where the magic happens
         * Move by Drag-Vector
         * @param e {event}
         */
        var scroll = function (e) {
            if(clicked) {
                var currentMouse = {
                    x:  e.clientX,
                    y:  e.clientY
                };

                var delta = {
                    x: startClickPos.x - currentMouse.x,
                    y: startClickPos.y - currentMouse.y
                };

                that.$context.parent().scrollTop(scrollPos.y + scrollSpeed * (delta.y));
                that.$context.parent().scrollLeft(scrollPos.x + scrollSpeed * (delta.x));
            }
        }
    };

    /**
     * Start at DOM-ready
     */
    $(document).ready(function(){
        if(typeof bastianowicz == "undefined") bastianowicz = {};
        bastianowicz.drag_n_scroll = new drag_n_scroll();
        bastianowicz.drag_n_scroll.$context = $(context);
        bastianowicz.drag_n_scroll.init();
    });
})(context);
