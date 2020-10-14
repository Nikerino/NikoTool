// Niko Nikolopoulos
// Personal planner application

const lists = new Map();
let selectedList;

function loadList( list ) {

	// Set title of list
	$( ".contents-head" ).html( list.name );

	// Clear contents initially
	$( ".contents-list" ).html( "" );

	// Add each item to list contents
	list.items.forEach( item => { addToListContents( item ); } );

	initEventListeners();

}

function selectList( list ) {

	// If this object is already selected then return... these users I'm tellin ya
	if ( list.hasClass( "selected-list" ) ) { return; }

	// Remove selected list from currently selected and add to new one
	$( ".selected-list" ).removeClass( "selected-list" );
	list.addClass( "selected-list" );

	// Set global selected list to new list
	selectedList = lists.get( list.attr( "name" ) );

	// Visually load list
	loadList( selectedList );
}

function createList( listName ) {

	//  create a new list object
	let newList = new List( listName );

	// If the list exists or the name is empty, just return... dumb users
	if ( lists.has( listName ) || listName.normalize() == "" ) { return; }

	// Add list to map of lists
	lists.set( listName, newList );

	// Visually add list to menu
	addToListMenu( listName );

	// Add all the necessary event listeners
	initEventListeners();

	// Reset input box for list name
	$( ".lists-add" ).val( "" );

}

function removeList( list ) {

	// Delete list from map of lists
	lists.delete( list.attr( "name" ) );

	// Visually delete list
	list.remove();

	// Select the default list
	selectList( $( ".default-list" ) );

}

function editList( list ) {
	
}

function createListItem( itemName ) {

	// Check if item is empty
	if ( itemName.normalize() == "" ) { return; }

	// Adds item to items set in selected list
	selectedList.items.add( itemName );

	// Visually add item to list contents
	addToListContents( itemName );

	// Add all the necessary event listeners
	initEventListeners();

	// Reset input box for item name
	$( ".list-item-add" ).val( "" );

}

function removeListItem( listItem ) {

	// Delete item from list's set
	selectedList.items.delete( listItem.attr( "name" ) );

	// Visually delete item from list content
	listItem.remove();

}

function editListItem( listItem ) {

}

function addToListMenu( listName ) {
	$( `
		<div class="list" name="${listName}">
			<span class="list-text">&nbsp ${listName}</span>
			<span class="list-edit">&#x2710</span>
			<span class="list-delete">&#x2716</span>
		</div>
		` ).appendTo( ".lists" );
}

function addToListContents( itemName ) {
	$( `
		<div class="list-item draggable" draggable="true" name="${itemName}">
			<span class="list-item-prefix">&#x27A4</span>
			<span class="list-item-text">${itemName}</span>
			<span class="list-item-edit">&#x2710</span>
			<span class="list-item-delete">&#x2716</span>
		</div>
		` ).appendTo( ".contents-list" );
}

function initEventListeners() {

	// Select list
	$( ".list" ).on( "click", function() {
		selectList( $( this ) );
	} );

	// Add list
	$( ".lists-add-button" ).on( "click", function () {
		createList( $( ".lists-add" ).val() );
	} );

	// Delete list
	$( ".list-delete" ).on( "click", function() {
		removeList( $( this ).parent() )
	} );

	// Edit list
	$( ".list-edit" ).on( "click", function() {
		editList( $( this ).parent() );
	} );

	// On text change
	$( ".list-text" ).on( "input", function() {

	} )

	// Add list item
	$( ".list-item-add-button" ).on( "click", function() {
		createListItem( $( ".list-item-add" ).val() );
	} );
	
	// Delete List item
	$( ".list-item-delete" ).on( "click", function() {
		removeListItem( $( this ).parent() );
	} );

	// Edit list item
	$( ".list-item-edit" ).on( "click", function() {
		editListItem( $( this ).parent() );
	} );

	// On text change
	$( ".list-item-text" ).on( "input", function() {
		
	} )

	// make elements draggable
	const draggables = document.querySelectorAll( ".draggable" );
	draggables.forEach( draggable => {
		draggable.addEventListener( "dragstart", () => { draggable.classList.add( "dragging" ); } )
		draggable.addEventListener( "dragend", () => { draggable.classList.remove( "dragging" ); } )
	} )

}

class List {

	constructor( name ) {
		this.name = name;
		this.items = new Set();
	}

}

$(document).ready( function() {

	// Setup To-Do List that cannot be deleted
	let name = "To-Do List"
	let newList = new List( name );

	// Add this list to the map of lists
	lists.set( name, newList );

	// Visually add this list to the menu
	$( `
		<div class="list default-list" name="${name}">
			<span class="list-text">&nbsp ${name}</span>
		</div>
		` ).appendTo( ".lists" );

	// Make Selected
	$( ".default-list" ).addClass( "selected-list" );
	selectedList = newList;

	// Load this list
	loadList( newList );

	// setup event listenes
	initEventListeners();

} )