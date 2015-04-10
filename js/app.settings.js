var App = {};
App.Graphs = {};

$.datepicker.setDefaults({
    showOn: "both",
    buttonImage: "/assets/i/calendar.png",
    dayNamesMin: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    firstDay: 1,
    dateFormat: "dd.mm.yy"
});

App.settings = {
	setAutocompleteSettings: function(elem) {
		$(elem).on('focus', function() {
			var type = $(this).data('autocomplete-type');
			console.log(type);
			switch (type) {
				case 'doctor':
					$.ui.autocomplete.prototype._renderItem = function(ul, item) {
						ul.addClass('ui-autocomplete-' + type);
						
						return $('<li>')
							.attr('data-value', item.value)
							.append($('<a>').html('<img class="b-ava" src="'+ item.ava +'" alt="" /><div class="info"><div class="name">'+ item.value +'</div><div class="post">'+ item.post +'</div></div>'))
							.appendTo(ul);
					};
					
				break;
				
				case 'clinic':
					$.ui.autocomplete.prototype._renderItem = function(ul, item) {
						ul.addClass('ui-autocomplete-' + type);
						
						return $('<li>')
							.attr('data-value', item.value)
							.append($('<a>').html(item.value + '<div class="address"><b class="b-icon b-addresspoint"></b>'+ item.address +'</div>'))
							.appendTo(ul);
					};
					
				break;
				
				case 'city-residence':
					$.ui.autocomplete.prototype._renderItem = function(ul, item) {
						ul.addClass('ui-autocomplete-' + type);
						
						return $('<li>')
							.attr('data-value', item.value)
							.append($('<a>').html(item.value))
							.appendTo(ul);
					};
				break;
			}
		});
	},
	getOpts: function(elem, parent) {
		var opts = {},
			$hidden,
			type = elem.data('autocomplete-type');
	
		switch (type) {
			case 'doctor':
				
				opts = {
					source: '/ajax/doctors_list',
					create: function(e, ui) {
						$hidden = $('<input />', { name: elem.attr('name'), type: 'hidden' }).insertAfter(elem);
						elem.attr('name', '');
					},
					select: function(e, ui) {
						$hidden.val(ui.item.id);
						parent.find('.b-ava').attr('src', ui.item.ava);
					}
				};
				
			break;
			
			case 'clinic':
			
				opts = {
					source: '/ajax/clinic_list',
					create: function(e, ui) {
						$hidden = $('<input />', { name: elem.attr('name'), type: 'hidden' }).insertAfter(elem);
						elem.attr('name', '');
					},
					select: function(e, ui) {
						$hidden.val(ui.item.id);
					}
				};
				
			break;

            case 'city-residence':

                opts = {
                    source: '/ajax/city_list',
                    create: function(e, ui) {
                        $hidden = $('<input />', { name: elem.attr('name'), type: 'hidden' }).insertAfter(elem);
                        elem.attr('name', '');
                    },
                    select: function(e, ui) {
                        $hidden.val(ui.item.id);
                    }
                };

                break;
		}
		
		return opts;
	}
}

App.w = $(window);

