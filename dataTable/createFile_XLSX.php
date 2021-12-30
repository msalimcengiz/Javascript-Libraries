<?php
$rowKeys =(isset($_POST['rowKeys'])?$_POST['rowKeys']:false);
$datas   =(isset($_POST['datas'])?$_POST['datas']:false);
$myLibUrl=(isset($_POST['myLibUrl'])?$_POST['myLibUrl']:false);
$r=array('success'=>false,'data'=>array(),'message'=>'');
if($rowKeys&&$datas&&$myLibUrl){

	if(file_exists(__DIR__.'/dataTableFiles')){
		$files=scandir(__DIR__.'/dataTableFiles/');
		foreach($files as $file){
			if(is_file(__DIR__.'/dataTableFiles/'.$file)){
				unlink(__DIR__.'/dataTableFiles/'.$file);
			}
		}
	}

	require_once __DIR__.'/vendor/autoload.php';

	$spreadsheet2 = new PhpOffice\PhpSpreadsheet\Spreadsheet;
	$sheet = $spreadsheet2->getActiveSheet();

	$arrayRows=array(
		'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
		'AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ',
		'BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ'
	);

	$countRow=0;
	foreach($rowKeys as $k=>$v){
		$sheet->setCellValue($arrayRows[$countRow].'1',$v);
		$spreadsheet2->getActiveSheet()->getColumnDimension($arrayRows[$countRow])->setAutoSize(true);
		$countRow++;
	}

	$spreadsheet2->setActiveSheetIndex(0);

	$spreadsheet2->getDefaultStyle()->getFont()->setName('Calibri');
	$spreadsheet2->getDefaultStyle()->getFont()->setSize(12);
	$spreadsheet2->getActiveSheet()->getStyle('A1:'.$arrayRows[$countRow-1].'1')->getFont()->getColor()->setARGB(\PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE);
	$spreadsheet2->getActiveSheet()->getStyle('A1:'.$arrayRows[$countRow-1].'1')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF1A2648');
	$spreadsheet2->getActiveSheet()->getStyle('A1:'.$arrayRows[$countRow-1].'1')->getFont()->setBold(true);

	$rowNumber=2;
	foreach($datas as$k=>$v){
		$countRow=0;
		foreach($rowKeys as$kk=>$vv){
			$sheet->setCellValue($arrayRows[$countRow].$rowNumber,$v[$kk]);
			$countRow++;
		}
		$rowNumber++;
	}

	if(!file_exists(__DIR__.'/dataTableFiles')){mkdir(__DIR__."/dataTableFiles");}
	$r['data']=array('link'=>$myLibUrl.'dataTableFiles/'.strtotime(date("Y-m-d")).'_'.strtotime(date("h:i:sa")).'.xlsx');
	$writer = new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet2);
	$writer->save('dataTableFiles/'.strtotime(date("Y-m-d")).'_'.strtotime(date("h:i:sa")).'.xlsx');
	$r['success']=true;
}else{
	$r['message']='Eksik Veri !';
}

echo json_encode($r);
?>