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

	$.get('/portfolio/tags').done(function(data){
		// tag sorting
		$('#portfolioTag').tokenfield({
			autocomplete: {
			source: data.tags,
			delay: 100
		},
			showAutocompleteOnFocus: true
		})
		$('#portfolioTag').on('tokenfield:createtoken', function (event) {
		    var existingTokens = $(this).tokenfield('getTokens');
		    $.each(existingTokens, function(index, token) {
		        if (token.value === event.attrs.value)
		            event.preventDefault();
		    });
		});
	});

});