App.Page = {
	w: {
		el: $(window),
		h: $(window).height() - 200
	},
	init: function() {
		this.header = $('.b-top');
		this.carousel = $('.b-carousel');
		
		this.binds();
	},
	setSlider: function(elem) {
		elem.each(function(i, el) {
			var $el = $(el),
				val = $el.data('value');
		
			$el.slider({
				value: val,
				create: function(e, ui) {
					var $this = $(e.target)
				
					$this.append('<div class="b-slider-val"></div>');
					$this.find('.b-slider-val').css({
						left: val + '%'
					});
					$this.append('<span class="border left">редко</span><span class="border right">часто</span>');
				},
				slide: function(e, ui) {
					$(e.target).find('.b-slider-val').css({
						left: ui.value + '%',
						width: (105 - ui.value) + '%'
					});
				},
				change: function(e, ui) {
					$(e.target).find('.b-slider-val').css({
						left: ui.value + '%',
						width: (105 - ui.value) + '%'
					});
				}
			});
		});
	},
	binds: function() {
		var t = this,
			$enter = this.header.find('.b-enter');
	
		this.header.find('.b-enter .handler').on('click', function() {
			if ($enter.find('.b-sub-menu').length) {
				$enter.toggleClass('open');
		
				$('body').on('click.enterclose', function(e) {
					if (!($(e.target).closest($enter).length)) {
						$enter.removeClass('open');
						$('body').off('click.enterclose');
					}
				});
				
				return false;
			}
		});
	
		new App.Carousel(this.carousel);
		
		this.w.el.on('scroll', function() {
			if ($(this).scrollTop() > App.Page.w.h) {
				$('.b-toUp').addClass('show');
			} else {
				$('.b-toUp').removeClass('show');
			}
		});
		
		$('.b-toUp').on('click', function() {
			t.w.el.scrollTop(0);
			
			return false;
		});
		
		var addPacksMeasure = $('.b-additional-packages-item .measurements');
		addPacksMeasure.find('.num').on('change', function() {
			addPacksMeasure.find('.total').val($(this).val()*addPacksMeasure.find('.price').data('price') + ' руб.');
		});
		
		this.setSlider($('.b-slider'));
		this.setScrollpane();
		this.setDatePicker();
		this.setSelect();
		this.uploadDocs();
		this.setAddLines();
		this.setDropdown();
		this.setAutocomplete('.b-autocomplete', '#js-doctor-choose');
		this.setAutocomplete('.b-autocomplete', '#js-add-clinic');
		this.setAutocomplete('.b-autocomplete', '#js-city-residence');
		this.setOpener();
		this.setRadio();
		this.setRadioGroup('tarifs', $('.b-tarifs table .b-button'));
	},
	setRadioGroup: function(type, labels) {
		switch (type) {
			case 'tarifs':
				if (labels.find('input:checked').length) {
					$('.b-choose-tarif input:submit, .b-additional-packages-item input:submit').removeAttr('disabled');
					labels.find('input:checked').closest('label').removeClass('theme-gray-dark');
				}
			
				labels.find('input').on('change', function() {
					var $input = $(this);
					labels.addClass('theme-gray-dark');
					if ($input.is(':checked')) {
						$('.b-choose-tarif input:submit, .b-additional-packages-item input:submit').removeAttr('disabled');
						$input.closest('label').removeClass('theme-gray-dark');
					}
				});
			
				break;
		}
	},
	setRadio: function() {
		$('.b-radio-box').each(function(i, el) {
			new App.Radio($(el));
		});
	},
	setOpener: function() {
		$('.b-orders-list li').each(function() {
			var $li = $(this);
			
			$li.find('.line').on('click', function() {
				$li.toggleClass('open');
			});
		});
		$('.b-archive-table .line .b-go').on('click', function() {
			var $line = $(this);
			
			$line.closest('tbody').toggleClass('open');
		});
	},
	setAddLines: function() {
		$.each($('.addlines'), function(i, el) {
			new App.Addlines($(el));
		});
	},
	setDropdown: function() {
		$.each($('.b-dropdown'), function(i, el) {
			new App.Dropdown($(el));
		});
	},
	setScrollpane: function() {
		$('.b-scrollpane-wrap').jScrollPane();
		
		$('.b-scrollpane-lines').each(function(i, el){
			var $this = $(el),
				lines = $this.find($this.data('line'));
			
			if (lines.length > 10) {
				$this.height(lines.filter(':eq(0)').outerHeight() * 10);
				$this.jScrollPane();
			}
		});
	},
	setAutocomplete: function(el, parent, opts) {
		var $el = $(el, parent),
			$parent = $(parent),
			options;
	
		App.settings.setAutocompleteSettings($el);
		$el.autocomplete($.extend(App.settings.getOpts($el, $parent), opts));
	},
	setDatePicker: function(parent) {
		$('.b-datepicker', parent).datepicker();
	},
    setTimePicker: function(parent) {
        $('.b-timepicker', parent).timepicker({
            defaultTime: '12:00',
            hourText: 'Часы',
            minuteText: 'Минуты'
        });
    },
	setSelect: function(parent) {
		$.each($('.b-select-box', parent), function(i, el) {
			new App.Select($(el));
		});
	},
	uploadDocs: function() {
		if (!$('.b-uploader').length) return;

        var url = "/ajax/load_document";

        if ($('#survey-request-page').length > 0) {
            url = "/ajax/load_request_document";
        }

		this.uploadDocsOpts = {
			runtimes: 'html5,flash,silverlight,html4',
			url: url,
			flash_swf_url: 'http://rawgithub.com/moxiecode/moxie/master/bin/flash/Moxie.cdn.swf',
			container: 'js-doc-upload',
			browse_button: 'js-doc-browse',
			dragdrop: true,
			drop_element: 'js-uploader-drop',
			multipart: true,
			filters: {
			},
			autostart: true,
			max_files_count: 5
		};
	
		new App.UploadDocs(this.uploadDocsOpts, $('.b-uploader'));
	},
	drawGraph: function(id) {
		var currentTpl = App.popup.getCurrentTpl(),
			graphId = id.replace(/-/gi, '_'),  // выпилить эту хрень попозже, сделать однообразно или везде sugar или sugar-level
			graphBlock = $('#' + id + '-graph');
			
		console.log('drawGraph', id, graphId, graphBlock);
		
		if (!graphBlock.length) {
			App.popup.popup.closest('.b-patientdata-item').find('.b-ac').html('<div class="graph" id="'+ id +'-graph" style="width: 315px; height:229px;"></div>');
			graphBlock = $(id + '-graph');
		}
		
		$.ajax(Routing.generate('ajax_dashboard_'+ graphId +'_data'), {
			success: function (data) {
				graphBlock.html('');
				App.Graphs[graphId].data = data;
				new Morris.Line(App.Graphs[graphId]);
			}
		})
	},
	addPatientData: function(popupElem, successCb) {
		console.log('addPatientData');
		
		var form = popupElem.find('.b-popup-form');
		form.data('successCb', successCb);
		
		App.popup.rebind();
		
		new App.Form(form);
		
		App.popup.saveButton.on('click', function() {
			if ($(this).is('[disabled]')) return false;
			
			form.trigger('send');
		});
	},
	showAllHistory: function(popupElem, linetag, block) {
		console.log('showAllHistory');
		var content = popupElem.find(block),
			line = content.find(linetag + ':eq(0)'),
			lines = content.find(linetag).length;
			
		if (lines > 10) {
			content.height(line.outerHeight() * 10);
			content.jScrollPane();
			App.popup.toCenter();
		}
	},
	renderHistoryTableNote: function(selector, html) {
		console.log('renderHistoryTableNote', selector , html);
		if (!html) return;
		
		var elem = $('#js-' + selector),
			historyTable = '<table class="b-history-list">' + elem.find('.b-history-list').html() + html + '</table>',
			jsp = elem.find('.jspScrollable').data('jsp'),
			pane = jsp ? jsp.getContentPane() : elem.find('.b-history-list');
			
		pane.html(historyTable);
		jsp && jsp.reinitialise();
	},
	renderHistoryListNote: function(selector, html) {
		console.log('renderHistoryListNote', selector , html);
		if (!html) return;
		
		var elem = $('#js-' + selector),
			historyList = elem.find('ul').html() + html,
			jsp = elem.find('.jspScrollable').data('jsp'),
			pane = jsp ? jsp.getContentPane() : elem.find('ul');
		
		pane.html(historyList);
		jsp && jsp.reinitialise();
	},
	renderTopPatientData: function(selector, html) {
		if (!html) return;
		
		var block = $('#js-' + selector),
			val = block.find('.val');
		
		if (!val.length) {
			block.find('.b-icon.b-add').replaceWith('<div class="val">'+ html +'</div>');
		} else {
			val.html(html);
		}
	},
	renderLifewayData: function(html) {
		if (!html) return;
		
		$('#js-lifeway table').replaceWith(html);
	},
	renderPreparation: function(selector, html) {
		var block = $('#' + selector);
		console.log('renderPreparation', block, html);
		if (!block.length) return;
		
		block.html(block.html() + html);
	},
	fillAutocompleteData: function(selector, data) {
		var block = $('#'+selector);
		
		if (!block.length) return;
		
		block.find('input[type=text]').val(data.name);
		block.find('input[type=hidden]').val(data.id);
	}
}

$(function() {
	$('.js-form').each(function(i, el) {
		new App.Form($(el));
	});
	
	App.Events.init();
	App.popup = new App.Popup();
	App.Page.init();
});
