

var _App = function (UI) {


    this.setUI(UI);

    // Wires NeuralNetwork with learning methods and algorithm.

    this.ticksTimer;
    this.version = "0.1";
    var sigFigures = 2;

    iCurrentChromosone = 0;
    this.navDisabled = false;

    this.NeuralNetwork;
    this.GA;
    this.UI;
    // Initialize export.


    this.pause = function () {

        clearInterval(__App.ticksTimer);

        this.UI.status("Paused.");
    }



    //    return this;

}


_App.prototype.setUI = function (UserInterface) {

    // UserInterface is a JSON interface to UI view and events.
    this.UI = UserInterface;

}


_App.prototype.ticks = function () {

    var completed = false;

    // Pause ticker.
    clearInterval(this.ticksTimer);


    // Do stuff...

    this.GA.evaluatePool();

    // Evaluate completion status.
    completed = __App.evaluateChromosone(0);

    status("Epoch: " + (this.NeuralNetwork.count + 1));

    this.NeuralNetwork.count++;

    if (this.NeuralNetwork.count < maxEpochs && !completed) {

        // Resume.

        // Evolve network.
        this.GA.epoch(this.GA.pool.slice(0, 5));

        this.ticksTimer = setInterval(function () {

            __App.ticks();
        }, 1);
    }

    // Else ticker remains suspended -wait for a UI event.
}


// Entry point.   
_App.prototype.main = function (train) {

    // Load current UI.
    this.setUI(_UI.Interface());

    var nInputs;
    var nOutputs;
    var nHidden;
    var nNeurons;

    var chromosone;
    var epoch;

    var seed;
    var poolSize = 5;


    // Parse UI parameters.

    // TODO: UI.validate();
    nInputs = this.UI.nInputs;
    nInputNeurons = this.UI.nInputNeurons;
    nHidden = this.UI.nHidden;
    nNeurons = this.UI.nNeurons;
    nOutputs = this.UI.nOutputs;

    chromosone = this.UI.chromosone;
    epoch = this.UI.epoch;

    maxEpochs = this.UI.maxEpochs;
    trainingSets = this.UI.trainingSets;


    // Create a new Neural Network and Genetic Algorithm.
    this.NeuralNetwork = new FeedForward(nInputs, nInputNeurons, nHidden, nNeurons, nOutputs);
    this.NeuralNetwork.startTime = new Date();

    var seed = this.NeuralNetwork.getWeights();
    this.GA = new GeneticAlgorithm(seed.length, this.NeuralNetwork.wordLength);

    if (chromosone != "") {

        // Restoring previous network.

        // Load chromosone.
        this.GA.pool[0] = chromosone.split(',');

        // Evaluate network.
        this.GA.evaluatePool();
        status("Epoch: " + epoch);
        this.evaluateChromosone(0);
        if (!train) return;

    }

    this.GA.initPool(seed, poolSize);
    if(chromosone !="") this.GA.pool[0] = chromosone.split(',');

    this.UI.status("Init.", "lightpink");

    // TODO: Update link upon export event.
    // initNetExport(nnArgs);

    // Initalize UI outputs

    //UI.log();
    this.UI.log(this.NeuralNetwork.neurons + " Neurons created.");
    this.UI.log(this.NeuralNetwork.synapses + " synapses.");
    this.UI.log("Network entropy: " + (this.NeuralNetwork.wordLength * this.NeuralNetwork.synapses).toExponential());

    // Start ticker.
    if (train) { this.ticks(); }


}

// TODO: Rewrite.

