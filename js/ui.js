// AI User Interface
var sets = 0;


function _UI() {

    result = { nInputs: document.getElementById("tbnInputs").value,
        nInputNeurons: document.getElementById("tbnInputNeurons").value,
        nHidden: document.getElementById("tbnHiddenLayers").value,
        nNeurons: document.getElementById("tbnNeuronsPerHiddenLayer").value,
        nOutputs: document.getElementById("tbnOutputs").value,
        maxEpochs: document.getElementById("tbMaxEpochs").value,
        nTrainingSets: document.getElementById('nSets').value,
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

        trainingSets: function () {
            var sets = new Array();
            var results = xPath('//trainingSet/input');
            var n = 0;
            for (i = 0; i < (results.snapshotLength); i += 2) {

                sets[n] = new Array();
                sets[n][0] = results.snapshotItem(i).value.split(',');
                sets[n][1] = results.snapshotItem(i + 1).value.split(',');
                n++;
            }
            return sets;
        },
        validate: function () { }
    }


    return result;
}


// TODO: Dynamically populate training sets.
function addSet() {

    sets++;
    document.getElementById('nSets').innerHTML = sets;

    var parent = document.getElementById('trainingSets');
    var div;
    var inputs;
    var targets;
    var link;

    div = document.createElement("trainingSet");

    link = document.createElement("span");
    link.setAttribute("onclick", "javascript:remove(this)");
    link.setAttribute("class", "link");
    link.appendChild(document.createTextNode(" -"));

    inputs = document.createElement("input");
    inputs.setAttribute("value", "-5,-5");
    targets = document.createElement("input");
    targets.setAttribute("value", "0,0,0");

    div.appendChild(inputs);
    div.appendChild(targets);
    div.appendChild(link);
    parent.appendChild(div);
}

function remove(set) {

    document.getElementById("trainingSets").removeChild(set.parentNode);
    sets--;
    document.getElementById('nSets').innerHTML = sets;

}


var setCurrentChromosoneIndex = 0;
var navDisabled = false;

function setCurrentChromosone(n, navToggle) {

    var results;
    var ele;
    var match = "";

    if (navToggle != undefined) {
        navDisabled = (navDisabled) ? false : true;
    }

    setCurrentChromosoneIndex += n;

    if (setCurrentChromosoneIndex > GA.pool.length - 1) setCurrentChromosoneIndex = 0;
    if (setCurrentChromosoneIndex < 0) setCurrentChromosoneIndex = GA.pool.length - 1;

    document.getElementById('imgTitle').innerHTML = "Chromosone #: " + setCurrentChromosoneIndex + " ";
    document.getElementById('imgTitle').innerHTML += GA.pool[setCurrentChromosoneIndex].fs; //parseFloat(value).toFixed(2) + " ";

    if (count % 500 == 0) {

        GA.pool[0].forEach(function (key, value) {

            log(GA.getIndexToBinaryString(value), 1);
        });
        log("");

        log("Mutations " + gMutations);

    }

    // Each training set.
    trainingSets.forEach(function (tsKey, value) {

        inputs = trainingSets[tsKey][0];
        targets = trainingSets[tsKey][1];

        results = NeuralNetwork.update(inputs, GA.pool[setCurrentChromosoneIndex]);

        ele = 'imgResult' + tsKey;
        document.getElementById(ele).innerHTML = "";


        results.forEach(function (index, value) {
            var html = parseFloat(value).toFixed(sigFigures) + " ";

            document.getElementById(ele).innerHTML += html + " ";
            if (targets[index] == Math.round(value)) match += targets[index];
        });

        document.getElementById(ele).innerHTML += "<br />";

    });

    nnToImg(document.getElementById('nnCanvas'));

    if (match.length == targets.length * trainingSets.length) {

        // Show stats.
        end(GA.pool);

        // Success
        return true;
    }

    else return false
}

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

    data = GA.getBinaryString(setCurrentChromosoneIndex);


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

function manualTest() {

    var inputs = document.getElementById('tbManualTest').value.split(',');
    var results = NeuralNetwork.update(inputs, GA.pool[setCurrentChromosoneIndex]);
    var output = "";
    results.forEach(function (key, value) {
        output += value.toFixed(0) + " ";
    });
    alert(output);
}


