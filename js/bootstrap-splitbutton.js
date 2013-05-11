!function ($) {
    "use strict"; // jshint ;_;

    var old = $.fn.splitbutton;

    /* SPLITBUTTON CLASS DEFINITION
    * ============================= */

    var SplitButton = function (el) {
        var $this = $(el).addClass('bootstrap-splitbutton')
            , actionButton = $this.children('a:first')
            , actionLabel = $this.children('span:first')
            , dropdownList = $this.children('ul:first');

        var btnClass = $this.data('buttonclass');
        if (typeof (btnClass) == 'undefined' || btnClass.length == 0 || btnClass.split(' ').indexOf('btn') == -1) {
            btnClass = 'btn'
        }

        if (actionButton.length > 0) {
            actionButton.addClass(btnClass);
            actionButton.after('<a class="' + btnClass + ' dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></a>');
        } else {
            $this.prepend('<a class="' + btnClass + ' dropdown-toggle" data-toggle="dropdown" href="#" />');
            if (actionLabel.length > 0) {
                actionLabel.text(actionLabel.text() + ' ').attr('class', '');
                $this.children('a:first').prepend(actionLabel);
            }
            $this.children('a:first').append('<span class="caret" />');
        }

        dropdownList.addClass('dropdown-menu');
        $this.addClass('btn-group');
    };

    $.fn.splitbutton = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('splitbutton');

            if (!data) $this.data('splitbutton', (data = new SplitButton(this)));
        });
    }
} (window.jQuery);