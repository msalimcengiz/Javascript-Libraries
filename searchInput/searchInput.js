;(function($, window, document, undefined) {
	$.fn.SearchInput = function(option) {
		var MyElement = $(this);

		var OuterMyElement=null,
			SearchOuter=null,
			SearchClearIcon=null,
			SearchSuggestions=null,
			SearchSuggestionsResulth=null,
			ClearControl=0,
			CatOpStatus=0,
			CatStatus=0,
			StartHtml='',
			ajaxUrl='',
			ajaxSearchUrl='',
			ajaxDatas='',
			ajaxSendDatas={},
			LoadedDatas=[],
			DataRequestText='',
			DataStatus=0,
			MenuIndex=0,
			ActivetedIndex=0,
			SearchTımeOut=null,
			startHtmlData='',
			elementSearch=null,
			elementSendDatas={},
			elementDatas='',
			searchKeyName='',
			searchResulthKeyName='',
			VaryantHtml='',
			NoResulthAddStatus=false,
			ClickOpen=true,
			BoxOp='all',
			IconStatus=true,
			ResetInputFunc='',
			ResetInputFuncDatas='',
			NoResulthAddFunc='',
			NoResulthAddFuncDatas='',
			IsResulthFunc='',
			IsResulthFuncDatas='',
			viewTreeStatus=false,
			keySelectedIndex=-1,
			searchStatus=false,
			scroolLoadStatus=true,
			SearchInput_TreeName='',
			catListMenus='',
			SelectedOp='',
			scrollingElementKeyControl=null,
			scroolPositionKeyControl=0,
			searchVal='',
			scroolLoadFirstRun=0,
			scroolLoadSira=0,
			scroolLoadYuklenen=0,
			scroolLoadPosition=0,
			scroolLoadWindowHeight=0,
			ValCount=0,
			keyControlSelectedList=null;


		if (option==undefined){option={};}

		if (option.ClickOpen!=undefined){ClickOpen=option.ClickOpen;}

		if (option.IconStatus!=undefined){IconStatus=option.IconStatus;}

		if (option.ResetInputFunc!=undefined){ResetInputFunc=option.ResetInputFunc;}

		if (option.ResetInputFuncDatas!=undefined){ResetInputFuncDatas=option.ResetInputFuncDatas;}

		if (option.NoResulthAddFunc!=undefined){NoResulthAddFunc=option.NoResulthAddFunc;}

		if (option.NoResulthAddFuncDatas!=undefined){NoResulthAddFuncDatas=option.NoResulthAddFuncDatas;}

		if (option.IsResulthFunc!=undefined){IsResulthFunc=option.IsResulthFunc;}

		if (option.IsResulthFuncDatas!=undefined){IsResulthFuncDatas=option.IsResulthFuncDatas;}

		if (option.BoxOp!=undefined){
			BoxOp=option.BoxOp;
			if (BoxOp != 'Search') {BoxOp='all';}
		}

		if (option.startHtml != undefined) {
			StartHtml='<div class="SearchInputDataBox SearchInputDataBox-0 ActiveList">'+option.startHtml+'</div>';
			if (option.startHtmlData != undefined) {
				startHtmlData = option.startHtmlData;
			}
			MenuIndex=1;
		}

		if (option.ajaxUrl != undefined) {
			ajaxUrl=option.ajaxUrl;
		}

		if (option.ajaxSearchUrl != undefined) {
			ajaxSearchUrl=option.ajaxSearchUrl;
		}

		if (option.ajaxDatas != undefined) {
			ajaxDatas=option.ajaxDatas;
			ajaxDatas=JSON.parse(ajaxDatas);
		}

		if (option.elementDatas != undefined) {
			elementDatas=option.elementDatas;
			elementDatas=JSON.parse(elementDatas);
		}

		if (option.elementSearch != undefined) {
			elementSearch=JSON.parse(option.elementSearch);
			if (option.searchKeyName != undefined) {
				searchKeyName = option.searchKeyName;
			}
			if (option.searchResulthKeyName != undefined) {
				searchResulthKeyName = option.searchResulthKeyName;
			}
		}

		if (option.NoResulthAddStatus != undefined) {
			NoResulthAddStatus=option.NoResulthAddStatus;
		}

		if (option.viewTreeStatus != undefined) {
			viewTreeStatus=option.viewTreeStatus;
		}

		if (option.scroolLoadStatus != undefined) {
			scroolLoadStatus=option.scroolLoadStatus;
		}

		var SearchSelectRemove=MyElement.closest('.SearchSelect');
		if(SearchSelectRemove!=undefined&&SearchSelectRemove.length>0){
			SearchSelectRemove.find('.SearchClearIcon').remove();
			SearchSelectRemove.find('.SearchSuggestions').remove();
			MyElement.unwrap().unwrap();
			//SearchSelectRemove.remove();
		}

		if(IconStatus==false){
			MyElement.wrap('<div id="SearchInput-'+MyElement.attr('id')+'" class="SearchSelect NoIcons"></div>');
		}else{
			MyElement.wrap('<div id="SearchInput-'+MyElement.attr('id')+'" class="SearchSelect"></div>');
		}

		function AddSlashes(text) {
			return  text.replace(/"/g, '\\"');
		}

		OuterMyElement=MyElement.parent();
		MyElement.wrap('<div class="SearchOuter SearchOuterBefore"></div>');
		SearchOuter=MyElement.parent();
		SearchOuter.append('<div class="SearchClearIcon"><i class="fas fa-times"></i></div>');
		SearchClearIcon=MyElement.next();
		OuterMyElement.append('<div class="SearchSuggestions">'+StartHtml+'</div>');
		SearchSuggestions=MyElement.closest('.SearchSelect').find('.SearchSuggestions');
		SearchSuggestions.append('<div class="SearchSuggestionsResulth"></div>');
		SearchSuggestionsResulth=MyElement.closest('.SearchSelect').find('.SearchSuggestionsResulth');

		SearchClearIcon.click(function(){
			MyElement.val('');
			MyElement.focus();
			UnSelectedItem();
			ClearControl=1;
			CatOpStatus=0;
			SearchSuggestions.children().show();
			SearchSuggestionsResulth.hide();
			if(BoxOp=='Search'){
				SearchSuggestionsResulth.children().eq(0).children().remove();
				SearchSuggestions.hide();
			}
			if(ResetInputFunc!=''){
				window[ResetInputFunc](window.btoa(unescape(encodeURIComponent(ResetInputFuncDatas))));
			}
		});

		SearchOuter.click(function(){
			setTimeout(function() {
				if (ClearControl==0) {
					CatOpStatus=0;
					if (CatStatus==0) {
						if (ClickOpen==true) {
							if (BoxOp=='Search'){
								if (SearchSuggestionsResulth.children().eq(0).children().length > 0) {
									SearchSuggestions.show();
									MyElement.focus();
									SearchOuter.removeClass('SearchOuterBefore');
									SearchClearIcon.show();
									CatStatus=1;
								}else{
									SearchSuggestions.hide();
								}
							}else{
								SearchSuggestions.show();
								MyElement.focus();
								SearchOuter.removeClass('SearchOuterBefore');
								SearchClearIcon.show();
								CatStatus=1;
							}
						}
					}else{
						SearchSuggestions.hide();
						MyElement.focusout();
						SearchOuter.addClass('SearchOuterBefore');
						SearchClearIcon.hide();
						CatStatus=0;
					}
				}
				ClearControl=0;
			}, 50);
		});

		$(window).click(function() {
			setTimeout(function() {
				if (CatOpStatus==1) {
					SearchSuggestions.hide();
					MyElement.focusout();
					SearchOuter.addClass('SearchOuterBefore');
					SearchClearIcon.hide();
					CatStatus=0;
				}
				CatOpStatus=1;
			}, 100);
		});

		function createSEOLink(link){
			var trMap = {
				'çÇ':'c',
				'ğĞ':'g',
				'şŞ':'s',
				'üÜ':'u',
				'ıİ':'i',
				'öÖ':'o'
			};

			for(var key in trMap) {
				link = link.replace(new RegExp('['+key+']','g'), trMap[key]);
			}
			return  link.replace(/[^-a-zA-Z0-9\s]+/ig, '')
			.replace(/\s/gi, "-")
			.replace(/[-]+/gi, "-")
			.toLowerCase();
		}

		function CreateCatTree(ID){
			SearchInput_TreeName = elementSearch[ID]['name']+SearchInput_TreeName;
			if (elementSearch[ID]['parentId'] != 0) {
				SearchInput_TreeName = ' > '+SearchInput_TreeName;
				CreateCatTree(elementSearch[ID]['parentId']);
			}
		}

		function ReLoadEvent(){
			SearchSuggestions.children().children().children().children().click(function(){
				keySelectedIndex=-1;
				SearchSuggestions.find('.keySelectedIndex').removeClass('keySelectedIndex');
				searchStatus=false;
				if (ajaxUrl!='') {
					AttrType = '';
					ajaxSendDatas = {};
					$.each(this.attributes, function() {
						AttrType = this.name.split('-');
						if(this.specified && AttrType[0]=='data') {
							ajaxSendDatas[AttrType[1]] = this.value;
						}
					});
					if (JSON.stringify(ajaxSendDatas) != '{}') {

						$.each(ajaxDatas,function(k,v){
							ajaxSendDatas[k] = v;
						});

						DataRequestText = JSON.stringify(ajaxSendDatas);
						DataStatus=0;
						for(var i = 0; i < LoadedDatas.length; i++){
							if(DataRequestText==LoadedDatas[i]){
								DataStatus = 1;
								ActivetedIndex=i;
							}
						}

						CatOpStatus=0;
						SearchSuggestions.children().show();
						SearchSuggestionsResulth.hide();
						if (DataStatus==0) {
							LoadedDatas.push(DataRequestText);
							$.ajax({
							    url      :ajaxUrl,
							    type     :'POST',
							    data     :ajaxSendDatas,
							    cache    :false,
							    sync	 :false,
							    success:function(data){
									SearchSuggestions.append('<div class="SearchInputDataBox SearchInputDataBox-'+MenuIndex+'">'+data+'</div>');
									MenuIndex++;
									searchStatus=false;
									setTimeout(function() {
										SearchSuggestions.children().removeClass('ActiveList');
										SearchSuggestions.children().eq(SearchSuggestions.children().length-1).addClass('ActiveList');
										ReLoadEvent();
									}, 100);
							    },
							    error:function(data){
									console.log(data);
							    }
							});
						}else{
							SearchSuggestions.children().removeClass('ActiveList');
							SearchSuggestions.find('.SearchInputDataBox-'+ActivetedIndex).addClass('ActiveList');
						}
					}
				}else{
					AttrType = '';
					elementSendDatas = {};
					$.each(this.attributes, function() {
						AttrType = this.name.split('-');
						if(this.specified && AttrType[0]=='data') {
							elementSendDatas[AttrType[1]] = this.value;
						}
					});

					$.each(elementDatas,function(k,v){
						elementSendDatas[k] = v;
					});
					if (JSON.stringify(elementSendDatas) != '{}') {

						if (elementSendDatas['catid']!=undefined) {

							DataRequestText = JSON.stringify(elementSendDatas);
							DataStatus=0;
							for(var i = 0; i < LoadedDatas.length; i++){
								if(DataRequestText==LoadedDatas[i]){
									DataStatus = 1;
									ActivetedIndex=i;
								}
							}

							CatOpStatus=0;
							SearchSuggestions.children().show();
							SearchSuggestionsResulth.hide();

							if (DataStatus==0) {
								LoadedDatas.push(DataRequestText);
								catListMenus = '';

								catListMenus += '<ul>';
									if (elementSendDatas['catid']!=0) {
										catListMenus += '<li>';
								    		catListMenus += '<a href="javascript:;" data-catid="'+elementSearch[elementSendDatas['catid']]['parentId']+'">';
								        		catListMenus += '<div class="cat-list-back"><i class="fas fa-long-arrow-alt-left"></i> Geri</div>';
								    		catListMenus += '</a>';
										catListMenus += '</li>';
									}
									$.each(elementSearch,function(k,v){
										if (v['parentId']==elementSendDatas['catid']) {
											if (viewTreeStatus==true) {
												SearchInput_TreeName='';
								        		CreateCatTree(k);
								        	}
							        		SelectedOp = elementSendDatas['SelectedOp'];
							        		if (SelectedOp == 'SelectedCat') {
							        			SelectedOpText = 'href="javascript:;" onclick="'+IsResulthFunc+'(this,\''+window.btoa(unescape(encodeURIComponent('{}')))+'\',\''+window.btoa(unescape(encodeURIComponent(SearchInput_TreeName)))+'\',\''+window.btoa(unescape(encodeURIComponent(k)))+'\')"';
							        		}else{
							        			SelectedOpText = 'href="javascript:downloadShcema('+k+');" download';
							        		}
							        		catListMenus += '<li>';
							        			if (v['isSelectable']==true) {
							        				catListMenus += '<a '+SelectedOpText+' >';
							        			}else{
							        				catListMenus += '<a href="javascript:;" data-catid="'+k+'">';
							        			}

							        			if (viewTreeStatus==true) {
							        				catListMenus += '<div class="cat_list_title">'+SearchInput_TreeName+'</div>';
							        			}else{
							        				catListMenus += '<div class="cat_list_title">'+v['name']+'</div>';
							        			}
									        		catListMenus += '<div class="cat_list_arrow_icon"><i class="fas fa-caret-down"></i></div>';
								        		catListMenus += '</a>';
							        		catListMenus += '</li>';
										}
									});
								catListMenus += '</ul>';
								SearchSuggestions.append('<div class="SearchInputDataBox SearchInputDataBox-'+MenuIndex+'">'+catListMenus+'</div>');
								MenuIndex++;
								searchStatus=false;
								setTimeout(function() {
									SearchSuggestions.children().removeClass('ActiveList');
									SearchSuggestions.children().eq(SearchSuggestions.children().length-1).addClass('ActiveList');
									ReLoadEvent();
								}, 100);
							}else{
								SearchSuggestions.children().removeClass('ActiveList');
								SearchSuggestions.find('.SearchInputDataBox-'+ActivetedIndex).addClass('ActiveList');
							}
						}
					}
				}
			});
			if (scroolLoadStatus==true) {
				ReloadActiveScrool();
			}
		}

		MyElement.keyup(function(e){

			if (e.keyCode==38) {
				keySelectedIndex--;
				if (searchStatus==true) {
					keyControlSelectedList = SearchSuggestionsResulth;
				}else{
					keyControlSelectedList = SearchSuggestions.find('.ActiveList');
				}

				scrollingElementKeyControl = keyControlSelectedList;
				scroolPositionKeyControl = scrollingElementKeyControl[0].scrollTop;
				if (keySelectedIndex<0) {
					keySelectedIndex=keyControlSelectedList.children().eq(0).children().length-1;
					scrollingElementKeyControl[0].scrollTop=keyControlSelectedList.children().eq(0).children().length*31;
				}
				keyControlSelectedList.children().eq(0).children().removeClass('keySelectedIndex');
				keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex).addClass('keySelectedIndex');
				if (scroolPositionKeyControl >= keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex)[0].offsetTop) {
					scrollingElementKeyControl[0].scrollTop=keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex)[0].offsetTop;
				}

			}else if(e.keyCode==40){
				keySelectedIndex++;
				if (searchStatus==true) {
					keyControlSelectedList = SearchSuggestionsResulth;
				}else{
					keyControlSelectedList = SearchSuggestions.find('.ActiveList');
				}

				scrollingElementKeyControl = keyControlSelectedList;
				scroolPositionKeyControl = 124 + scrollingElementKeyControl[0].scrollTop;
				if (keySelectedIndex>keyControlSelectedList.children().eq(0).children().length-1) {
					keySelectedIndex=0;
					scrollingElementKeyControl[0].scrollTop=0;
				}
				keyControlSelectedList.children().eq(0).children().removeClass('keySelectedIndex');
				keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex).addClass('keySelectedIndex');

				if (keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex)[0].offsetTop >= scroolPositionKeyControl) {
					scrollingElementKeyControl[0].scrollTop=keyControlSelectedList.children().eq(0).children().eq(keySelectedIndex)[0].offsetTop-93;
				}

			}else if(e.keyCode==13){
				if (keyControlSelectedList.find('.keySelectedIndex')!=undefined) {
					keyControlSelectedList.find('.keySelectedIndex').find('a').trigger('click');
				}
			}else{
				if (option.elementSearch == undefined) {
					if (ajaxSearchUrl!='') {
						searchVal=$(this).val().trim();
						clearTimeout(SearchTımeOut);
						if (searchVal != '') {
							SearchTımeOut = setTimeout(function() {

								AttrType = '';
								ajaxSendDatas = {};

								ajaxSendDatas['searchVal'] = searchVal;							

								$.each(ajaxDatas,function(k,v){
									ajaxSendDatas[k] = v;
								});

								$.ajax({
								    url      :ajaxSearchUrl,
								    type     :'POST',
								    data     :ajaxSendDatas,
								    cache    :false,
								    sync	 :false,
								    success:function(data){
								    	searchStatus=true;
								    	VaryantHtml = data;
								    	if (VaryantHtml=='<ul></ul>') {
											if (NoResulthAddStatus==false) {
												VaryantHtml='<div class="NoResulth">Hiçbir Sonuç Bulunamadı !</div>';
											}else{
												VaryantHtml='';
												VaryantHtml+='<div class="NoResulthAndAdd">';
													VaryantHtml+='<div class="Title">Aradığınız sonuç bulunamadı.Değer girebilirsiniz.</div>';
													VaryantHtml+='<div class="VaryAddOuter row">';
														VaryantHtml+='<div class="col-8"><input type="text" class="form-control" placeholder="Değer Girin..."></div>';
														VaryantHtml+='<div class="col-4"><button type="button" class="btn btn-success" onclick="'+NoResulthAddFunc+'($(this).closest(\'.VaryAddOuter\').find(\'input\'),\''+window.btoa(unescape(encodeURIComponent(NoResulthAddFuncDatas)))+'\')">Ekle</button></div>';
													VaryantHtml+='</div>';
												VaryantHtml+='</div>';
											}
											CatStatus=0;
										}else{
											CatStatus=1;
										}
										SearchSuggestions.children().hide();
										SearchSuggestionsResulth.html(VaryantHtml);
										SearchSuggestionsResulth.show();
										SearchSuggestions.show();
										MyElement.focus();
										SearchOuter.removeClass('SearchOuterBefore');
										SearchClearIcon.show();
										NewValControl();
										ReLoadEvent();
								    },
								    error:function(data){
										console.log(data);
								    }
								});
							}, 500);
						}else{
							SearchSuggestions.children().show();
							SearchSuggestionsResulth.hide();
							if (BoxOp=='Search'){
								SearchSuggestionsResulth.children().eq(0).children().remove();
								SearchSuggestions.hide();
							}
						}
					}
				}else{
					searchVal=$(this).val().trim();
					clearTimeout(SearchTımeOut);
					if (searchVal!=''){
						SearchTımeOut=setTimeout(function(){
							if (searchKeyName!=''){
								AttrType='';
								elementSendDatas={};
								$.each(this.attributes,function(){
									if(this.name!=undefined){
										AttrType = this.name.split('-');
										if(this.specified && AttrType[0]=='data'){
											elementSendDatas[AttrType[1]] = this.value;
										}
									}
								});
								$.each(elementDatas,function(k,v){
									elementSendDatas[k] = v;
								});
								searchStatus=true;
								var selectedWords=[],selectedWord='',indexNumber=-1;
								$.each(elementSearch,function(k,v){
									selectedWord=createSEOLink(elementSearch[k][searchKeyName]);
									indexNumber=selectedWord.indexOf(createSEOLink(searchVal));
									if(indexNumber>-1){
										if(viewTreeStatus==true){
											SearchInput_TreeName='';
							        		CreateCatTree(k);
							        		selectedWords.push({"number":indexNumber,"name":SearchInput_TreeName,"key":k,"isSelectable":v['isSelectable']});
							        	}else{
							        		selectedWords.push({"number":indexNumber,"name":v['name'],"key":k,"isSelectable":v['isSelectable']});
							        	}
									}
								});
								function compare(a,b){
								  if(a.number<b.number){return -1;}
								  if(a.number>b.number){return 1;}
								  return 0;
								}
								selectedWords.sort(compare);
								VaryantHtml='<ul>';
								$.each(selectedWords,function(k,v){
									if(viewTreeStatus==true){
										if (v['isSelectable']==true){
											SelectedOp = elementSendDatas['SelectedOp'];
							        		if (SelectedOp=='SelectedCat'){
							        			VaryantHtml+='<li><a onclick="'+IsResulthFunc+'(this,\''+window.btoa(unescape(encodeURIComponent(IsResulthFuncDatas)))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[v.key][searchKeyName])))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[v.key][searchResulthKeyName])))+'\')" href="javascript:;">';
							        		}else{
							        			VaryantHtml+='<li><a href="javascript:downloadShcema('+v.key+');" download>';
							        		}
										}else{
											VaryantHtml+='<li><a href="javascript:;" data-catid="'+v.key+'">';
										}
									}else{
										VaryantHtml+='<li><a onclick="'+IsResulthFunc+'(this,\''+window.btoa(unescape(encodeURIComponent(IsResulthFuncDatas)))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[v.key][searchKeyName])))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[v.key][searchResulthKeyName])))+'\')" href="javascript:;">';												
									}

									if(viewTreeStatus==true){
										SearchInput_TreeName='';
						        		CreateCatTree(v.key);
						        		VaryantHtml+='<div class="cat_list_title">'+SearchInput_TreeName+'</div>';
						        	}else{
						        		selectedWords.push({"number":elementSearch[v.key][searchKeyName].toLowerCase().indexOf(searchVal.toLowerCase()),"name":v['name']});
						        		VaryantHtml+='<div class="cat_list_title">'+v['name']+'</div>';
						        	}
					        		//elementSearch[k][searchKeyName]
									//VaryantHtml+='<div class="cat_list_arrow_icon"><i class="fas fa-chevron-right"></i></div>';
									VaryantHtml+='</a></li>';
									
								});
								VaryantHtml+='</ul>';
								if(VaryantHtml=='<ul></ul>'){
									if(NoResulthAddStatus==false){
										VaryantHtml='<div class="NoResulth">Hiçbir Sonuç Bulunamadı !</div>';
									}else{
										VaryantHtml='';
										VaryantHtml+='<div class="NoResulthAndAdd">';
											VaryantHtml+='<div class="Title">Aradığınız sonuç bulunamadı.Değer girebilirsiniz.</div>';
											VaryantHtml+='<div class="VaryAddOuter row">';
												VaryantHtml+='<div class="col-8"><input type="text" class="form-control" placeholder="Değer Girin..."></div>';
												VaryantHtml+='<div class="col-4"><button type="button" class="btn btn-success" onclick="'+NoResulthAddFunc+'($(this).closest(\'.VaryAddOuter\').find(\'input\'),\''+window.btoa(unescape(encodeURIComponent(NoResulthAddFuncDatas)))+'\')">Ekle</button></div>';
											VaryantHtml+='</div>';
										VaryantHtml+='</div>';
									}
									CatStatus=0;
								}else{
									CatStatus=1;
								}
								SearchSuggestions.children().hide();
								SearchSuggestionsResulth.html(VaryantHtml);
								SearchSuggestionsResulth.show();
								SearchSuggestions.show();
								MyElement.focus();
								SearchOuter.removeClass('SearchOuterBefore');
								SearchClearIcon.show();
								NewValControl();
								ReLoadEvent();
							}
						},500);
					}else{
						SearchSuggestions.children().show();
						SearchSuggestionsResulth.hide();
						if (BoxOp=='Search'){
							SearchSuggestionsResulth.children().eq(0).children().remove();
							SearchSuggestions.hide();
						}
					}
				}
			}
		});

		function NewValControl(){
			SearchSuggestions.find('.NoResulthAndAdd input').click(function(){
				$(this).focus();
				ClearControl=1;
				CatOpStatus=0;
			});
		}

		function ReloadActiveScrool(){
			SearchSuggestions.find('.ActiveList').scroll(function() {
				scroolLoadFirstRun=0;scroolLoadSira=0;scroolLoadYuklenen=0;
				scroolLoadPosition=$(this).scrollTop();
				scroolLoadWindowHeight = this.scrollHeight - $(this).height() - 31;

				if (scroolLoadPosition >= scroolLoadWindowHeight && scroolLoadFirstRun==0) {
					if (option.elementSearch == undefined) {

					}else{
						scroolLoadFirstRun=1;
						if ($(this).children().eq(0).children().length < Object.keys(elementSearch).length) {
							if(searchKeyName!=''){
								ValCount=0;
								scroolLoadYuklenen = $(this).children().eq(0).children().length-1;
								VaryantHtml='';
								$.each(elementSearch,function(k,v){
									if (scroolLoadSira > scroolLoadYuklenen) {
										VaryantHtml+='<li><a onclick="'+IsResulthFunc+'(this,\''+window.btoa(unescape(encodeURIComponent(IsResulthFuncDatas)))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[k][searchKeyName])))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[k][searchResulthKeyName])))+'\')" href="javascript:;">';
											VaryantHtml+='<div class="cat_list_title">'+elementSearch[k][searchKeyName]+'</div>';
											//VaryantHtml+='<div class="cat_list_arrow_icon"><i class="fas fa-chevron-right"></i></div>';
										VaryantHtml+='</a></li>';
										ValCount++;
										if (ValCount==10) {return false;}
									}
									scroolLoadSira++;
								});
								$(this).children().eq(0).append(VaryantHtml);
								MenuIndex++;
								scroolLoadFirstRun=0;
							}
						}
					}
				}
			});
		}

		function OnLoad(){
			if (option.elementSearch == undefined) {

			}else{
				if(searchKeyName!=''){
					ValCount=0;
					VaryantHtml='<div class="SearchInputDataBox SearchInputDataBox-'+MenuIndex+'"><ul>';
					$.each(elementSearch,function(k,v){
						VaryantHtml+='<li><a onclick="'+IsResulthFunc+'(this,\''+window.btoa(unescape(encodeURIComponent(IsResulthFuncDatas)))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[k][searchKeyName])))+'\',\''+window.btoa(unescape(encodeURIComponent(elementSearch[k][searchResulthKeyName])))+'\')" href="javascript:;">';
							VaryantHtml+='<div class="cat_list_title">'+elementSearch[k][searchKeyName]+'</div>';
							//VaryantHtml+='<div class="cat_list_arrow_icon"><i class="fas fa-chevron-right"></i></div>';
						VaryantHtml+='</a></li>';
						ValCount++;
						if (ValCount==10) {return false;}
					});
					VaryantHtml+='</ul></div>';
					SearchSuggestions.append(VaryantHtml);
					setTimeout(function() {
						SearchSuggestionsResulth.hide();
						SearchSuggestions.children().removeClass('ActiveList');
						SearchSuggestions.children().eq(SearchSuggestions.children().length-1).addClass('ActiveList');
						if (scroolLoadStatus==true) {
							ReloadActiveScrool();
						}
					}, 100);
					MenuIndex++;
				}
			}
		}

		function UnSelectedItem(){
			MyElement.removeAttr('disabled');
		}

		if (startHtmlData!= '') {
			LoadedDatas.push(startHtmlData);
		}

		if (option.startHtml == undefined) {
			OnLoad();
		}

		if (BoxOp=='Search'){SearchSuggestions.children().css('display','none !important');SearchSuggestionsResulth.css('display','');}

		ReLoadEvent();
		return OuterMyElement;
	};
})(window.Zepto || window.jQuery, window, document);