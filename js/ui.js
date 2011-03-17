

InterfaceLibrary = function () {

    // AI User Interface
    // View | Events | Local storage
    this.objName = 'Network';
    
    this.sets = 0;
    var setCountElementId = "nSets";
    this.trainingSets = new Array();
    
    // Declare UI elements:

    //this.tbnInputs = document.getElementById("tbnInputs");





this.initNetExport = function (print, save) {

        // Snapshots current network encoding in JSON, encapsulating in DataURI XML.
        var data = "";
        var html = "";

        var result = this.Network.exportNetwork();

        var net = result.network;
        var response = result.response;
        var weightFactor = result.weightFactor;
        var ver = result.version;
        var fs = result.fs;

        var name = document.getElementById('tbNetName').value;

        var chromosone = result.chromosone;
        var epoch = result.epoch;

        var dataURI = "data:myApplication/xml;charset=utf-8,";

        // Build json string representation of network. Wrap in xml tags for viewing.
        data = "<xml>{'Version':'";
        data += ver + "',";
        data += "'arguments':'";
        data += net;
        data += "',";

        data += "'response':'";
        data += response;
        data += "',";

        data += "'weightFactor':'";
        data += weightFactor;
        data += "',";


        data += "'Name':'";
        data += name;
        data += "',";

        data += "'fs':'";
        data += fs;
        data += "',";

        trainingSets.forEach(function (key, value) {

            data += "'trainingSet" + key + "':'";
            data += trainingSets[key].inputs + ":" + trainingSets[key].outputs;
            data += "',"; //    
        });

        data += "'Chromosone':'";
        data += chromosone;
        data += "',";
        data += "'epoch':'";
        data += epoch;
        data += "'";

        data += "}</xml>";


        var el = document.getElementById('exportNet');
        el.setAttribute("href", dataURI + data);
        el.innerHTML = document.getElementById('tbNetName').value;

        if (save) this.saveNetwork(data);
        if (print) this.printNetwork(data);

        return (data);
    }












}

InterfaceLibrary.prototype.initInterface = function(obj){

   this.Interface = obj;

}

InterfaceLibrary.prototype.registerNetwork = function (obj) {


   this.Network = obj;


}

