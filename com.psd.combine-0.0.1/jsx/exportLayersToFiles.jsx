﻿// enable double clicking from the Macintosh Finder or the Windows Explorer

#target photoshop

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details

$.localize = true;

// the drop down list indexes for file type

var jpegIndex = 1;
var png8Index = 2;
var png24Index = 3;

var exportHeader = {
    psdName: '',
    psdWidth: 0,
    psdHeight: 0,
    extension: '',
    prefix: '',
    outDir: ''
};

///////////////////////////////////////////////////////////////////////////////

// Function: initExportInfo

// Usage: create our default parameters

// Input: a new Object

// Return: a new object with params set to default

///////////////////////////////////////////////////////////////////////////////

function initExportInfo(exportInfo) {

    exportInfo.destination = new String("");

    exportInfo.fileNamePrefix = new String("untitled_");

    exportInfo.visibleOnly = false;

    exportInfo.fileType = png24Index;

    exportInfo.icc = true;

    exportInfo.jpegQuality = 8;

    exportInfo.psdMaxComp = true;

    exportInfo.tiffCompression = TIFFEncoding.NONE;

    exportInfo.tiffJpegQuality = 8;

    exportInfo.pdfEncoding = PDFEncoding.JPEG;

    exportInfo.pdfJpegQuality = 8;

    exportInfo.targaDepth = TargaBitsPerPixels.TWENTYFOUR;

    exportInfo.bmpDepth = BMPDepthType.TWENTYFOUR;

    exportInfo.png24Transparency = true;

    exportInfo.png24Interlaced = false;

    exportInfo.png24Trim = true;

    exportInfo.png8Transparency = true;

    exportInfo.png8Interlaced = false;

    exportInfo.png8Trim = true;



    try {

        exportInfo.destination = Folder(app.activeDocument.fullName.parent).fsName; // destination folder

        var tmp = app.activeDocument.fullName.name;

        exportInfo.fileNamePrefix = decodeURI(tmp.substring(0, tmp.indexOf("."))); // filename body part

    } catch (someError) {

        exportInfo.destination = new String("");

        exportInfo.fileNamePrefix = app.activeDocument.name; // filename body part

    }

}


///////////////////////////////////////////////////////////////////////////////

// Function: saveFile

// Usage: the worker routine, take our params and save the file accordingly

// Input: reference to the document, the name of the output file, 

//        export info object containing more information

// Return: <none>, a file on disk

///////////////////////////////////////////////////////////////////////////////

