;(function($,window,document,undefined){
	$.fn.folderUpload=function(option){
		var myElement=$(this),
			imageElementCount=1,
			mainImageStatus=false,
			fileName=false,
			selectedItem=null,
			fileTypes=[],
			inputFileType=[],
			filesData=[],
			loadingScreen=null,
			onLoadData=[];

		if(option.elementCount!=undefined){imageElementCount=option.elementCount;}
		if(option.mainImage!=undefined){mainImageStatus=option.mainImage;}
		if(option.fileTypes!=undefined){fileTypes=option.fileTypes;}
		if(option.fileName!=undefined){fileName=option.fileName;}
		if(option.inputFileType!=undefined){inputFileType=option.inputFileType;}
		if(option.data!=undefined){onLoadData=option.data;}

		option['getData']=function(){
			return filesData;
		};

		function initHtml(){
			var html='',imageListCount=imageElementCount,inputFilter='',index=0;
			for(var i=0;i<inputFileType.length;i++){
				inputFilter+=inputFileType[i];
				if(inputFileType.length-1!=i){inputFilter+=', ';}
			}
			for(var i=0;i<imageListCount;i++){
				filesData.push({
					"id":"",
					"name":"",
					"url":"",
					"data":""
				});
			}
			for(var i=0;i<onLoadData.length;i++){
				if(i>(imageElementCount-1)){break;}
				filesData[i]['url']=onLoadData[i];
			}
			html+='<div class="folderUpload_outer">';
				html+='<div class="folderUpload_loadingScreen"><div class="folderUpload_loadingScreenBg"></div><div class="folderUpload_loadingScreenText">Lütfen bekleyin.</div></div>';
				if(mainImageStatus){
					imageListCount--;
				    html+='<div class="folderUpload_mainImage">';
				        html+='<div class="folderUpload_remove" data-index="0"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 68.162 10.398 H 21.838 c -5.38 0 -9.742 4.362 -9.742 9.742 v 3.065 h 65.808 V 20.14 C 77.904 14.76 73.542 10.398 68.162 10.398 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 57.628 14.469 H 32.373 c -1.104 0 -2 -0.896 -2 -2 C 30.373 5.593 35.966 0 42.841 0 h 4.318 c 6.875 0 12.469 5.593 12.469 12.469 C 59.628 13.573 58.732 14.469 57.628 14.469 z M 34.611 10.469 H 55.39 C 54.488 6.761 51.141 4 47.159 4 h -4.318 C 38.86 4 35.512 6.761 34.611 10.469 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 16.154 27.346 l 3.555 60.704 C 19.773 89.145 20.679 90 21.776 90 h 46.449 c 1.097 0 2.003 -0.855 2.068 -1.949 l 3.554 -60.704 H 16.154 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 32.87 81.108 c -0.04 0.003 -0.079 0.004 -0.119 0.004 c -1.051 0 -1.933 -0.82 -1.995 -1.883 l -2.275 -38.856 c -0.064 -1.103 0.777 -2.049 1.88 -2.113 c 1.088 -0.066 2.049 0.777 2.113 1.88 l 2.275 38.855 C 34.814 80.098 33.973 81.044 32.87 81.108 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 47 79.112 c 0 1.104 -0.896 2 -2 2 s -2 -0.896 -2 -2 V 40.256 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 V 79.112 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 59.244 79.229 c -0.063 1.063 -0.944 1.883 -1.995 1.883 c -0.039 0 -0.079 -0.001 -0.119 -0.003 c -1.103 -0.065 -1.944 -1.012 -1.88 -2.114 l 2.275 -38.855 c 0.063 -1.103 0.992 -1.947 2.113 -1.88 c 1.103 0.064 1.944 1.011 1.879 2.113 L 59.244 79.229 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg></div>';
				        html+='<label class="folderUpload_mainItem" for="folderUpload_mainItem" draggable="true">';
				        	html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 80.399 16.264 c 1.967 0 3.567 1.6 3.567 3.567 v 2.739 H 51.813 c -2.342 -0.659 -3.954 -2.769 -3.954 -5.227 c 0 -0.364 -0.019 -0.724 -0.055 -1.079 C 47.804 16.264 80.399 16.264 80.399 16.264 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 85.665 28.195 h -34.2 c -0.21 0 -0.419 -0.024 -0.624 -0.07 c -5.067 -1.152 -8.606 -5.586 -8.606 -10.782 c 0 -2.765 -2.249 -5.015 -5.015 -5.015 H 5.015 C 2.25 12.328 0 14.578 0 17.343 v 57.09 c 0 1.786 1.453 3.239 3.239 3.239 h 83.522 c 1.786 0 3.239 -1.452 3.239 -3.239 V 32.529 C 90 30.139 88.055 28.195 85.665 28.195 z M 55.358 51.765 c -0.976 0.977 -2.558 0.977 -3.535 0 L 47.5 47.442 v 14.671 c 0 1.381 -1.119 2.5 -2.5 2.5 s -2.5 -1.119 -2.5 -2.5 V 47.442 l -4.324 4.323 c -0.975 0.977 -2.559 0.977 -3.535 0 c -0.977 -0.976 -0.977 -2.559 0 -3.535 l 8.589 -8.588 c 0.117 -0.117 0.246 -0.222 0.384 -0.314 c 0.059 -0.04 0.124 -0.067 0.186 -0.101 c 0.081 -0.044 0.158 -0.093 0.244 -0.128 c 0.081 -0.034 0.166 -0.053 0.25 -0.078 c 0.073 -0.021 0.142 -0.049 0.217 -0.064 c 0.161 -0.032 0.325 -0.049 0.489 -0.049 s 0.328 0.017 0.489 0.049 c 0.076 0.015 0.147 0.043 0.22 0.065 c 0.082 0.024 0.166 0.043 0.246 0.076 c 0.088 0.036 0.168 0.086 0.251 0.132 c 0.06 0.033 0.122 0.059 0.179 0.097 c 0.139 0.093 0.268 0.198 0.385 0.315 l 8.588 8.588 C 56.335 49.207 56.334 50.788 55.358 51.765 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
				            html+='<div class="folderUpload_tumbnail '+(filesData[0]['url']!=''?'active':'')+'"><div class="folderUpload_img" '+(filesData[0]['url']!=''?'style="background-image: url(\''+filesData[0]['url']+'\');"':'')+'></div></div>';
				            html+='<div class="folderUpload_fileName '+(filesData[0]['name']!=''&&fileName?'active':'')+'"><div class="folderUpload_name">'+(filesData[0]['name']!=''?filesData[0]['name']:'')+'</div></div>';
				            html+='<input type="file" id="folderUpload_mainItem" accept="'+inputFilter+'" multiple="" />';
				        html+='</label>';
				    html+='</div>';
				}
				if(imageListCount>0){
				    html+='<div class="folderUpload_images">';
				        html+='<ul>';
					        for(var i=0;i<imageListCount;i++){
					        	index=(mainImageStatus?(i+1):i);
					        	html+='<li>';
					                html+='<div class="folderUpload_remove" data-index="'+index+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 68.162 10.398 H 21.838 c -5.38 0 -9.742 4.362 -9.742 9.742 v 3.065 h 65.808 V 20.14 C 77.904 14.76 73.542 10.398 68.162 10.398 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 57.628 14.469 H 32.373 c -1.104 0 -2 -0.896 -2 -2 C 30.373 5.593 35.966 0 42.841 0 h 4.318 c 6.875 0 12.469 5.593 12.469 12.469 C 59.628 13.573 58.732 14.469 57.628 14.469 z M 34.611 10.469 H 55.39 C 54.488 6.761 51.141 4 47.159 4 h -4.318 C 38.86 4 35.512 6.761 34.611 10.469 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 16.154 27.346 l 3.555 60.704 C 19.773 89.145 20.679 90 21.776 90 h 46.449 c 1.097 0 2.003 -0.855 2.068 -1.949 l 3.554 -60.704 H 16.154 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(183,66,66); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 32.87 81.108 c -0.04 0.003 -0.079 0.004 -0.119 0.004 c -1.051 0 -1.933 -0.82 -1.995 -1.883 l -2.275 -38.856 c -0.064 -1.103 0.777 -2.049 1.88 -2.113 c 1.088 -0.066 2.049 0.777 2.113 1.88 l 2.275 38.855 C 34.814 80.098 33.973 81.044 32.87 81.108 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 47 79.112 c 0 1.104 -0.896 2 -2 2 s -2 -0.896 -2 -2 V 40.256 c 0 -1.104 0.896 -2 2 -2 s 2 0.896 2 2 V 79.112 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 59.244 79.229 c -0.063 1.063 -0.944 1.883 -1.995 1.883 c -0.039 0 -0.079 -0.001 -0.119 -0.003 c -1.103 -0.065 -1.944 -1.012 -1.88 -2.114 l 2.275 -38.855 c 0.063 -1.103 0.992 -1.947 2.113 -1.88 c 1.103 0.064 1.944 1.011 1.879 2.113 L 59.244 79.229 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg></div>';
					                html+='<label class="folderUpload_item" for="folderUpload_itemId'+index+'" draggable="true">';
					                    html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 80.399 16.264 c 1.967 0 3.567 1.6 3.567 3.567 v 2.739 H 51.813 c -2.342 -0.659 -3.954 -2.769 -3.954 -5.227 c 0 -0.364 -0.019 -0.724 -0.055 -1.079 C 47.804 16.264 80.399 16.264 80.399 16.264 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 85.665 28.195 h -34.2 c -0.21 0 -0.419 -0.024 -0.624 -0.07 c -5.067 -1.152 -8.606 -5.586 -8.606 -10.782 c 0 -2.765 -2.249 -5.015 -5.015 -5.015 H 5.015 C 2.25 12.328 0 14.578 0 17.343 v 57.09 c 0 1.786 1.453 3.239 3.239 3.239 h 83.522 c 1.786 0 3.239 -1.452 3.239 -3.239 V 32.529 C 90 30.139 88.055 28.195 85.665 28.195 z M 55.358 51.765 c -0.976 0.977 -2.558 0.977 -3.535 0 L 47.5 47.442 v 14.671 c 0 1.381 -1.119 2.5 -2.5 2.5 s -2.5 -1.119 -2.5 -2.5 V 47.442 l -4.324 4.323 c -0.975 0.977 -2.559 0.977 -3.535 0 c -0.977 -0.976 -0.977 -2.559 0 -3.535 l 8.589 -8.588 c 0.117 -0.117 0.246 -0.222 0.384 -0.314 c 0.059 -0.04 0.124 -0.067 0.186 -0.101 c 0.081 -0.044 0.158 -0.093 0.244 -0.128 c 0.081 -0.034 0.166 -0.053 0.25 -0.078 c 0.073 -0.021 0.142 -0.049 0.217 -0.064 c 0.161 -0.032 0.325 -0.049 0.489 -0.049 s 0.328 0.017 0.489 0.049 c 0.076 0.015 0.147 0.043 0.22 0.065 c 0.082 0.024 0.166 0.043 0.246 0.076 c 0.088 0.036 0.168 0.086 0.251 0.132 c 0.06 0.033 0.122 0.059 0.179 0.097 c 0.139 0.093 0.268 0.198 0.385 0.315 l 8.588 8.588 C 56.335 49.207 56.334 50.788 55.358 51.765 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
					                    html+='<div class="folderUpload_tumbnail '+(filesData[index]['url']!=''?'active':'')+'"><div class="folderUpload_img" '+(filesData[index]['url']!=''?'style="background-image: url(\''+filesData[index]['url']+'\');"':'')+'></div></div>';
					                    html+='<div class="folderUpload_fileName '+(filesData[index]['name']&&fileName!=''?'active':'')+'"><div class="folderUpload_name">'+(filesData[index]['name']!=''?filesData[index]['name']:'')+'</div></div>';
					                    html+='<input type="file" id="folderUpload_itemId'+index+'" accept="'+inputFilter+'" multiple="" />';
					                html+='</label>';
					            html+='</li>';	
					        }
				        html+='</ul>';
				    html+='</div>';
				}
			html+='</div>';
			myElement.html(html);
			initEvent();
			loadingScreen=myElement.find('.folderUpload_loadingScreen');
		}

		function initEvent(){
			var imageListCount=imageElementCount;
			if(mainImageStatus){
				imageListCount--;
				myElement.find('.folderUpload_mainItem').on('dragstart',function(event){
					selectedItem=event.target;
				});
				myElement.find('.folderUpload_mainItem').on('dragover',function(event){
					$(event.target).addClass('folderUpload_fileHover');
					event.preventDefault();
				});
				myElement.find('.folderUpload_mainItem').on('dragenter',function(event){
					$(event.target).addClass('folderUpload_fileHover');
					event.preventDefault();
				});
				myElement.find('.folderUpload_mainItem').on('dragleave',function(event){
					$(event.target).removeClass('folderUpload_fileHover');
					event.preventDefault();
					event.stopPropagation();
				});
				myElement.find('.folderUpload_mainItem').on('drop',function(event){
					event.preventDefault();
					event.stopPropagation();
					$(event.target).removeClass('folderUpload_fileHover');
					fileDrop(event.originalEvent.dataTransfer.files,event.target);
				});
				myElement.find('.folderUpload_mainItem').on("change",fileDrop);
			}
			if(imageListCount>0){
				myElement.find('.folderUpload_item').on('dragstart',function(event){
					selectedItem=event.target;
				});
				myElement.find('.folderUpload_item').on('dragover',function(event){
					$(event.target).addClass('folderUpload_fileHover');
					event.preventDefault();
				});
				myElement.find('.folderUpload_item').on('dragenter',function(event){
					$(event.target).addClass('folderUpload_fileHover');
					event.preventDefault();
				});
				myElement.find('.folderUpload_item').on('dragleave',function(event){
					$(event.target).removeClass('folderUpload_fileHover');
					event.preventDefault();
					event.stopPropagation();
				});
				myElement.find('.folderUpload_item').on('drop',function(event){
					event.preventDefault();
					event.stopPropagation();
					$(event.target).removeClass('folderUpload_fileHover');
					fileDrop(event.originalEvent.dataTransfer.files,event.target);
				});
				myElement.find('.folderUpload_item').on("change",fileDrop);
			}
			myElement.find('.folderUpload_remove').on('click',function(event){
				loadingScreen.show();
				filesData[$(this).attr('data-index')]['id']='';
				filesData[$(this).attr('data-index')]['name']='';
				filesData[$(this).attr('data-index')]['url']='';
				filesData[$(this).attr('data-index')]['data']='';
				descImageList();
			});
		}

		function fileDrop(event,trgtElement){
			var droppedFilesProduct=[],targetElement=null;
			if(event.target!=undefined){
				droppedFilesProduct=event.target.files;
				targetElement=$(event.target);
			}else if(event.dataTransfer!=undefined){
				droppedFilesProduct=event.dataTransfer.files;
				targetElement=$(event.target).find('input');
			}else if(event.originalEvent!=undefined){
				droppedFilesProduct=event.originalEvent.dataTransfer.files;
				targetElement=$(event.target).find('input');
			}else{
				droppedFilesProduct=event;
				if($(trgtElement).hasClass('folderUpload_img')||$(trgtElement).hasClass('fa-file-upload')){
					targetElement=$(trgtElement).closest('label').find('input');
					if(droppedFilesProduct.length<1){
						Productdrop(targetElement);
					}
				}else{
					targetElement=$(trgtElement).find('input');
				}
			}

			if(droppedFilesProduct==null||droppedFilesProduct.length<1){return false;}
			var typeControl=false;
			if(fileTypes.length>0){
				for(var i=0;i<droppedFilesProduct.length;i++){
					for(var a=0;a<fileTypes.length;a++){
						if(fileTypes[a]==droppedFilesProduct[i].type){
							typeControl=true;
						}
					}
				}
			}else{
				typeControl=true;
			}

			if(typeControl){
				loadingScreen.show();
				var nextElement=null,thisElement=null,dataCount=0,itemIndex=0;
				for(var i=0;i<droppedFilesProduct.length;i++){
					var fr=new FileReader;
					fr.onload=function(e){
						if(nextElement==null){
							thisElement=targetElement;
							if(thisElement[0].id=='folderUpload_mainItem'){
								nextElement=thisElement.closest('.folderUpload_outer').find('.folderUpload_images ul li').eq(0).find('input');
								itemIndex=0;
							}else{
								nextElement=thisElement.closest('li').next().find('input');
								itemIndex=thisElement.closest('ul').children().index(thisElement.closest('li'));
								if(mainImageStatus){itemIndex++;}
							}
						}else{
							if(nextElement!=null&&nextElement.length>0){
								itemIndex=nextElement.closest('ul').children().index(nextElement.closest('li'));
								nextElement=nextElement.closest('li').next().find('input');
								if(mainImageStatus){itemIndex++;}
							}else{
								itemIndex=-1;
							}
						}

						if(itemIndex!=-1){
							filesData[itemIndex]['name']=droppedFilesProduct[dataCount]['name'];
							filesData[itemIndex]['data']=e.target.result;
						}
						dataCount++;

						if(droppedFilesProduct.length==dataCount){
							descImageList();
						}
					};				
					fr.readAsDataURL(droppedFilesProduct[i]);
				}
			}else{
				alert('Geçersiz Dosya Türü !');
			}
		}

		function descImageList(){
			var descItem=[];
			for(var i=0;i<filesData.length;i++){
				if(filesData[i]['id']!=''||filesData[i]['name']!=''||filesData[i]['url']!=''||filesData[i]['data']!=''){
					descItem.push({
						"id":filesData[i]['id'],
						"name":filesData[i]['name'],
						"url":filesData[i]['url'],
						"data":filesData[i]['data']
					});
				}
				filesData[i]['id']='';
				filesData[i]['name']='';
				filesData[i]['url']='';
				filesData[i]['data']='';
			}
			for(var i=0;i<descItem.length;i++){
				filesData[i]['id']=descItem[i]['id'];
				filesData[i]['name']=descItem[i]['name'];
				filesData[i]['url']=descItem[i]['url'];
				filesData[i]['data']=descItem[i]['data'];
			}
			imageList();
		}

		function imageList(){
			for(var i=0;i<filesData.length;i++){
				if(mainImageStatus){
					if(i==0){
						if(filesData[i]['data']!=''||filesData[i]['url']!=''){
							myElement.find('.folderUpload_mainImage .folderUpload_tumbnail').addClass('active');
							myElement.find('.folderUpload_mainImage .folderUpload_tumbnail .folderUpload_img').css('background-image','url('+(filesData[i]['data']!=''?filesData[i]['data']:(filesData[i]['url']!=''?filesData[i]['url']:''))+')');
							if(fileName){
								myElement.find('.folderUpload_mainImage .folderUpload_fileName').addClass('active');
								myElement.find('.folderUpload_mainImage .folderUpload_fileName .folderUpload_name').text(filesData[i]['name']);
							}
						}else{
							myElement.find('.folderUpload_mainImage .folderUpload_tumbnail').removeClass('active');
							myElement.find('.folderUpload_mainImage .folderUpload_tumbnail .folderUpload_img').css('background-image','');
							if(fileName){
								myElement.find('.folderUpload_mainImage .folderUpload_fileName').removeClass('active');
								myElement.find('.folderUpload_mainImage .folderUpload_fileName .folderUpload_name').text('');
							}
						}
					}else{
						if(filesData[i]['data']!=''||filesData[i]['url']!=''){
							myElement.find('li').eq((i-1)).find('.folderUpload_tumbnail').addClass('active');
							myElement.find('li').eq((i-1)).find('.folderUpload_tumbnail .folderUpload_img').css('background-image','url('+(filesData[i]['data']!=''?filesData[i]['data']:(filesData[i]['url']!=''?filesData[i]['url']:''))+')');
							if(fileName){
								myElement.find('li').eq((i-1)).find('.folderUpload_fileName').addClass('active');
								myElement.find('li').eq((i-1)).find('.folderUpload_fileName .folderUpload_name').text(filesData[i]['name']);
							}
						}else{
							myElement.find('li').eq((i-1)).find('.folderUpload_tumbnail').removeClass('active');
							myElement.find('li').eq((i-1)).find('.folderUpload_tumbnail .folderUpload_img').css('background-image','');
							if(fileName){
								myElement.find('li').eq((i-1)).find('.folderUpload_fileName').removeClass('active');
								myElement.find('li').eq((i-1)).find('.folderUpload_fileName .folderUpload_name').text('');
							}
						}
					}
				}else{
					if(filesData[i]['data']!=''||filesData[i]['url']!=''){
						myElement.find('li').eq(i).find('.folderUpload_tumbnail').addClass('active');
						myElement.find('li').eq(i).find('.folderUpload_tumbnail .folderUpload_img').css('background-image','url('+(filesData[i]['data']!=''?filesData[i]['data']:(filesData[i]['url']!=''?filesData[i]['url']:''))+')');
						if(fileName){
							myElement.find('li').eq(i).find('.folderUpload_fileName').addClass('active');
							myElement.find('li').eq(i).find('.folderUpload_fileName .folderUpload_name').text(filesData[i]['name']);
						}
					}else{
						myElement.find('li').eq(i).find('.folderUpload_tumbnail').removeClass('active');
						myElement.find('li').eq(i).find('.folderUpload_tumbnail .folderUpload_img').css('background-image','');
						if(fileName){
							myElement.find('li').eq(i).find('.folderUpload_fileName').removeClass('active');
							myElement.find('li').eq(i).find('.folderUpload_fileName .folderUpload_name').text('');
						}
					}
				}
			}
			loadingScreen.hide();
		}

		function Productdrop(targetElement){
			if(selectedItem!=null){
				var firstElement=$(selectedItem).find('.folderUpload_img'),
					secondElement=targetElement.closest('label').find('.folderUpload_img'),
					firstUrl='',
					secondUrl='',
					firstIndex=-1,
					secondIndex=-1;

				if(!targetElement.closest('label').hasClass('folderUpload_mainItem')){
					secondIndex=targetElement.closest('ul').children().index(targetElement.closest('li'));
					firstIndex=$(selectedItem).closest('ul').children().index($(selectedItem).closest('li'));
					if(mainImageStatus){
						secondIndex++;
						firstIndex++;
					}
				}else{
					firstIndex=$(selectedItem).closest('ul').children().index($(selectedItem).closest('li'));
					if(mainImageStatus){
						firstIndex++;
						secondIndex=0;
					}
				}

				firstUrl=(filesData[firstIndex]['data']!=''?filesData[firstIndex]['data']:(filesData[firstIndex]['url']!=''?filesData[firstIndex]['url']:''));
				secondUrl=(filesData[secondIndex]['data']!=''?filesData[secondIndex]['data']:(filesData[secondIndex]['url']!=''?filesData[secondIndex]['url']:''));
				
				if(firstUrl!=''&&secondUrl!=''){
					if(filesData[firstIndex]['data']!=''){filesData[firstIndex]['data']=secondUrl;}
					if(filesData[firstIndex]['url']!=''){filesData[firstIndex]['url']=secondUrl;}
					
					if(filesData[secondIndex]['data']!=''){filesData[secondIndex]['data']=firstUrl;}
					if(filesData[secondIndex]['url']!=''){filesData[secondIndex]['url']=firstUrl;}

					firstElement.css('background-image','url('+secondUrl+')');
					secondElement.css('background-image','url('+firstUrl+')');
				}
			}
		}

		initHtml();

		return option;
	};
})(window.Zepto || window.jQuery, window, document);