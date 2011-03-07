
// Solution paramaters
// Entry point.

function AI() {

    var ticksTimer;

    this.main = function (UserInterface, train) {

        if (typeof NeuralNetwork != 'undefined') {

            ticks();
            return;
        }

        var UI = UserInterface;

        if (typeof (UI) != "object") {

            // TODO: Set defaults.

        }


        // Initialize export.
        exportNetwork = function () {

            var args = {};
            args.network = NeuralNetwork.snapshot();
            args.chromosone = NeuralNetwork.GA.getTopChromosone();
            args.version = version;
            args.epoch = NeuralNetwork.count;
            return args;
        };


        var version = "0.1";

        var nInputs;
        var nOutputs;
        var nHidden;
        var nNeurons;

        var chromosone;
        var epoch;

        var seed;


        // Parse UI parameters.

        // TODO: UI.validate();
        nInputs = UI.nInputs;
        nInputNeurons = UI.nInputNeurons;
        nHidden = UI.nHidden;
        nNeurons = UI.nNeurons;
        nOutputs = UI.nOutputs;

        chromosone = UI.chromosone;
        epoch = UI.epoch;

        maxEpochs = UI.maxEpochs;
        trainingSets = UI.trainingSets;


        // Create a new Neural Network and Genetic Algorithm.

        this.NeuralNetwork = new FeedForward(nInputs, nInputNeurons, nHidden, nNeurons, nOutputs);
        this.NeuralNetwork.startTime = new Date();
        UI.status("Init.", "lightpink");

        // Restoring previous network.
        if (chromosone != "") {

            NeuralNetwork.GA.pool[0] = chromosone.split(',');
            NeuralNetwork.GA.train();
            // Evaluate completion status.
            status("Epoch: " + epoch);
            setCurrentChromosone(0);

        }



        // TODO: Update link upon export event.
        // initNetExport(nnArgs);

        // Initalize UI outputs

        //UI.log();
        UI.log(NeuralNetwork.neurons + " Neurons created.");
        UI.log(NeuralNetwork.synapses + " synapses.");
        UI.log("Network entropy: " + (NeuralNetwork.wordLength * NeuralNetwork.synapses).toExponential());

        // Start ticker.
        if (train) { ticks(); }
   
   
    }

    function pause() { clearInterval(ticksTimer); status("Paused."); }


    ticks = function () {

        var completed = false;

        // Pause ticker.
        clearInterval(ticksTimer);

        // Do stuff...
        NeuralNetwork.GA.train();
        // Evaluate completion status.
        completed = setCurrentChromosone(0);

        status("Epoch: " + (NeuralNetwork.count + 1));

        NeuralNetwork.count++;

        if (NeuralNetwork.count < maxEpochs && !completed) {

            // Resume.

            // Evolve network.
            NeuralNetwork.GA.epoch(NeuralNetwork.GA.pool.slice(0, 5));

            ticksTimer = setInterval(function () {
                // TODO: make anonomous.
                ticks();
            }, 1);
        }

        // Else ticker remains suspended -wait for a UI event.
    }

}



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