function saveFile(docRef, fileNameBody, exportInfo) {

    switch (exportInfo.fileType) {

        case jpegIndex:

            docRef.bitsPerChannel = BitsPerChannelType.EIGHT;
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".jpg");
            jpgSaveOptions = new JPEGSaveOptions();
            jpgSaveOptions.embedColorProfile = exportInfo.icc;
            jpgSaveOptions.quality = exportInfo.jpegQuality;
            docRef.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);

            break;
        case png8Index:

            var id5 = charIDToTypeID("Expr");
            var desc3 = new ActionDescriptor();
            var id6 = charIDToTypeID("Usng");
            var desc4 = new ActionDescriptor();
            var id7 = charIDToTypeID("Op  ");
            var id8 = charIDToTypeID("SWOp");
            var id9 = charIDToTypeID("OpSa");
            desc4.putEnumerated(id7, id8, id9);
            var id10 = charIDToTypeID("Fmt ");
            var id11 = charIDToTypeID("IRFm");
            var id12 = charIDToTypeID("PNG8");
            desc4.putEnumerated(id10, id11, id12);
            var id13 = charIDToTypeID("Intr"); //Interlaced
            desc4.putBoolean(id13, exportInfo.png8Interlaced);
            var id14 = charIDToTypeID("RedA");
            var id15 = charIDToTypeID("IRRd");
            var id16 = charIDToTypeID("Prcp"); //Algorithm
            desc4.putEnumerated(id14, id15, id16);
            var id17 = charIDToTypeID("RChT");
            desc4.putBoolean(id17, false);
            var id18 = charIDToTypeID("RChV");
            desc4.putBoolean(id18, false);
            var id19 = charIDToTypeID("AuRd");
            desc4.putBoolean(id19, false);
            var id20 = charIDToTypeID("NCol"); //NO. Of Colors
            desc4.putInteger(id20, 256);
            var id21 = charIDToTypeID("Dthr"); //Dither
            var id22 = charIDToTypeID("IRDt");
            var id23 = charIDToTypeID("Dfsn"); //Dither type
            desc4.putEnumerated(id21, id22, id23);
            var id24 = charIDToTypeID("DthA");
            desc4.putInteger(id24, 100);
            var id25 = charIDToTypeID("DChS");
            desc4.putInteger(id25, 0);
            var id26 = charIDToTypeID("DCUI");
            desc4.putInteger(id26, 0);
            var id27 = charIDToTypeID("DChT");
            desc4.putBoolean(id27, false);
            var id28 = charIDToTypeID("DChV");
            desc4.putBoolean(id28, false);
            var id29 = charIDToTypeID("WebS");
            desc4.putInteger(id29, 0);
            var id30 = charIDToTypeID("TDth"); //transparency dither
            var id31 = charIDToTypeID("IRDt");
            var id32 = charIDToTypeID("None");
            desc4.putEnumerated(id30, id31, id32);
            var id33 = charIDToTypeID("TDtA");
            desc4.putInteger(id33, 100);
            var id34 = charIDToTypeID("Trns"); //Transparency
            desc4.putBoolean(id34, exportInfo.png8Transparency);
            var id35 = charIDToTypeID("Mtt ");
            desc4.putBoolean(id35, true); //matte
            var id36 = charIDToTypeID("MttR"); //matte color
            desc4.putInteger(id36, 255);
            var id37 = charIDToTypeID("MttG");
            desc4.putInteger(id37, 255);
            var id38 = charIDToTypeID("MttB");
            desc4.putInteger(id38, 255);
            var id39 = charIDToTypeID("SHTM");
            desc4.putBoolean(id39, false);
            var id40 = charIDToTypeID("SImg");
            desc4.putBoolean(id40, true);
            var id41 = charIDToTypeID("SSSO");
            desc4.putBoolean(id41, false);
            var id42 = charIDToTypeID("SSLt");
            var list1 = new ActionList();
            desc4.putList(id42, list1);
            var id43 = charIDToTypeID("DIDr");
            desc4.putBoolean(id43, false);
            var id44 = charIDToTypeID("In  ");
            desc4.putPath(id44, new File(exportInfo.destination + "/" + fileNameBody + ".png"));
            var id45 = stringIDToTypeID("SaveForWeb");
            desc3.putObject(id6, id45, desc4);
            executeAction(id5, desc3, DialogModes.NO);
            break;

        case png24Index:

            var id6 = charIDToTypeID("Expr");
            var desc3 = new ActionDescriptor();
            var id7 = charIDToTypeID("Usng");
            var desc4 = new ActionDescriptor();
            var id8 = charIDToTypeID("Op  ");
            var id9 = charIDToTypeID("SWOp");
            var id10 = charIDToTypeID("OpSa");
            desc4.putEnumerated(id8, id9, id10);
            var id11 = charIDToTypeID("Fmt ");
            var id12 = charIDToTypeID("IRFm");
            var id13 = charIDToTypeID("PN24");
            desc4.putEnumerated(id11, id12, id13);
            var id14 = charIDToTypeID("Intr");
            desc4.putBoolean(id14, exportInfo.png24Interlaced);
            var id15 = charIDToTypeID("Trns");
            desc4.putBoolean(id15, exportInfo.png24Transparency);
            var id16 = charIDToTypeID("Mtt ");
            desc4.putBoolean(id16, true);
            var id17 = charIDToTypeID("MttR");
            desc4.putInteger(id17, 255);
            var id18 = charIDToTypeID("MttG");
            desc4.putInteger(id18, 255);
            var id19 = charIDToTypeID("MttB");
            desc4.putInteger(id19, 255);
            var id20 = charIDToTypeID("SHTM");
            desc4.putBoolean(id20, false);
            var id21 = charIDToTypeID("SImg");
            desc4.putBoolean(id21, true);
            var id22 = charIDToTypeID("SSSO");
            desc4.putBoolean(id22, false);
            var id23 = charIDToTypeID("SSLt");
            var list1 = new ActionList();
            desc4.putList(id23, list1);
            var id24 = charIDToTypeID("DIDr");
            desc4.putBoolean(id24, false);
            var id25 = charIDToTypeID("In  ");
            desc4.putPath(id25, new File(exportInfo.destination + "/" + fileNameBody + ".png"));
            var id26 = stringIDToTypeID("SaveForWeb");
            desc3.putObject(id7, id26, desc4);
            executeAction(id6, desc3, DialogModes.NO);
            break;

        default:

            if (DialogModes.NO != app.playbackDisplayDialogs) {

                alert("Failure...");

            }

            break;

    }

}

