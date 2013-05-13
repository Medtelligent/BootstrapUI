!function ($) {

    "use strict"; // jshint ;_;


    /* COMBOBOX PUBLIC CLASS DEFINITION
    * ================================= */

    var Combobox = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.combobox.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater
        this.source = this.options.source && this.options.source.filter(function (s) { return s != null && s.trim().length > 0; })
        this.$menu = $(this.options.menu)
        this.shown = false

        // setup button
        this.$trigger = this.$element.wrap('<div class="input-combobox input-append"></div>')
            .parent()
            .css({ position: 'relative' })
            .append('<button class="btn" data-toggle="menu" type="button"><span class="caret"></span></button>')
            .children('button');

        var adjustTriggerAlignment = this.$element.innerHeight() - this.$trigger.innerHeight();
        if (adjustTriggerAlignment != 0) {
            this.$trigger.css({
                paddingBottom: function (index, value) {
                    return parseFloat(value) - 3;
                }
            });
        }

        this.listen()
    }

    Combobox.prototype = {

        constructor: Combobox

        , select: function () {
            var val = this.$menu.find('.active').attr('data-value')
            this.$element
              .val(this.updater(val))
              .change()
            return this.hide()
        }

        , updater: function (item) {
            return item
        }

        , show: function () {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            })

            this.$menu
              .addClass('qs-combobox-menu')
              .appendTo('body')
              .css({
                  top: pos.top + pos.height
              , left: pos.left
              , minWidth: this.$element.outerWidth() + 'px'
              , zIndex: '100000000000'
              })
              .show()

            if (!this.$menu.attr('id')) {
                this.$menu.attr('id', 'qs-combobox-menu-' + $('body > .qs-combobox-menu').length)
            }

            this.shown = true
            return this
        }

        , hide: function () {
            this.$menu.hide()
            this.shown = false
            return this
        }

        , lookup: function (event) {
            var items

            this.query = !event || !$(event.currentTarget).is('[data-toggle=menu]') ? this.$element.val() : null;

            if (this.query && this.query.length < this.options.minLength) {
                return this.shown ? this.hide() : this
            }

            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

            return items ? this.process(items) : this
        }

        , process: function (items) {
            var that = this

            items = $.grep(items, function (item) {
                return that.query ? that.matcher(item) : true;
            })

            items = this.sorter(items)

            if (!items.length) {
                return this.shown ? this.hide() : this
            }

            return this.render(items.slice(0, this.options.items)).show()
        }

        , matcher: function (item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase())
        }

        , sorter: function (items) {
            var beginswith = []
              , caseSensitive = []
              , caseInsensitive = []
              , item

            while (item = items.shift()) {
                if (this.query && !item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
                else if (this.query && ~item.indexOf(this.query)) caseSensitive.push(item)
                else caseInsensitive.push(item)
            }

            return beginswith.concat(caseSensitive, caseInsensitive)
        }

        , highlighter: function (item) {
            if (this.query) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
                return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>'
                })
            }
            return item;
        }

        , render: function (items) {
            var that = this

            items = $(items).map(function (i, item) {
                i = $(that.options.item).attr('data-value', item)
                i.find('a').html(that.highlighter(item))
                return i[0]
            })

            items.first().addClass('active')
            this.$menu.html(items)
            return this
        }

        , next: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
              , next = active.next()

            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }

            next.addClass('active')
        }

        , prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active')
              , prev = active.prev()

            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }

            prev.addClass('active')
        }

        , listen: function () {
            this.$element
              .on('focus', $.proxy(this.focus, this))
              .on('blur', $.proxy(this.blur, this))
              .on('keypress', $.proxy(this.keypress, this))
              .on('keyup', $.proxy(this.keyup, this))

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this))
            }

            this.$menu
              .on('click', $.proxy(this.click, this))
              .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
              .on('mouseleave', 'li', $.proxy(this.mouseleave, this))

            this.$trigger
              .on('click', $.proxy(this.triggerClick, this))

            $('html').on('click.dropdown.data-api', $.proxy(function () {
                this.hide();
            }, this))
        }

        , eventSupported: function (eventName) {
            var isSupported = eventName in this.$element
            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;')
                isSupported = typeof this.$element[eventName] === 'function'
            }
            return isSupported
        }

        , move: function (e) {

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault()
                    break

                case 38: // up arrow
                    e.preventDefault()
                    if (this.shown) this.prev()
                    break

                case 40: // down arrow
                    e.preventDefault()
                    if (this.shown) this.next()
                    else {
                        this.focused = true;
                        this.lookup();
                    }
                    break
            }

            e.stopPropagation()
        }

        , keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27])
            this.move(e)
        }

        , keypress: function (e) {
            if (this.suppressKeyPressRepeat) return
            this.move(e)
        }

        , keyup: function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.shown) return
                    this.select()
                    break

                case 27: // escape
                    if (!this.shown) return
                    this.hide()
                    break

                default:
                    this.lookup()
            }

            e.stopPropagation()
            e.preventDefault()
        }

        , focus: function (e) {
            this.focused = true
        }

        , blur: function (e) {
            this.focused = false
            if (!this.mousedover && this.shown) this.hide()
        }

        , click: function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.select()
            this.$element.focus()
        }

        , triggerClick: function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.focused = true;
            this.lookup(e);
        }

        , mouseenter: function (e) {
            this.mousedover = true
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        }

        , mouseleave: function (e) {
            this.mousedover = false
            if (!this.focused && this.shown) this.hide()
        }
    }


    /* TYPEAHEAD PLUGIN DEFINITION
    * =========================== */

    var old = $.fn.combobox

    $.fn.combobox = function (option) {
        return this.each(function () {
            var $this = $(this)
        , data = $this.data('combobox')
        , options = (typeof option == 'object' && option) || (typeof option == 'undefined' && $this.data())
            if (!data) $this.data('combobox', (data = new Combobox(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.combobox.defaults = {
        source: []
        , items: 8
        , menu: '<ul class="combobox dropdown-menu"></ul>'
        , item: '<li><a href="#"></a></li>'
        , minLength: 1
    }

    $.fn.combobox.Constructor = Combobox


    /* TYPEAHEAD NO CONFLICT
    * =================== */

    $.fn.combobox.noConflict = function () {
        $.fn.combobox = old
        return this
    }


    /* TYPEAHEAD DATA-API
    * ================== */

    $(document).ready(function (e) {
        $('[data-provide="combobox"]').each(function () {
            var $this = $(this)
            if ($this.data('combobox')) return
            $this.combobox()
        });
    })

} (window.jQuery);
