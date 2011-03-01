var UI;
var weights;

// Log levels.
var verbosity = 9; // Everything.
var verbInfo = 5; // Info.
var verbError = 1; // Errors.

// Neural Network
var CONSTResponse = 1;
var wordLength = 16;    // 1024 2^n resolution

// Genetic Algorithm
var seedSizeN = 5; // Returns 2^(n-1)
var mutationRate = .1;
var crossoverRate = 1;
var maxEpochs = 100;
var includeParents = true; 

// Solution paramaters
var trainingSets = new Array(); 
var sigFigures = 2; //100K

// Misc
var startTime;
var endTime;
var ticksTimer;
var count;
var gMutations = 0;

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



// Entry point.
function main(UserInterface) {
   
    UI = UserInterface;
   
    var nInputs;
    var nOutputs;
    var nHidden;
    var nNeurons;

    var seed;
    var poolSize = 5;

    count = 0;

    // ...resume.
    if (typeof (UI) != "object") {

        // TODO: Set defaults.

    }

    // Parse UI Inputs.
    
    // TODO: UI.validate();
    nInputs = UI.nInputs;
    nInputNeurons = UI.nInputNeurons;
    nHidden = UI.nHidden;
    nNeurons = UI.nNeurons;
    nOutputs = UI.nOutputs;

    maxEpochs = UI.maxEpochs;
    trainingSets = UI.trainingSets();

    // Create a new Neural Network and Genetic Algorithm.
    NeuralNetwork = new NeuralNet(nInputs, nInputNeurons, nHidden, nNeurons, nOutputs);

    seed = NeuralNetwork.getWeights();
   
    GA = new GeneticAlgorithm(seed.length);
    GA.initPool(seed, poolSize);

    // Initalize UI outputs
    UI.status("Init.", "lightpink");
    UI.log();
    UI.log(NeuralNetwork.neurons + " Neurons created.");
    UI.log(NeuralNetwork.synapses + " synapses.");
    UI.log("Network entropy: " + (wordLength * NeuralNetwork.synapses).toExponential());

    // Start ticker.
    startTime = new Date();
    ticks();
}

function pause() { clearInterval(ticksTimer); status("Paused."); }

function resume() { ticks(weights); return }


function ticks() {

    var completed = false;

    // Pause ticker.
    clearInterval(ticksTimer);

    // Do stuff...
    GA.train();
    // Evaluate completion status.
    completed = setCurrentChromosone(0);

    status("Epoch: " + (count + 1));

    count++;

    if (count < maxEpochs && !completed) {

        // Resume.

        // Evolve network.
        GA.epoch(GA.pool.slice(0, 5));

        ticksTimer = setInterval(function () {
            ticks();
        }, 1);
    }


    // Else ticker remains suspended -wait for a UI event.
}


function NeuralNet(nInputs, nInputNeurons, nHiddenLayers, nNeuronsPerHiddenLayer, nOutputs) {

    // TODO validate params.
 
    this.neurons = 0;
    this.synapses = 0;

    this.nInputs = parseInt(nInputs);
    this.nInputNeurons = parseInt(nInputNeurons);
    this.nOutputs = parseInt(nOutputs);
    this.nHiddenLayers = parseInt(nHiddenLayers);
    this.nNeuronsPerHiddenLayer = parseInt(nNeuronsPerHiddenLayer);

    this.weights = new Array();

 
    // Define NeuralNetwork Layers:

    // Input layer.
    this.neuronLayer(this.nInputNeurons, this.nInputs);

    // Hidden layer(s).
    for (i = 0; i < this.nHiddenLayers; i++) this.neuronLayer(this.nNeuronsPerHiddenLayer, this.nNeuronsPerHiddenLayer);

    // Output layer.
    this.neuronLayer(this.nOutputs, (this.nNeuronsPerHiddenLayer == 0) ? this.nInputNeurons : this.nNeuronsPerHiddenLayer);


    function privateMember() { }

}

