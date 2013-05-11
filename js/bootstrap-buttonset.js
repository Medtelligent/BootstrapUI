!function ($) {
    "use strict"; // jshint ;_;

    /* RADIO/CHECKBOX BUTTONSET CLASS DEFINITION
    * ================================= */
    var ButtonSet = function (type, el, options) {
        options = options || {};
        var $this = $(el).addClass('bootstrap-' + type.substr(1) + 'buttonset')
            , controls = $this.find(type).appendTo($this)
            , labels = $this.find('label').appendTo($this)
            , btnGroup = $this.append('<span class="btn-group" data-toggle="buttons-' + type.substr(1) + '" />').children('.btn-group');

        // remove everything else
        $this.find(':not(' + type + ', label, label > i[class^="icon-"], .btn-group)').remove();

        // set button styles
        var btnClass = $this.data('buttonclass');
        if (typeof (btnClass) == 'undefined' || btnClass.length == 0 || btnClass.split(' ').indexOf('btn') == -1) {
            btnClass = 'btn'
        }

        // hide all controls
        controls.css({ position: 'absolute', height: '1px', width: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' });

        // convert all labels to buttons
        labels.each(function () {
            var $label = $(this).remove();
            btnGroup.append('<button type="button" class="' + btnClass + '" data-for="' + $label.attr('for') + '">' + $label.html() + '</button>')
        });

        // set orientation
        if (options.orientation && options.orientation == 'vertical') {
            var btns = btnGroup.addClass('btn-group-vertical').children('button');
            btns.not(btns.sort(function (a, b) { return $(a).outerWidth() < $(b).outerWidth(); })[0]).addClass('btn-block');
        }

        // check default selection
        controls.filter(':checked').each(function () {
            btnGroup.children('button[data-for="' + $(this).attr('id') + '"]').addClass('active');
        });

        // bind the buttons to update the controls
        btnGroup.on('click', 'button', function () {
            $this.children('#' + $(this).data('for')).trigger('click');
        });

    };

    var RadioButtonSet = function (el, options) {
        this.instance = new ButtonSet(':radio', el, options);
    };

    $.fn.radiobuttonset = function (option) {
        return this.each(function () {
            var $this = $(this)
                , options = $.extend({}, $this.data('options') || $this.data(), option)
                , data = $this.data('radiobuttonset');
            if (!data) $this.data('radiobuttonset', (data = new RadioButtonSet(this, options)));
        });
    }

    /* CHECKBOX BUTTONSET CLASS DEFINITION
    * ================================= */
    var CheckboxButtonSet = function (el, options) {
        this.instance = new ButtonSet(':checkbox', el, options);
    };

    $.fn.checkboxbuttonset = function (option) {
        return this.each(function () {
            var $this = $(this)
                , options = $.extend({}, $this.data('options') || $this.data(), option)
                , data = $this.data('checkboxbuttonset');
            if (!data) $this.data('checkboxbuttonset', (data = new CheckboxButtonSet(this, options)));
        });
    }
} (window.jQuery);