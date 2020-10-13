const url = require( "url" );
const path = require( "path" );
const { app, BrowserWindow } = require( "electron" );

let win; // Allows window to open and stay

function createWindow() {

    // Create new browser window
    win = new BrowserWindow( { 
        width: 1400,
        height: 850,
        webPreferences: {nodeIntegration: false}
    } );

    // Load index.html
    win.loadFile( "./index.html" );

    // Remove default menubar
    win.setMenu( null );

    // Open devtools
    win.webContents.openDevTools()

    // Close window
    win.on( "closed", function() {
        win = null;
    } );

}

// Run create window function
app.on( "ready", createWindow );

// Quit when all windows are closed
app.on( "window-all-closed", () => {
    if ( process.platform !== "darwin" ) { app.quit(); }
} );