NeuralNet.prototype.setWeights = function (value) {

    if ( typeof (value) == "Array" ) {
    
        this.weights = value;
        return 0;

    }

    else return -1;

}

NeuralNet.prototype.update = function (inputs, newWeights) {

    // TODO trap params.
    if (typeof inputs == "object" && inputs.length != this.nInputs) throw ("input length descreptancy in NeuralNet.prototype.update.");
    else if (typeof inputs == "string" && inputs != nInputs) throw ("input length descreptancy in NeuralNet.prototype.update.");

    //if (typeof newWeights != "object" || newWeights.length != this.weights.length) throw ("weight length descreptancy in NeuralNet.prototype.update.");

    // Load new weights.
    this.weights = newWeights;

    return this.getOutput(inputs);
}

NeuralNet.prototype.getWeights = function () {

    return this.weights;
}


NeuralNet.prototype.getWeight = function (synapse) {

    // Returns an individual synapse's weight.
    var retval = ((this.weights[synapse] - (Math.pow(2, wordLength) * .5)) * .01);

    return retval;
}

NeuralNet.prototype.getBinaryWeight = function () {

    return this.weights;

}

NeuralNet.prototype.neuronLayer = function (nNeurons, nInputsPerNeuron) {

    // Create neurons.
    for (var i = 0; i < nNeurons; i++) {

        this.neuron(nInputsPerNeuron);
    }
}

NeuralNet.prototype.neuron = function (nInputs) {
    
    for (var i = 0; i < nInputs + 1; ++i) {

        this.synapses++;
       
        // Set up weights with an initial random value.
        this.weights.push(randomClamped());
    
    }

    this.neurons++;
}

NeuralNet.prototype.getOutput = function (xInputs) {

    var output = new Array();
    var i;
    var activation = 0;
    var offset = 0;
    var synapses = 0;

    // Recures network layers: input, nHiddenLayers and output to calculate and
    // return the NN's output(s)

    //TODO trap xInputs;
    if (this.nInputs != xInputs.length) throw ("Error: Inputs length discreptancy in NeuralNet.prototype.getOutput");


    // Each neuron in input layer.
    for (i = 0; i < this.nInputNeurons; i++) {

        // Program neuron's synapses.
        for (j = 0; j < this.nInputs; j++) {

            activation += xInputs[j] * this.getWeight(offset++);

        }
        // Bias conditioned to +/- 5.
        activation += (-1 * this.getWeight(offset));
        output.push(5 - (sigmoid(activation, CONSTResponse)) * 10);

        //Do next neuron in this layer
        activation = 0;
    }
    xInputs = output;
    output = new Array();

    // Each hidden layer.
    for (i = 0; i < this.nHiddenLayers; i++) {

        output = new Array();

        // Each neuron.
        for (j = 0; j < this.nNeuronsPerHiddenLayer; j++) {

            // Calculate inputs of this neuron.
            for (k = 0; k < xInputs.length; k++) {

                activation += xInputs[k] * this.getWeight(offset++);
            }
            // Bias conditioned to +/- 5.
            activation += (-1 * this.getWeight(offset++));
            output.push(5 - (sigmoid(activation, CONSTResponse)) * 10);

            // Do next neuron in this layer.
            activation = 0;


        }

        // Outputs become inputs to next layer.

        // Do next hidden layer
        xInputs = output;
        output = new Array();

    }


    // Output layer.

    // Each neuron in output layer.
    for (i = 0; i < this.nOutputs; i++) {

        // Calculate inputs of this neuron.
        for (j = 0; j < xInputs.length; j++) {

            activation += xInputs[j] * this.getWeight(offset++);
        }
        // Bias.
        activation += (-1 * this.getWeight(offset++));

        // Uncoditioned 0~1 output.
        output.push(sigmoid(activation, CONSTResponse));
        activation = 0;


    }

    return output;
}


