// AI User Interface
var sets =0;
var trainingSetsElementId = "trainingsets";
var setCountElementId = "nSets";

function importNet() { 



}

function exportNet() {

    var data = "";
    var html = "";
    //datauri
    html = "data:application/xml;charset=utf-8,";

    data = "<xml>";
    
    trainingSets.forEach(function (key, value) {

    data += "<trainingSet>";
    data += trainingSets[key].inputs + ":" + trainingSets[key].outputs;
    data += "</trainingSet>" + String.fromCharCode(10)  + String.fromCharCode(13);
    });

    data += "<Chromosone>";
    data += getGenome();
    data += "</Chromosone>";

   data += "</xml>";

   html += data; // window.btoa(data);
   var el = document.getElementById('exportNet');
   el.setAttribute("href", html);
  

}

function initSets (){

    
    var inputs = new Array();
    var outputs = new Array();

     inputs.push("0,0,0");
     outputs.push("0,0,0,0");

     inputs.push("0,0,1");
     outputs.push("0,0,0,1");

     inputs.push("0,1,0");
     outputs.push("0,0,1,0");

     inputs.push("0,1,1");
     outputs.push("0,1,0,0");

     inputs.push("1,0,0");
     outputs.push("1,0,0,0");

     inputs.push("1,0,1");
     outputs.push("1,0,0,1");

     inputs.push("1,1,0");
     outputs.push("1,0,1,0");

     inputs.push("1,1,1");
     outputs.push("1,1,0,0");


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


function _UI() {

    JSON = { nInputs: document.getElementById("tbnInputs").value,
        nInputNeurons: document.getElementById("tbnInputNeurons").value,
        nHidden: document.getElementById("tbnHiddenLayers").value,
        nNeurons: document.getElementById("tbnNeuronsPerHiddenLayer").value,
        nOutputs: document.getElementById("tbnOutputs").value,
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
        },

        validate: function () { }
    }


    return JSON;
}


function addSet(trainingSet) {

    // Dynamically adds an HTML training set.
  
  
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

    // Append trainingSet.

    div = document.createElement("trainingSet");

    link = document.createElement("span");
    link.setAttribute("onclick", "javascript:remove(this)");
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
 
 /// Append setResult div for this set.

    div = document.getElementById("setResults");
    
    setResult = document.createElement("div");
    setResult.setAttribute("id", "setResult" + sets);
    div.appendChild(setResult);
    
    sets++;
    document.getElementById(setCountElementId).innerHTML = sets;

}

function remove(set) {

    document.getElementById("trainingSets").removeChild(set.parentNode);
    sets--;
    document.getElementById('nSets').innerHTML = sets;

}


var iCurrentChromosone = 0;
var navDisabled = false;



// TODO: Encapsulate UI
    
function setCurrentChromosone(n, navToggle) {

    var results;
    var ele;
    var match = "";

    if (navToggle != undefined) {
        navDisabled = (navDisabled) ? false : true;
    }

    iCurrentChromosone += n;

    if (iCurrentChromosone > GA.pool.length - 1) iCurrentChromosone = 0;
    if (iCurrentChromosone < 0) iCurrentChromosone = GA.pool.length - 1;
    
    // TODO: Encapsulate through UI.
    document.getElementById('networkResultTitle').innerHTML = "Chromosone #: " + iCurrentChromosone + "<br />Fitness: ";
    document.getElementById('networkResultTitle').innerHTML += GA.pool[iCurrentChromosone].fs; //parseFloat(value).toFixed(2) + " ";

    if (count % 500 == 0) {

        GA.pool[0].forEach(function (key, value) {

            log(GA.getIndexToBinaryString(value), 1);
        });
        log("");

        log("Mutations " + gMutations);

    }

    // Each training set.
    trainingSets.forEach(function (tsKey, value) {

        inputs = trainingSets[tsKey].inputs;
        targets = trainingSets[tsKey].outputs;

        results = NeuralNetwork.update(inputs, GA.pool[iCurrentChromosone]);

        ele = 'setResult' + tsKey;
        document.getElementById(ele).innerHTML = "";


        results.forEach(function (index, value) {
            var html = parseFloat(value).toFixed(sigFigures) + " ";

            document.getElementById(ele).innerHTML += html + " ";
            if (targets[index] == Math.round(value)) match += targets[index];
        });

        document.getElementById(ele).innerHTML += "<br />";

    });


    // TODO: Encapsulate UI
    nnToImg(document.getElementById('nnCanvas'));

    if (match.length == targets.length * trainingSets.length) {

        // Show stats.
        end(GA.pool);

        // Success
        return true;
    }

    else return false
}


// TODO: Encapsulate UI
    
function nnToImg(canvas) {

    var ctx = canvas.getContext('2d');

    var size = NeuralNetwork.synapses * wordLength;
    var width = height = Math.sqrt(size);

    canvas.width = width;
    canvas.height = height;

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



// TODO: Encapsulate UI
    
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




//XPATH

function xPath(query) {

    var result;

    try {

        result = document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    } catch (e) { console.log(e) }

    return result;

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
    if (data == 'fruit-apple') {
        li.textContent = 'Apples';
    } else if (data == 'fruit-orange') {
        li.textContent = 'Oranges';
    } else if (data == 'fruit-pear') {
        li.textContent = 'Pears';
    } else {
        li.textContent = 'Unknown Fruit';
    }
    //event.target.appendChild(li);
}

/////////////////////////
