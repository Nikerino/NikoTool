const draggables = document.querySelectorAll( ".draggable" );
const container = document.querySelector( ".draggable-container" );

draggables.forEach( draggable => {

	draggable.addEventListener( "dragstart", () => {
		draggable.classList.add( "dragging" );
	} )

	draggable.addEventListener( "dragend", () => {
		draggable.classList.remove( "dragging" );
	} )

} )

container.addEventListener( "dragover", e => {

	e.preventDefault();

	const nextElement = getElementAfterCursor( e.clientY );
	const dragging = document.querySelector( ".dragging" );
	
	if ( nextElement == null ) {
		container.appendChild( dragging );
	}
	else {
		container.insertBefore( dragging, nextElement );
	}

} )

function getElementAfterCursor( y ) {

	const draggableElements = container.querySelectorAll( ".draggable:not(.dragging)" );

	let closest_element = document.querySelector( "dragging" );
	let closest_offset = Number.NEGATIVE_INFINITY;

	draggableElements.forEach( element => {

		let box = element.getBoundingClientRect();
		let offset = y - box.top - box.height / 2

		if ( offset < 0 ) {
			if ( offset > closest_offset ) {
				closest_element = element;
				closest_offset = offset;
			}
		}

	} )

	return closest_element;

}