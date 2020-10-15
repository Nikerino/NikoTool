// Niko Nikolopoulos
// Personal planner application

let lists = new Map();
let selectedList;
let itemEditing;

const defaultListName = "To-Do List";

function loadList( list ) {

	// Set title of list
	$( ".list-title" ).html( list.name );

	// Add edit and delete buttons depending on list
	if ( list.name.normalize() == defaultListName.normalize() ) {
		$( ".list-delete" ).css( "display", "none" );
		$( ".list-edit" ).css( "display", "none" );
	}
	else {
		$( ".list-delete" ).css( "display", "initial" );
		$( ".list-edit" ).css( "display", "initial" );
	}

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
	selectedList = lists.get( list.attr( "id" ) );

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

	selectList( $( `#${listName}` ) );

}

function removeList( list ) {

	// Delete list from map of lists
	lists.delete( list.attr( "id" ) );

	// Visually delete list
	list.remove();

	// Select the default list
	selectList( $( ".default-list" ) );

}

function editList() {

	// get old name and new name
	let oldName = selectedList.name;
	let newName = $( ".edit-modal" ).find( "input" ).val();

	// if name already exists or is empty, just return... damn users
	if ( oldName.normalize() == newName.normalize() || lists.has( newName ) || newName == "" ) { return; }

	// reset modal and make it go away
	$( ".edit-modal input" ).val( "" );
	$( ".edit-modal" ).modal( "hide" );

	// make a temporary map that will become our lists variable
	let tempMap = new Map();
	for ( let [key, value] of lists.entries() ) { // iterate through entries and replace old one with new one
		if ( key.normalize() == oldName.normalize() ) {
			value.name = newName;
			tempMap.set( newName, value );
			continue;
		}
		tempMap.set( key, value );
	} // this keeps lists in proper order

	lists = tempMap; // assign to global

	// set properties for current list
	let currList = $( `#${oldName}` );
	currList.attr( "id", newName );
	currList.find( ".list-text" ).html( `&nbsp ${newName}` );

	// load list into content view
	loadList( selectedList );

}

function createListItem( itemName ) {

	// Check if item is empty
	if ( selectedList.items.has( itemName ) || itemName.normalize() == "" ) { return; }

	// Adds item to items set in selected list
	selectedList.items.add( itemName );

	// Load current list with new item
	loadList( selectedList );

	// Reset input box for item name
	$( ".list-item-add" ).val( "" );

}

function removeListItem( listItem ) {

	// Delete item from list's set
	selectedList.items.delete( listItem.attr( "id" ) );

	// Visually delete item from list content
	listItem.remove();

}

function editListItem() {

	// get old name and new name
	let oldName = itemEditing.attr( "id" );
	let newName = $( ".edit-modal" ).find( "input" ).val();

	// if name already exists or is empty, just return... damn users
	if ( oldName.normalize() == newName.normalize() || lists.has( newName ) || newName == "" ) { return; }

	// reset modal and make it go away
	$( ".edit-modal input" ).val( "" );
	$( ".edit-modal" ).modal( "hide" );

	// make a temporary map that will become our lists variable
	let tempSet = new Set();
	selectedList.items.forEach( item => { // iterate through items and replace old one with new one
		if ( item.normalize() == oldName.normalize() ) {
			tempSet.add( newName );
			return;
		}
		tempSet.add( item );
	} )// this keeps items in proper order

	// assign to items of list
	selectedList.items = tempSet; 

	// set id attr for this item
	itemEditing.attr( "id", newName );

	// load the list with item now changed
	loadList( selectedList );

}

function orderSet( movedItem ) {

	// temp set will become main items set for selected list
	let tempSet = new Set();

	// add items to set in visual order
	movedItem.parent().children().each( function() {
		tempSet.add( $( this ).attr( "id" ) );
	} );

	// assign new set to items of selected list
	selectedList.items = tempSet;

}

function addToListMenu( listName ) {
	$( `
		<div class="list" id="${listName}">
			<span class="list-prefix">&#9776</span>
			<span class="list-text">&nbsp ${listName}</span>
		</div>
		` ).appendTo( ".lists" );
}

function addToListContents( itemName ) {
	$( `
		<div class="list-item draggable" draggable="true" id="${itemName}">
			<span class="list-item-prefix">&#x27A4</span>
			<span class="list-item-text">${itemName}</span>
			<span class="list-item-edit" data-toggle="modal" data-target=".edit-modal">&#x270E</span>
			<span class="list-item-delete">&#x2716</span>
		</div>
		` ).appendTo( ".contents-list" );
}

function initEventListeners() {

	// Select list
	$( ".list" ).off().on( "click", function() {
		selectList( $( this ) );
	} );

	// Add list
	$( ".lists-add-button" ).off().on( "click", function () {
		createList( $( ".lists-add" ).val() );
	} );

	// Delete list
	$( ".btn-delete-list" ).off().on( "click", function() {
		removeList( $( `#${selectedList.name}` ) );
	} );

	// For delete modal, sets header to include name of list to be deleted
	$( ".list-delete" ).off().on( "click", function() {
		$( ".delete-modal" ).find( ".modal-title" ).html( `Are you sure you want to delete list "${selectedList.name}"?` );
	} );

	// Edit list
	$( ".list-edit" ).off().on( "click", function() {
		itemEditing = $( `#${selectedList.name}` )
	} );

	$( ".btn-edit-save" ).off().on( "click", function() {
		if ( itemEditing.hasClass( "list" ) ) { editList(); }
		else { editListItem(); }
	} )

	// Add list item
	$( ".list-item-add-button" ).off().on( "click", function() {
		createListItem( $( ".list-item-add" ).val() );
	} );
	
	// Delete List item
	$( ".list-item-delete" ).off().on( "click", function() {
		removeListItem( $( this ).parent() );
	} );

	// Edit list item
	$( ".list-item-edit" ).off().on( "click", function() {
		itemEditing = $( this ).parent();
	} );

	// make elements draggable
	/*
	const draggables = document.querySelectorAll( ".draggable" );
	draggables.forEach( draggable => {
		draggable.addEventListener( "dragstart", () => { draggable.classList.add( "dragging" ); } )
		draggable.addEventListener( "dragend", () => { draggable.classList.remove( "dragging" ); } )
	} )*/

	$( ".draggable" ).on( "dragstart", function() { $( this ).addClass( "dragging" ); } )
	$( ".draggable" ).on( "dragend", function() { $( this ).removeClass( "dragging" ); orderSet( $( this ) ); } )

}

class List {

	constructor( name ) {
		this.name = name;
		this.items = new Set();
	}

}

$(document).ready( function() {

	// Setup To-Do List that cannot be deleted
	let newList = new List( defaultListName );

	// Add this list to the map of lists
	lists.set( defaultListName, newList );

	// Visually add this list to the menu
	$( `
		<div class="list default-list" id="${defaultListName}">
			<span class="list-prefix">&#9776</span>
			<span class="list-text">&nbsp ${defaultListName}</span>
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