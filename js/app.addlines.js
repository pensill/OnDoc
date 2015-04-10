App.Addlines = function(elem) {
	this.init(elem);
}

App.Addlines.prototype = {
	init: function(elem) {
		this.elem = elem;
		this.html = this.elem.data('prototype');

		if (this.html) {
			this.createHtml();
		}

		this.addButton = this.elem.find('.b-addline');
		this.delButton = this.elem.find('.b-delline');
		this.template = this.elem.find('.template').html();
		
		this._binds();
	},
	createHtml: function() {
		var selectHtml = '<fieldset class="b-field b-field-elem">' + this.html.replace(/__name__/g, 0) + '<i class="b-icon b-addline"></i></fieldset>';

		if (this.elem.data('elements-count') > 0) {
			selectHtml = '';
		};

		this.elem.append(
			'<div class="template"><fieldset class="b-field b-field-elem">' + this.html +'<i class="b-icon b-delline"></i><i class="b-icon b-addline"></i></fieldset></div>' + selectHtml
		);
	},
	_binds: function() {
		var t = this;
		this.elem.find('.template').remove();
		
		this.elem.delegate('.b-addline', 'click', function() {
            var templateWithIndex = t.template.replace(/__name__/g, $(t.elem).find('.b-field-elem').length);
			t.elem.append(templateWithIndex);

			if (t.elem.find('select.b-select-box').length) {
				new App.Select(t.elem.find('select.b-select-box'));
			}
			
			App.Page.setTimePicker(this.elem);
		});
		this.elem.delegate('.b-delline', 'click', function() {
			$(this).closest('.b-field').remove();
		});
	}
}
