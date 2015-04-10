App.Events = (function() {
	var popupevts = {};

	return {
		init: function() {
//			this.settingsEvts();
			this.patientHistoryGet();
			this.patientDataEvts();
			this.customEvts();
		},
		settingsEvts: function() {
			var settingsForm = $('.b-settings-form');
			if (!settingsForm.length) return;
			
			settingsForm.each(function(i, el) {
				new App.Form($(el));
			});
		},
		getPopupEvts: function() {
			return popupevts;
		},
		customEvts: function() {
			popupevts['.js-demo-access'] = {
				etpl: 'click:demo',
				params: {
					buttons: true
				}
			};
			popupevts['.js-demo-access'] = {
				etpl: 'click:demo',
				params: {
					buttons: true
				}
			};
			
			$('.preparation').delegate('.text .b-button', 'click', function() {
				var preparation = $(this).closest('.text');
			
				App.popup.alert({
					text: unescape('%u0412%u044B%20%u0443%u0432%u0435%u0440%u0435%u043D%u044B%20%u0447%u0442%u043E%20%u0445%u043E%u0442%u0438%u0442%u0435%20%u0443%u0434%u0430%u043B%u0438%u0442%u044C%20%u0434%u0430%u043D%u043D%u044B%u0439%20%u043F%u0440%u0435%u043F%u0430%u0440%u0430%u0442%3F'),
					cb: function(closePopup) {
						$.get('/ajax/survey/medicament/delete/' + preparation.find('input').val(), function(data) {
							if (data.deleted) {
								preparation.remove();
							}
							(closePopup && $.isFunction(closePopup)) && closePopup();
						});
					}
				});
			});

            var historyPopups = ['pressure', 'pulse', 'sugar-level', 'cholesterol', 'weight', 'temperature', 'allergy', 'vaccination', 'operation'];

            historyPopups.forEach(function(element){
                var className = '.b-' + element + '-history-popup .b-delline';

                $(document).delegate(className, 'click', function () {
                    var id = $(this).data('id'),
                        line = $(this).closest('tr');

                    App.popup.alert({
                        text: "Вы уверены что хотите удалить значение из истории?",
                        cb: function(closePopup) {
                            var deleteUrl = '/ajax/dashboard/widgets/' + element + '/delete/' + id;

                            $.post(deleteUrl, function(data) {
                                if (data.deleted) {
                                    line.remove();

                                    if (['allergy', 'vaccination', 'operation'].indexOf(element) == -1) {
                                        App.Page.drawGraph(element);
                                    } else if (['allergy', 'vaccination', 'operation'].indexOf(element) != -1) {
                                        $('[data-' + element + '-id="' + id + '"]').remove();
                                    }
                                }
                                (closePopup && $.isFunction(closePopup)) && closePopup();
                            });
                        }
                    });
                });
            });

            $(document).delegate('#survey-delete', 'click', function(e) {
                e.preventDefault();
                var id = $(this).data('id');

                App.popup.alert({
                    text: "Вы уверены что хотите удалить обследование?",
                    cb: function(closePopup) {
                        $.post('/patient/survey/' + id + '/delete', function(data) {
                            if (data.deleted) {
                                window.location.replace(data.redirect_url);
                            }
                            (closePopup && $.isFunction(closePopup)) && closePopup();
                        });
                    }
                });
            });
		},
		patientHistoryGet: function() {
			var patientDataBlocks = [
					'pressure', 'pulse', 'sugar', 'cholesterol', 'weight', 'temperature', 'allergy', 'vaccinations', 'operations'
				];
				
			$.each(patientDataBlocks, function(i, el) {
				popupevts['.js-popup-' + el + '-history'] = {
					etpl: 'click:history-' + el,
					params: {
						buttons: true,
						align: 'center',
						appendToBlock: '#js-' + el,
						url: '/ajax/dashboard/widgets/' + el + '/history',
						tpl: 'history-' + el,
						group: 'group-history'
					}
				}
			});
		},
		patientDataEvts: function() {
			var patientDataBlocks = [
					'pressure', 'pulse', 'sugar', 'cholesterol', 'weight', 'temperature', 'allergy', 'vaccinations', 'operations', 'lifeway', 'medicine', 'preparation', 'allergy', 'vaccinations', 'operations',
					'add-specialist', 'add-clinic'
				],
				topPatientDataBlocks = [
					'height', 'bloodGroup', 'vision', 'weight-top', 'pressure-top'
				];
			
			$.each(patientDataBlocks, function(i, el) {
				popupevts['.js-popup-' + el] = {
					etpl: 'click:' + el,
					params: {
						buttons: true,
						align: 'center',
						appendToBlock: '#js-' + el 
					}
				}
			});
			
			popupevts['.js-popup-medicine'].params.align = 'right';
			popupevts['.js-popup-add-specialist'].params.appendToBlock = '#js-doctor-choose';
			popupevts['.js-popup-preparation'].etpl = 'click:medicine';
			popupevts['.js-popup-preparation'].params.successCb = 'add-preparation';
			
			$.each(topPatientDataBlocks, function(i, el) {
				popupevts['.js-popup-' + el] = {
					etpl: 'click:' + el,
					params: {
						buttons: true,
						closeButton: '%u043E%u0442%u043C%u0435%u043D%u0438%u0442%u044C',
						align: 'center',
						appendToBlock: '#js-' + el,
						group: 'pdata',
					}
				}
			});
			popupevts['.js-popup-weight-top'].etpl = 'click:weight';	
			popupevts['.js-popup-pressure-top'].etpl = 'click:pressure';
		}
	}
})()