///////////////////////////////////////////////////////////////////////////////

// Function: setInvisibleAllArtLayers

// Usage: unlock and make invisible all art layers, recursively

// Input: document or layerset

// Return: all art layers are unlocked and invisible

///////////////////////////////////////////////////////////////////////////////

function setInvisibleAllArtLayers(obj) {

    for (var i = 0; i < obj.artLayers.length; i++) {

        obj.artLayers[i].allLocked = false;

        obj.artLayers[i].visible = false;

    }

    for (var i = 0; i < obj.layerSets.length; i++) {

        setInvisibleAllArtLayers(obj.layerSets[i]);

    }

}

///////////////////////////////////////////////////////////////////////////////

// Function: removeAllInvisibleArtLayers

// Usage: remove all the invisible art layers, recursively

// Input: document or layer set

// Return: <none>, all layers that were invisible are now gone

///////////////////////////////////////////////////////////////////////////////

function removeAllInvisibleArtLayers(obj) {

    for (var i = obj.artLayers.length - 1; 0 <= i; i--) {

        if (!obj.artLayers[i].visible) {

            obj.artLayers[i].remove();

        }

    }

    for (var i = obj.layerSets.length - 1; 0 <= i; i--) {

        removeAllInvisibleArtLayers(obj.layerSets[i]);

    }

}

///////////////////////////////////////////////////////////////////////////////

// Function: removeAllEmptyLayerSets

// Usage: find all empty layer sets and remove them, recursively

// Input: document or layer set

// Return: empty layer sets are now gone

///////////////////////////////////////////////////////////////////////////////

function removeAllEmptyLayerSets(obj) {

    var foundEmpty = true;

    for (var i = obj.layerSets.length - 1; 0 <= i; i--) {

        if (removeAllEmptyLayerSets(obj.layerSets[i])) {

            obj.layerSets[i].remove();

        } else {

            foundEmpty = false;

        }

    }

    if (obj.artLayers.length > 0) {

        foundEmpty = false;

    }

    return foundEmpty;

}

///////////////////////////////////////////////////////////////////////////////

// Function: exportChildren

// Usage: find all the children in this document to save

// Input: duplicate document, original document, export info,

//        reference to document, starting file name

// Return: <none>, documents are saved accordingly

///////////////////////////////////////////////////////////////////////////////

/**
 * Function: ungroupLayerSet
 *   Usage: ungroup a layerSet
 *   Input: <none>
 *   Return: <none> layerSet has been ungrouped
 */
function ungroupLayerSet() {

    var desc = new ActionDescriptor(),
        ref = new ActionReference();

    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref);
    try {

        executeAction(stringIDToTypeID("ungroupLayersEvent"), desc, DialogModes.NO);

    } catch (e) {}
}