_App.prototype.evaluateChromosone = function (n, navToggle) {

    var results;
    var ele;
    var match = "";

    if (navToggle != undefined) {
        navDisabled = (navDisabled) ? false : true;
    }

    iCurrentChromosone += n;

    if (iCurrentChromosone > this.GA.pool.length - 1) iCurrentChromosone = 0;
    if (iCurrentChromosone < 0) iCurrentChromosone = GA.pool.length - 1;


    // TODO: Encapsulate through UI.

    document.getElementById('networkResultTitle').innerHTML = "Chromosone #: " + iCurrentChromosone + "<br />Fitness: ";
    document.getElementById('networkResultTitle').innerHTML += this.GA.pool[iCurrentChromosone].fs; //parseFloat(value).toFixed(2) + " ";


    // Each training set.
    trainingSets.forEach(function (tsKey, value) {

        inputs = trainingSets[tsKey].inputs;
        targets = trainingSets[tsKey].outputs;

        results = __App.NeuralNetwork.update(inputs, __App.GA.pool[iCurrentChromosone]);

        // TODO: encapsulate through UI

        ele = 'setResult' + tsKey;
        document.getElementById(ele).innerHTML = "";


        results.forEach(function (index, value) {
            var html = parseFloat(value).toFixed(this.sigFigures) + " ";

            document.getElementById(ele).innerHTML += html + " ";
            if (targets[index] == Math.round(value)) match += targets[index];
        });

        document.getElementById(ele).innerHTML += "<br />";

    });



    //nnToImg(document.getElementById('nnCanvas'));

    if (match.length == targets.length * trainingSets.length) {

       //TODO: hook this:
        // Show stats.

        this.UI.status("Completed.", "lightgreen");
        this.UI.log("Completed.");

        // Success
        return true;
    }

    else return false
}


_App.prototype.exportNetwork = function () {

    var obj = {};

    obj.network = __App.NeuralNetwork.snapshot();
    obj.chromosone = __App.GA.getTopChromosone();
    obj.version = __App.version;
    obj.epoch = __App.NeuralNetwork.count;
    obj.fs = obj.chromosone.fs;

    //obj...
    return obj;
};



getRandom = function (min, max) {

    return max - (Math.random() * (max - min));

}



// Prototypes.
Array.prototype.forEach = function (fn) {

    // Pass key/value pairs to returning function.
    for (var i = 0; i < this.length; i++) {
        fn(i, this[i]);
    }
};

// Remove array elements by index #.
Array.prototype.removeByIndex = function (arr, index) {
    arr.splice(index, 1);
}

// Ensures array elements are unique.
Array.prototype.unique = function () {
    var r = new Array();
    o: for (var i = 0, n = this.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x] == this[i]) {
                continue o;
            }
        }
        r[r.length] = this[i];
    }
    return r;
}


// TODO: move this.
//FeedForward.prototype.end = function (pool) {

//    // Training criteria met.

//    this.endTime = new Date();

//    document.getElementById('status').style.backgroundColor = "Green";
//    _UI._UI.log("Completed.");

//    _UI.log("Total runtime: " + (this.endTime.getTime() - this.startTime.getTime()) + "ms");
//    _UI.log("Epochs: " + this.count);

//    outputs = _App.NeuralNetwork.update(inputs, pool[0]);

//    _UI.log("");
//    _UI.log("Best match:");

//    outputs.forEach(function (key, value) {
//        _UI.log("Output: " + value);
//    });

//    _UI.log("Genome length " + pool[0].length + ":");
//    _UI.log(__App.NeuralNetwork.getWeights());

//    inputs.forEach(function (key, value) {

//        _UI.log(value + " ", 1);
//    });

//    return true;
//}




function status(msg) { document.getElementById('status').innerHTML = msg; }

// Logging.
if (1); //(console.log) log = function (msg) { console._UI.log(msg) };
else {
    function log(msg, lb, verb) {
        //verb
        // 9=Everything
        // 5=Info
        // 1=Errors only
        //   if (verb == undefined) verb = 5;
        //   if (!verbosity || verbosity < verb) return;
        //   if (verb == verbError) msg = "<br/ >" + "ERROR: " + msg;

        var log = document.getElementById("log");

        //linebreak flag
        if (!lb) msg += "<br />";

        //   msg += log.innerHTML;

        log.innerHTML += msg;


    }

}


