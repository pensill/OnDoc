App.CheckboxGroup = function(elem) {
	this.init(elem);
}
App.CheckboxGroup.prototype = {
	init: function(elem) {
		this.elem = elem;
		this.labels = this.elem.find('label');
		this.checkbox = this.elem.find('input');
		
		this._setDefault();
		this._binds();
	},
	_setDefault: function() {
		this.checkbox.each(function(i, el) {
			var $this = $(this),
				$check = $this.find('input'),
				$li = $this.closest('li');
		
			$check.is(':checked') ? $li.addClass('checked') : $li.removeClass('checked');
		});
	},
	_binds: function() {
		this.labels.on('click', function() {
			var $this = $(this),
				$check = $this.find('input'),
				$li = $this.closest('li');
		
			$check.is(':checked') ? $li.addClass('checked') : $li.removeClass('checked');
		});
	}
}