function randomClamped() {

    // Returns a random wordLength number, E.g., 10 bit = 0~1023.

    return Math.floor(getRandom(0, 1) * Math.pow(2, wordLength));

}

function sigmoid(activation, response) {

    return 1 / (1 + Math.pow(Math.E, -activation / response));

}

function mutate(value) {

    // Returns value with bitwise mutation -flips a random bit. 

    var mask;

    // 1 ~ wordLength
    mask = Math.round(Math.random() * Math.ceil(Math.log(Math.pow(2, wordLength)) / Math.log(2) - 1));

    // 2^(n-1) - 0,1,2,4,8...
    mask = Math.floor(Math.pow(2, (mask - 1)));

    return (value ^ mask);

}


function GeneticAlgorithm(chromosoneLength) {

    // Holds the population.
    this.pool = new Array();
    this.chromosoneLength = chromosoneLength;

}


getRandom = function (min, max) {

    return max - (Math.random() * (max - min));


}
GeneticAlgorithm.prototype.initPool = function (seed, poolSize) {

    // Initialize pool with random values.

    // wordLength - bits per geneome.
    // size - population of chromosones (returns ~size^2-size, depending on crossoverRate )
    // seed - sample chromosone
    this.chromosoneLength = seed.length;

    var genePool = new Array();

    for (i = 0; i < poolSize; i++) {

        var value = new Array();

        for (j = 0; j < seed.length; j++) {

            value.push(Math.floor(getRandom(0, 1) * Math.pow(2, wordLength)));
        }

        genePool.push(value);
    }

    this.pool = genePool;
}



GeneticAlgorithm.prototype.epoch = function (genePool) {

    // Push latent genes.
    // genePool.push(latentGenome);

    var ngChromosones = new Array();

    // Apply genetic crosssover 70% chance.
    // Apply genetic mutation .1% chance.
    // Apply roulette selection of fittess members
    // For each gene, crossover with other genes
    // with a possibility of mutation.


    // Step through parent gene pool.
    for (i = 0; i < genePool.length; i++) {
        var xChromosone = new Array();

        // Inherit xChromosone from parent.

        genePool[i].forEach(function (key, value) {

            xChromosone.push(value);
        });

        // Process against all other parent genomes
        for (j = 0; j < genePool.length; j++) {

            var yChromosone = new Array();
            var crossoverPoint = Math.round(getRandom(0, 1) * wordLength * this.chromosoneLength);

            // Do not cross with self
            //if (j == i) continue;


            // Not tonight, I have a headache...
            if (getRandom(0, 1) > crossoverRate) continue;

            // Inherit yChromosone from parent.
            genePool[j].forEach(function (key, value) {

                yChromosone.push(value);

            });


            // Apply crossover between genomes creating a next-generation chromosone.

            var xy = new Array();
            var leftWords = Math.floor(crossoverPoint / wordLength);

            for (k = 0; k < leftWords; k++) {

                xy[k] = xChromosone[k];
                var rnd = getRandom(0, 1); // Math.floor(Math.random() / mutationRate) + 1;

                if (rnd > (mutationRate)) {

                    xy[k] = mutate(xy[k]);
                    gMutations++;

                }
            }

            // Split point.
            if (leftWords) {
                //
                ///////////////////////////	

                // Crossover X MSB.
                // 2^(n) -1 eg, 10-bit base = 1023 1111111111
                var base = Math.pow(2.0, wordLength) - 1;

                // known bug
                var msb = base - (Math.pow(2.0, wordLength - crossoverPoint % wordLength) - 1);
                var lsb = base - msb;

                xy[k] = (xChromosone[k] & msb);

                // Crossover Y LSB.
                xy[k] += (yChromosone[k] & lsb);

                // Random mutaton.
                var rnd = getRandom(0, 1);

                if (rnd > (mutationRate)) {

                    xy[k] = mutate(xy[k]);
                    gMutations++;
                }



                k++;
            }

            // Crossover remaining words from Y.
            for (; k < this.chromosoneLength; k++) {

                xy[k] = yChromosone[k];

                // Random mutaton.
                var rnd = getRandom(0, 1);

                if (rnd > (mutationRate)) {

                    xy[k] = mutate(xy[k]);
                    gMutations++;
                }

            }

            //status(gMutations);
            ngChromosones[ngChromosones.length] = new Array();

            xy.forEach(function (key, value) {

                ngChromosones[ngChromosones.length - 1].push(value);

            });

        }


    }

    // Include parents - Parent pool survives WITHOUT evolving.


    //ngChromosones = ngChromosones.unique();

    //this.pool = this.poolgenePool.slice(0, 5);
    //this.pool = genePool.concat(ngChromosones);

    if (includeParents) ngChromosones = ngChromosones.concat(genePool.slice(0, 5));

    this.pool = ngChromosones;



}

