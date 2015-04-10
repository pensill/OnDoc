App.Dropdown = function(elem) {
	this.create(elem);
}
App.Dropdown.prototype = {
	create: function(elem) {
		this.scrollHeight = elem.data('scroll-height');
		
		if (elem.get(0).tagName != 'SELECT') {
			this.init(elem);
			return;
		}
	
		var html = '<div class="current"></div><div class="b-select-box-options">',
			resElem = $('<div></div>', { 'class': 'b-select-box' });
			
		elem.find('option').each(function(i, el) {
			html += '<div data-value="'+ el.value +'" '+ (el.selected && 'selected') +' class="b-select-box-option">'+ 
				el.innerHTML +
				($(el).data('icon') ? ('<i class="b-icon b-'+ $(el).data('icon') +'"></i>') : '')+
			'</div>';
		});
		html +=	'</div><input type="hidden" value="" name="'+ elem.attr('name') +'" />';
		
		elem.attr('id') && (resElem.id = elem.attr('id'));
		resElem.html(html);
		resElem.insertAfter(elem);
		elem.remove();
		
		this.init(resElem);
	},
	init: function(elem) {
		this.elem = elem;
		this.current = this.elem.find('.current');
		this.options = this.elem.find('.option');
		this.optionsList = this.elem.find('.options');
		this.input = this.elem.find('input');
		
		this.binds();
		this.setDefault();
		this.setScroll();
	},
	binds: function() {
		var t = this;
		
		this.elem
			.on('open', function() {
				console.log('open');
				var $this = $(this);
				t.elem.addClass('open');
				
				$('body').on('click.close', function(e) {
					!($(e.target).closest($this).length) && t.elem.trigger('close');
				});
				
				return false;
			})
			.on('close', function() {
				t.elem.removeClass('open');
				$('body').off('click.close');
				return false;
			})
			.on('toggle', function() {
				console.log('toggle');
				t.elem.hasClass('open') ? t.elem.trigger('close') : t.elem.trigger('open');
				return false;
			})
			.on('change', function(e, p) {
				t.input.val(p.val);
				t.current.text(p.txt);

                if ($('#survey-request-page').length > 0) {
                    if (window.location.search) {
                        if (window.location.search.search(/([&?]per_page=\d+)/) != -1) {
                            var url = window.location.search;
                            window.location.href = url.replace(/(per_page=\d+)/, 'per_page=' + p.val);
                        } else {
                            window.location.href = window.location.search + '&per_page=' + p.val;
                        }
                    } else {
                        window.location.href = '?per_page=' + p.val;
                    }
                }

				return false;
			});
	
		this.current.on('click', function() {
			t.elem.trigger('toggle');
		});
		
		this.options.on('click', function() {
			t.elem.trigger('change', { val: $(this).data('value'), txt: $(this).text() });
			t.elem.trigger('close');
		});
	},
	setDefault: function() {
		var selected = this.options.filter('[selected]');
		selected = !selected.length && this.options.filter(':eq(0)');
		
		selected.length && selected.trigger('click');
	},
	setScroll: function() {
		if (!this.scrollHeight) return false;
		
		this.elem.trigger('open');
		this.optionsList.height(this.scrollHeight);
		this.optionsList.jScrollPane();
		this.elem.trigger('close');
	}
}
