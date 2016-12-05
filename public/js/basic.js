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

	// tag auto complete
	var availableTags = [
		"웹접근성",
		"반응형웹",
		"모바일웹",
		"패럴렉스 스크롤"
	];
    function split( val ) {
      return val.split( /,\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
 
	$( "#sortTag" )
		// don't navigate away from the field on tab when selecting an item
		.on( "keydown", function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB &&
		    $( this ).autocomplete( "instance" ).menu.active ) {
		  event.preventDefault();
		}
		})
		.autocomplete({
		minLength: 0,
		source: function( request, response ) {
		  // delegate back to autocomplete, but extract the last term
		  response( $.ui.autocomplete.filter(
		    availableTags, extractLast( request.term ) ) );
		},
		focus: function() {
		  // prevent value inserted on focus
		  return false;
		},
		select: function( event, ui ) {
		  var terms = split( this.value );
		  // remove the current input
		  terms.pop();
		  // add the selected item
		  terms.push( ui.item.value );
		  // add placeholder to get the comma-and-space at the end
		  terms.push( "" );
		  this.value = terms.join( ", " );
		  return false;
		}
	});
});