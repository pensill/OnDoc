App.Form = function(form) {
	this.init(form);
};
App.Form.prototype = (function() {
	var _params = {};

	return {
		init: function(form) {
			this.form = form;
			this.addSuccess = $('<div></div>', {
				'class': 'b-add-success b-ac',
				html: '<div class="b-aligner"></div>'+
					'<div class="b-align-container">'+
						'<i class="b-icon b-daw-success-s"></i>'+
						'<h2>Cохранено!</h2>'+
					'</div>'
			});
			this.submitButton = this.form.find('.submit');
			
			_params = {
				action: this.form.attr('action'),
				isAjax: this.form.data('ajax'),
				id: this.form.data('formname'),
				successCb: this.form.data('successCb')
			}
			
			this.binds();
		},
		binds: function() {
			var t = this;
		
			this.submitButton.on('click', function() {
				t.form.trigger('send');

				return false;
			});
			this.form.on('submit', function() {
				console.log('submit not send');
				t.form.trigger('send');

				return false;
			});
			this.ajaxsend();
			this.bindErrors();
		},
		bindErrors: function(rebind) {
		console.log('bindErrors', rebind);
			this.form.find('.b-input-box.b-error').each(function() {
				var $box = $(this);

                console.log($box);
				
				$box.find('input')
					.on('focus', function() {
                        $box.find('.b-error-hint').remove();
					})
					.on('change', function() {
                        $box.removeClass('b-error');
					})
			});
			
			this.form.find('.b-field.b-error').each(function(i, el) {
				$(el).css({ 'zIndex': 100 - i });
			});
			
			rebind && App.popup && App.popup.rebind();
		},
		isAjax: function() {
			return _params.isAjax;
		},
		ajaxsend: function() {
			var t = this;
			
			if (this.isAjax()) {
				this.form.on('send', function(e, params) {
					console.log('serialize', t.serialize());
					console.log('_params.id', _params.id);
					
					t.form.find('.b-error-hint').remove();
					
					App.popup.lockButtons();
					
					$.post(_params.action, t.serialize(), function(data) {
							if (!data.errors) {
								t.sendSuccess(data);
							} else {
								t.sendError(data);
							}
						})
						.fail(function(e) {
							console.log('request failed', e);
							alert('request failed');
						});
				
					return false;
				});
			}
		},
		sendError: function(data) {
			console.log('sendError', _params.id, data);
			
			this.redrawHTML = data.form;
			this.redraw();
			this.bindErrors(true);
			
			App.popup.unlockButtons();
		},
		sendSuccess: function(data) {
			var t = this;
		
			console.log('sendSuccess', _params.id, data);
			var form_id = {
				'add-pressure': function() { App.Page.drawGraph('pressure', data); App.Page.renderTopPatientData('pressure-top', data.html); },
				'add-pulse': function() { App.Page.drawGraph('pulse', data); },
				'add-sugar': function() { App.Page.drawGraph('sugar-level', data); },
				'add-cholesterol': function() { App.Page.drawGraph('cholesterol', data); },
				'add-weight': function() { App.Page.drawGraph('weight', data); App.Page.renderTopPatientData('weight-top', data.html); },
				'add-temperature': function() { App.Page.drawGraph('temperature', data); },
				
				'add-lifeway': function() { App.Page.renderLifewayData(data.html); },
				'add-height': function() { App.Page.renderTopPatientData('height', data.html); },
				'add-blood-type': function() { App.Page.renderTopPatientData('bloodGroup', data.html); },
				'add-vision': function() { App.Page.renderTopPatientData('vision', data.html); },
				'add-allergy': function() { App.Page.renderHistoryTableNote('allergy', data.html); },
				'add-vaccinations': function() { App.Page.renderHistoryTableNote('vaccinations', data.html); },
				'add-operations': function() { App.Page.renderHistoryTableNote('operations', data.html); },
				'add-medicine': function() { App.Page.renderHistoryListNote('medicine', data.html); },
				'add-preparation': function() { App.Page.renderPreparation('intake_med_values', data.html); },
				'add-specialist': function() { App.Page.fillAutocompleteData('js-doctor-choose', data); },
				'add-clinic': function() { App.Page.fillAutocompleteData('js-add-clinic', data); },
                'add-city-residence': function() { App.Page.fillAutocompleteData('js-city-residence', data); },
				
				'change-email': function() { 
					App.popup.render({
						tpl: 'changeEmail', 
						buttons: false,
						appendToBlock: t.form
					});
					App.popup.open({
						autoClose: 2
					});
				},
				'change-pass': function() { 
					App.popup.render({
						tpl: 'changePass', 
						buttons: false,
						appendToBlock: t.form
					});
					App.popup.open({
						autoClose: 2
					});
				}
			};
			
			if (_params.successCb) {
				t._successAddPatientData(form_id[_params.successCb]);
			} else {
				t._successAddPatientData(form_id[_params.id]);
			}
			
			switch (_params.id) {
				case 'reg-form':
					App.popup.render({
						tpl: 'reg-success',
						appendToBlock: '#registration'
					});
					App.popup.open({
						autoClose: 2
					});
					
					this.form.trigger('reset');
				
					break;
			};
		},
		_successAddPatientData: function(cb) {
			this.addSuccess.appendTo(App.popup.content);

			this.addSuccess.animate({
				opacity: 1
			},300, function() {
				setTimeout(function() {
					App.popup.close(cb);
				}, 2000);
			});
		},
		redraw: function() {
			if (this.redrawHTML) {
				this.form.html(this.redrawHTML);
			}
		},
		serialize: function() {
			var res = {};
		
			this.form.find('input, select').each(function() {
				var $input = $(this);
			
				if ($input.is('[type=checkbox]')) {
					($input.attr('name') && $input.is(':checked')) && (res[$input.attr('name')] = $input.val());
				}
				else {
					$input.attr('name') && (res[$input.attr('name')] = $input.val());
				}
			});
			
			return res;
		}
	}
})();
