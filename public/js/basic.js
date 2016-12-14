// JavaScript

$(document).ready(function(){
	$('.select').selectmenu();
	$('.inp-date').datepicker();
	if($('.checkbox').length){$('.checkbox input').customInput();}
	if($('.radio').length){$('.radio input').customInput();}
	$(document).tooltip();

	// search ui
	$('#searchAll').focus(function(){
		$(this).parents('form').addClass('focus',100);
	});
	$('#searchAll').focusout(function(){
		$(this).parents('form').removeClass('focus',100);
	});

	$.get('/portfolio/tags').done(function(data){
		// tag sorting
		$('#sortTag').tokenfield({
			autocomplete: {
			source: data.tags,
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
	});
	
	window.portfolio = {
		recommend: function(name){
			$.post('/portfolio/recommend/'+name).done(data=>{
				if(data.status == 200){
					alert('추천 하였습니다!');
					location.reload();
				} else {
					alert('추천 실패');
				}	
			});
		},

	};

});