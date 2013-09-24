!function ($) {
    "use strict"; // jshint ;_;

    var old = $.fn.buttongroup;

    /* buttongroup CLASS DEFINITION
    * ============================= */

    var ButtonGroup = function (el) {
        var that = this;
        this.$element = $(el).addClass('bootstrap-buttongroup')
            , this.actionButton = this.$element.children('a:first')
            , this.actionLabel = this.$element.children('span:first')
            , this.dropdownList = this.$element.children('ul:first');

        // set button styles
        this.btnClass = this.$element.data('buttonclass');
        if (typeof (btnClass) != 'undefined' && btnClass.length > 0) {
            this.btnClass = $.grep(this.btnClass.split(' '), function(n, i) { return n.startsWith('btn-'); }).pop();
        }

        this.btnSizeClass = this.$element.data('buttonsizeclass');
        if (typeof (this.btnSizeClass) != 'undefined' && this.btnSizeClass.length > 0) {
            this.btnSizeClass = $.grep(this.btnSizeClass.split(' '), function(n, i) { return n.startsWith('btn-'); }).pop();
        }

        // create split button skeleton
        var btnCss = $.grep(['btn', this.btnSizeClass, this.btnClass], function(n) { return typeof(n) !== 'undefined' }).join(' ');
        if (this.actionButton.length > 0) {
            this.actionButton.addClass(btnCss);
            this.actionButton.after('<a class="' + btnCss + ' dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>');
        } else {
            this.$element.prepend('<a class="' + btnCss + ' dropdown-toggle" data-toggle="dropdown" href="#" />');
            if (this.actionLabel.length > 0) {
                this.actionLabel.html(this.actionLabel.html() + ' ').attr('class', '');
                this.$element.children('a:first').prepend(this.actionLabel);
            }
            this.$element.children('a:first').append('<span class="caret" />');
        }
        this.dropdownList.addClass('dropdown-menu');
        this.$element.addClass('btn-group');
    };

    $.fn.buttongroup = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('buttongroup');

            if (!data) $this.data('buttongroup', (data = new ButtonGroup(this)));
        });
    }
} (window.jQuery);