InterfaceLibrary.prototype.attachEvents = function (obj) {

    var objName = this.objName; 
    // Bind UI events
    element = document.getElementById('taNetImport');
    element.ondblclick = 'myApp.Interface.importNetwork(element.value)';

    element = document.getElementById('btnTrain');

    var str = 'function(){' + objName + '.resume(true);}';
    element.onclick = function(){obj.resume(true)};// //eval('(' + str + ')'); // function () { Network.resume(true) }; // '';

}


    InterfaceLibrary.prototype.initUI = function () {

        // Register UI.

        // Some browsers (FF) cache this across page loads. 
        document.getElementById('tbChromosone').value = "";

        // Check for local storage support.
        if (this.initLocalStorage() == 0) {

            this.populateSelectBox(); // getNetworkStore();
        }

        // Populate training sets
        this.initSets();

    }


    InterfaceLibrary.prototype.log = function (msg, lb) {

        el = document.getElementById('log');

        if (typeof msg == 'undefined') {

            el.innerHTML = ""
            return;
        }

        if (!lb) {

            el.innerHTML += msg + "<br />";
        }
        else el.innerHTML += msg;

        return;
    }


    InterfaceLibrary.prototype.removeStorageKey = function (value) {

        var nnIndex = getNetIndex();

        // Replaces storage index
        var json = "{'timestamp':["

        for (var i = 0; i < nnIndex.timestamp.length; i++) {

            if (nnIndex.timestamp[i] != value) {
                json += nnIndex.timestamp[i];
                if (i < nnIndex.timestamp.length - 1) json += ",";
            }
        }

        json += "]}";

        // Store network object.
        localStorage.setItem('NeuralNetworkIndex', json);
        localStorage.removeItem(value);

        populateSelectBox();

    }



    InterfaceLibrary.prototype.printNetwork = function (data) {

        document.getElementById('taNetImport').value = data.slice(5, data.length - 6);

    }


    //    this.importNet = function (str) {

    //        var jsonSTR;
    //        var obj = {};
    //        
    //        // Convert JSON text into JS object.
    //        obj = eval('(' + jsonSTR + ')');

    //    }



    InterfaceLibrary.prototype.initSets = function() {

        var inputs = new Array();
        var outputs = new Array();

        inputs.push("-5,-5,-5");
        outputs.push("0,0,0,0");

        inputs.push("-5,-5,5");
        outputs.push("0,0,0,1");

        inputs.push("-5,5,-5");
        outputs.push("0,0,1,0");

        inputs.push("-5,5,5");
        outputs.push("0,1,0,0");

        inputs.push("5,-5,-5");
        outputs.push("1,0,0,0");





        //    inputs.push("0,0,0");
        //    outputs.push("0,0,0,0");

        //    inputs.push("0,0,1");
        //    outputs.push("0,0,0,1");

        //    inputs.push("0,1,0");
        //    outputs.push("0,0,1,0");

        //    inputs.push("0,1,1");
        //    outputs.push("0,1,0,0");

        //    inputs.push("1,0,0");
        //    outputs.push("1,0,0,0");

        //    inputs.push("1,0,1");
        //    outputs.push("1,0,0,1");

        //    inputs.push("1,1,0");
        //    outputs.push("1,0,1,0");

        //    inputs.push("1,1,1");
        //    outputs.push("1,1,0,0");

        inputs.forEach(function (key, value, obj) {

            var trainingSet = {};

            trainingSet.inputs = inputs[key];
            trainingSet.outputs = outputs[key];

            obj.addSet(trainingSet);
            //     sets++;

        }, this);


        //                <input type="text" value="-5,-5,5" /><input type="text" value="0,0,0,1"/>
        //                <input type="text" value="-5,5,-5" /><input type="text" value="0,0,1,0"/>
        //                <input type="text" value="-5,5,5" /><input type="text" value="0,1,0,0"/>
        //                <input type="text" value="5,-5,-5" /><input type="text" value="1,0,0,0"/> 

    }







        InterfaceLibrary.prototype.removeSet = function (set) {

        document.getElementById("trainingSets").removeChild(set.parentNode);
        sets--;
        document.getElementById('nSets').innerHTML = sets;

    }



    InterfaceLibrary.prototype.removeAllSets = function () {

        // Remove sets.
        document.getElementById("trainingSets").innerHTML = ""; //removeChild(set.parentNode);

        // Clear analysis area.
        document.getElementById("setResults").innerHTML = ""; //removeChild(set.parentNode);

        this.sets = 0;

    }




    InterfaceLibrary.prototype.nnToImg = function (canvas) {
        return;
        try {
            if (typeof canvas.getContext == 'undefined') {

                status("No canvas support. Upgrade your browser.");
                return -1;
            }

            var ctx = canvas.getContext('2d');

            var size = NeuralNetwork.synapses * NeuralNetwork.wordLength;
            var width = height = Math.sqrt(size);

            canvas.width = width;
            canvas.height = height;


            if (typeof ctx.getImageData == 'undefined') {

                status("No canvas support. Upgrade your browser.");
                return -1;
            }


            var imgd = ctx.getImageData(0, 0, width, height);

            var pRed = 0;
            var pGreen = 0;
            var pBlue = 255;
            var pAlpha = 255;
            var data;
            var offset;

            data = GA.getBinaryString(iCurrentChromosone);


            offset = 0;

            data.forEach(function (key, bits) {

                for (i = 0; i < bits.length; i++) {

                    imgd.data[offset + i * 4] = pRed * bits[i];
                    imgd.data[offset + i * 4 + 1] = pGreen * bits[i];
                    imgd.data[offset + i * 4 + 2] = pBlue * bits[i];
                    imgd.data[offset + i * 4 + 3] = pAlpha; //

                }

                offset += (i * 4);
            });

            ctx.putImageData(imgd, 0, 0);
            if (navDisabled) return;

            nnImage = document.getElementById('nnImg');
            nnImage.src = canvas.toDataURL();

        }
        catch (e) { log(e + " Problem with canvas support.") };
    }


    InterfaceLibrary.prototype.manualTest = function () {

        var inputs = document.getElementById('tbManualTest').value.split(',');
        var results = NeuralNetwork.update(inputs, GA.pool[iCurrentChromosone]);
        var output = "";
        results.forEach(function (key, value) {
            output += value.toFixed(0) + " ";
        });
        alert(output);
    }


    InterfaceLibrary.prototype.parseTrainingSets = function () {

        // Returns objects array of delimited input/output values 
        // [index]["inputs"][values]  
        // [index]["outputs"][values]
        var sets = new Array();

        // Get dynamically/manually generated training sets.
        var results = this.xPath('//trainingSet/input');

        var n = 0;
        for (i = 0; i < (results.snapshotLength); i += 2) {

            sets[n] = new Array();
            sets[n].inputs = results.snapshotItem(i).value.split(',');
            sets[n].outputs = results.snapshotItem(i + 1).value.split(',');
            n++;
        }
        return sets;
    }


    InterfaceLibrary.prototype.populateSelectBox = function () {


        // Clear options
        var sbSaved = document.getElementById('sbSavedNetworks');
        sbSaved.innerHTML = "";

        // Populate saved network select box.
        var nnIndex = this.getNetIndex();
        this.log("Saved Networks:");

        for (var i = 0; i < nnIndex.timestamp.length; i++) {

            log(nnIndex.timestamp[i]);
            var net = this.getStoredNet(nnIndex.timestamp[i]);
            if (typeof net == 'undefined') {

                removeStorageKey(i);
                continue;
            }

            var opt = document.createElement('option');
            var textNode = document.createTextNode(net.Name);
            opt.appendChild(textNode);
            opt.setAttribute('value', nnIndex.timestamp[i]);
            sbSaved.appendChild(opt);
        }
    }

    ////DND

    var internalDNDType = "WaynesType";
    //ondragstart="event.dataTransfer.setData('text/plain', 'This text may be dragged')

    function dragStartHandler(event) {
        //   if (event.target instanceof HTMLLIElement) {
        // use the element's data-value="" attribute as the value to be moving:
        event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
        event.dataTransfer.effectAllowed = 'move'; // only allow moves

        // } else {
        event.preventDefault(); // don't allow selection to be dragged
        //}
    }

    function dragEnterHandler(event) {
        // cancel the event if the drag contains data of our type
        //    if (event.dataTransfer.types.contains(internalDNDType))
        event.preventDefault();
    }
    function dragOverHandler(event) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault(); // override default drag feedback
    }
    function dropHandler(event) {
        var types = event.dataTransfer.types;

        types.forEach(function (key, value) { log(key + " " + value) });
        // drop the data
        //var li = document.createElement('li');
        var data = event.dataTransfer.getData("Files"); //internalDNDType);
        alert(data);
        if (data == 'fruit-myApple') {
            li.textContent = 'myApples';
        } else if (data == 'fruit-orange') {
            li.textContent = 'Oranges';
        } else if (data == 'fruit-pear') {
            li.textContent = 'Pears';
        } else {
            li.textContent = 'Unknown Fruit';
        }
        //event.target.AppendChild(li);
    }

    /////////////////////////


    /// CLIENT SIDE STORAGE

    InterfaceLibrary.prototype.initLocalStorage = function() {

        if (typeof window.localStorage == 'undefined') {
            status('No local storage support. Upgrade your browser.');
            return -1;
        }

        // Creates NeuralNetwork timestamp index if it doesn't exist.
        if (!localStorage.getItem('NeuralNetworkIndex')) {

            var json = "{'timestamp':[]}";
            localStorage.setItem('NeuralNetworkIndex', json);

        }

        return 0;
    }

   InterfaceLibrary.prototype.saveNetwork = function(xml) {

        var result;
        var timestamp = new Date().getTime();

        updateStorageIndex(timestamp);

        // Store net.
        localStorage.setItem(timestamp, xml);
        populateSelectBox();

    }


    InterfaceLibrary.prototype.updateStorageIndex = function (timestamp) {

        var obj = getNetIndex();
        obj.timestamp.push(timestamp);

        var json = "{'timestamp':["

        for (var i = 0; i < obj.timestamp.length; i++) {

            json += obj.timestamp[i];
            if (i < obj.timestamp.length - 1) json += ",";
        }
        json += "]}";

        // Store network object.
        localStorage.setItem('NeuralNetworkIndex', json);

    }



    InterfaceLibrary.prototype.getStoredNet = function (timestamp) {

        // Fetch each stored nn timestamp and populate associated names
        var xml = localStorage.getItem(timestamp);
        if (xml == null) {
            return;

        }
        var json = xml.slice(5, xml.length - 6);

        try {

            var net = eval('(' + json + ')');

        }
        catch (e) {
            log(e + " " + " Saved network invalid, cleaning up...");
            localStorage.removeItem(timestamp);

        }

        return net;
    }

    InterfaceLibrary.prototype.getNetIndex = function() {

        var retval = eval('(' + localStorage.getItem('NeuralNetworkIndex') + ')');
        return retval;
    }



    InterfaceLibrary.prototype.restoreSavedNetwork = function (timestamp) {


        // TODO: Save current net.
        var net = this.getStoredNet(timestamp);
        this.parseNetwork(net);

        // Load net.
        
        this.Network.resume();

        // Print network.
        this.initNetExport(true, false);

    }


    InterfaceLibrary.prototype.importNetwork = function (data) {


        var json;

        //Remove DataURI if any
        if (data.slice(0, 5) == "data:") {

            json = data.slice(35, data.length);
            data = json;
        }


        //Remove XML tags if any
        if (data.slice(0, 5) == "<xml>") {

            json = data.slice(5, data.length - 6);
        }

        else json = data;

        try {

            var net = eval('(' + json + ')');

        }
        catch (e) {

            log(e + " " + " Network import invalid.");
        }

        this.parseNetwork(net);

    }

   InterfaceLibrary.prototype.parseNetwork = function (net) {

        // TODO: validate/trap.
        var args = net.arguments.split(',');
        var chromosone = net.Chromosone;
        var response = net.response;
        var weightFactor = net.weightFactor;

        var epoch = net.epoch;

        var name = net.Name;

        var version = net.Version;

        this.Interface.nInputs(args[0]); // document.getElementById('tbnInputs').value = args[0];
        this.Interface.nInputNeurons(args[1]);
        this.Interface.nNeurons(args[2]);
        this.Interface.nHidden(args[3]);
        this.Interface.nOutputs(args[4]);

        this.Interface.chromosone(chromosone);
        this.Interface.netName(name);

        this.Interface.response(response);
        this.Interface.weightFactor(weightFactor);

        this.removeAllSets();

        // Add all stored sets.
        var i = 0;

        while (net['trainingSet' + i]) {

            var data = net['trainingSet' + i].split(':');

            var trainingset = {};
            trainingset.inputs = data[0];
            trainingset.outputs = data[1];

            this.addSet(trainingset);
            i++;
        }


    }


    function dbInit() {

        //    var database = openDatabase("NeuralNetwork API", "Version 0.1");
        //    
        //    
        //    database.executeSql("SELECT * FROM test", function (result1) {
        //        // do something with the results
        //        database.executeSql("DROP TABLE test", function (result2) {
        //            // do some more stuff
        //            alert("My second database query finished executing!");
        //        });
        //    }); 
    }


    //Hash obj arrays
    //(function () {
    //    var id = 0;

    //    /*global MyObject */
    //    MyObject = function () {
    //        this.objectId = '<#MyObject:' + (id++) + '>';
    //        this.toString = function () {
    //            return this.objectId;
    //        };
    //    };
    //})();


