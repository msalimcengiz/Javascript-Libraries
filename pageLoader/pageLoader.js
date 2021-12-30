;(function($,window,document,undefined){
	$.pageLoader=function(option){
		let totalData=0,
			windowHeight=0;
		function getElementParent(element){
			if(element[0].nodeName!='BODY'){
				totalData=parseInt(element[0].offsetTop);
				getElementParent($(element).parent());
			}
		}

		function findedTotalOffset(element){
			totalData=0;
			getElementParent($(element));
			return totalData;	
		}

		function init(){
			windowHeight=parseInt($(window).height())+100;
			$.each(option,function(k,v){
				let selectedElement=null;
				if(v.selectorType=='class'){
					selectedElement=$('.'+v.selector);
				}else{
					selectedElement=$('#'+v.selector);
				}
				v['elements']=[];
				$.each(selectedElement,function(kk,vv){
					v['elements'].push({'element':$(vv),'totalOffset':findedTotalOffset(vv),'codeInitIsRun':false});
				});
			});

			let scroolPosition=$(window).scrollTop();
			$.each(option,function(k,v){
				$.each(v['elements'],function(kk,vv){
					if((scroolPosition+windowHeight)>vv['totalOffset']&&!vv['codeInitIsRun']){
						vv['codeInitIsRun']=true;
						let selectedFunc=v['codeInit'];
						selectedFunc({'element':vv['element']});
					}
				});
			});

			$(window).scroll(function(){
				let scroolPosition=$(window).scrollTop();
				$.each(option,function(k,v){
					$.each(v['elements'],function(kk,vv){
						if((scroolPosition+windowHeight)>(vv['totalOffset']-720)&&!vv['codeInitIsRun']){
							vv['codeInitIsRun']=true;
							let selectedFunc=v['codeInit'];
							selectedFunc({'element':vv['element']});
						}
					});
				});
			});
		}

		setTimeout(function(){init();},250);
	};
})(window.Zepto || window.jQuery, window, document);