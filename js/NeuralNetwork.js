var random = false;
var weights;

// Log levels.
var verbosity = 9; // Everything.
var verbInfo = 5; // Info.
var verbError = 1; // Errors.

// Neural Network
var CONSTResponse = 1;
var wordLength = 10;    // 1024 10-bit resolution

// Genetic Algorithm
var seedSizeN = 5; // Returns 2^(n-1)
var mutationRate = .1;
var crossoverRate = 1;
var maxEpochs = 100;
var includeParents = true;// false;

// Solution paramaters
var trainingSets = new Array(); // Math.PI;
var accuracy = 100000; //100K

// Misc
var startTime;
var endTime;
var ticksTimer;
var count;
var gMutations = 0;
// = ["00", "10", "20", "30", "40"];//, "50", "60", "70", "80", "90"];
//var inputs = ["90", "80", "70", "60", "50", "40", "30", "20", "10", "00"];
//var inputs = ["00", "00", "00", "00", "00", "00", "00", "00", "00", "00"];


// Prototypes.
Array.prototype.forEach = function (fn) {

    // Pass key/value pairs to returning function.

    for ( var i = 0; i < this.length; i++) {
        fn(i, this[i]);
    }
};

Array.prototype.removeByIndex = function (arr, index) {
    arr.splice(index, 1);
}

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
function main() {

    // Resume.
    //if (typeof (weights) != "undefined") { resume(); return; }

    var nInputs;
    var nOutputs;
    var nHidden;
    var nNeurons;

    var Settings;
   
    var seed;
    var poolSize = 5;

    // Initialize.
    count = 0;

    // Parse setting from UI.
    Settings = getUISettings();
   
    // TODO: Validate settings.  
    // Settings.validate();
    nInputs =       Settings.nInputs;
    nInputNeurons = Settings.nInputNeurons;
    nHidden =       Settings.nHidden;
    nNeurons =      Settings.nNeurons;
    nOutputs =      Settings.nOutputs;

    maxEpochs =     Settings.maxEpochs;
    trainingSets =  Settings.trainingSets();

    // TODO: Encapsulate UI interface. 
    document.getElementById('status').style.backgroundColor = "Lightgray";
   
   
    // TODO: Implement log.clear().
    document.getElementById("log").innerHTML = "";

    // Create a new Neural Network and Genetic Algorithm.
    myNN = new NeuralNet(nInputs, nInputNeurons, nHidden, nNeurons, nOutputs);
    
    seed = myNN.getWeights();
    myGA = new GeneticAlgorithm(seed.length);
    
    myGA.initPool(seed,poolSize);
   
    log(myNN.neurons + " Neurons created.");
    log(myNN.synapses + " synapses.");
    log("Network entropy: " + (wordLength * myNN.synapses).toExponential());

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
    myGA.train();
    // Evaluate completion status.
    completed = navPool(0);
    
    status("Epoch: " + (count + 1));

    count++;

    if (count < maxEpochs && !completed ) {

        // Resume.

        // Evolve network.
        myGA.epoch(myGA.pool.slice(0, 5));
    
        ticksTimer = setInterval(function () {
            ticks();
        }, 1);
    }


    // Else ticker remains suspended -wait for a UI event.
}


function NeuralNet(nInputs, nInputNeurons, nHiddenLayers, nNeuronsPerHiddenLayer, nOutputs) {

    // TODO validate params.
//    for (i = 0; i < arguments.length; i++) {
//        alert(arguments[0].toString());
//        for (j = 0; j < arguments[i].length; j++) {
//            alert(arguments[i][j]);
//        }
//    
//    }
    this.neurons = 0;
    this.synapses = 0;
    
    this.nInputs = parseInt(nInputs);
    this.nInputNeurons = parseInt(nInputNeurons);
    this.nOutputs = parseInt(nOutputs);
    this.nHiddenLayers = parseInt(nHiddenLayers);
    this.nNeuronsPerHiddenLayer = parseInt(nNeuronsPerHiddenLayer);
    
    // Current weight array [nSynapses][wordLength].
    this.weights = new Array();

    // Define NeuralNetwork Layers:

    // Input layer.
    this.neuronLayer(this.nInputNeurons, this.nInputs);
   
    // Hidden layer(s).
    for (i = 0; i < this.nHiddenLayers; i++) this.neuronLayer(this.nNeuronsPerHiddenLayer, this.nNeuronsPerHiddenLayer);

    // Output layer.
    this.neuronLayer(this.nOutputs, (this.nNeuronsPerHiddenLayer == 0) ? this.nInputNeurons : this.nNeuronsPerHiddenLayer);

    
    function myPrivate() { } 

}

NeuralNet.prototype.setWeights = function (value) {

    this.weights = value;

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

    // Returns an individual synapse weight.
    var retval = ((this.weights[synapse] - (Math.pow(2, wordLength) * .5)) * .01);

    return retval;
}

NeuralNet.prototype.getBinaryWeight = function () {

    return this.weights;

}

NeuralNet.prototype.neuronLayer = function (nNeurons, nInputsPerNeuron) {

    // Make an array of neurons.

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
    for ( i = 0; i < this.nInputNeurons; i++ ) {

        // Program neuron's synapses.
        for ( j = 0; j < this.nInputs; j++ ) {

            activation += xInputs[j] * this.getWeight( offset++ );

        }
        // Bias conditioned to +/- 5.
        activation += (-1 * this.getWeight(offset));
        output.push( 5 - (sigmoid(activation, CONSTResponse)) * 10 );

        //Do next neuron in this layer
        activation = 0;
    }
    xInputs = output;
    output = new Array();

    // Each hidden layer.
    for (i = 0; i < this.nHiddenLayers; i++) {

        output = new Array();

        // Each neuron.
        for ( j = 0; j < this.nNeuronsPerHiddenLayer; j++ ) {

            // Calculate inputs of this neuron.
            for ( k = 0; k < xInputs.length; k++ ) {

                activation += xInputs[k] * this.getWeight( offset++ );
            }
            // Bias conditioned to +/- 5.
            activation += (-1 * this.getWeight( offset++ ));
            output.push( 5 - (sigmoid(activation, CONSTResponse)) * 10 );

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

            activation += xInputs[j] * this.getWeight( offset++ );
        }
        // Bias.
        activation += (-1 * this.getWeight( offset++ ));

        // Uncoditioned 0~1 output.
        output.push(sigmoid(activation, CONSTResponse));
        activation = 0;
        

    }

    return output;
}