InterfaceLibrary.prototype.xmlParser = function(xmlString) {

        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlString, "text/xml");
        }
        else // Internet Explorer
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlString);
        }

    }


    //XPATH
    InterfaceLibrary.prototype.xPath = function(query) {

        var result;

        if (typeof document.evaluate != 'undefined') {
            result = document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }

        else { // IE

            try {
                throw ('');
                //IE Doesn't seem to work, perhaps because doc is not valid xml.

                //            result = document.getElementsByTagName("trainingset");
                //            //xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                //            //xmlDoc.async = false;
                //       //     xmlDoc.load(document);
                //         //   xmlDoc.setProperty("SelectionLanguage", "XPath");
                //            result = xmlDoc.selectNodes(query);
                //            
            }

            catch (e) {

                status(e + " No xPath support");

            }
        }

        return result;

    }

//    this.initUI();

    //return this;




InterfaceLibrary.prototype.addSet = function (trainingSet) {

    // Dynamically adds a training set to the DOM.
    if (typeof trainingSet == 'undefined') {

        trainingSet = {};
        trainingSet.inputs = "";
        trainingSet.outputs = "";
    }



    var parent = document.getElementById("trainingSets");
    var div;
    var inputs;
    var targets;
    var link;
    var setResult;

    // myAppend trainingSet.

    div = document.createElement("trainingSet");

    link = document.createElement("span");
    link.setAttribute("onclick", "javascript: _UI.removeSet(this)");
    link.setAttribute("class", "link");
    link.appendChild(document.createTextNode(" -"));

    inputs = document.createElement("input");
    inputs.setAttribute("value", trainingSet.inputs);
    targets = document.createElement("input");
    targets.setAttribute("value", trainingSet.outputs);

    div.appendChild(inputs);
    div.appendChild(targets);
    div.appendChild(link);
    parent.appendChild(div);

    /// myAppend setResult div for this set.
    div = document.getElementById("setResults");

    setResult = document.createElement("div");
    setResult.setAttribute("id", "setResult" + this.sets);
    div.appendChild(setResult);

    this.sets++;
    //this.setCount(this.sets);

}


var mouseX = 0;
var mouseY = 0;

// If it is not IE, we assume that the browser is NS.
var IE = document.all?true:false

if (!IE) document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
  if (IE) { // grab the x-y pos.s if browser is IE
    mouseX = event.clientX + document.body.scrollLeft
    mouseY = event.clientY + document.body.scrollTop
  } else {  // grab the x-y pos.s if browser is NS
    mouseX = e.pageX
    mouseY = e.pageY
  }
  return true;
}






