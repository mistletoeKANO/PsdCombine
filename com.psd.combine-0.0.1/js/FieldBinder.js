
var FieldBinder = {}

// 运行时 绑定 HTML 标签
var runtimeElement = {}
// 运行时 数据
var runtimeField = {}
// 运行时记录的 操作数据
var recorder = {}

FieldBinder.Init = function (){
    FieldBinder.loadJSX("js/json2.js");

    var selectFolder = document.getElementById("selectFolder");
    selectFolder.addEventListener('click', FieldBinder.OnSelectFolder);
    
    runtimeElement.labelPsdFolderPath = document.getElementById("labelSelectedPsdPath");
    
    runtimeElement.combinePsdFile = document.getElementById("selectCombinePsdFile");
    runtimeElement.combinePsdFile.addEventListener('click', FieldBinder.OnSelectCombinePsd)
    runtimeElement.combinePsdFileRoot = runtimeElement.combinePsdFile.parentElement

    runtimeElement.combinePsdFileLabel = document.getElementById("selectCombinePsdFileLabel");

    var savePath = document.getElementById("selectSavePath")
    savePath.addEventListener('click', FieldBinder.OnSelectSavePath)

    runtimeElement.savePathLabel = document.getElementById("selectSavePathLabel")

    var exportBtn = document.getElementById("export")
    exportBtn.addEventListener('click', FieldBinder.OnExport)
    $('#export').shake({"rumbleEvent": "mousedown"})

    runtimeElement.exportType = document.getElementById("exportType")
}

FieldBinder.OnSelectFolder = function(){
    var cs = new CSInterface()
    cs.evalScript("mainForm.selectFolder()", FieldBinder.DealSelectedFolder);
}

FieldBinder.DealSelectedFolder = function(result){
    var data = JSON.parse(result)
    if(data.errorCode == 1)
    {
        alert(data.mes);
        return
    }
    runtimeField.psdPath = decodeURI(data.psdSourceFolder);
    runtimeElement.labelPsdFolderPath.innerText = runtimeField.psdPath;

    var psdScroll = document.getElementById("psdScroll")
    FieldBinder.RemoveAllNode(psdScroll, 1)
    for (let index = 0; index < data.psdList.length; index++) {
        var item = FieldBinder.CreatePsdItem(data.psdList[index])
        psdScroll.appendChild(item);
    }
    
    // TODO 后续需要 针对每个 PSD 选择 不同图层配置的话 需要存个备份，用来刷新重置 图层树Tree
    var layerScroll = document.getElementById("layerScroll")
    FieldBinder.RemoveAllNode(layerScroll)
    FieldBinder.SelectPsdItem(layerScroll, data.modleLayers);

    recorder.sourcePsdData = data
}

FieldBinder.CreatePsdItem = function(psd)
{
    var container = document.createElement("div")
    container.className = "psdScrollItem"
    container.type = "button"

    var toggle = document.createElement("input")
    toggle.type = "checkbox"
    toggle.checked = true
    psd.select = toggle.checked
    container.appendChild(toggle)

    var lab = document.createElement("label")
    lab.innerText = psd.name;
    container.appendChild(lab);

    container.addEventListener('click', function(){
        toggle.checked = !toggle.checked
        psd.select = toggle.checked
    });
    return container
}

FieldBinder.SelectPsdItem = function(root, layers)
{
    for (let index = 0; index < layers.length; index++) {
        var node = FieldBinder.CreateLayerTree(layers[index])
        root.appendChild(node)
    }
}

FieldBinder.CreateLayerTree = function(layer)
{
    switch(layer.typename)
    {
        case "ArtLayer":
            return FieldBinder.CreateLeafNode(layer)
        case "LayerSet":
            return FieldBinder.CreateBranchNode(layer)
    }
}

FieldBinder.CreateBranchNode = function(layerSet)
{
    var outer = document.createElement("div")
    outer.classList.add("layerBranchNodeOuter")

    var branchNode = document.createElement("div")
    branchNode.classList.add("layerBranchNode")
    outer.appendChild(branchNode)

    var toggle = document.createElement("input")
    toggle.type = "checkbox"
    
    $(toggle).click(function(){layerSet.select = toggle.checked;})
    branchNode.appendChild(toggle)

    var toggleDiv = document.createElement("div")
    toggleDiv.classList.add("layerBranchToggleDiv")
    toggleDiv.type = "button"
    branchNode.appendChild(toggleDiv)

    var foldImg = document.createElement("img")
    foldImg.src = "../img/Foldout.png"
    foldImg.className = "image"
    toggleDiv.appendChild(foldImg)

    var folderImg = document.createElement("img")
    folderImg.src = "../img/FolderOut.png"
    folderImg.className = "image"
    toggleDiv.appendChild(folderImg)

    var lab = document.createElement("label")
    lab.innerText = layerSet.name;
    toggleDiv.appendChild(lab);

    var container = document.createElement("div")
    container.classList.add("branchNodeContainer")
    outer.appendChild(container)

    for (let index = 0; index < layerSet.layers.length; index++) {
        var leafNode = FieldBinder.CreateLayerTree(layerSet.layers[index])
        container.appendChild(leafNode)
    }

    var open = false
    $(container).hide()
    $(toggleDiv).click(function(){
        open = !open
        var rot = open? 90 : 0
        var dur = 200
        $(foldImg).rotate({animateTo: rot, duration: dur});
        $(container).toggle(dur, function(){
            folderImg.src = open? "../img/FolderOn.png" : "../img/FolderOut.png"
        })
    })
    return outer
}