function randomClamped() {

    // Returns a random wordLength number, E.g., 10 bit = 0~1023.
     
    return Math.floor( getRandom(0,1) * Math.pow(2, wordLength) );

}

function sigmoid(activation, response) {

    return 1 / (1 + Math.pow(Math.E, -activation / response));

}

function mutate(value) {

    // Returns value with bitwise mutation -flips a random bit. 
    
    // XOR bit mask.
    var mask;

    // 1 ~ wordLength
    mask = Math.round(Math.random() * Math.ceil(Math.log(Math.pow(2, wordLength)) / Math.log(2) - 1));
    
    // 2^(n-1) - 0,1,2,4,8...
    mask = Math.floor( Math.pow( 2, (mask - 1) ) );     

    // XOR of value.
    return (value ^ mask);

}


/////GA
function GeneticAlgorithm(chromosoneLength) {

// Holds the population
    this.pool = new Array();
    this.chromosoneLength  = chromosoneLength;
         
}


getRandom = function (min, max) {

    return max - (Math.random() * (max-min));


}
GeneticAlgorithm.prototype.initPool = function (seed, poolSize) {

    // Initialize pool with random values.

    // wordLength - bits per geneome.
    // size - population of chromosones (returns ~size^2-size, depending on crossoverRate )
    // seed - sample chromosone
    this.chromosoneLength = seed.length;

    var genePool = new Array();
    //genePool.push(seed);

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
        result.push(((value - (Math.pow(2, wordLength) * .5)) *.01));

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

            var results = myNN.update(inputs, pool[pKey]);

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

    outputs = myNN.update(inputs, pool[0]);

    log("");
    log("Best match:");

    outputs.forEach(function (key, value) {
        log("Output: " + value);
    });

    log("Genome length " + pool[0].length + ":");
    log(myNN.getWeights()); 

    inputs.forEach(function (key, value) {

        log(value + " ", 1);
    });

    return true;
}



function getUISettings() {

    result = { nInputs: document.getElementById("tbnInputs").value,
        nInputNeurons: document.getElementById("tbnInputNeurons").value,
        nHidden: document.getElementById("tbnHiddenLayers").value,
        nNeurons: document.getElementById("tbnNeuronsPerHiddenLayer").value,
        nOutputs: document.getElementById("tbnOutputs").value,
        maxEpochs: document.getElementById("tbMaxEpochs").value,
        nTrainingSets: document.getElementById('nSets').value,
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






/////////////////////////

function manualTest() {

    var inputs = document.getElementById('tbManualTest').value.split(',');
    var results = myNN.update(inputs, myGA.pool[navPoolIndex]);
    var output = "";
    results.forEach(function (key, value) {
        output += value.toFixed(0)+" ";
    });
    alert(output);
}



var navPoolIndex = 0;
var navDisabled = false;



function navPool(n, navToggle) {

    var results;
    var ele;
    var match = "";
    if (navToggle != undefined) {
        navDisabled = (navDisabled) ? false : true;
    }

    navPoolIndex += n; 

    if (navPoolIndex > myGA.pool.length - 1) navPoolIndex = 0;
    if (navPoolIndex < 0) navPoolIndex = myGA.pool.length - 1;

    document.getElementById('imgTitle').innerHTML = "Chromosone #: " + navPoolIndex + " ";
    document.getElementById('imgTitle').innerHTML += myGA.pool[navPoolIndex].fs; //parseFloat(value).toFixed(2) + " ";
    
    if (count % 500 == 0) {

        myGA.pool[0].forEach(function (key, value) {

            log(myGA.getIndexToBinaryString(value), 1);
          });
        log("");
         
          log("Mutations " + gMutations);
        
    }

    // Each training set.
    trainingSets.forEach(function (tsKey, value) {

        inputs = trainingSets[tsKey][0];
        targets = trainingSets[tsKey][1];

        results = myNN.update(inputs, myGA.pool[navPoolIndex]);

        ele = 'imgResult' + tsKey;
        document.getElementById(ele).innerHTML = "";
           

        results.forEach(function (index, value) {
            var html = parseFloat(value).toFixed(1)+"--";
            
            document.getElementById(ele).innerHTML += html + " ";
            if(targets[index] == Math.round(value)) match += targets[index];
        });

        document.getElementById(ele).innerHTML += "<br />";
    
    });

    nnToImg(document.getElementById('nnCanvas'));

    if (match.length == targets.length * trainingSets.length) {
        
        // Show stats.
        end(myGA.pool);
        
        // Success
        return true;
    }
    
    else return false
}

function nnToImg(canvas) {

    var ctx = canvas.getContext('2d');

    var size = myNN.synapses * wordLength;
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

    if (random) {
        data = new Array();
        for (i = 0; i < size / wordLength; i++) {
            var t = (Math.floor(Math.random() * Math.pow(2, wordLength) - 1).toString(2));
            while (t.length < wordLength) t = "0" + t;
            data.push(t);
        }
    } else data = myGA.getBinaryString(navPoolIndex);


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

