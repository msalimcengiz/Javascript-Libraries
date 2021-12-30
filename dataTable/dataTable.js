;(function($,window,document,undefined){
	$.fn.dataTable=function(option){
		if(this.length<1){alert('Element bulunamadı !'); return false;}
		if(option==undefined){option={};}
		let dataTable_element               =$(this),
			dataTable_listTable             =null,
			dataTable_pagingNumberList      =null,
			dataTable_searchInput           =null,
			dataTable_listCountElement      =null,
			dataTable_listCount             =null,
			dataTable_rowSearchInput        =null,
			dataTable_selectedDataList      =null,
			dataTable_selectedDataListNoSort=null,
			dataTable_infoModal             =null,
			dataTable_operationArea         =false,
			dataTable_checkedDatas          ={},
			dataTable_outerFilterTypeData   ={},
			dataTable_outerFilterLocalData  =null,
			dataTable_tableDataKeys         ={},
			dataTable_flatpickrIsAdd        =false,

			dataTable_allData               =(option.data!=undefined?option.data:null),
			dataTable_listCountOptions      =(option.listCountOptions!=undefined?option.listCountOptions:[10,20,50,100]),
			dataTable_customSearch          =(option.customSearch!=undefined?option.customSearch:false),
			dataTable_colFilterBtn          =(option.colFilterBtn!=undefined?option.colFilterBtn:false),
			dataTable_colFilterStatus       =(option.colFilterStatus!=undefined?option.colFilterStatus:false),
			dataTable_opKeyName             =(option.opKeyName!=undefined?option.opKeyName:''),
			dataTable_footerInfo            =(option.footerInfo!=undefined?option.footerInfo:{}),
			dataTable_tableKeys             =(option.keys!=undefined?option.keys:null),
			dataTable_rowOperation          =(option.rowOperation!=undefined?option.rowOperation:{}),
			dataTable_showInfoModal         =(option.showInfoModal!=undefined?option.showInfoModal:false),
			dataTable_showInfoModalKeys     =(option.showInfoModalKeys!=undefined?option.showInfoModalKeys:{}),
			dataTable_filterType            =(option.filterType!=undefined?option.filterType:{}),
			dataTable_outerFilterType       =(option.outerFilterType!=undefined?option.outerFilterType:{}),
			dataTable_colLink               =(option.colLink!=undefined?option.colLink:{}),
			dataTable_defaultSort           =(option.defaultSort!=undefined?option.defaultSort:{'key':'','type':''});

		//localStorage.setItem('dataTable_outerFilterTypeData',{});
		//localStorage.getItem('dataTable_outerFilterTypeData');
		//localStorage.removeItem('dataTable_outerFilterTypeData');
		//localStorage.clear();

		$.each(dataTable_allData,function(k,v){
			$.each(v,function(kk,vv){
				dataTable_tableDataKeys[kk]=kk;
			});
			return false;
		});

		if(localStorage.getItem('dataTable_outerFilterTypeData_'+dataTable_element.attr('id'))!=undefined){
			dataTable_outerFilterLocalData=JSON.parse(localStorage.getItem('dataTable_outerFilterTypeData_'+dataTable_element.attr('id')));
		}

		if(dataTable_outerFilterLocalData==null){
			$.each(dataTable_outerFilterType,function(k,v){
				$.each(v,function(kk,vv){
					dataTable_outerFilterTypeData[k+'_'+vv['id']]=k+'_'+vv['id'];
				});			
			});
		}else{
			$.each(dataTable_outerFilterLocalData,function(k,v){
				dataTable_outerFilterTypeData[v]=v;
			});
		}

		option['dataTable_setAllData']=function(data){
			dataTable_allData=JSON.parse(JSON.stringify(data));
			dataTable_selectedDataList=JSON.parse(JSON.stringify(data));
			dataTable_checkedDatas={};
			pagingInit(dataTable_selectedDataList,dataTable_listCount);
		};

		option['dataTable_getData']=function(){
			return dataTable_selectedDataList;
		};

		option['dataTable_getSelected']=function(){
			return dataTable_checkedDatas;
		};

		option['dataTable_removeItem']=function(key,value){
			if(Object.keys(dataTable_allData).length>0||dataTable_allData.length>0){
				if(key!=undefined&&value!=undefined){
					for(var i=0;i<dataTable_allData.length;i++){
						if(dataTable_allData[i][key]==value){
							dataTable_allData.splice(i,1);
							break;
						}	
					}
					for(var i=0;i<dataTable_selectedDataList.length;i++){
						if(dataTable_selectedDataList[i][key]==value){
							dataTable_selectedDataList.splice(i,1);
							break;
						}	
					}
				}else{
					alert('Silme işlemi yapılamadı.Eksik verileriniz var.');
				}
				pagingInit(dataTable_selectedDataList,dataTable_listCount);
			}else{
				alert('Tablonuzda işlem yapmak için veri bulunmuyor !');
			}
		};

		option['dataTable_addItem']=function(data,key){
			if(key!=undefined){
				var addStatus=true;
				$.each(dataTable_tableKeys,function(k,v){
					if(data[k]==undefined){
						addStatus=false;
					}
				});
				if(addStatus){
					dataTable_allData[key]=data;
					dataTable_selectedDataList[key]=data;
				}else{
					alert('Ekleme başarısız oldu. Eksik başlıklarınız var.');
				}
			}else{
				var addStatus=true;
				$.each(dataTable_tableKeys,function(k,v){
					if(data[k]==undefined){
						addStatus=false;
					}
				});
				if(addStatus){
					dataTable_allData.push(data);
					dataTable_selectedDataList.push(data);
				}else{
					alert('Ekleme başarısız oldu. Eksik başlıklarınız var.');
				}
			}
			pagingInit(dataTable_selectedDataList,dataTable_listCount);
		};

		option['dataTable_updateItem']=function(data,key,value){
			if(key!=undefined&&value!=undefined){
				var addStatus=true;
				$.each(dataTable_tableKeys,function(k,v){
					if(data[k]==undefined){
						addStatus=false;
					}
				});
				if(addStatus){
					for(var i=0;i<dataTable_allData.length;i++){
						if(dataTable_allData[i][key]==value){
							dataTable_allData[i]=JSON.parse(JSON.stringify(data));
							break;
						}	
					}
					for(var i=0;i<dataTable_selectedDataList.length;i++){
						if(dataTable_selectedDataList[i][key]==value){
							dataTable_selectedDataList[i]=JSON.parse(JSON.stringify(data));
							break;
						}	
					}
				}else{
					alert('Güncelleme başarısız oldu. Eksik başlıklarınız var.');
				}
			}else{
				alert('Tabloda veri güncellemek için güncellecek satırı belirtmelisiniz.');
			}
			pagingInit(dataTable_selectedDataList,dataTable_listCount);
		};

		option['dataTable_updateItemCol']=function(data,key,value,col){
			if(key!=undefined&&value!=undefined){
				var addStatus=false;
				$.each(dataTable_tableKeys,function(k,v){
					if(col==k){
						addStatus=true;
					}
				});
				if(addStatus){
					for(var i=0;i<dataTable_allData.length;i++){
						if(dataTable_allData[i][key]==value){
							dataTable_allData[i][col]=data;
							break;
						}	
					}
					for(var i=0;i<dataTable_selectedDataList.length;i++){
						if(dataTable_selectedDataList[i][key]==value){
							dataTable_selectedDataList[i][col]=data;
							break;
						}	
					}
				}else{
					alert('Güncelleme başarısız oldu. Gönderdiğiniz başlık bulunamadı.');
				}
			}else{
				alert('Tabloda veri güncellemek için güncellecek satırı belirtmelisiniz.');
			}
			pagingInit(dataTable_selectedDataList,dataTable_listCount);
		};

		option['dataTable_writeDocument']=function(docType,filename,myLibUrl){
			if(docType!=undefined){
				if(docType=='csv'){
					var fileData='';
					$.each(dataTable_tableKeys,function(k,v){
						fileData+=v+';';
					});
					fileData+="\n";

				    $.each(dataTable_allData,function(k,v){
				    	$.each(dataTable_tableKeys,function(kk,vv){
							fileData+=v[kk]+';';
						});
						fileData+="\n";
				    });

				    var csvString = 'ı,ü,ü,ğ,ş,#Hashtag,ä,ö';
				    var universalBOM = "\uFEFF";
				    var a = window.document.createElement('a');
				    a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+fileData));
				    a.setAttribute('download', filename+'.'+docType);
				    window.document.body.appendChild(a);
				    a.click();
				}else if(docType=='xlsx'){
					if(myLibUrl!=undefined){
						$.ajax({
						    url      :myLibUrl+'createFile_XLSX.php',
						    type     :'POST',
						    data     :{rowKeys:dataTable_tableKeys,datas:dataTable_allData,myLibUrl:myLibUrl},
						    dataType :'json',
						    cache    :false,
						    sync	 :false,
						    async    :false,
						    global   :false,
						    success:function(data){
								if(data.success){
									var a = document.createElement('a');
				                    a.href = data.data.link;
				                    a.download = filename+'.xlsx';
				                    document.body.append(a);
				                    a.click();
				                    a.remove();
								}else{
									if(data.error!=undefined){
										var errors='';
										$.each(data.error,function(k,v){
											errors+=v.key+' = '+v.message+'<br>';
										});
										Swal.fire({
											icon: 'error',
											title: 'Hata',
											html: errors,
											confirmButtonText:'Tamam'
										});
									}else{
										Swal.fire({
											icon: 'error',
											title: 'Hata',
											html: data.message,
											confirmButtonText:'Tamam'
										});
									}
								}
						    },
						    error:function(data){
								console.log(data);
								alert('İşlem yapılamadı. Sistem Hatası !');
						    }
						});
					}else{
						alert('Lütfen kütüphanenizin bulunduğu dosya konumunu gönderin.');
					}
				}else{
					alert('Bu dosya tipi mevcut değil !');
				}
			}else{
				alert('Lütfen bir dosya tipi gönderiniz !');
			}
		};

		function initOuterFilter(){
			var html='';
			$.each(dataTable_outerFilterType,function(k,v){
				$.each(v,function(kk,vv){
					if(dataTable_outerFilterTypeData[k+'_'+vv['id']]!=undefined){
						html+='<div class="dataTable_dropdownSelectOuter">';
							html+='<button type="button" id="'+kk+'">';
								html+=vv['title'];
							html+='</button>';
							html+='<div class="dataTable_dropdownMenuSelect">';
								$.each(vv['values'],function(kkk,vvv){
									html+='<div class="dataTable_dropdownMenuItemSelect">';
										html+='<div class="dataTable_dropdownMenuItemCheckboxOuterSelect">';
											html+='<input type="checkbox" class="dataTable_outerFilterInput" id="'+kk+'_'+vvv['id']+'" data-titleId="'+vv['id']+'" data-valueId="'+vvv['id']+'" data-rowKey="'+k+'">';
											html+='<label for="'+kk+'_'+vvv['id']+'">'+vvv['name']+'</label>';
										html+='</div>';
									html+='</div>';
								});
							html+='</div>';
						html+='</div>';
					}
				});
			});
			dataTable_element.find('.dataTable_outerFilterArea').html(html);
		}

		function initTableElement(){
			if((dataTable_rowOperation.html!=undefined&&dataTable_rowOperation.html!='')||(dataTable_showInfoModal&&dataTable_opKeyName!='')){
				dataTable_operationArea=true;
			}
			if(dataTable_tableKeys==null){
				dataTable_tableKeys={};
				$.each(dataTable_allData,function(k,v){
					$.each(v,function(kk,vv){
						dataTable_tableKeys[kk]=kk;
					});
					return false;
				});
			}
			var html='';
			html+='<div class="dataTable_outer">';
				html+='<div class="dataTable_opOuter">';
					html+='<div class="dataTable_opSearch">';
						if(dataTable_customSearch){
							html+='<div class="dataTable_formGroup">';
								html+='<input type="text" class="dataTable_formControl dataTable_searchInput" placeholder="Ara...">';
							html+='</div>';
						}
					html+='</div>';
					html+='<div class="dataTable_opListCount">';
						html+='<div class="dataTable_formGroup">';
							html+='<label for="dataTable_listCount">Listeleme Sayısı</label>';
							html+='<select class="dataTable_formControl dataTable_listCount">';
								$.each(dataTable_listCountOptions,function(k,v){
									html+='<option value="'+v+'">'+v+'</option>';
								});
							html+='</select>';
						html+='</div>';
					html+='</div>';
					html+='<div class="dataTable_showRowFilter">';
						if(dataTable_colFilterBtn){
							//html+='<i class="fas fa-filter dataTable_showedRowsFilter '+(dataTable_colFilterStatus?'active':'')+'"></i>';
							html+='<svg class="dataTable_showedRowsFilter '+(dataTable_colFilterStatus?'active':'')+'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 86 77.409 H 54.645 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 H 86 c 2.209 0 4 1.791 4 4 S 88.209 77.409 86 77.409 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 53.897 20.591 H 4 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 49.897 c 2.209 0 4 1.791 4 4 S 56.106 20.591 53.897 20.591 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 86 49 H 31.428 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 H 86 c 2.209 0 4 1.791 4 4 S 88.209 49 86 49 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 36.102 77.409 H 4 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 32.102 c 2.209 0 4 1.791 4 4 S 38.311 77.409 36.102 77.409 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 13.633 49 H 4 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 9.633 c 2.209 0 4 1.791 4 4 S 15.842 49 13.633 49 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 86 20.591 H 71.866 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 H 86 c 2.209 0 4 1.791 4 4 S 88.209 20.591 86 20.591 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 50.47 82.307 H 39.53 c -1.893 0 -3.428 -1.535 -3.428 -3.428 v -10.94 c 0 -1.893 1.535 -3.428 3.428 -3.428 h 10.94 c 1.893 0 3.428 1.535 3.428 3.428 v 10.94 C 53.898 80.772 52.363 82.307 50.47 82.307 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 28 53.898 H 17.06 c -1.893 0 -3.428 -1.535 -3.428 -3.428 V 39.53 c 0 -1.893 1.535 -3.428 3.428 -3.428 H 28 c 1.893 0 3.428 1.535 3.428 3.428 v 10.94 C 31.428 52.363 29.893 53.898 28 53.898 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 68.266 25.488 h -10.94 c -1.893 0 -3.428 -1.535 -3.428 -3.428 v -10.94 c 0 -1.893 1.535 -3.428 3.428 -3.428 h 10.94 c 1.893 0 3.428 1.535 3.428 3.428 v 10.94 C 71.693 23.954 70.159 25.488 68.266 25.488 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
						}
						if(Object.keys(dataTable_outerFilterType).length>0){
							html+='<div class="dataTable_dropdown">';
								html+='<button class="dataTable_dropdownBtn" type="button" id="dataTable_outerFilterTypeData">';
									html+='<svg id="dataTable_showedRowsOuterFilter" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 78.969 0 H 11.031 C 4.939 0 0 4.939 0 11.031 v 67.937 C 0 85.061 4.939 90 11.031 90 h 67.937 C 85.061 90 90 85.061 90 78.969 V 11.031 C 90 4.939 85.061 0 78.969 0 z M 69.488 68.568 H 20.511 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 48.977 c 2.209 0 4 1.791 4 4 S 71.697 68.568 69.488 68.568 z M 69.488 49 H 20.511 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 48.977 c 2.209 0 4 1.791 4 4 S 71.697 49 69.488 49 z M 69.488 29.432 H 20.511 c -2.209 0 -4 -1.791 -4 -4 s 1.791 -4 4 -4 h 48.977 c 2.209 0 4 1.791 4 4 S 71.697 29.432 69.488 29.432 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
								html+='</button>';
								html+='<div class="dataTable_dropdownMenu">';
									$.each(dataTable_outerFilterType,function(k,v){
										$.each(v,function(kk,vv){
											html+='<div class="dataTable_dropdownMenuItem">';
												html+='<div class="dataTable_dropdownMenuItemCheckboxOuter">';
													html+='<input type="checkbox" class="dataTable_outerFilterTypeDataTitle" id="dataTable_outerFilterTypeDataTitle_'+vv['id']+'" data-titleId="'+vv['id']+'" data-rowKey="'+k+'" '+(dataTable_outerFilterTypeData[k+'_'+vv['id']]!=undefined?'checked="checked"':'')+'>';
													html+='<label for="dataTable_outerFilterTypeDataTitle_'+vv['id']+'">'+vv['title']+'</label>';
												html+='</div>';
											html+='</div>';
										});
									});
								html+='</div>';
							html+='</div>';
						}
					html+='</div>';
				html+='</div>';
				html+='<div class="dataTable_outerFilterArea"></div>';
				html+='<div class="dataTable_tableOuter '+(dataTable_colFilterStatus?'autoTable':'')+' '+(dataTable_opKeyName!=''?'allSelectActive':'')+'">';
					html+='<table>';
						html+='<thead>';
							html+='<tr>';
								if(dataTable_opKeyName!=''){
									html+='<th>';
										html+='<div class="custom-control custom-checkbox">';
											html+='<input type="checkbox" class="custom-control-input dataTable_checkedBoxAll" id="dataTable_checkedBoxAll_'+dataTable_element.attr('id')+'" name="dataTable_checkedBoxAll" data-key="" required="">';
											html+='<label class="custom-control-label" for="dataTable_checkedBoxAll_'+dataTable_element.attr('id')+'"></label>';
										html+='</div>';
									html+='</th>';
								}
								$.each(dataTable_tableKeys,function(k,v){
									html+='<th>';
										html+='<div class="dataTable_rowTitle">'+v+'</div>';
										if(dataTable_colFilterStatus){
											html+='<div class="dataTable_filterOuter">';
												if(dataTable_filterType[k]!=undefined){
													if(dataTable_filterType[k]=='date'){
														if(!dataTable_flatpickrIsAdd){
															$('body').append('<link rel="stylesheet" type="text/css" href="dataTable/flatpickr/flatpickr.min.css">');
															$('body').append('<script type="text/javascript" src="dataTable/flatpickr/flatpickrLang.min.js"></script>');
															dataTable_flatpickrIsAdd=true;
														}
														html+='<div class="dataTable_rowSearch"><input type="text" class="form-control form-control-sm flatpickr-range flatpickr-input dataTable_rowSearchInput" data-searchKey="'+k+'" data-searchType="date" placeholder="YYYY-MM-DD to YYYY-MM-DD"></div>';
													}
												}else{
													html+='<div class="dataTable_rowSearch"><input type="text" placeholder="Ara..." data-searchKey="'+k+'" data-searchType="text" class="dataTable_rowSearchInput"></div>';
												}
												html+='<div class="dataTable_filterBtn"><i class="fas fa-ellipsis-v openFilterArea"></i></div>';
												html+='<div class="dataTable_rowfilterArea">';
													html+='<ul>';
														html+='<li><div class="dataTable_sort"><span>A-Z Sırala</span><i class="fas fa-sort-amount-up-alt sortTable" data-rowKey="'+k+'" data-rowSortStatus="0"></i></div></li>';
														html+='<li><div class="dataTable_desc"><span>Z-A Sırala</span><i class="fas fa-sort-amount-down-alt reverseSortTable" data-rowKey="'+k+'" data-rowSortStatus="0"></i></div></li>';
													html+='</ul>';
												html+='</div>';
											html+='</div>';
										}
									html+='</th>';
								});
								if(dataTable_operationArea){
									html+='<th>İşlem</th>';
								}
							html+='</tr>';
						html+='</thead>';
						html+='<tbody></tbody>';
						html+='<tfoot></tfoot>'
					html+='</table>';
				html+='</div>';
				html+='<div class="dataTable_paginationOuter">';
					html+='<ul class="dataTable_pagination dataTable_pagingNumberList"><li class="dataTable_paginationItem"><a class="dataTable_paginationItemChild" href="#"><span>...</span></a></li></ul>';
				html+='</div>';
			html+='</div>';
			dataTable_element.html(html);
			initOuterFilter();

			if(window.flatpickr!=undefined){
				$(".flatpickr-range").flatpickr({
				    mode:'range',
					onChange: function(selectedDates,dateStr,instance){
						var sendKeys={};
						for(var i=0;i<dataTable_rowSearchInput.length;i++){
							if(dataTable_rowSearchInput[i].value!=''){
								sendKeys[dataTable_rowSearchInput[i].getAttribute("data-searchKey")]={'value':dataTable_rowSearchInput[i].value,'type':dataTable_rowSearchInput[i].getAttribute("data-searchtype")};
							}
						}
						searchFunction(this.value,sendKeys);
				    },
				    lang:'tr'
				});
				$(".flatpickr-range").removeAttr('readonly');
			}

			dataTable_element.find('.dataTable_outerFilterInput').on('change',function(event){
				var filterList={};
				$.each(dataTable_element.find('.dataTable_outerFilterInput'),function(k,v){
					filterList[$(v).attr('data-rowKey')+'_'+$(v).attr('data-titleId')+'_'+$(v).attr('data-valueId')]={
						'rowKey':$(v).attr('data-rowKey'),
						'titleId':$(v).attr('data-titleId'),
						'valueId':$(v).attr('data-valueId'),
						'status':v.checked
					};
				});
				filterSelectList(filterList);
			});

			dataTable_element.find('.dataTable_outerFilterTypeDataTitle').on('change',function(event){
				var data={};
				$.each(dataTable_element.find('.dataTable_outerFilterTypeDataTitle'),function(k,v){
					if(v.checked){
						data[$(v).attr('data-rowKey')+'_'+$(v).attr('data-titleId')]=$(v).attr('data-rowKey')+'_'+$(v).attr('data-titleId');
					}else{
						delete data[$(v).attr('data-rowKey')+'_'+$(v).attr('data-titleId')];
					}
				});
				localStorage.removeItem('dataTable_outerFilterTypeData_'+dataTable_element.attr('id'));
				localStorage.setItem('dataTable_outerFilterTypeData_'+dataTable_element.attr('id'),JSON.stringify(data));
				dataTable_outerFilterTypeData=data;
				initOuterFilter();
			});

			dataTable_selectedDataList=JSON.parse(JSON.stringify(dataTable_allData));
			dataTable_selectedDataListNoSort=JSON.parse(JSON.stringify(dataTable_allData));
			dataTable_listTable=dataTable_element.find('tbody');
			dataTable_pagingNumberList=dataTable_element.find('.dataTable_pagingNumberList');
			dataTable_searchInput=dataTable_element.find('.dataTable_searchInput');
			dataTable_listCountElement=dataTable_element.find('.dataTable_listCount');
			dataTable_rowSearchInput=dataTable_element.find('.dataTable_rowSearchInput');
			dataTable_listCount=dataTable_listCountOptions[0];
			dataTable_searchInput.on('keyup',function(event){
				searchFunction(this.value);
			});
			dataTable_listCountElement.on('change',function(event){
				dataTable_listCount=this.value;
				pagingInit(dataTable_selectedDataList,dataTable_listCount);	
			});
			dataTable_rowSearchInput.on('keyup',function(event){
				var sendKeys={};
				for(var i=0;i<dataTable_rowSearchInput.length;i++){
					if(dataTable_rowSearchInput[i].value!=''){
						sendKeys[dataTable_rowSearchInput[i].getAttribute("data-searchKey")]={'value':dataTable_rowSearchInput[i].value,'type':dataTable_rowSearchInput[i].getAttribute("data-searchtype")};
					}
				}
				searchFunction(this.value,sendKeys);
			});
			dataTable_element.find('.dataTable_showedRowsFilter').on('click',function(event){
				if(dataTable_colFilterStatus){
					dataTable_colFilterStatus=false;
				}else{
					dataTable_colFilterStatus=true;
				}
				initTableElement();
			});
			dataTable_element.find('.dataTable_checkedBoxAll').on('click',function(event){
				if(this.checked){
					dataTable_element.find('.dataTable_checkedBoxs').prop('checked',true);
					$.each(dataTable_allData,function(k,v){
						dataTable_checkedDatas[v[dataTable_opKeyName]]=v[dataTable_opKeyName];
					});
				}else{
					dataTable_element.find('.dataTable_checkedBoxs').prop('checked',false);
					dataTable_checkedDatas={};
				}
			});

			var openFilterAreaCnt=false;
			$('body').on('click',function(event){
				setTimeout(function(){
					if(!openFilterAreaCnt){dataTable_element.find('.dataTable_rowfilterArea').removeClass('active');}
					openFilterAreaCnt=false;
				},100);
			});
			dataTable_element.find('.openFilterArea').on('click',function(event){
				openFilterAreaCnt=true;
				if($(this).parent().parent().find('.dataTable_rowfilterArea').hasClass('active')){
					$(this).parent().parent().find('.dataTable_rowfilterArea').removeClass('active');
				}else{
					$(this).parent().parent().find('.dataTable_rowfilterArea').addClass('active');
				}
			});
			dataTable_element.find('.sortTable').on('click',function(event){
				if(this.getAttribute('data-rowSortStatus')=='0'){
					dataTable_element.find('.sortTable').removeClass('active').attr('data-rowSortStatus','0');
					dataTable_element.find('.reverseSortTable').removeClass('active').attr('data-rowSortStatus','0');
					this.classList.add("active");
					this.setAttribute('data-rowSortStatus','1');
					dataTable_selectedDataList.sort(compareValues(this.getAttribute('data-rowKey'),'asc'));
				}else{
					dataTable_selectedDataList=JSON.parse(JSON.stringify(dataTable_selectedDataListNoSort));
					this.classList.remove("active");
					this.setAttribute('data-rowSortStatus','0');
				}
				pagingInit(dataTable_selectedDataList,dataTable_listCount);
			});
			dataTable_element.find('.reverseSortTable').on('click',function(event){
				if(this.getAttribute('data-rowSortStatus')=='0'){
					dataTable_element.find('.sortTable').removeClass('active').attr('data-rowSortStatus','0');
					dataTable_element.find('.reverseSortTable').removeClass('active').attr('data-rowSortStatus','0');
					this.classList.add("active");
					this.setAttribute('data-rowSortStatus','1');
					dataTable_selectedDataList.sort(compareValues(this.getAttribute('data-rowKey'),'desc'));
				}else{
					dataTable_selectedDataList=JSON.parse(JSON.stringify(dataTable_selectedDataListNoSort));
					this.classList.remove("active");
					this.setAttribute('data-rowSortStatus','0');
				}
				pagingInit(dataTable_selectedDataList,dataTable_listCount);
			});
			pagingInit(dataTable_selectedDataList,dataTable_listCount);

			if(dataTable_showInfoModal&&dataTable_opKeyName!=''){
				var modalHtml='';
				modalHtml+='<div class="dataTable_modal" id="dataTable_infoModal_'+dataTable_element.attr('id')+'">';
				  	modalHtml+='<div class="dataTable_modalDialog">';
				    	modalHtml+='<div class="dataTable_modalContent">';
				    	  	modalHtml+='<div class="dataTable_modalHeader">';
				    	  	  	modalHtml+='<h4 class="dataTable_modalTitle">Detay</h4>';
				    	  	  	modalHtml+='<button type="button" class="dataTable_close">&times;</button>';
				    	  	modalHtml+='</div>';
				    	  	modalHtml+='<div class="dataTable_modalBody">';
				    	  		$.each(dataTable_showInfoModalKeys,function(k,v){
				    	  			if(v['type']=='input'){
				    	  				modalHtml+='<div class="dataTable_formGroup">';
											modalHtml+='<label for="dataTable_showInfoModalKeys_'+k+'">'+v['title']+':</label>';
											modalHtml+='<input type="text" class="dataTable_formControl" id="dataTable_showInfoModalKeys_'+k+'" disabled="disabled">';
										modalHtml+='</div>';
				    	  			}else if(v['type']=='textarea'){
				    	  				modalHtml+='<div class="dataTable_formGroup">';
											modalHtml+='<label for="dataTable_showInfoModalKeys_'+k+'">'+v['title']+':</label>';
											modalHtml+='<textarea class="dataTable_formControl" rows="10" id="dataTable_showInfoModalKeys_'+k+'" disabled="disabled"></textarea>';
										modalHtml+='</div>';
				    	  			}
				    	  		});
				    	  	modalHtml+='</div>';
				    	modalHtml+='</div>';
				  	modalHtml+='</div>';
				  	modalHtml+='<div class="dataTable_modalBack"></div>';
				modalHtml+='</div>';
				$('body').append(modalHtml);
				dataTable_infoModal=$('#dataTable_infoModal_'+dataTable_element.attr('id'));
				dataTable_infoModal.find('.dataTable_close').on('click',function(){
					dataTable_infoModal.hide();
				});
				dataTable_infoModal.find('.dataTable_modalBack').on('click',function(){
					dataTable_infoModal.hide();
				});
				addition();
			}
		}

		function compareValues(key,order='asc'){
			return function innerSort(a,b){
				if(!a.hasOwnProperty(key)||!b.hasOwnProperty(key)){return 0;}

				const varA=(typeof a[key]==='string')?a[key].toUpperCase():a[key];
				const varB=(typeof b[key]==='string')?b[key].toUpperCase():b[key];

				let comparison=0;
				if(varA>varB){
					comparison=1;
				}else if(varA<varB){
					comparison=-1;
				}

				return ((order==='desc')?(comparison*-1):comparison);
			};
		}

		function seflink(text){
			text=text.toString();
			var changeCharacter={
				"Ğ":"g",
				"Ü":"u",
				"Ş":"s",
				"İ":"i",
				"Ö":"o",
				"Ç":"c",
				"ğ":"g",
				"ü":"u",
				"ş":"s",
				"ı":"i",
				"ö":"o",
				"ç":"c",
			};
			text=text.replace(/[^0-9a-zA-ZÄzÜŞİÖÇğüşıöç ]/g,"");
			$.each(changeCharacter,function(k,v){
				text=text.replace(new RegExp(k,"g"),v);
			});
			text=text.replace(/ +/g,"-");
			text=text.replace(/ /g,"-");
			text=text.replace(/\s/g,"-");
			text=text.replace(/^-/g,"-");
			text=text.replace(/-$/g,"-");
			text=text.toLowerCase();
			return text;
		}

		function addition(){
			if(Object.keys(dataTable_footerInfo).length>0){
				var html='<tr>',data='';
				if(dataTable_opKeyName!=''){html+='<td></td>';}
				$.each(dataTable_tableKeys,function(k,v){
					data='';
					if(dataTable_footerInfo[k]!=undefined){
						if(dataTable_footerInfo[k]=='addition'){
							data=0;
							$.each(dataTable_allData,function(kk,vv){
								data+=parseFloat(vv[k]);
							});
							data='TOPLAM : '+data;
						}
					}
					html+='<td>'+data+'</td>';
				});
				if(dataTable_operationArea){html+='<td></td>';}
				html+='</tr>';
				dataTable_element.find('tfoot').html(html);
			}
		}

		function searchFunction(word,rowKeys){
			var filterStatus=1,
	            findedElements=[];
	        if(word!=''){
	        	$.each(dataTable_allData,function(k,v){
	            	filterStatus=0;
	            	if(rowKeys!=undefined){
	            		$.each(rowKeys,function(kk,vv){
	            			if(vv['type']=='text'){
	            				if(seflink(v[kk]).indexOf(seflink(vv['value']))>-1){filterStatus=1;}
	            			}else if(vv['type']=='date'){
	            				if(filterDate(vv['value'],v[kk])){filterStatus=1;}
	            			}
						});
	            	}else{
	            		$.each(dataTable_tableKeys,function(kk,vv){
			            	if(seflink(v[kk]).indexOf(seflink(word))>-1){filterStatus=1;}
						});
	            	}
		            if(filterStatus==1){findedElements.push(JSON.parse(JSON.stringify(v)));}
	            });
	            dataTable_selectedDataList=JSON.parse(JSON.stringify(findedElements));
	            dataTable_selectedDataListNoSort=JSON.parse(JSON.stringify(findedElements));
		        pagingInit(dataTable_selectedDataList,dataTable_listCount);
	        }else{
	        	dataTable_selectedDataList=JSON.parse(JSON.stringify(dataTable_allData));
	            dataTable_selectedDataListNoSort=JSON.parse(JSON.stringify(dataTable_allData));
	        	pagingInit(dataTable_allData,dataTable_listCount);
	        }
		}

		function filterDate(dates,rowDate){
			dates=dates.split('to');
			if(dates!=undefined&&dates[0]!=undefined&&dates[1]!=undefined){
				dates[0]=new Date(dates[0]);
				dates[1]=new Date(dates[1]);
				rowDate=new Date(rowDate);
				dates[0]=dates[0].getTime()/1000;
				dates[1]=dates[1].getTime()/1000;
				rowDate=rowDate.getTime()/1000;
				if(dates[0]<rowDate&&dates[1]>rowDate){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		function filterSelectList(filterList){
			var filterStatus={},
	            findedElements=[],
	            allFalse=true,
	            filterCnt=true;
        	$.each(dataTable_allData,function(k,v){
            	filterStatus={};
            	filterCnt=true;
            	$.each(filterList,function(kk,vv){
            		if(vv['status']){
            			allFalse=false;
            			if(v[vv['rowKey']]!=undefined){
            				if(filterStatus[vv['rowKey']+'_'+vv['titleId']]!=undefined){
            					if(filterStatus[vv['rowKey']+'_'+vv['titleId']]!=true){filterStatus[vv['rowKey']+'_'+vv['titleId']]=false;}
            				}else{
            					filterStatus[vv['rowKey']+'_'+vv['titleId']]=false;
            				}
	            			$.each(v[vv['rowKey']],function(kkk,vvv){
	            				if(vvv['id']==vv['titleId']){
	            					$.each(vvv['values'],function(kkkk,vvvv){
	            						if(vvvv['id']==vv['valueId']){
	            							filterStatus[vv['rowKey']+'_'+vv['titleId']]=true;
	            						}
	            					});
	            				}
	            			});
	            		}
            		}
            	});
	            $.each(filterStatus,function(k,v){
            		if(!v){filterCnt=false;}
            	});
	            if(filterCnt){findedElements.push(JSON.parse(JSON.stringify(v)));}
            });
            if(!allFalse){
				dataTable_selectedDataList=JSON.parse(JSON.stringify(findedElements));
	            dataTable_selectedDataListNoSort=JSON.parse(JSON.stringify(findedElements));
		        pagingInit(dataTable_selectedDataList,dataTable_listCount);
	        }else{
	        	dataTable_selectedDataList=JSON.parse(JSON.stringify(dataTable_allData));
	            dataTable_selectedDataListNoSort=JSON.parse(JSON.stringify(dataTable_allData));
	        	pagingInit(dataTable_allData,dataTable_listCount);
	        }
		}

		//operation : 'prev' 'next' 'between' 'unbetween'
		/*function filterDate(dates,rowKeys,operation){
			if(dates!=undefined&&dates[0]!=undefined){
				if(Object.prototype.toString.call(dates[0])!=="[object Date]"){
					alert('Filtreleme yapabilmek için geçerli bir tarih formatı girmelisiniz.');
					return false;
				}
				dates[0]=dates[0].getTime()/1000;

				if(dates[1]!=undefined){
					if(Object.prototype.toString.call(dates[1])!=="[object Date]"){
						alert('Filtreleme yapabilmek girdiğiniz tarihlerin formatı geçerli olmalıdır !');		
						return false;
					}
					dates[1]=dates[1].getTime()/1000;
				}

				if(operation==undefined){
					if(dates[0]!=undefined&&dates[1]!=undefined){
						operation='between';
					}else{
						operation='next';
					}
				}else{
					if(operation=='between'||operation=='unbetween'){
						if(dates[0]==undefined||dates[1]==undefined){
							alert('Lütfen tarihleri doğru gönderdiğinizden emin olun.');
							return false;
						}
					}
				}

				if(operation=='between'||operation=='unbetween'){

				}else{
					$.each(dataTable_allData,function(k,v){
		            	
		            });
				}
			}else{
				alert('Filtreleme yapabilmek için geçerli bir tarih formatı girmelisiniz.');
			}
		}*/

		function listData(datas){
			var html='',sira=0,addLink='';
			$.each(datas,function(k,v){
				html+='<tr>';
					if(dataTable_opKeyName!=''){
						html+='<td>';
							html+='<div class="custom-control custom-checkbox">';
								html+='<input type="checkbox" class="custom-control-input dataTable_checkedBoxs" id="dataTable_checkedBox_'+sira+'_'+dataTable_element.attr('id')+'" name="dataTable_checkedBoxs" data-key="'+v[dataTable_opKeyName]+'" required="">';
								html+='<label class="custom-control-label" for="dataTable_checkedBox_'+sira+'_'+dataTable_element.attr('id')+'"></label>';
							html+='</div>';
						html+='</td>';
					}
					$.each(dataTable_tableKeys,function(kk,vv){
						addLink='';
						if(dataTable_colLink.keys!=undefined){
							$.each(dataTable_colLink.keys,function(kkk,vvv){
								if(kkk==kk){
									addLink=vvv;
									$.each(dataTable_tableDataKeys,function(kkkk,vvvv){
										addLink=addLink.replace(new RegExp('{{'+kkkk+'}}',"g"),v[kkkk]);
										addLink=addLink.replace(new RegExp('{'+kkkk+'}',"g"),seflink(v[kkkk]));
									});
									return false;
								}
							});
						}
						if(addLink!=''){
							html+='<td><a href="'+addLink+'" target="_blank">'+v[kk]+'</a></td>';
						}else{
							html+='<td>'+v[kk]+'</td>';
						}
					});
					var opHtml='';
					if(dataTable_rowOperation.html!=undefined&&dataTable_rowOperation.html!=''){
						opHtml=dataTable_rowOperation.html;
						if(dataTable_rowOperation.function!=undefined){
							$.each(dataTable_rowOperation.function,function(kk,vv){
								opHtml=opHtml.replace(new RegExp(kk,"g"),vv);
							});
						}
						if(dataTable_rowOperation.key!=undefined){
							$.each(dataTable_rowOperation.key,function(kk,vv){
								opHtml=opHtml.replace(new RegExp(kk,"g"),v[vv]);
							});
						}
						if(dataTable_rowOperation.control!=undefined){
							$.each(dataTable_rowOperation.control,function(kk,vv){
								if(!v[vv]){
									opHtml=opHtml.replace(new RegExp(kk,"g"),' style="display:none;" ');
								}else{
									opHtml=opHtml.replace(new RegExp(kk,"g"),'');
								}
							});	
						}
					}
					if(dataTable_showInfoModal&&dataTable_opKeyName!=''){
						opHtml+='<a href="javascript:;" type="button" class="dataTable_infoOpenModal" data-key="'+v[dataTable_opKeyName]+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 45 0 C 20.187 0 0 20.187 0 45 c 0 24.813 20.187 45 45 45 c 24.813 0 45 -20.187 45 -45 C 90 20.187 69.813 0 45 0 z M 52.706 67.583 l -0.521 2.194 c -0.227 0.958 -0.938 1.736 -1.878 2.028 c -3.267 1.016 -6.733 1.262 -10.125 0.711 c -2.291 -0.373 -3.846 -2.532 -3.474 -4.823 l 3.067 -18.855 c 0.363 -2.232 -0.817 -4.315 -2.697 -5.247 c -1.175 -0.582 -1.805 -1.885 -1.502 -3.161 l 0.521 -2.194 c 0.227 -0.958 0.938 -1.736 1.878 -2.029 c 3.267 -1.016 6.733 -1.262 10.125 -0.711 c 2.291 0.373 3.846 2.532 3.474 4.823 l -3.067 18.855 c -0.363 2.232 0.817 4.315 2.697 5.247 C 52.379 65.004 53.008 66.307 52.706 67.583 z M 47.55 31.096 c -3.838 0 -6.95 -3.112 -6.95 -6.95 s 3.112 -6.95 6.95 -6.95 s 6.95 3.112 6.95 6.95 S 51.388 31.096 47.55 31.096 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg></a>';
					}
					if(dataTable_operationArea){
						html+='<td><span class="dataTable_specialOpArea">'+opHtml+'</span></td>';
					}
				html+='</tr>';
				sira++;
			});
			if(html==''){
				var colCount=Object.keys(dataTable_tableKeys).length;
				if(dataTable_opKeyName!=''){colCount++;}
				if(dataTable_operationArea){colCount++;}
				html+='<tr class="dataTable_noResulthOuter"><td class="dataTable_noResulthOuterIn" colspan="'+colCount+'"><div class="dataTable_noResulth"><span>Listelenecek Veri Yok</span></div></td></tr>'
			}
			dataTable_listTable.html(html);
			dataTable_listTable.find('.dataTable_infoOpenModal').on('click',function(event){
				var selectedKeyId=$(this).attr('data-key');
				$.each(dataTable_allData,function(k,v){
					if(selectedKeyId==v[dataTable_opKeyName].toString()){
						$.each(dataTable_showInfoModalKeys,function(kk,vv){
							$('#dataTable_showInfoModalKeys_'+kk).val(v[kk]);
						});
						return false;
					}
				});
				dataTable_infoModal.show();
			});
			dataTable_element.find('.dataTable_checkedBoxs').on('click',function(event){
				if(this.checked){
					dataTable_checkedDatas[$(this).attr('data-key')]=$(this).attr('data-key');
				}else{
					delete dataTable_checkedDatas[$(this).attr('data-key')];
				}
			});
		}

		var selectedPageNumber=5,selectedPageLimit=10,maxPageNumberLimit=1,pagingData=null;
		function pagingInit(datas,pageLimit){
			selectedPageNumber=1;
			selectedPageLimit=pageLimit;
			pagingData=datas;
			pagingSelectedData(datas,0,selectedPageLimit);
			rendePageNumberHtml();
		}

		function pagingSelectedData(datas,minLimit,maxLimit){
			var selectedData=[],count=0;
			$.each(datas,function(k,v){
				if((count==minLimit||count>minLimit)&&count<maxLimit){
					selectedData.push(JSON.parse(JSON.stringify(v)));
				}
				count++;
			});
			listData(selectedData);
		}

		function rendePageNumberHtml(){
			var html='',pageNumberCount=selectedPageNumber,maxPageLimit=1,firstDotsHtml='',lastDotsHtml='';
			maxPageLimit=parseInt(Object.keys(pagingData).length/selectedPageLimit);
			if(Object.keys(pagingData).length%selectedPageLimit>0){maxPageLimit++;}
			maxPageNumberLimit=maxPageLimit;
			if(maxPageLimit>5){
				if(pageNumberCount>4){
					firstDotsHtml+='<li class="dataTable_paginationItem dataTable_pageBtn" id="tableList_firstBtn" data-pageNumber="1"><a class="dataTable_paginationItemChild" href="javascript:;"><span>1</span></a></li>';
					firstDotsHtml+='<li class="dataTable_paginationItem" id="tableList_firstDot"><a class="dataTable_paginationItemChild" href="javascript:;"><span>...</span></a></li>';
				}else if(pageNumberCount<(maxPageLimit-3)){
					lastDotsHtml+='<li class="dataTable_paginationItem" id="tableList_lastBtn"><a class="dataTable_paginationItemChild" href="javascript:;"><span>...</span></a></li>';
					lastDotsHtml+='<li class="dataTable_paginationItem dataTable_pageBtn" id="tableList_lastDot" data-pageNumber="'+maxPageLimit+'"><a class="dataTable_paginationItemChild" href="javascript:;"><span>'+maxPageLimit+'</span></a></li>';
				}else{
					lastDotsHtml+='<li class="dataTable_paginationItem" id="tableList_lastBtn"><a class="dataTable_paginationItemChild" href="javascript:;"><span>...</span></a></li>';
					lastDotsHtml+='<li class="dataTable_paginationItem dataTable_pageBtn" id="tableList_lastDot" data-pageNumber="'+maxPageLimit+'"><a class="dataTable_paginationItemChild" href="javascript:;"><span>'+maxPageLimit+'</span></a></li>';
				}
			}

			if(pageNumberCount<5){
				pageNumberCount=1;
			}else if(pageNumberCount>(maxPageLimit-4)){
				pageNumberCount=maxPageLimit-4;
			}else{
				pageNumberCount-=3;
			}
			html+='<li class="dataTable_paginationItem">';
				html+='<a class="dataTable_paginationItemChild dataTable_pageBtnDown" href="javascript:;">';
					html+='<span class="dataTable_paginationPrevIcon">«</span>';
					//html+='<span class="dataTable_paginationPrevIcon">Geri</span>';
				html+='</a>';
			html+='</li>';
			html+=firstDotsHtml;
			for(var i=0;i<5;i++){
				html+='<li class="dataTable_paginationItem dataTable_pageBtn '+(pageNumberCount==selectedPageNumber?'active':'')+'" data-pageNumber="'+pageNumberCount+'"><a class="dataTable_paginationItemChild" href="javascript:;"><span>'+pageNumberCount+'</span></a></li>';
				if(pageNumberCount>(maxPageLimit-1)){break;}
				pageNumberCount++;
			}
			html+=lastDotsHtml;
			html+='<li class="dataTable_paginationItem">';
				html+='<a class="dataTable_paginationItemChild dataTable_pageBtnUp" href="javascript:;">';
					html+='<span class="dataTable_paginationNextIcon">»</span>';
					//html+='<span class="dataTable_paginationNextText">İleri</span>';
				html+='</a>';
			html+='</li>';
			dataTable_pagingNumberList.html(html);

			dataTable_element.find('.dataTable_pageBtn').on('click',function(event) {
				dataTable_pagingNumberList.children().removeClass('active');
				for(var i=0;i<dataTable_pagingNumberList.children().length;i++){
					if(dataTable_pagingNumberList.children().eq(i).children().eq(0).text()==$(this).attr('data-pageNumber')){
						dataTable_pagingNumberList.children().eq(i).addClass('active');
					}
				}
				selectedPageNumber=$(this).attr('data-pageNumber');
				updatePageList();
				rendePageNumberHtml();
			});

			dataTable_element.find('.dataTable_pageBtnDown').on('click',function(event) {
				if(1<selectedPageNumber){
					selectedPageNumber--;
					selectPage(selectedPageNumber);
				}
			});

			dataTable_element.find('.dataTable_pageBtnUp').on('click',function(event) {
				if(maxPageNumberLimit>selectedPageNumber){
					selectedPageNumber++;
					selectPage(selectedPageNumber);
				}
			});
		}

		function updatePageList(){
			pagingSelectedData(pagingData,((selectedPageLimit*selectedPageNumber)-selectedPageLimit),(selectedPageLimit*selectedPageNumber));
		}

		function selectPage(pageNumber){
			dataTable_pagingNumberList.children().removeClass('active');
			for(var i=0;i<dataTable_pagingNumberList.children().length;i++){
				if(dataTable_pagingNumberList.children().eq(i).children().eq(0).text()==pageNumber){
					dataTable_pagingNumberList.children().eq(i).addClass('active');
				}
			}
			selectedPageNumber=pageNumber;
			updatePageList();
			rendePageNumberHtml();
		}

		if(dataTable_allData!=null){
			dataTable_allData.sort(compareValues(dataTable_defaultSort['key'],dataTable_defaultSort['type']));
			initTableElement();
		}else{
			alert('Tabloda veri yok!');
		}

		return option;
	};
})(window.Zepto || window.jQuery, window, document);