FieldBinder.CreateLeafNode = function(layer)
{
    var leafNode = document.createElement("div")
    leafNode.classList.add("layerLeafNode")
    leafNode.type = "button"

    var toggle = document.createElement("input")
    toggle.type = "checkbox"
    leafNode.appendChild(toggle)

    var lab = document.createElement("label")
    lab.innerText = layer.name;
    leafNode.appendChild(lab);

    leafNode.addEventListener('click', function(){
        toggle.checked = !toggle.checked
        layer.select = toggle.checked
    });

    return leafNode
}

FieldBinder.OnSelectCombinePsd = function()
{
    var cs = new CSInterface()
    cs.evalScript("mainForm.selectCombineFile()", FieldBinder.DealSelectedCombinePsd);
}

FieldBinder.DealSelectedCombinePsd = function(result)
{
    var psd = JSON.parse(result)
    if(psd.errorCode == 1)
    {
        alert(psd.mes);
        return
    }
    runtimeElement.combinePsdFileLabel.innerText = decodeURI(psd.filePath);
    FieldBinder.CreateSelection(psd.layers)
    recorder.combinePsdData = psd
}

FieldBinder.CreateSelection = function(layers)
{
    if(typeof(runtimeField.combineSelection) != "undefined")
    {
        runtimeElement.combinePsdFileRoot.removeChild(runtimeElement.combinePsdFileRoot.lastChild)
        runtimeField.combineSelection = null;
    }
    var selection = document.createElement("select")
    selection.multiple = true;
    runtimeElement.combinePsdFileRoot.appendChild(selection)
    
    for (let index = 0; index < layers.length; index++) {
        var option = document.createElement("option")
        var item = layers[index]
        option.innerText = item.name
        option.selected = false
        item.select = option.selected

        selection.options.add(option)
    }
    $(selection).fSelect();
    runtimeField.combineSelection = selection
}

FieldBinder.OnSelectSavePath = function(){
    var savePath = window.cep.fs.showOpenDialogEx(true, true, "选择保存目录...")
    runtimeElement.savePathLabel.innerText = savePath.data
    recorder.savePath = encodeURI(savePath.data)
}

FieldBinder.OnExport = function(){

    if(typeof(recorder.sourcePsdData) == "undefined"){alert("未配置批处理源文件..."); return;}
    if(typeof(recorder.combinePsdData) != "undefined")
    {
        var selectCount = 0
        var options = runtimeField.combineSelection.options
        var combineLayers = recorder.combinePsdData.layers;
        for (let i = 0; i < options.length; i++) {
            var op = options[i]
            for (let j = 0; j < combineLayers.length; j++) {
                if(op.innerText == combineLayers[j].name){
                    combineLayers[j].select = op.selected;
                    if(op.selected) selectCount++;
                    break;
                }
            }
        }
        //if(selectCount == 0) {alert("合并文件选择图层为空! 请先选择需要合并的图层再执行导出操作."); return;}
    }else {alert("Warrning:未配置 Combine PSD 文件 ..."); return;}
    
    recorder.exportType = runtimeElement.exportType[runtimeElement.exportType.selectedIndex].text
    var parm = JSON.stringify(recorder)
    var cs = new CSInterface()
    var jsxScript = "mainForm.processExport('"+ parm + "')";
    cs["evalScript"](jsxScript, function(result){
        var response = JSON.parse(result)
        if(response.errorCode == 1){alert(response.mes); return}
        alert("ExportSucceed!")
    });
}

FieldBinder.loadJSX = function(fileName)
{
    var cs = new CSInterface()
    // 工程根目录
    var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/";
    cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}

FieldBinder.RemoveAllNode = function(parentNode, startIndex)
{
    var obj = parentNode.children;
    if(typeof(startIndex) == "undefined") startIndex = 0;
    for(var i=obj.length-1; i>=startIndex ; i--) 
    {
        parentNode.removeChild(obj[i]);
        obj[i] = null;
    }
}

FieldBinder.Init()