GeneticAlgorithm.prototype.getWeights = function () {


    var result = new Array();

    this.pool.forEach(function (key, value) {

        // Convert (10-bit) number into +/- decimal.

        // TODO Decimal place adapts to word length. 
        result.push(((value - (Math.pow(2, wordLength) * .5)) * .01));

        //return ((this.weights[index] - (Math.pow(2, wordLength) / 2))).toFixed(2) //this.weights[index];

    });

    return result;

}

GeneticAlgorithm.prototype.getIndexToBinaryString = function (value) {


    var binary = new Array();
    var out = value.toString(2);
    while (out.length < wordLength) out = "0" + out;
    binary.push(out);

    return binary;

}

GeneticAlgorithm.prototype.getBinaryString = function (index) {


    var binary = new Array();
    this.pool[index].forEach(function (key, value) {

        var out = parseFloat(value).toString(2);
        while (out.length < wordLength) out = "0" + out;
        binary.push(out);
    });

    return binary;

}

GeneticAlgorithm.prototype.train = function () {

    var pool = this.pool;

    // Each chromosone.

    pool.forEach(function (pKey, value) {

        // Reset fitness.
        pool[pKey].fs = 0;

        // Each training set.
        trainingSets.forEach(function (tsKey, value) {

            inputs = trainingSets[tsKey][0];
            targets = trainingSets[tsKey][1];

            var results = NeuralNetwork.update(inputs, pool[pKey]);

            // Evaluate fitness and set new score.
            results.forEach(function (index, value) {

                var delta = Math.abs(targets[index] - results[index]);
                //                if (delta < .5) {

                delta *= delta;
                //              }

                pool[pKey].fs += delta;

            });

        });

    });


    // Order pool by lowest (best) fitness score.

    pool.sort(function (a, b) {
        return (a.fs) - (b.fs);
    });


    return;

}

//END GA


function end(pool) {

    // Training criteria met.

    endTime = new Date();

    document.getElementById('status').style.backgroundColor = "Green";
    status("Completed.");

    log("Total runtime: " + (endTime.getTime() - startTime.getTime()) + "ms");
    log("Epochs: " + count);

    outputs = NeuralNetwork.update(inputs, pool[0]);

    log("");
    log("Best match:");

    outputs.forEach(function (key, value) {
        log("Output: " + value);
    });

    log("Genome length " + pool[0].length + ":");
    log(NeuralNetwork.getWeights());

    inputs.forEach(function (key, value) {

        log(value + " ", 1);
    });

    return true;
}




function status(msg) { document.getElementById('status').innerHTML = msg; }

// Logging.
if (1); //(console.log) log = function (msg) { console.log(msg) };
else {
    function log(msg, lb, verb) {
        //verb
        // 9=Everything
        // 5=Info
        // 1=Errors only
        if (verb == undefined) verb = 5;
        if (!verbosity || verbosity < verb) return;
        if (verb == verbError) msg = "<br/ >" + "ERROR: " + msg;

        var log = document.getElementById("log");

        //linebreak flag
        if (!lb) msg += "<br />";

        //   msg += log.innerHTML;

        log.innerHTML += msg;


    }

}


