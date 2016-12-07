// JavaScript

$(document).ready(function(){
	$('.select').selectmenu();
	$('.inp-date').datepicker();
	$(document).tooltip();

	// search ui
	$('#searchAll').focus(function(){
		$(this).parents('form').addClass('focus',100);
	});
	$('#searchAll').focusout(function(){
		$(this).parents('form').removeClass('focus',100);
	});

	// tag sorting
	$('#sortTag').tokenfield({
		autocomplete: {
		source: ['웹접근성','패럴렉스 스크롤','반응형웹','제이쿼리'],
		delay: 100
	},
		showAutocompleteOnFocus: true
	})
	$('#sortTag').on('tokenfield:createtoken', function (event) {
	    var existingTokens = $(this).tokenfield('getTokens');
	    $.each(existingTokens, function(index, token) {
	        if (token.value === event.attrs.value)
	            event.preventDefault();
	    });
	});

	window.contact ={
		sendContact: sendContact
	}

});

function sendContact(){
	$.post('/contact',{
			category: $('#inpSort').val(),
			contents: $('#inpCont').val(),
			name: $('#inpName').val(),
			email: $('#inpEmail').val(),
		}).done(function(data){
		if(data.msg =='OK'){
			// input clear
			// pop up
			alert('good!!!');
		} else {
			alert('bad!!!!');
		} 
	});
}