/**
 * Function: ungroupAllLayerSets
 *   Usage: ungroup all layerSets
 *   Input: duplicate document
 *   Return: <none>, layerSets have been ungrouped
 */
function ungroupAllLayerSets(wrkDoc) {

    var setLen = wrkDoc.layerSets.length,
        idx = setLen - 1;

    while (setLen) {

        wrkDoc.activeLayer = wrkDoc.layerSets[idx];
        ungroupLayerSet();
        setLen = wrkDoc.layerSets.length;
        idx = setLen - 1;
    }
}

/**
 * Function: catLeftZeros
 *   Usage: return a string padded to fixed length
 *   Input: number to convert, length
 *   Return: string padded to length
 */
function catLeftZeros(num, len) {

    var str = num.toString();

    if (str.length < len) {
        while (str.length < len) {
            str = '0' + str;
        }
    }
    return str;
}


function exportChildren(dupObj, orgObj, exportInfo, dupDocRef, fileNamePrefix) {

    for (var i = 0; i < dupObj.artLayers.length; i++) {

        if (exportInfo.visibleOnly) { // visible layer only

            if (!orgObj.artLayers[i].visible) {

                continue;

            }

        }

        // we need all the parents visible as well

        var allParents = dupObj.artLayers[i].parent;

        var actualDocument = null; // and the document to activate the target layer

        while (allParents) {

            if (allParents.typename == "Document") {

                actualDocument = allParents;

                allParents = undefined;

                continue;

            }

            allParents.visible = true;

            allParents = allParents.parent;

        }

        // this will make the layer visible as well

        actualDocument.activeLayer = dupObj.artLayers[i];

        var layerName = dupObj.artLayers[i].name; // store layer name before change doc

        var duppedDocumentTmp = dupDocRef.duplicate();

        if ((psdIndex == exportInfo.fileType) || (png24Index == exportInfo.fileType) || (png8Index == exportInfo.fileType)) { // PSD: Keep transparency

            removeAllInvisible(duppedDocumentTmp);

            //PNGFileOptions

            if ((png24Index == exportInfo.fileType) || (png8Index == exportInfo.fileType)) { // PNGFileOptions

                if ((exportInfo.png8Trim == true) && (png8Index == exportInfo.fileType)) { //transparancy checked?

                    if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
                        app.activeDocument.trim(TrimType.TRANSPARENT);
                    }
                }

                if ((exportInfo.png24Trim == true) && (png24Index == exportInfo.fileType)) { //transparancy checked?
                    if (activeDocument.activeLayer.isBackgroundLayer == false) { //is it anything but a background layer?
                        app.activeDocument.trim(TrimType.TRANSPARENT);
                    }
                }

            }

        } else { // just flatten

            duppedDocumentTmp.flatten();

        }

        var fileNameBody = fileNamePrefix;

        fileNameBody += "_" + zeroSuppress(i, 4);

        fileNameBody += "_" + layerName;

        fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|]/g, "_"); // '/\:*?"<>|' -> '_'
        fileNameBody = fileNameBody.replace(' ', '')

        if (fileNameBody.length > 120) {

            fileNameBody = fileNameBody.substring(0, 120);

        }

        saveFile(duppedDocumentTmp, fileNameBody, exportInfo);

        duppedDocumentTmp.close(SaveOptions.DONOTSAVECHANGES);

        dupObj.artLayers[i].visible = false;

    }

    for (var i = 0; i < dupObj.layerSets.length; i++) {

        if (exportInfo.visibleOnly) { // visible layer only

            if (!orgObj.layerSets[i].visible) {

                continue;

            }

        }

        var fileNameBody = fileNamePrefix;

        fileNameBody += "_" + zeroSuppress(i, 4) + "s";

        exportChildren(dupObj.layerSets[i], orgObj.layerSets[i], exportInfo, dupDocRef, fileNameBody); // recursive call

    }

}

// End Export Layers To Files.jsx