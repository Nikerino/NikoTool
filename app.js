// Niko Nikolopoulos
// Personal planner application

function loadList( list ) {

	
		
}

// change selected list
$( ".list" ).on( "click", function() {

	// If this object is already selected... return
	if ( $( this ).hasClass( "selected-list" ) ) { return; }

	// remove selected list from currently selected and add to new one
	$( ".selected-list" ).removeClass( "selected-list" );
	$( this ).addClass( "selected-list" );

} )  