App.Carousel = function(elem) {
	this.init(elem);
};
App.Carousel.prototype = (function(){
	var step = 1,
		interval,
		hurry = false;

	return {
		init: function(elem) {
			if (!elem.length) return;
			
			this.elem = elem;
			this.list = elem.find('ul');
			this.items = this.elem.find('.b-carousel-slide');
			this.itemsLength = this.items.length;
			this.iFirst = this.items.filter(':eq(0)');
			this.iLast = this.items.filter(':eq('+(this.itemsLength-1)+')');
			this.widthItem = this.iFirst.width();
			
			this._createAdd();
			this._binds();
			this._autoScroll();
		},
		_createAdd: function() {
			var t = this;
		
			this.elem.append('<span class="b-carousel-prev"></span><span class="b-carousel-next"></span>');
			this.iFirst.clone().appendTo(this.list);
			this.iLast.clone().insertBefore(this.iFirst);
			
			this.buttonPrev = this.elem.find('.b-carousel-prev');
			this.buttonNext = this.elem.find('.b-carousel-next');
			
			this.list.css({
				left: -t.widthItem
			});
		},
		_binds: function() {
			var t = this;
		
			this.buttonPrev.on('click slide', $.proxy(this.slide, this, 'prev'));
			this.buttonNext.on('click slide', $.proxy(this.slide, this, 'next'));
		},
		slide: function(dir) {
			if (hurry) return false;
			hurry = true;
			
			var t = this;
		
			this.list.animate({
				left: -this._getLeft(dir) * this.widthItem
			}, 300, function() {
				if (step == 0) {
					step = t.itemsLength;
				}
				if (step == t.itemsLength+1) {
					step = 1;
				}
					
				t.list.css({
					left: -t.widthItem * step
				});
				hurry = false;
			});
			
			clearInterval(interval);
			this._autoScroll();
		},
		_getLeft: function(dir) {
			if (dir == 'next') {
				step++;
			} else {
				step--;
			}
			if (step > this.itemsLength + 1) {
				step = 0;
			}
			if (step < 0) {
				step = this.itemsLength + 1;
			}
			return step;
		},
		_autoScroll: function() {
			var t = this;
			
			interval = setInterval(function() {
				t.buttonNext.trigger('slide');
			}, 5000);
		}
	}
})();
