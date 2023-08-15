
var mainForm = {};

var recorderJsx = {};

mainForm.selectFolder = function() {
    var result = {};
    result.errorCode = 0;
    try {
        var psdDocs = Folder.selectDialog("选择PSD源文件...");
        if(!psdDocs) return;
        var allFiles = psdDocs.getFiles("*.psd");
        recorderJsx.sourceFiles = allFiles;

        result.psdSourceFolder = encodeURI(psdDocs.fsName);
        result.psdList = new Array();
        result.modleLayers = new Array;
        for (var i = 0; i < allFiles.length; i++) {
            var file = allFiles[i];
            var psd = {
                name: file.name,
                select: true
            };
            var doc = app.open(file, OpenDocumentType.PHOTOSHOP, false);
            if(i == 0){
                if (mainForm.tryGetLayers(doc, result.modleLayers)) {
                    result.psdList.push(psd);
                }
                continue;
            }
            doc.close(SaveOptions.DONOTSAVECHANGES);
        }
    } catch (e) {
        result.errorCode = 1;
        result.mes = e.message + " Line: " + e.line;
    }
    return JSON.stringify(result);
};

mainForm.tryGetLayers = function(doc, result) {
    for (var j = 0, len = doc.layers.length; j < len; j++) {
        var cur = doc.layers[j];
        mainForm.getChildLayers(cur, result);
    }
    if (result.length > 0) return true;
};

mainForm.getChildLayers = function(layer, result) {
    var layerInfo = {
        name: layer.name,
        typename: layer.typename,
        select: false
    };
    switch (layer.typename) {
        case "ArtLayer":
            result.push(layerInfo);
            break;
        case "LayerSet":
            layerInfo.layers = new Array();
            result.push(layerInfo);
            for (var i = 0, len = layer.layers.length; i < len; i++) {
                mainForm.getChildLayers(layer.layers[i], layerInfo.layers);
            }
            break;
    }
};

mainForm.selectCombineFile = function() {
    var result = {};
    result.errorCode = 0;
    try {
        var selectedFiles = app.openDialog();
        if (selectedFiles.length == 0) return result;

        var file = selectedFiles[0];
        result.filePath = encodeURI(file.fsName);
        var psd = app.open(file, OpenDocumentType.PHOTOSHOP, false);
        recorderJsx.combineFile = psd;

        result.layers = new Array();
        for (var i = 0; i < psd.layers.length; i++) {
            var layer = psd.layers[i];
            mainForm.getPsdLayer(layer, result.layers);
        }
    } catch (e) {
        result.errorCode = 1;
        result.mes += e.message + " Line: " + e.line;
    }
    return JSON.stringify(result);
};

mainForm.getPsdLayer = function(layer, result) {
    switch (layer.typename) {
        case "ArtLayer":
            result.push({
                name: layer.name
            });
            break;
        case "LayerSet":
            for (var i = 0, len = layer.layers.length; i < len; i++) {
                mainForm.getPsdLayer(layer.layers[i], result);
            }
            break;
    }
};

mainForm.getFileByName = function(psdFile) {
    for (var i = 0, len = recorderJsx.sourceFiles.length; i < len; i++) {
        var file = recorderJsx.sourceFiles[i]
        if (file.name == psdFile) return file;
    };
}

// var recorder = {}
// recorder.exportType
// recorder.savePath
// recorder.combinePsdData = {"layers":{"name","select"}}
// recorder.sourcePsdData = {"psdSourceFolder":"", "psdList":{"select", "name"}, "modleLayers":{"name","typename","select"}}

// 记录 一下 js传过来的 需要合并的 PSD 配置数据
var recorder = {};
var exportError = "";
// JSCallJsx
mainForm.processExport = function(jsRecorder) {
    var result = {};
    result.errorCode = 0;
    try {
        recorder = JSON.parse(jsRecorder);
        recorder.savePath = decodeURI(recorder.savePath)

        var dupCom = recorderJsx.combineFile.duplicate()
        recorderJsx.combineFile.close(SaveOptions.DONOTSAVECHANGES)
        dupCom.mergeVisibleLayers()

        var psdList = recorder.sourcePsdData.psdList
        for (var j=0, len=psdList.length; j < len ; j++) {
            var item = psdList[j]
            if(!item.select) continue;
            var file = mainForm.getFileByName(item.name)
            var doc = app.open(file, OpenDocumentType.PHOTOSHOP, false);
            var dupDoc = doc.duplicate()
            doc.close(SaveOptions.DONOTSAVECHANGES)
            mainForm.dupDocLayers2ExportFile(dupDoc, dupCom)
        };
        dupCom.close(SaveOptions.DONOTSAVECHANGES)
    } catch (e) {
        result.errorCode = 1;
        result.mes = e.message + exportError + " Line: " + e.line;
    }
    return JSON.stringify(result);
};

