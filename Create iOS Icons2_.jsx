// Photoshop Script to Create iPhone Icons from iTunesArtwork
//
// WARNING!!! In the rare case that there are name collisions, this script will
// overwrite (delete perminently) files in the same folder in which the selected
// iTunesArtwork file is located. Therefore, to be safe, before running the
// script, it's best to make sure the selected iTuensArtwork file is the only
// file in its containing folder.
//
// Copyright (c) 2010 Matt Di Pasquale
// Added tweaks Copyright (c) 2012 by Josh Jones http://www.appsbynight.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// Prerequisite:
// First, create at least a 1024x1024 px PNG file according to:
// http://developer.apple.com/library/ios/#documentation/iphone/conceptual/iphoneosprogrammingguide/BuildTimeConfiguration/BuildTimeConfiguration.html
//
// Install - Save Create Icons.jsx to:
//   Win: C:\Program Files\Adobe\Adobe Utilities\ExtendScript Toolkit CS5\SDK
//   Mac: /Applications/Utilities/Adobe Utilities/ExtendScript Toolkit CS5/SDK
// * Restart Photoshop
//
// Update:
// * Just modify & save, no need to resart Photoshop once it's installed.
//
// Run:
// * With Photoshop open, select File > Scripts > Create Icons
// * When prompted select the prepared iTunesArtwork file for your app.
// * The different version of the icons will get saved to the same folder that
//   the iTunesArtwork file is in.
//
// Adobe Photoshop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html


// Turn debugger on. 0 is off.
// $.level = 1;

try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width < 1024)
    {
        throw "Image width is too small!  Image width must be at least 1024 pixels.";
    }
    
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata
    
	if(doc.height < 1024)
	{
		var icons = [

        // {"name": "iTunesArtwork@2x", "size":1024},
        // {"name": "iTunesArtwork",    "size":512},

		    {"name": "logo_60x45",        "width":60,"height":45},
        {"name": "logo_60x45@2x",        "width":120,"height":90},
        {"name": "logo_60x45@3x",        "width":180,"height":135},

        {"name": "logo_67x50",        "width":67,"height":50},
        {"name": "logo_67x50@2x",        "width":134,"height":100},
        {"name": "logo_67x50@3x",        "width":201,"height":150},

        {"name": "logo_74x55",        "width":74,"height":55},
        {"name": "logo_74x55@2x",        "width":148,"height":110},
        {"name": "logo_74x55@3x",        "width":222,"height":165},

        {"name": "logo_27x20",        "width":27,"height":20},
        {"name": "logo_27x20@2x",        "width":54,"height":40},
        {"name": "logo_27x20@3x",        "width":81,"height":60},

        {"name": "logo_32x24",        "width":32,"height":24},
        {"name": "logo_32x24@2x",        "width":64,"height":48},
        {"name": "logo_32x24@3x",        "width":96,"height":72},
    ];
	}
	else
	{
		var icons = [

        // {"name": "iTunesArtwork@2x", "size":1024},
        // {"name": "iTunesArtwork",    "size":512},

        {"name": "logo_29",         "width":29,"height":29},
        {"name": "logo_1024",         "width":1024,"height":1024},
        {"name": "logo_512",         "width":512,"height":512},
        {"name": "logo_40@2x",         "width":40,"height":40},
        {"name": "logo_60@3x",         "width":60,"height":60},
        {"name": "logo_57",         "width":57,"height":57},
        {"name": "logo_58",         "width":58,"height":58},
        {"name": "logo_80",         "width":80,"height":80},
        {"name": "logo_87",         "width":87,"height":87},
        {"name": "logo_114",        "width":114,"height":114},
        {"name": "logo_120",        "width":120,"height":120},
        {"name": "logo_120-1",      "width":120,"height":120},
        {"name": "logo_180",        "width":180,"height":180},

        {"name": "logo_48",         "width":48,"height":48},
        {"name": "logo_72",         "width":72,"height":72},
        {"name": "logo_96",         "width":96,"height":96},
        {"name": "logo_128",        "width":128,"height":128}
    ];
	}
	
    

    var icon;
    for (i = 0; i < icons.length; i++)
    {
      icon = icons[i];
      doc.resizeImage(icon.width, icon.height, // width, height
                      null, ResampleMethod.BICUBICSHARPER);

      var destFileName = icon.name + ".png";

      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }

      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("iOS Icons created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}