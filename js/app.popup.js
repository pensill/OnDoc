App.Popup = function() {
	this.init();
};
App.Popup.prototype = (function() {
	var tpls = {},
		group = {},
		currentTpl;
	
	return {
		init: function() {
			this.popup = $('.b-popup');
			this.content = this.popup.find('.b-popup-content-inner');
			this.closeButton = this.popup.find('.b-popup-close');
			this.saveButton = this.popup.find('.b-save');
			this.buttons = this.popup.find('.b-buttons');
			this.appended = false;
			this.isOpen = false;
		
			$('.b-popup-template').each(function(i, el) {
				var $el = $(el),
					$inner;
					
				if ($el.find('form').length) {
					$inner = $el.find('form');
					$inner.addClass('b-popup-form');
					
					tpls[el.id] = '<div data-formname="'+ $inner.data('formname') +'" data-ajax="1" action="'+ $inner.attr('action') +'" class="'+ $inner.attr('class') +'">' + $inner.html() + '</div>';
				} else {
					tpls[el.id] = $el.html();
				}
				
				group[el.id] = $el.data('group');
				
				$el.remove();
			});
			
			this._binds();
			this._eventBinds();
		},
		_binds: function() {
			var t = this;
		
			this.popup.on('open', function(e, opts) {
					console.log('open popup', opts);
					var $this = $(this),
						parent = t.popup.parent();
						
					if (parent[0].tagName.toLowerCase() == 'body') {
						parent = App.w;
					};
					
					$this
						.addClass('open')
						.css({
							opacity: 0
						})
						
						.animate({
							opacity: 1
						}, 500, function() {
							(opts && opts.autoClose) && setTimeout(function() {
								t.close();
							}, opts.autoClose*1000);
						});
						
					if (opts && opts.align && opts.align !== 'center') {
						if (opts.align == 'right') {
							$this
								.css({
									top: (parent.height()/2  - $this.height()/2) + parent.scrollTop(),
									left: 'auto',
									right: 0
								})
						}
					} else {
						$this
							.css({
								top: (parent.height()/2  - $this.height()/2) + parent.scrollTop(),
								left: parent.width()/2 - $this.width()/2,
								right: 'auto'
							})
					}
					
					t.isOpen = true;
					t._popupBinds(opts);
				})
				.on('close', function(e, params) {
					console.log('close currentTpl', currentTpl);
					console.log('close params', params);
					var $this = $(this);
					
					$this.animate({
						opacity: 0
					}, 500, function() {
						$this.removeClass('open');
					});
					
					(params && params.cb && $.isFunction(params.cb)) && params.cb();
					
					t.isOpen = false;
				});
				
			this.closeButton.on('click', function() {
				if ($(this).is('[disabled]')) return false;
				
				t.close();
			});
		},
		toCenter: function() {
			var t = this,
				parent = this.popup.parent();
						
			if (parent[0].tagName.toLowerCase() == 'body') {
				parent = App.w;
			};
		
			this.popup
				.css({
					top: (parent.height()/2  - t.popup.height()/2) + parent.scrollTop(),
					left: parent.width()/2 - t.popup.width()/2,
					right: 'auto'
				})
		},
		_popupBinds: function(opts) {
			if (!currentTpl) return;
		
			this.saveButton.off('click');
		
			var t = this,
				addPatientDataBlocks = [
					'pressure', 'pulse', 'sugar', 'cholesterol', 'weight', 'temperature', 'allergy', 'vaccinations', 'operations',
					'lifeway', 'medicine', 'height', 'bloodGroup', 'vision', 'add-specialist', 'add-clinic'
				],
				historyBlocks = [
					'pressure', 'pulse', 'sugar', 'cholesterol', 'weight', 'temperature', 'diagnosis', 'allergy', 'vaccinations', 'operations'
				];
			console.log('_popupBinds currentTpl', currentTpl);	
			
			$.each(addPatientDataBlocks, function(i, el) {
				switch (currentTpl) {
					case el:
						App.Page.addPatientData(t.popup, opts && opts.successCb);
						break;
				}
			});
			
			$.each(historyBlocks, function(i, el) {
				switch (currentTpl) {
					case 'history-' + el:
						App.Page.showAllHistory(t.popup, 'tr', '.b-' + el);
						App.Page.setDatePicker(t.popup);
						break;
				}
			});
			
			switch (currentTpl) {
				case 'demo': 
					t.popup.find('img').on('load', function() {
						t.popup.find('.b-demo-picture').jScrollPane();
						
						t.popup
							.css({
								top: (App.w.height()/2  - t.popup.height()/2) + App.w.scrollTop(),
								left: App.w.width()/2 - t.popup.width()/2
							})
					});
					break;
					
				case 'lifeway':
					t.popup.find('.b-field:first').find('select, input').trigger('focus');
					break;
			}
		},
		rebind: function() {
			console.log('rebind');
			
			var form = this.popup.find('.b-popup-form');
			
			$.each(this.popup.find('.addlines'), function(i, el) {
				new App.Addlines($(el));
			});

			App.Page.setSelect(this.popup);
			
			$.each(this.popup.find('.b-checkbox-group'), function(i, el) {
				new App.CheckboxGroup($(el));
			});
			
			App.Page.setDatePicker(this.popup);
			App.Page.setTimePicker(this.popup);
		},
		_eventBinds: function() {
			var t = this,
				i, evt, tpl;
				
			console.log('_openBinds', this._evts);
			
			for (i in this._evts) {
				var evtsParse = this._evts[i]['etpl'].split(':');
				
				(function(el, evt, tpl, params) {
					$(el).on(evt, function(){
						if ($(this).is('[disabled]')) {
							console.log('disabled button no action');
							return false;
						}
						
						currentTpl = tpl || params.tpl;
						
						if (params.url) {
							$.get(params.url, function(data) {
								params.html = data.html;
								
								t.render(
									$.extend(
										{ tpl: currentTpl }, 
										params
									)
								);
								t.open(params);
							});
							
							return false;
						}
						
						t.render(
							$.extend(
								{ tpl: currentTpl }, 
								params
							)
						);
						t.open(params);
						
						return false;
					});
					
				})(i, evtsParse[0], evtsParse[1], this._evts[i]['params'])
			}
		},
		_evts: App.Events.getPopupEvts(),
		getTpl: function(id) {
			return tpls[id];
		},
		getCurrentTpl: function() { 
			return currentTpl;
		},
		render: function(opts) {
			if (opts.appendToBlock) {
				this.popup.appendTo(opts.appendToBlock);
				this.appended = true;
			} else if (this.appended) {
				this.popup.appendTo('body');
			}
			
			if (opts.html) {
				currentTpl = opts.tpl;
				group[currentTpl] = opts.group;
			}
			
			this.popup.attr('class', 'b-popup ' + (currentTpl ? ' b-tpl-' + currentTpl : '') + (group[currentTpl] ? ' b-' + group[currentTpl] : '') + (this.isOpen ? ' open' : ''));
			this.content.html(opts.html || this.getTpl(opts.tpl));
			
			if (!opts.buttons) {
				this.buttons.hide();
			} else {
				this.closeButton.html('<i class="b-icon b-cross"></i>' + unescape(opts.closeButton && opts.closeButton.length ? opts.closeButton : '%u0437%u0430%u043A%u0440%u044B%u0442%u044C'));
				this.saveButton.html(opts.saveButton && opts.saveButton.length ? opts.saveButton : unescape('%u0421%u043E%u0445%u0440%u0430%u043D%u0438%u0442%u044C'));
			
				this.buttons.show();
			}
		},
		open: function(opts) {
			this.unlockButtons();
			this.popup.trigger('open', opts);
		},
		close: function(cb) {
			this.popup.trigger('close', { cb: cb });
		},
		lockButtons: function() {
			this.closeButton.attr('disabled', 'disabled');
			this.saveButton.attr('disabled', 'disabled');
		},
		unlockButtons: function() {
			this.closeButton.removeAttr('disabled');
			this.saveButton.removeAttr('disabled');
		},
		alert: function(params) {
			var t = this;
			currentTpl = false;
		
			this.content.html(params.text);
			this.popup.attr('class', 'b-popup b-adddata b-popup-alert');
			this.popup.appendTo('body');
			this.closeButton.html('Нет');
			
			if (!this.saveButton.length) {
				this.saveButton = $('<span />', { html: unescape('%u0414%u0430'), 'class': 'b-button b-save' }).appendTo(this.buttons);
			}
			this.saveButton.html(unescape('%u0414%u0430'));
			
			this.open();
			
			if (params.cb && $.isFunction(params.cb)) {
				this.saveButton.on('click', function() {
					t.lockButtons();
					params.cb($.proxy(t.close, t));
				});
				
			}
		}
	};
})();