mainForm.dupDocLayers2ExportFile = function(dupDoc, dupCom){
    var lc = recorder.sourcePsdData.modleLayers

    app.activeDocument = dupDoc
    for (var i=lc.length - 1; i >= 0 ; i--) {
        var ld = dupDoc.layers[i]
        if(mainForm.changeSelectedLayer(dupDoc, dupCom, ld, lc[i])) break;
    };

    mainForm.SavePNG(dupDoc);
    dupDoc.close(SaveOptions.DONOTSAVECHANGES);
}

/*
    ld : psd
    lc : data
*/
mainForm.changeSelectedLayer = function(dupDoc, dupCom, ld, lc){
    if(lc.typename != ld.typename){
        throw new Error("PSD 图层结构不一致! -> PSD:" + dupDoc.name);
        return true;
    }

    if(lc.select) {
        app.activeDocument = dupCom
        app.activeDocument.selselection = dupCom.activeLayer
        app.activeDocument.selselection.copy()

        app.activeDocument = dupDoc
        var pasLayer = app.activeDocument.paste()
        pasLayer.move(ld, ElementPlacement.PLACEBEFORE)

        ld.remove();
        return true;
    }
    
    if(lc.typename == "LayerSet"){
        for (var i=0, len=lc.layers.length; i < len ; i++) {
            if(mainForm.changeSelectedLayer(dupDoc, dupCom, ld.layers[i], lc.layers[i])) return true;
        };
    }
    return false;
}

mainForm.dupLayers = function(newDocName){
    var desc15 = new ActionDescriptor();
    var ref9 = new ActionReference();
    ref9.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc15.putReference( charIDToTypeID('null'), ref9 );
    var ref10 = new ActionReference();
    ref10.putName( charIDToTypeID('Dcmn'), newDocName);
    desc15.putReference( charIDToTypeID('T   '), ref10 );
    desc15.putInteger( charIDToTypeID('Vrsn'), 5 );
    executeAction( charIDToTypeID('Dplc'), desc15, DialogModes.NO );
};

mainForm.SavePNG = function(dupDoc){

    app.activeDocument = dupDoc
    var folder = decodeURI(recorder.savePath)
    if(!recorder.savePath || typeof(recorder.savePath) == "undefined"){
        var rotPath = Folder.selectDialog("选择保存路径...");
        recorder.savePath = rotPath.fsName
        folder = recorder.savePath
    }
    var saveFile = File(folder + "/" + dupDoc.name + ".png");
    
    // pngSaveOptions = new PNGSaveOptions();
    // pngSaveOptions.compression = 9;
    // app.activeDocument = op.firstFile
    // op.firstFile.saveAs(pngFile, pngSaveOptions, true, Extension.LOWERCASE)

    var pngOpts = new ExportOptionsSaveForWeb; 
    pngOpts.format = SaveDocumentType.PNG
    pngOpts.PNG8 = false; 
    pngOpts.transparency = true; 
    pngOpts.interlaced = false; 
    pngOpts.quality = 100;
    app.activeDocument.exportDocument(new File(saveFile), ExportType.SAVEFORWEB, pngOpts);
}

// 测试方法
function Test() {
    try {
        var op = {}
        var psdDocs = Folder.selectDialog("选择PSD源文件...");
        var c = psdDocs.fsName
        // op.firstFile = selectPsdFile();
        // //op.secondFile = selectPsdFile();
        // var width = op.firstFile.width
        // var height = op.firstFile.height
        //op.newDoc = app.documents.add(width, height, op.firstFile.resolution, 'CombineDoc', NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
        
        // app.activeDocument = op.firstFile
        // for (var i=op.firstFile.layers.length - 1; i >= 0 ; i--) {
        //     var l = op.firstFile.layers[i]
        //     op.firstFile.activeLayer = l
        //     op.firstFile.selection = l
        //     op.firstFile.selection.copy()
        //     mainForm.dupLayers(op.newDoc.name)
        // };

        // var folder = Folder.selectDialog("选择保存路径...");
        // pngFile = File(folder + "/" + op.newDoc.name + ".png"); 
        // if(pngFile.exists) pngFile.remove();
        // // save the PNG
        // pngSaveOptions = new PNGSaveOptions();
        // pngSaveOptions.compression = 9;
        // app.activeDocument = op.firstFile
        // op.firstFile.saveAs(pngFile, pngSaveOptions, true, Extension.LOWERCASE)

        //mainForm.exportSelectPsd(op.newDoc)

    } catch (e) {
        var eos = e
        var err = e.message
        var c = e.line
    }

}

function selectPsdFile() {
    try {
        var selectedFiles = app.openDialog();
        if (selectedFiles.length == 0) return null;

        var file = selectedFiles[0];
        var psd = app.open(file, OpenDocumentType.PHOTOSHOP, false);
        return psd
    } catch (e) {
        return e
    }
}
//Test();