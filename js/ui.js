

var _UI = (function () {

    // AI User Interface
    // View | Events | Local storage

    //
    var sets = 0;
    var trainingSetsElementId = "trainingsets";
    var setCountElementId = "nSets";
    this.trainingSets = new Array();

    this.Interface = function () {

        // Object representing the UI for controller interface. 
        //json interface.
        // Implements
        // Methods:
        // log(msg, lb)
        // status(msg, color)
        // Properties:
        // NeuralNetwork(arguments)
        // parameters

        var Obj = { nInputs: document.getElementById("tbnInputs").value,
            nInputNeurons: document.getElementById("tbnInputNeurons").value,
            nHidden: document.getElementById("tbnHiddenLayers").value,
            nNeurons: document.getElementById("tbnNeuronsPerHiddenLayer").value,
            nOutputs: document.getElementById("tbnOutputs").value,
            chromosone: document.getElementById("tbChromosone").value,
            epoch: document.getElementById("tbEpoch").value,
            maxEpochs: document.getElementById("tbMaxEpochs").value,
            nTrainingSets: document.getElementById('nSets').value,
            trainingSets: parseTrainingSets(trainingSetsElementId),
            status: function (msg, color) {

                el = document.getElementById('status');
                el.style.backgroundColor = color;
                el.innerHTML = msg;
                return;
            },
            log: function (msg, lb) {
                log(msg, lb);
            },

            validate: function () { }
        }

        return Obj;
    }

    this.initUI = function () {

        // Register UI.
       
        // Some browsers (FF) cache this across page loads. 
        document.getElementById('tbChromosone').value = "";

        // Check for local storage support.
        if (initLocalStorage() == 0) {

            populateSelectBox(); // getNetworkStore();
        }

        // Populate training sets
        initSets();

    }


    this.log = function (msg, lb) {

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



    this.removeStorageKey = function (value) {

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


    this.initNetExport = function () {

        // Snapshots current network encoding in JSON, encapsulating in DataURI XML.
        var data = "";
        var html = "";

        var result = __App.exportNetwork();

        var net = result.network;
        var ver = result.version;
        var fs = result.fs;

        var name = document.getElementById('tbNetName').value;

        var chromosone = result.chromosone;
        var epoch = result.epoch;

        var dataURI = "data:_Application/xml;charset=utf-8,";

        // Build json string representation of network. Wrap in xml tags for viewing.
        data = "<xml>{'Version':'";
        data += ver + "',";
        data += "'arguments':'";
        data += net;
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

        document.getElementById('taNetImport').value = data.slice(5, data.length - 6);
        saveNetwork(data);
    }





    //    this.importNet = function (str) {

    //        var jsonSTR;
    //        var obj = {};
    //        
    //        // Convert JSON text into JS object.
    //        obj = eval('(' + jsonSTR + ')');

    //    }


    function initSets() {

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

        inputs.forEach(function (key, value) {

            var trainingSet = {};

            trainingSet.inputs = inputs[key];
            trainingSet.outputs = outputs[key];

            addSet(trainingSet);
            //     sets++;

        });


        //                <input type="text" value="-5,-5,5" /><input type="text" value="0,0,0,1"/>
        //                <input type="text" value="-5,5,-5" /><input type="text" value="0,0,1,0"/>
        //                <input type="text" value="-5,5,5" /><input type="text" value="0,1,0,0"/>
        //                <input type="text" value="5,-5,-5" /><input type="text" value="1,0,0,0"/> 

    }






    this.addSet = function (trainingSet) {

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

        // _Append trainingSet.

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

        /// _Append setResult div for this set.
        div = document.getElementById("setResults");

        setResult = document.createElement("div");
        setResult.setAttribute("id", "setResult" + sets);
        div.appendChild(setResult);

        sets++;
        document.getElementById(setCountElementId).innerHTML = sets;

    }

    this.removeSet = function (set) {

        document.getElementById("trainingSets").removeChild(set.parentNode);
        sets--;
        document.getElementById('nSets').innerHTML = sets;

    }

    this.removeAllSets = function () {

        // Remove sets.
        document.getElementById("trainingSets").innerHTML = ""; //removeChild(set.parentNode);

        // Clear analysis area.
        document.getElementById("setResults").innerHTML = ""; //removeChild(set.parentNode);

        sets = 0;

    }




    this.nnToImg = function (canvas) {
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


    function manualTest() {

        var inputs = document.getElementById('tbManualTest').value.split(',');
        var results = NeuralNetwork.update(inputs, GA.pool[iCurrentChromosone]);
        var output = "";
        results.forEach(function (key, value) {
            output += value.toFixed(0) + " ";
        });
        alert(output);
    }


    function parseTrainingSets(elementName) {

        // Returns objects array of delimited input/output values 
        // [index]["inputs"][values]  
        // [index]["outputs"][values]
        var sets = new Array();

        // Get dynamically/manually generated training sets.
        var results = xPath('//trainingSet/input');

        var n = 0;
        for (i = 0; i < (results.snapshotLength); i += 2) {

            sets[n] = new Array();
            sets[n].inputs = results.snapshotItem(i).value.split(',');
            sets[n].outputs = results.snapshotItem(i + 1).value.split(',');
            n++;
        }
        return sets;
    }


    function populateSelectBox() {


        // Clear options
        var sbSaved = document.getElementById('sbSavedNetworks');
        sbSaved.innerHTML = "";

        // Populate saved network select box.
        var nnIndex = getNetIndex();
        log("Saved Networks:");

        for (var i = 0; i < nnIndex.timestamp.length; i++) {

            log(nnIndex.timestamp[i]);
            var net = getStoredNet(nnIndex.timestamp[i]);
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
        if (data == 'fruit-_Apple') {
            li.textContent = '_Apples';
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

    function initLocalStorage() {

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

    function saveNetwork(xml) {

        var result;
        var timestamp = new Date().getTime();

        updateStorageIndex(timestamp);

        // Store net.
        localStorage.setItem(timestamp, xml);
        populateSelectBox();

    }


    function updateStorageIndex(timestamp) {

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



    function getStoredNet(timestamp) {

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

    function getNetIndex() {

        var retval = eval('(' + localStorage.getItem('NeuralNetworkIndex') + ')');
        return retval;
    }



    this.restoreSavedNetwork = function (timestamp) {


        // TODO: Save current net.
        var net = getStoredNet(timestamp);
        parseNetwork(net);

    }

    this.parseNetwork = function (net) {

        var args = net.arguments.split(',');
        var chromosone = net.Chromosone;
        var epoch = net.epoch;

        var name = net.Name;

        var version = net.Version;

        document.getElementById('tbnInputs').value = args[0];
        document.getElementById('tbnInputNeurons').value = args[1];
        document.getElementById('tbnNeuronsPerHiddenLayer').value = args[2];
        document.getElementById('tbnHiddenLayers').value = args[3];
        document.getElementById('tbnOutputs').value = args[4];

        document.getElementById('tbChromosone').value = chromosone;
        document.getElementById('tbNetName').value = name;
        //maxEpochs: document.getElementById("tbMaxEpochs").value,

        removeAllSets();

        // Add all stored sets.
        var i = 0;

        while (net['trainingSet' + i]) {

            var data = net['trainingSet' + i].split(':');

            var trainingset = {};
            trainingset.inputs = data[0];
            trainingset.outputs = data[1];

            addSet(trainingset);
            i++;
        }

        // Load net.
        __App.main();

    }

    this.importNetwork = function (data) {


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

        parseNetwork(net);

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


    function xmlParser(xmlString) {

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
    function xPath(query) {

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

    return this;

})();


