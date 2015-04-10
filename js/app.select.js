App.Select = function(elem) {
	this.create(elem);
}
App.Select.prototype = {
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
		html +=	'</div>';
		//<input type="hidden" value="" name="'+ elem.attr('name') +'" />
		
		elem.attr('id') && (resElem.id = elem.attr('id'));
		resElem.html(html);
		resElem.insertAfter(elem);
		elem.appendTo(resElem);
		//elem.hide();
		
		this.init(elem, resElem);
	},
	init: function(select, elem) {
		this.elem = elem;
		this.select = select;
		this.current = this.elem.find('.current');
		this.options = this.elem.find('.b-select-box-option');
		this.optionsList = this.elem.find('.b-select-box-options');
		this.input = this.elem.find('input');
		
		this.binds();
		this.setDefault();
		this.setScroll();
	},
	binds: function() {
		var t = this;
		
		this.select
			.on('focus', function() {
			console.log('focused');
				t.elem.addClass('focused');
				
				$('body').on('keydown', function(e) {
					if (e.keyCode != 38 && e.keyCode != 40) return true;
					
					t.selectedOption[e.keyCode == 38 ? 'prev' : e.keyCode == 40 ? 'next' : '']().trigger('click', { trigger: true });
				});
			})
			.on('blur', function() {
				t.elem.removeClass('focused');
				$('body').off('keydown');
			})
			.on('change', function() {
			console.log('select change');
				t.elem.trigger('change', { val: $(this).val(), txt: $(this).find('option:selected').text(), trigger: true });
			});
		
		this.elem
			.on('open', function() {
				var $this = $(this);
				t.elem.addClass('open');
				
				$('body').on('click.close', function(e) {
					!($(e.target).closest('.b-select-box').length) && t.elem.trigger('close');
				});
				
				return false;
			})
			.on('close', function() {
				t.elem.removeClass('open');
				$('body').off('click.close');
				return false;
			})
			.on('toggle', function() {
				t.elem.hasClass('open') ? t.elem.trigger('close') : t.elem.trigger('open');
				return false;
			})
			.on('change', function(e, p) {
				(p && !p.trigger) && t.select.val(p.val);
				p && t.current.text(p.txt);
				return false;
			});
	
		this.current.on('click', function() {
			t.elem.trigger('toggle');
		});
		
		this.options.on('click', function(e, p) {
			t.selectedOption.removeAttr('selected');
			t.selectedOption = $(this);
			t.selectedOption.attr('selected', 'selected');
			
			t.elem.trigger('change', { val: $(this).data('value'), txt: $(this).text(), trigger: (p && p.trigger) });
			t.elem.trigger('close');
		});
	},
	setDefault: function() {
		this.selectedOption = this.options.filter('[selected]');
		
		this.selectedOption.length && this.selectedOption.trigger('click');
	},
	setScroll: function() {
		if (!this.scrollHeight) return false;
		
		this.elem.trigger('open');
		this.optionsList.height(this.scrollHeight);
		this.optionsList.jScrollPane();
		this.elem.trigger('close');
	}
}