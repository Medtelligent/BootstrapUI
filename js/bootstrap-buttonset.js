!function ($) {
    "use strict"; // jshint ;_;

    /* RADIO/CHECKBOX BUTTONSET CLASS DEFINITION
    * ================================= */
    var ButtonSet = function (type, el, options) {
        var that = this;
        options = options || {};
        this.$element = $(el).addClass('bootstrap-' + type.substr(1) + 'buttonset')
            , this.buttonsetType = type
            , this.controls = this.$element.find(type).appendTo(this.$element)
            , this.labels = this.$element.find('label').appendTo(this.$element)
            , this.btnGroup = this.$element.append('<span class="btn-group" data-toggle="buttons-' + type.substr(1) + '" />').children('.btn-group');

        // remove everything else
        this.$element.find(':not(' + type + ', label, label > i[class^="icon-"], .btn-group)').remove();

        // set button styles
        this.btnClass = this.$element.data('buttonclass');
        if (typeof (this.btnClass) != 'undefined' && this.btnClass.length > 0) {
            this.btnClass = $.grep(this.btnClass.split(' '), function(n, i) { return n.startsWith('btn-'); }).pop();
        }

        this.btnSizeClass = this.$element.data('buttonsizeclass');
        if (typeof (this.btnSizeClass) != 'undefined' && this.btnSizeClass.length > 0) {
            this.btnSizeClass = $.grep(this.btnSizeClass.split(' '), function(n, i) { return n.startsWith('btn-'); }).pop();
        }

        this.btnActiveClass = this.$element.data('buttonactiveclass');
        if (typeof (this.btnActiveClass) != 'undefined' && this.btnActiveClass.length > 0) {
            this.btnActiveClass = $.grep(this.btnActiveClass.split(' '), function(n, i) { return n.startsWith('btn-') && n != that.btnClass && n != that.btnSizeClass; }).pop();
        }

        // hide all controls
        this.controls.css({ position: 'absolute', height: '1px', width: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' });

        // convert all labels to buttons
        var btnCss = $.grep(['btn', this.btnSizeClass, this.btnClass], function(n) { return typeof(n) !== 'undefined' }).join(' ');
        this.labels.each(function () {
            var $label = $(this).remove();
            that.btnGroup.append($('<button type="button">' + $label.html() + '</button>').attr({
                class        : btnCss,
                'data-for'   : $label.attr('for'),
                title        : $label.attr('title')
            }));
        });

        // set orientation
        if (options.orientation && options.orientation == 'vertical') {
            var btns = this.btnGroup.addClass('btn-group-vertical').children('button');
            btns.not(btns.sort(function (a, b) { return $(a).outerWidth() < $(b).outerWidth(); })[0]).addClass('btn-block');
        }

        // check default selection
        this.controls.filter(':checked').each(function () {
            var activeCss = $.grep(['active', that.btnActiveClass], function(n) { return typeof(n) !== 'undefined' }).join(' ');
            that.btnGroup.children('button[data-for="' + $(this).attr('id') + '"]').addClass(activeCss);
        });

        // bind the buttons to update the controls
        this.btnGroup.on('click', 'button', function () {
            that.$element.children('#' + $(this).data('for')).trigger('click');
        });
    };

    var RadioButtonSet = function (el, options) {
        this.instance = new ButtonSet(':radio', el, options);

        // bind the buttons to update the controls
        var instance = this.instance;
        if (instance.btnActiveClass) {
            instance.btnGroup.on('click', 'button', function () {
                instance.btnGroup.children('button').removeClass(instance.btnActiveClass).addClass(instance.btnClass);
                $(this).removeClass(instance.btnClass).addClass(instance.btnActiveClass);
            });
        }
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

        // bind the buttons to update the controls
        var instance = this.instance;
        if (instance.btnActiveClass) {
            instance.btnGroup.on('click', 'button', function () {
                if (instance.$element.children('#' + $(this).data('for')).is(':checked')) {
                    $(this).removeClass(instance.btnClass).addClass(instance.btnActiveClass);
                } else {
                    $(this).removeClass(instance.btnActiveClass).addClass(instance.btnClass);
                }
            });
        }
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