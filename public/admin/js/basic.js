// JavaScript

$(document).ready(function(){
	$('.select').selectmenu();
	$('.inp-date').datepicker();
	if($('.checkbox').length){$('.checkbox input').customInput();}
	if($('.radio').length){$('.radio input').customInput();}
	if($('#portfolioWrite').length){
		var simplemde = new SimpleMDE({ 
			element: document.getElementById('portfolioWrite') 
		});
	}
});