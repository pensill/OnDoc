App.Radio = function(elem) {
	this.init(elem);
}
App.Radio.prototype = {
	init: function(elem) {
		this.elem = elem;
		this.labels = this.elem.find('label');
		this.radio = this.elem.find('input');
		
		this._setDefault();
		this._binds();
	},
	_setDefault: function() {
		this.radio.each(function(i, el) {
			var $this = $(this),
				$li = $this.closest('li');
				
			$this.is(':checked') && $li.addClass('checked');
		});
	},
	_binds: function() {
		var t = this;
	
		this.labels.on('click', function() {
			var $this = $(this),
				$check = $this.find('input'),
				$li = $this.closest('li');
				
			t.elem.find('li').removeClass('checked');
		
			$check.is(':checked') && $li.addClass('checked');
		});
	}
}