;(function($,window,document,undefined){
	$.fn.dateSelect=function(option){
		if(this.length<1){alert('Element bulunamadı !');return false;}
		if(option==undefined){option={};}
		
		let returnOption={};

		let selectHour=(option['hour']!=undefined?option['hour']:false),
			closedDates=(option['closedDates']!=undefined?option['closedDates']:{}),
			startDate=(option['startDate']!=undefined?option['startDate']:null),
			minSelect=(option['minSelect']!=undefined?option['minSelect']:null),
			onSelect=(option.onSelect!=undefined?option.onSelect:null),
			onClear=(option.onClear!=undefined?option.onClear:null);

		let monthNames={
			'shortName':{
				'0' :'Oca',
				'1' :'Şub',
				'2' :'Mar',
				'3' :'Nis',
				'4' :'May',
				'5' :'Haz',
				'6' :'Tem',
				'7' :'Ağu',
				'8' :'Eyl',
				'9' :'Eki',
				'10':'Kas',
				'11':'Ara',
			},
			'fullName':{
				'0' :'Ocak',
				'1' :'Şubat',
				'2' :'Mart',
				'3' :'Nisan',
				'4' :'Mayıs',
				'5' :'Haziran',
				'6' :'Temmuz',
				'7' :'Ağustos',
				'8' :'Eylül',
				'9' :'Ekim',
				'10':'Kasım',
				'11':'Aralık',
			}
		};

		let myElement=$(this),
			myElementOuter=null,
			firstMountSelect=0,
			firstYearSelect=0,
			secondMountSelect=0,
			secondYearSelect=0,
			firstSelectedDate=null,
			firstSelectedItem=null,
			secondSelectedDate=null,
			secondSelectedItem=null,
			firstHourSelect=null,
			secondHourSelect=null,
			selectCalenderListInDaysAraeFirst=null,
			selectCalenderListInDaysAraeSecond=null,
			selectCalenderSubTitleFirst=null,
			selectCalenderSubTitleSecond=null,
			selectCalenderRightArrow=null,
			selectCalenderLeftArrow=null,
			selectDateLabelFirst=null,
			selectDateLabelSecond=null,
			selectCalenderBtnClear=null,
			selectCalenderBtnApprove=null,
			selectHourAreas=null,
			selectHourLabelFirst=null,
			selectHourLabelSecond=null,
			selectArea=null,
			myElementBlock=null,
			opType=0,
			findedClosed=false;

		returnOption['get']=function(){
			let firstDate=null,
				secondDate=null;

			if(firstSelectedDate!=null){
				let firstDateData = new Date(parseInt(firstSelectedDate));
				firstDate=firstDateData.getFullYear()+'-'+((firstDateData.getMonth()+1).toString().length==1?('0'+(firstDateData.getMonth()+1)):(firstDateData.getMonth()+1))+'-'+(firstDateData.getDate().toString().length==1?'0'+firstDateData.getDate():firstDateData.getDate());
			}

			if(secondSelectedDate!=null){
				let secondDateData = new Date(parseInt(secondSelectedDate));
				secondDate=secondDateData.getFullYear()+'-'+((secondDateData.getMonth()+1).toString().length==1?('0'+(secondDateData.getMonth()+1)):(secondDateData.getMonth()+1))+'-'+(secondDateData.getDate().toString().length==1?'0'+secondDateData.getDate():secondDateData.getDate());
			}

			return {
				'firstDate':firstDate,
				'secondDate':secondDate,
				'firstTime':(firstHourSelect!=null?(firstHourSelect.toString().length==1?'0'+firstHourSelect+':00':firstHourSelect+':00'):null),
				'secondTime':(secondHourSelect!=null?(secondHourSelect.toString().length==1?'0'+secondHourSelect+':00':secondHourSelect+':00'):null)
			};
		};

		returnOption['set']=function(data){
			if(data.firstDate!=undefined){
				let date=new Date(data.firstDate);
				if(Object.prototype.toString.call(date)==="[object Date]"){
					firstSelectedDate=date.getTime();
				}
			}
			
			if(data.secondDate!=undefined){
				let date=new Date(data.secondDate);
				if(Object.prototype.toString.call(date)==="[object Date]"){
					secondSelectedDate=date.getTime();
				}
			}
			
			firstHourSelect=data.firstHour;
			secondHourSelect=data.secondHour;
			changeFirstDate();
			inirSelectHour();
		};

		returnOption['clear']=function(){
			firstSelectedDate=null;
			secondSelectedDate=null;
			firstHourSelect=null;
			secondHourSelect=null;
			selectHourLabelFirst.hide();
			selectHourLabelFirst.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
			selectHourLabelSecond.hide();
			selectHourLabelSecond.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
			changeFirstDate();
			inirSelectHour();
		};

		function init(){
			let html='',
				myElementHtml=myElement[0].outerHTML;

			html+='<div class="dateSelect_outer dateSelect_outer_'+myElement.attr('id')+'">';
				html+='<div class="myElementBlock"></div>';
				html+='<div class="dateSelect_selectArea">';
					html+='<div class="dateSelect_selectDatesArea">';
						html+='<div class="dateSelect_selectDatesSelection">';
							html+='<div class="dateSelect_selectDate">';
								html+='<span class="dateSelect_selectDateInfo">Biniş Tarihi</span>';
								html+='<span class="dateSelect_selectDateLabel dateSelect_selectDateLabelFirst" style="display:none">24 Agu Cuma</span>';
								html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 71.33 11.468 v -8 H 58.67 v 8 H 31.33 v -8 H 18.67 v 8 H 0 v 0 v 20.348 v 47.871 h 90 V 31.815 V 11.468 v 0 H 71.33 z M 62.67 7.468 h 4.66 v 10.174 h -4.66 V 7.468 z M 22.67 7.468 h 4.66 v 10.174 h -4.66 V 7.468 z M 86 75.686 H 4 V 31.815 h 82 V 75.686 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><rect x="10" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="10" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="71.23" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="71.23" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/></g></g></svg>';
							html+='</div>';
							if(selectHour){
								html+='<div class="dateSelect_selectHour">';
									html+='<span class="dateSelect_selectHourInfo">Biniş Saati</span>';
									html+='<span class="dateSelect_selectDateLabel dateSelect_selectHourLabelFirst" style="display: none;"></span>';
									html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 9 C 25.149 9 9 25.149 9 45 s 16.149 36 36 36 s 36 -16.149 36 -36 S 64.851 9 45 9 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 66.071 40.5 H 49.5 V 23.929 c 0 -2.485 -2.015 -4.5 -4.5 -4.5 s -4.5 2.015 -4.5 4.5 V 45 c 0 2.485 2.015 4.5 4.5 4.5 h 21.071 c 2.485 0 4.5 -2.015 4.5 -4.5 S 68.557 40.5 66.071 40.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
								html+='</div>';
								html+='<div class="dateSelect_selectHour">';
									html+='<span class="dateSelect_selectHourInfo">İniş Saati</span>';
									html+='<span class="dateSelect_selectDateLabel dateSelect_selectHourLabelSecond" style="display: none;"></span>';
									html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 45 90 C 20.187 90 0 69.813 0 45 C 0 20.187 20.187 0 45 0 c 24.813 0 45 20.187 45 45 C 90 69.813 69.813 90 45 90 z M 45 9 C 25.149 9 9 25.149 9 45 s 16.149 36 36 36 s 36 -16.149 36 -36 S 64.851 9 45 9 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 66.071 40.5 H 49.5 V 23.929 c 0 -2.485 -2.015 -4.5 -4.5 -4.5 s -4.5 2.015 -4.5 4.5 V 45 c 0 2.485 2.015 4.5 4.5 4.5 h 21.071 c 2.485 0 4.5 -2.015 4.5 -4.5 S 68.557 40.5 66.071 40.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
								html+='</div>';
							}else{
								html+='<div class="dateSelect_selectDate">';
									html+='<span class="dateSelect_selectDateInfo">İniş Tarihi</span>';
									html+='<span class="dateSelect_selectDateLabel dateSelect_selectDateLabelSecond" style="display: none">30 Agu Cuma</span>';
									html+='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 71.33 11.468 v -8 H 58.67 v 8 H 31.33 v -8 H 18.67 v 8 H 0 v 0 v 20.348 v 47.871 h 90 V 31.815 V 11.468 v 0 H 71.33 z M 62.67 7.468 h 4.66 v 10.174 h -4.66 V 7.468 z M 22.67 7.468 h 4.66 v 10.174 h -4.66 V 7.468 z M 86 75.686 H 4 V 31.815 h 82 V 75.686 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><rect x="10" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="10" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="22.25" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="34.49" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="46.74" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="58.99" y="61.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="71.23" y="37.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/><rect x="71.23" y="49.7" rx="0" ry="0" width="8.77" height="9.03" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) "/></g></g></svg>';
								html+='</div>';
							}
						html+='</div>';
					html+='</div>';
					html+='<div class="'+(selectHour?'dateSelect_selectCalenderAllAraeHalf':'dateSelect_selectCalenderAllArae')+'">';
						html+='<div class="dateSelect_selectCalenderArae">';
							html+='<div class="dateSelect_selectCalenderTitle">';
								html+='<svg class="dateSelect_selectCalenderTitleLeftBtn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 31.67 58.799 l 42.333 -42.333 c 1.059 -1.059 1.059 -2.776 0 -3.835 L 62.166 0.794 c -1.059 -1.059 -2.776 -1.059 -3.835 0 L 15.998 43.127 c -1.059 1.059 -1.059 2.776 0 3.835 l 11.837 11.837 C 28.893 59.858 30.61 59.858 31.67 58.799 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 31.67 31.201 l 42.333 42.333 c 1.059 1.059 1.059 2.776 0 3.835 L 62.166 89.206 c -1.059 1.059 -2.776 1.059 -3.835 0 L 15.998 46.873 c -1.059 -1.059 -1.059 -2.776 0 -3.835 l 11.837 -11.837 C 28.893 30.142 30.61 30.142 31.67 31.201 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
								html+='<div class="'+(selectHour?'dateSelect_selectCalenderSubTitleFull':'dateSelect_selectCalenderSubTitle')+'" id="dateSelect_selectCalenderSubTitleFirst">Ağustos 2019</div>';
								if(!selectHour){
									html+='<div class="dateSelect_selectCalenderSubTitle" id="dateSelect_selectCalenderSubTitleSecond">Eylül 2019</div>';
								}
								html+='<svg class="dateSelect_selectCalenderTitleRightBtn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g transform="translate(128 128) scale(0.72 0.72)" style=""><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(-175.05 -175.05000000000004) scale(3.89 3.89)" ><path d="M 58.33 58.799 L 15.998 16.466 c -1.059 -1.059 -1.059 -2.776 0 -3.835 L 27.834 0.794 c 1.059 -1.059 2.776 -1.059 3.835 0 l 42.333 42.333 c 1.059 1.059 1.059 2.776 0 3.835 L 62.166 58.799 C 61.107 59.858 59.39 59.858 58.33 58.799 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><path d="M 58.33 31.201 L 15.998 73.534 c -1.059 1.059 -1.059 2.776 0 3.835 l 11.837 11.837 c 1.059 1.059 2.776 1.059 3.835 0 l 42.333 -42.333 c 1.059 -1.059 1.059 -2.776 0 -3.835 L 62.166 31.201 C 61.107 30.142 59.39 30.142 58.33 31.201 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></g></svg>';
							html+='</div>';
						html+='</div>';
						html+='<div class="dateSelect_selectCalenderListArae">';
							html+='<div class="dateSelect_selectCalenderListInArae">';
								html+='<ul class="dateSelect_selectCalenderListInTitleArae">';
									html+='<li>Pt</li>';
									html+='<li>Sa</li>';
									html+='<li>Ça</li>';
									html+='<li>Pe</li>';
									html+='<li>Cu</li>';
									html+='<li>Ct</li>';
									html+='<li>Pz</li>';
								html+='</ul>';
								html+='<ul class="dateSelect_selectCalenderListInDaysAraeFirst"></ul>';
							html+='</div>';
							if(!selectHour){
								html+='<div class="dateSelect_selectCalenderListInArae">';
									html+='<ul class="dateSelect_selectCalenderListInTitleArae">';
										html+='<li>Pt</li>';
										html+='<li>Sa</li>';
										html+='<li>Ça</li>';
										html+='<li>Pe</li>';
										html+='<li>Cu</li>';
										html+='<li>Ct</li>';
										html+='<li>Pz</li>';
									html+='</ul>';
									html+='<ul class="dateSelect_selectCalenderListInDaysAraeSecond"></ul>';
								html+='</div>';
							}
						html+='</div>';
					html+='</div>';
					if(selectHour){
						html+='<div class="dateSelect_selectCalenderAllAraeHalf">';
							html+='<div class="dateSelect_selectHourAreas">';
								html+='<div class="dateSelect_selectHourAreaFirst">';
									html+='<div class="dateSelect_selectHourAreaFirstTitle">';
										html+='<span>Saat</span>';
									html+='</div>';
									html+='<ul class="dateSelect_selectHourAreaFirstValue">';
										html+='<li data-value="00:00"><span>00:00</span></li>';
										html+='<li data-value="01:00"><span>01:00</span></li>';
										html+='<li data-value="02:00"><span>02:00</span></li>';
										html+='<li data-value="03:00"><span>03:00</span></li>';
										html+='<li data-value="04:00"><span>04:00</span></li>';
										html+='<li data-value="05:00"><span>05:00</span></li>';
										html+='<li data-value="06:00"><span>06:00</span></li>';
										html+='<li data-value="07:00"><span>07:00</span></li>';
										html+='<li data-value="08:00"><span>08:00</span></li>';
										html+='<li data-value="09:00"><span>09:00</span></li>';
										html+='<li data-value="10:00"><span>10:00</span></li>';
										html+='<li data-value="11:00"><span>11:00</span></li>';
										html+='<li data-value="12:00"><span>12:00</span></li>';
										html+='<li data-value="13:00"><span>13:00</span></li>';
										html+='<li data-value="14:00"><span>14:00</span></li>';
										html+='<li data-value="15:00"><span>15:00</span></li>';
										html+='<li data-value="16:00"><span>16:00</span></li>';
										html+='<li data-value="17:00"><span>17:00</span></li>';
										html+='<li data-value="18:00"><span>18:00</span></li>';
										html+='<li data-value="19:00"><span>19:00</span></li>';
										html+='<li data-value="20:00"><span>20:00</span></li>';
										html+='<li data-value="21:00"><span>21:00</span></li>';
										html+='<li data-value="22:00"><span>22:00</span></li>';
										html+='<li data-value="23:00"><span>23:00</span></li>';
									html+='</ul>';
								html+='</div>';
								html+='<div class="dateSelect_selectHourAreaSecond">';
									html+='<div class="dateSelect_selectHourAreaSecondTitle">';
										html+='<span>Saat</span>';
									html+='</div>';
									html+='<ul class="dateSelect_selectHourAreaSecondValue">';
										html+='<li data-value="00:00"><span>00:00</span></li>';
										html+='<li data-value="01:00"><span>01:00</span></li>';
										html+='<li data-value="02:00"><span>02:00</span></li>';
										html+='<li data-value="03:00"><span>03:00</span></li>';
										html+='<li data-value="04:00"><span>04:00</span></li>';
										html+='<li data-value="05:00"><span>05:00</span></li>';
										html+='<li data-value="06:00"><span>06:00</span></li>';
										html+='<li data-value="07:00"><span>07:00</span></li>';
										html+='<li data-value="08:00"><span>08:00</span></li>';
										html+='<li data-value="09:00"><span>09:00</span></li>';
										html+='<li data-value="10:00"><span>10:00</span></li>';
										html+='<li data-value="11:00"><span>11:00</span></li>';
										html+='<li data-value="12:00"><span>12:00</span></li>';
										html+='<li data-value="13:00"><span>13:00</span></li>';
										html+='<li data-value="14:00"><span>14:00</span></li>';
										html+='<li data-value="15:00"><span>15:00</span></li>';
										html+='<li data-value="16:00"><span>16:00</span></li>';
										html+='<li data-value="17:00"><span>17:00</span></li>';
										html+='<li data-value="18:00"><span>18:00</span></li>';
										html+='<li data-value="19:00"><span>19:00</span></li>';
										html+='<li data-value="20:00"><span>20:00</span></li>';
										html+='<li data-value="21:00"><span>21:00</span></li>';
										html+='<li data-value="22:00"><span>22:00</span></li>';
										html+='<li data-value="23:00"><span>23:00</span></li>';
									html+='</ul>';
								html+='</div>';
							html+='</div>';
						html+='</div>';
					}
					html+='<div class="dateSelect_selectCalenderBtnArae">';
						html+='<button type="button" class="dateSelect_selectCalenderBtnClear">Temizle</button>';
						html+='<button type="button" class="dateSelect_selectCalenderBtnApprove">Tamam</button>';
					html+='</div>';
				html+='</div>';
			html+='</div>';

			myElement.parent().append(html);
			myElementOuter=myElement.parent().find('.dateSelect_outer_'+myElement.attr('id'));
			myElementOuter.append(myElementHtml);
			myElement.remove();
			myElement=myElementOuter.find('#'+myElement.attr('id'));
			myElement.addClass('myElement');
			//myElement.attr('disabled','disabled');
			myElement.attr('placeholder','Lütfen bir tarih seçin.');
			selectArea=myElementOuter.find('.dateSelect_selectArea');
			selectCalenderListInDaysAraeFirst=myElementOuter.find('.dateSelect_selectCalenderListInDaysAraeFirst');
			selectCalenderListInDaysAraeSecond=myElementOuter.find('.dateSelect_selectCalenderListInDaysAraeSecond');
			selectCalenderSubTitleFirst=myElementOuter.find('#dateSelect_selectCalenderSubTitleFirst');
			selectCalenderSubTitleSecond=myElementOuter.find('#dateSelect_selectCalenderSubTitleSecond');
			selectCalenderRightArrow=myElementOuter.find('.dateSelect_selectCalenderTitleRightBtn');
			selectCalenderLeftArrow=myElementOuter.find('.dateSelect_selectCalenderTitleLeftBtn');
			selectDateLabelFirst=myElementOuter.find('.dateSelect_selectDateLabelFirst');
			selectDateLabelSecond=myElementOuter.find('.dateSelect_selectDateLabelSecond');
			selectCalenderBtnClear=myElementOuter.find('.dateSelect_selectCalenderBtnClear');
			selectCalenderBtnApprove=myElementOuter.find('.dateSelect_selectCalenderBtnApprove');
			selectHourAreas=myElementOuter.find('.dateSelect_selectHour');
			selectHourLabelFirst=myElementOuter.find('.dateSelect_selectHourLabelFirst');
			selectHourLabelSecond=myElementOuter.find('.dateSelect_selectHourLabelSecond');
			selectHourAreaFirstValue=myElementOuter.find('.dateSelect_selectHourAreaFirstValue');
			selectHourAreaSecondValue=myElementOuter.find('.dateSelect_selectHourAreaSecondValue');
			myElementBlock=myElementOuter.find('.myElementBlock');

			selectArea.on('click',function(event){
				opType=2;
			});
			myElementBlock.on('click',function(event){
				if(selectArea.hasClass('dateSelect_selectAreaActive')){
					opType=1;
					selectArea.removeClass('dateSelect_selectAreaActive');
				}else{
					opType=2;
					selectArea.addClass('dateSelect_selectAreaActive');
				}
			});
			$('body').on('click',function(event){
				setTimeout(function(){
					if(selectArea.hasClass('dateSelect_selectAreaActive')&&opType!=2){
						selectArea.removeClass('dateSelect_selectAreaActive');
					}
					opType=0;
				},100);
			});

			let date=new Date();
			firstMountSelect=(date.getMonth()+1);
			firstYearSelect=date.getFullYear();
			changeFirstDate();

			selectCalenderRightArrow.on('click',function(){
				opType=2;
				firstMountSelect++;
				changeFirstDate();
			});
			selectCalenderLeftArrow.on('click',function(){
				opType=2;
				firstMountSelect--;
				changeFirstDate();
			});

			selectCalenderBtnClear.on('click',function(){
				opType=2;
				firstSelectedDate=null;
				secondSelectedDate=null;
				firstHourSelect=null;
				secondHourSelect=null;
				selectHourLabelFirst.hide();
				selectHourLabelFirst.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
				selectHourLabelSecond.hide();
				selectHourLabelSecond.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
				changeFirstDate();
				inirSelectHour();
				if(onClear!=null){
					onClear();
				}
			});

			selectCalenderBtnApprove.on('click',function(){
				opType=1;
				selectArea.removeClass('dateSelect_selectAreaActive');
			});

			inirSelectHour();
		}

		function initInputValue(){
			let inputText='';

			let firstDate='',
				secondDate='',
				firstHour=firstHourSelect,
				secondHour=secondHourSelect;

			if(selectHour){
				if(firstSelectedDate!=null){
					let firstDateData = new Date(parseInt(firstSelectedDate));
					firstDate=firstDateData.getDate()+' '+monthNames['fullName'][firstDateData.getMonth()]+' '+firstDateData.getFullYear();
				}else{
					firstDate='';
				}

				if(firstDate==''&&firstHour==''&&secondHour==''){
					inputText+='';
				}else{
					inputText+=firstDate+' - '+(firstHour!=null?(firstHour.toString().length==1?'0'+firstHour+':00':firstHour+':00'):'')+'/'+(secondHour!=null?(secondHour.toString().length==1?'0'+secondHour+':00':secondHour+':00'):'');
				}
			}else{
				if(firstSelectedDate!=null){
					let firstDateData = new Date(parseInt(firstSelectedDate));
					firstDate=firstDateData.getDate()+' '+monthNames['fullName'][firstDateData.getMonth()]+' '+firstDateData.getFullYear();
				}else{
					firstDate='';
				}
				if(secondSelectedDate!=null){
					let secondDateData = new Date(parseInt(secondSelectedDate));
					secondDate=secondDateData.getDate()+' '+monthNames['fullName'][secondDateData.getMonth()]+' '+secondDateData.getFullYear();
				}else{
					secondDate='';
				}
				if(firstDate==''&&secondDate==''){
					inputText+='';
				}else{
					inputText+=firstDate+' - '+secondDate;
				}
			}

			myElement.val(inputText);
		}

		function inirSelectHour(){
			let htmlFirstHour='',
				htmlSecondHour='',
				todayHour = new Date(),
				todayDate = new Date();

			todayDate = new Date((todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear());
			for(var i=0;i<24;i++){
				if(i.toString().length<2){
					if(firstSelectedDate!=null){
						if(firstSelectedDate==todayDate.getTime()){
							htmlFirstHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(firstHourSelect==i&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
							if(firstHourSelect!=null){
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i&&firstHourSelect<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(secondHourSelect==i&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
							}else{
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
								secondHourSelect=null;
							}
						}else{
							htmlFirstHour+='<li class="'+(firstSelectedDate!=null?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(firstHourSelect==i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
							if(firstHourSelect!=null){
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&firstHourSelect<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(secondHourSelect==i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
							}else{
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null?'dateSelect_selectHourAreaFirstValueHourActive':'')+'" data-value="'+i+'"><span>0'+i+':00</span></li>';
								secondHourSelect=null;
							}
						}
					}else{
						htmlFirstHour+='<li class="" data-value="'+i+'"><span>0'+i+':00</span></li>';
						htmlSecondHour+='<li class="" data-value="'+i+'"><span>0'+i+':00</span></li>';
						firstHourSelect=null;
						secondHourSelect=null;
					}
				}else{
					if(firstSelectedDate!=null){
						if(firstSelectedDate==todayDate.getTime()){
							htmlFirstHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(firstHourSelect==i&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
							if(firstHourSelect!=null){
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i&&firstHourSelect<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(secondHourSelect==i&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
							}else{
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&todayHour.getHours()<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
								secondHourSelect=null;
							}
						}else{
							htmlFirstHour+='<li class="'+(firstSelectedDate!=null?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(firstHourSelect==i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
							if(firstHourSelect!=null){
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null&&firstHourSelect<i?'dateSelect_selectHourAreaFirstValueHourActive':'')+' '+(secondHourSelect==i?'dateSelect_selectHourAreaFirstValueHourActived':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
							}else{
								htmlSecondHour+='<li class="'+(firstSelectedDate!=null?'dateSelect_selectHourAreaFirstValueHourActive':'')+'" data-value="'+i+'"><span>'+i+':00</span></li>';
								secondHourSelect=null;
							}
						}
					}else{
						htmlFirstHour+='<li class="" data-value="'+i+'"><span>'+i+':00</span></li>';
						htmlSecondHour+='<li class="" data-value="'+i+'"><span>'+i+':00</span></li>';
						firstHourSelect=null;
						secondHourSelect=null;
					}
				}
			}

			selectHourAreaFirstValue.html(htmlFirstHour);
			selectHourAreaSecondValue.html(htmlSecondHour);

			if(firstHourSelect!=null){
				selectHourLabelFirst.html((firstHourSelect.toString().length==1?'0'+firstHourSelect+':00':firstHourSelect+':00'));
				selectHourLabelFirst.show();
				selectHourLabelFirst.closest('.dateSelect_selectHour').addClass('dateSelect_selectDateActive');
			}else{
				selectHourLabelFirst.hide();
				selectHourLabelFirst.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
			}

			if(secondHourSelect!=null){
				selectHourLabelSecond.html((secondHourSelect.toString().length==1?'0'+secondHourSelect+':00':secondHourSelect+':00'));
				selectHourLabelSecond.show();
				selectHourLabelSecond.closest('.dateSelect_selectHour').addClass('dateSelect_selectDateActive');
			}else{
				selectHourLabelSecond.hide();
				selectHourLabelSecond.closest('.dateSelect_selectHour').removeClass('dateSelect_selectDateActive');
			}

			selectHourAreaFirstValue.find('li.dateSelect_selectHourAreaFirstValueHourActive').off();
			selectHourAreaSecondValue.find('li.dateSelect_selectHourAreaFirstValueHourActive').off();
			selectHourAreaFirstValue.find('li.dateSelect_selectHourAreaFirstValueHourActive').on('click',function(){
				opType=2;
				secondHourSelect=null;
				if(firstHourSelect==parseInt($(this).attr('data-value'))){
					firstHourSelect=null;
				}else{
					firstHourSelect=parseInt($(this).attr('data-value'));
				}
				initInputValue();
				inirSelectHour();
				if(onSelect!=null){
					runOnSelect();
				}
			});

			selectHourAreaSecondValue.find('li.dateSelect_selectHourAreaFirstValueHourActive').on('click',function(){
				opType=2;
				if(secondHourSelect==parseInt($(this).attr('data-value'))){
					secondHourSelect=null;
				}else{
					secondHourSelect=parseInt($(this).attr('data-value'));
				}
				initInputValue();
				inirSelectHour();
				if(onSelect!=null){
					runOnSelect();
				}
			});
		}

		function initSelectDate(){
			selectCalenderListInDaysAraeFirst.find('.dateSelect_selectCalenderListInDaysAraeLight').off();
			selectCalenderListInDaysAraeSecond.find('.dateSelect_selectCalenderListInDaysAraeLight').off();
			selectCalenderListInDaysAraeFirst.find('.dateSelect_selectCalenderListInDaysAraeLight').on('click',function(){
				opType=2;
				if($(this).attr('data-value')!=firstSelectedDate){
					if(firstSelectedDate!=null){
						if(!selectHour){
							if(secondSelectedDate!=null){
								if($(this).attr('data-value')!=secondSelectedDate){
									secondSelectedDate=$(this).attr('data-value');
								}else{
									secondSelectedDate=null;
								}
							}else{
								secondSelectedDate=$(this).attr('data-value');
							}
						}else{
							firstSelectedDate=$(this).attr('data-value');	
						}
					}else{
						firstSelectedDate=$(this).attr('data-value');
					}
				}else{
					firstSelectedDate=null;
					secondSelectedDate=null;
				}
				changeFirstDate();
				inirSelectHour();
				if(onSelect!=null){
					runOnSelect();
				}
			});
			selectCalenderListInDaysAraeSecond.find('.dateSelect_selectCalenderListInDaysAraeLight').on('click',function(){
				opType=2;
				if($(this).attr('data-value')!=firstSelectedDate){
					if(firstSelectedDate!=null){
						if(!selectHour){
							if(secondSelectedDate!=null){
								if($(this).attr('data-value')!=secondSelectedDate){
									secondSelectedDate=$(this).attr('data-value');
								}else{
									secondSelectedDate=null;
								}
							}else{
								secondSelectedDate=$(this).attr('data-value');
							}
						}else{
							firstSelectedDate=$(this).attr('data-value');	
						}
					}else{
						firstSelectedDate=$(this).attr('data-value');
					}
				}else{
					firstSelectedDate=null;
					secondSelectedDate=null;
				}
				changeFirstDate();
				inirSelectHour();
				if(onSelect!=null){
					runOnSelect();
				}
			});
			inirSelectHour();
		}

		function runOnSelect(){
			let firstDate=null,
				secondDate=null,
				data=null;

			if(firstSelectedDate!=null){
				let firstDateData = new Date(parseInt(firstSelectedDate));
				firstDate=firstDateData.getFullYear()+'-'+((firstDateData.getMonth()+1).toString().length==1?('0'+(firstDateData.getMonth()+1)):(firstDateData.getMonth()+1))+'-'+(firstDateData.getDate().toString().length==1?'0'+firstDateData.getDate():firstDateData.getDate());
			}

			if(secondSelectedDate!=null){
				let secondDateData = new Date(parseInt(secondSelectedDate));
				secondDate=secondDateData.getFullYear()+'-'+((secondDateData.getMonth()+1).toString().length==1?('0'+(secondDateData.getMonth()+1)):(secondDateData.getMonth()+1))+'-'+(secondDateData.getDate().toString().length==1?'0'+secondDateData.getDate():secondDateData.getDate());
			}

			data={
				'firstDate':firstDate,
				'secondDate':secondDate,
				'firstTime':(firstHourSelect!=null?(firstHourSelect.toString().length==1?'0'+firstHourSelect+':00':firstHourSelect+':00'):null),
				'secondTime':(secondHourSelect!=null?(secondHourSelect.toString().length==1?'0'+secondHourSelect+':00':secondHourSelect+':00'):null)
			};
			onSelect(data);
		}

		function changeFirstDate(){
			let date=new Date(),
				firstDate='',
				secondDate='';

			if(firstMountSelect==0){
				firstMountSelect=12;
				firstYearSelect--;
			}else if(firstMountSelect==13){
				firstMountSelect=1;
				firstYearSelect++;
			}

			secondMountSelect=(firstMountSelect+1);
			secondYearSelect=firstYearSelect;

			if(secondMountSelect==0){
				secondMountSelect=12;
				secondYearSelect--;
			}else if(secondMountSelect==13){
				secondMountSelect=1;
				secondYearSelect++;
			}

			firstDate=firstMountSelect+'-1-'+firstYearSelect;
			secondDate=secondMountSelect+'-1-'+secondYearSelect;

			findedClosed=false;

			createCalenderList(firstDate,0);
			createCalenderList(secondDate,1);
		}

		function createCalenderList(dateText,area=0){
			let todayDate = new Date(),
				date = new Date(dateText),
				operationDate = new Date(dateText),
				html ='',
				classes = '',
				findCloesed=false;

			if(startDate!=null){
				todayDate.setDate(todayDate.getDate()+parseInt(startDate));
			}

			if(firstSelectedDate!=null){
				findCloesed=true;
				todayDate = new Date(parseInt(firstSelectedDate));
				selectDateLabelFirst.html(todayDate.getDate()+' '+monthNames['shortName'][todayDate.getMonth()]+' '+todayDate.getFullYear());
				selectDateLabelFirst.closest('.dateSelect_selectDate').addClass('dateSelect_selectDateActive');
				selectDateLabelFirst.show();
				if(secondSelectedDate!=null){
					var secondTodayDate = new Date(parseInt(secondSelectedDate));
					selectDateLabelSecond.html(secondTodayDate.getDate()+' '+monthNames['shortName'][secondTodayDate.getMonth()]+' '+secondTodayDate.getFullYear());
					selectDateLabelSecond.closest('.dateSelect_selectDate').addClass('dateSelect_selectDateActive');
					selectDateLabelSecond.show();
				}else{
					selectDateLabelSecond.html('');
					selectDateLabelSecond.closest('.dateSelect_selectDate').removeClass('dateSelect_selectDateActive');
					selectDateLabelSecond.hide();
				}
				if(selectHour){
					todayDate = new Date();
					todayDate = new Date((todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear());
				}
			}else{
				selectDateLabelFirst.html('');
				selectDateLabelFirst.closest('.dateSelect_selectDate').removeClass('dateSelect_selectDateActive');
				selectDateLabelFirst.hide();
				selectDateLabelSecond.html('');
				selectDateLabelSecond.closest('.dateSelect_selectDate').removeClass('dateSelect_selectDateActive');
				selectDateLabelSecond.hide();
				todayDate = new Date((todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear());
				if(selectHour){
					todayDate = new Date();
					todayDate = new Date((todayDate.getMonth()+1)+'-'+todayDate.getDate()+'-'+todayDate.getFullYear());
				}
			}

			if(!selectHour){
				if(firstSelectedDate!=null){
					if(minSelect!=null){
						todayDate.setDate(todayDate.getDate()+parseInt(minSelect));
					}
				}
			}

			let selectedDate=null;
			if(operationDate.getDay()==1){
				selectedDate=operationDate;
			}else{
				for(var i=7;i>0;i--){
					let checkDateUnix=operationDate.setDate(operationDate.getDate() - 1);
					let checkDate=new Date(checkDateUnix);
					if(checkDate.getDay()==1){
						selectedDate=checkDate;
						break;
					}
				}
			}

			if(selectedDate!=null){
				var startWriteLight=false;
				for(var i=0;i<42;i++){
					if(selectedDate.getDate()=='1'&&startWriteLight==true){
						startWriteLight=false;
					}else if(selectedDate.getDate()=='1'&&startWriteLight==false){
						startWriteLight=true;
					}
					classes='';

					var controlDate='';
						controlDate+=selectedDate.getFullYear();
						controlDate+='-';
						controlDate+=((selectedDate.getMonth()+1).toString().length<2?'0'+(selectedDate.getMonth()+1):(selectedDate.getMonth()+1));
						controlDate+='-';
						controlDate+=(selectedDate.getDate().toString().length<2?'0'+selectedDate.getDate():selectedDate.getDate());
					if(!findedClosed){
						if(closedDates[controlDate]!=undefined){
							if(closedDates[controlDate]['status']){
								classes+=(startWriteLight&&todayDate.getTime()<=selectedDate.getTime()?'dateSelect_selectCalenderListInDaysAraeLight':'');
							}else{
								if(findCloesed&&todayDate.getTime()<selectedDate.getTime()){
									if(!selectHour){
										findedClosed=true;
									}
								}
							}
						}else{
							classes+=(startWriteLight&&todayDate.getTime()<=selectedDate.getTime()?'dateSelect_selectCalenderListInDaysAraeLight':'');
						}
					}

					if(firstSelectedDate==selectedDate.getTime()&&startWriteLight){
						classes+=' dateSelect_selectCalenderListInDaysAraeLight dateSelect_selectCalenderListInDaysAraeActive';
					}else if(secondSelectedDate==selectedDate.getTime()&&startWriteLight){
						classes+=' dateSelect_selectCalenderListInDaysAraeLight dateSelect_selectCalenderListInDaysAraeActive';
					}else if(firstSelectedDate!=null&&secondSelectedDate!=null){
						if(selectedDate.getTime()>firstSelectedDate&&selectedDate.getTime()<secondSelectedDate&&startWriteLight){
							classes+=' dateSelect_selectCalenderListInDaysAraeBetweenActive';
						}
					}

					if(closedDates[controlDate]!=undefined){
						if(!closedDates[controlDate]['status']){
							classes+=(startWriteLight&&todayDate.getTime()<=selectedDate.getTime()?'dateSelect_selectCalenderListInDaysAraeClosed':'');
						}
					}

					html+='<li data-value="'+selectedDate.getTime()+'" class="'+classes+'">'+(selectedDate.getDate())+'</li>';
					selectedDate.setDate(selectedDate.getDate()+1);
				}
				if(area==0){
					selectCalenderListInDaysAraeFirst.html(html);
					selectCalenderSubTitleFirst.html(monthNames['fullName'][date.getMonth()]+' '+date.getFullYear());
				}else{
					selectCalenderListInDaysAraeSecond.html(html);
					selectCalenderSubTitleSecond.html(monthNames['fullName'][date.getMonth()]+' '+date.getFullYear());
				}
				initSelectDate();
				initInputValue();
			}else{
				alert('Seçili tarih bulunamadı !');
			}
		}

		init();

		return returnOption;
	};
})(window.Zepto || window.jQuery, window, document);