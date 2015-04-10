App.UploadDocs = function(opts, elem) {
	this.run(opts, elem);
};
App.UploadDocs.prototype = {
	run: function(opts, elem) {
		this.elem = elem;
		this.options = opts;
		
		this.build();
		
		this.plupload = new plupload.Uploader(opts);
		this.binds();
		this.plupload.init();
	},
	binds: function() {
		var t = this;
	
		this.plupload.bind('Init', function(a, b) {
			console.log('Init');
		});
		this.plupload.bind('PostInit', function(a, b) {
			console.log('PostInit');
		});
		this.plupload.bind('OptionChanged', function(a, b) {
			console.log('OptionChanged');
		});
		this.plupload.bind('Refresh', function(a, b) {
			console.log('Refresh');
		});
		this.plupload.bind('FileUploaded', function(a, b, c) {
			console.log('FileUploaded', a, b, c);
			if (c.response) {
				t.elem.append('<input type="hidden" value="'+ c.response +'" name="files[]" />');
			}
		});
		this.plupload.bind('UploadFile', function(a, b) {
			console.log('UploadFile');
		});
		this.plupload.bind('UploadProgress', function(a, b) {
			console.log('UploadProgress');
		});
		this.plupload.bind('FilesAdded', function(a, b) {
			setTimeout(function() {
				if (a.files.length >= a.settings.max_files_count) {
					a.files.splice(a.settings.max_files_count, a.files.length);
					b.splice(a.settings.max_files_count, a.files.length);
					t.browseButton.attr('disabled', 'disabled');
					t.plupload.disableBrowse();
				}
			
				t.filesField.removeClass('hidden');
				
				t.filesField.html('');
				$.each(a.files, function(i, file) {
					var li = $('<li></li>', { 'class': 'b-ac', html: '<div class="b-aligner"></div><div class="b-align-container"></div>' });
					li.appendTo(t.filesField);
					li.find('.b-align-container').html(t._getThumb(file, li.find('.b-align-container')));
				});

                if ($('#documents-no-files-error')) {
                    $('#documents-no-files-error').remove();
                }
				
				t.plupload.start();
			}, 1);
		});
		this.plupload.bind('UploadComplete', function(a, b) {
			console.log('UploadComplete', a, b);
		});
		this.plupload.bind('Error', function(a, b) {
			console.log('Error');
		});
	},
	_getThumb: function(file, el) {
		var t = this;
	
		if (file.type.match(/pdf/gi)) {
			return '<i class="b-icon b-pdf-s"></i>';
		} else if (file.type.match(/\.document/gi)) {
			return '<i class="b-icon b-doc-s"></i>';
		} else if (file.type.match(/\.sheet/gi)) {
			return file.name;
		} else if (file.type.match(/image/gi)){
			var img = new o.Image();
			
			img.onload = function() {
				var thumb = el.html('');
				this.embed(thumb[0], { 
					width: 78, 
					height: 78, 
					crop: true,
					swf_url: o.resolveUrl(t.options.flash_swf_url),
					xap_url: o.resolveUrl(t.options.silverlight_xap_url)
				});
			};

			img.load(file.getSource());
		}
	},
	build: function() {
		this.elem.append(this.getBlockHtml(this.elem.data('type')));
		
		this.browseButton = this.elem.find('#js-doc-browse');
		this.filesField = this.elem.find('.b-uploader-files');
	},
	getBlockHtml: function(type) {
		console.log('getBlockHtml', type);
		switch (type) {
			case 'docs':
				return '<div class="b-uploader-container" id="js-doc-upload">'+
					'<div class="b-uploader-drop" id="js-uploader-drop">'+
						'<ul class="b-uploader-files b-added-docs hidden"></ul>'+
						'<i class="b-icon b-iphoto"></i>'+
						'<div class="b-uploader-drop-text">Перетащите файлы в эту область для загрузки или <span class="b-pseudo-link" id="js-doc-browse">выберите файлы</span> (максимум 5)</div>'+
					'</div>'+
				'</div>'
			
				break;
			default:
				return '<div class="b-uploader-container" id="js-doc-upload">'+
					'<div class="b-uploader-drop" id="js-uploader-drop">'+
						'<ul class="b-uploader-files b-added-docs hidden"></ul>'+
						'<i class="b-icon b-iphoto"></i>'+
						'<div class="b-uploader-drop-text">Перетащите файлы в эту область для загрузки или выберите файлы (максимум 5)</div>'+
					'</div>'+
					'<div class="b-buttons">'+
						'<span id="js-doc-browse" class="b-button">загрузить с компьютера</span>'+
					'</div>'+
				'</div>';
		}
	}
};
