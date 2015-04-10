// История диагнозов
var diagnosishtml = '<div class="b-diagnosis-chronic-diseases">'+
						'<h2>История диагнозов</h2>'+
						'<div class="b-diagnosis">'+
							'<table class="b-history-list">'+
								'<tr>'+
									'<td class="l">'+
										'<div class="name">Отравление</div>'+
									'</td>'+
									'<td class="c">'+
										'<div class="b-slider ui-slider">'+
											'<a href="#" class="ui-slider-handle ui-state-default ui-corner-all" style="left: 11%;"></a>'+
											'<div class="b-slider-val" style="left: 11%;"></div>'+
											'<span class="border left">редко</span><span class="border right">часто</span>'+
										'</div>'+
									'</td>'+
									'<td>'+
										'<div class="date">'+
											'12.12.2013'+
											'<a class="b-go" href="#"></a>'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'</table>'+
						'</div>'+
					'</div>';
					
// Хронические заболевания
var chronicdiseaseshtml = '<div class="b-diagnosis-chronic-diseases">'+
					'<h2>Хронические заболевания</h2>'+
					'<div class="b-chronic-diseases">'+
						'<table class="b-history-list">'+
							'<tr>'+
								'<td class="l">'+
									'<div class="name">Артрит</div>'+
								'</td>'+
								'<td class="c">'+
									'<i class="b-icon b-folder"></i>'+
								'</td>'+
								'<td>'+
									'<div class="date">'+
										'14 записей с 2006 года'+
										'<a href="#" class="b-go"></a>'+
									'</div>'+
								'</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="l">'+
									'<div class="name">Мучит</div>'+
								'</td>'+
								'<td class="c">'+
									'<i class="b-icon b-folder"></i>'+
								'</td>'+
								'<td>'+
									'<div class="date">'+
										'14 записей с 2006 года'+
										'<a href="#" class="b-go"></a>'+
									'</div>'+
								'</td>'+
							'</tr>'+
						'</table>'+
					'</div>'+
				'</div>';
				
// попап истории давления
var pressureHistoryHtml = '<div class="b-pressure-history-popup">'+
		'<h2>Давление</h2>'+
		'<fieldset class="b-field b-cols">'+
			'<span class="b-input-box l-col"><input type="text" class="b-datepicker" value="" /></span>'+
			'<span class="b-input-box r-col"><input type="text" class="b-datepicker" value="" /></span>'+
		'</fieldset>'+
		'<div class="b-pressure">'+
			'<table class="b-history-list">'+
                '<tr>'+
                    '<td class="l">'+
                        '<div class="name">80 | 120</div>'+
                    '</td>'+
                    '<td class="c">'+
                        '<div class="date">28.02.2014</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="date">18:02</div>'+
                    '</td>'+
					'<td class="r"><i class="b-icon b-delline"></i></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="l">'+
                        '<div class="name">75 | 110</div>'+
                    '</td>'+
                    '<td class="c">'+
                        '<div class="date">01.01.2014</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="date">18:01</div>'+
                    '</td>'+
					'<td class="r"><i class="b-icon b-delline"></i></td>'+
                '</tr>'+
			'</table>'+
		'</div>'+
	'</div>';
	
// попап истории холестерина
var cholesterolHistoryHtml = '<div class="b-cholesterol-history-popup">'+
		'<h2>Холестерин</h2>'+
		'<div class="b-cholesterol">'+
			'<table class="b-history-list">'+
				'<thead>'+
					'<tr>'+
						'<th class="l">Общий</th>'+
						'<th class="l">ЛВП</th>'+
						'<th class="l">ХВП</th>'+
						'<th class="l">ТГ</th>'+
						'<th colspan="3"></th>'+
					'</tr>'+
				'</thead>'+
                '<tr>'+
                    '<td class="l">'+
                        '<div class="name">4,5</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">3,8</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="c">'+
                        '<div class="date">28.02.2014</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="date">18:02</div>'+
                    '</td>'+
					'<td class="r"><i class="b-icon b-delline"></i></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="l">'+
                        '<div class="name">4,5</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">3,8</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="c">'+
                        '<div class="date">28.02.2014</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="date">18:02</div>'+
                    '</td>'+
					'<td class="r"><i class="b-icon b-delline"></i></td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="l">'+
                        '<div class="name">4,5</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">3,8</div>'+
                    '</td>'+
                    '<td class="l">'+
                        '<div class="name">80</div>'+
                    '</td>'+
                    '<td class="c">'+
                        '<div class="date">28.02.2014</div>'+
                    '</td>'+
                    '<td>'+
                        '<div class="date">18:02</div>'+
                    '</td>'+
					'<td class="r"><i class="b-icon b-delline"></i></td>'+
                '</tr>'+
			'</table>'+
		'</div>'+
	'</div>';