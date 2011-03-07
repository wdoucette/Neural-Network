//  NeuralNetwork API Copyright 2011 Wayne Doucette, http://wayne-doucette.blogspot.com.
//  All rights reserved.
//  Simplified BSD License _Appllies.
// https://spreadsheets.google.com/ccc?key=0AvzKco15_YcGdDk2WTFDV1RiSkpTZlRXOHNjSTZMd2c&hl=en


function FeedForward(nInputs, nInputNeurons, nHiddenLayers, nNeuronsPerHiddenLayer, nOutputs) {


    // TODO validate params.
    // Misc
   
    this.count = 0;

    this.startTime;// = new Date();
    this.endTime;

    var poolSize = 5;
    
    this.CONSTResponse = .85;
    this.wordLength = 10;    // 1024 2^n resolution
    this.gMutations = 0;

 
    this.neurons = 0;
    this.synapses = 0;
    this.nInputs = parseInt(arguments[0]);
    this.nInputNeurons = parseInt(arguments[1]);
    this.nHiddenLayers = parseInt(arguments[2]);
    this.nNeuronsPerHiddenLayer = parseInt(arguments[3]);
    this.nOutputs = parseInt(arguments[4]);
   
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

FeedForward.prototype.snapshot = function () {

    var args = new Array();
    args.push(this.nInputs);
    args.push(this.nInputNeurons);
    args.push(this.nHiddenLayers);
    args.push(this.nNeuronsPerHiddenLayer);
    args.push(this.nOutputs);


    return args;   

}


FeedForward.prototype.setWeights = function (value) {
   

    if (typeof (value) == "object") {

        this.weights = value;
        return 0;

    }

    else return -1;

}

FeedForward.prototype.update = function (inputs, newWeights) {

    // TODO trap params.
    if (typeof inputs == "object" && inputs.length != this.nInputs) {

        throw ("input length descreptancy in FeedForward.prototype.update.");
        return -1;
    }
    else if (typeof inputs == "string" && inputs != nInputs) {

        throw ("input length descreptancy in FeedForward.prototype.update.");
        return -1;
    }

    //if (typeof newWeights != "object" || newWeights.length != this.weights.length) throw ("weight length descreptancy in FeedForward.prototype.update.");

    // Load new weights.
    this.weights = newWeights;

    return this.getOutput(inputs);
}

FeedForward.prototype.getWeights = function () {

    return this.weights;
}


FeedForward.prototype.getWeight = function (synapse) {

    // Returns an individual synapse's weight.
    var retval = ((this.weights[synapse] - (Math.pow(2, this.wordLength) * .5)) * .01);

    return retval;
}

FeedForward.prototype.getBinaryWeight = function () {

    return this.weights;

}

FeedForward.prototype.neuronLayer = function (nNeurons, nInputsPerNeuron) {

    // Create neurons.
    for (var i = 0; i < nNeurons; i++) {

        this.neuron(nInputsPerNeuron);
    }
}

FeedForward.prototype.neuron = function (nInputs) {
    
    for (var i = 0; i < nInputs + 1; ++i) {

        this.synapses++;
       
        // Set up weights with an initial random value.
        this.weights.push(randomClamped());
    
    }

    this.neurons++;
}

FeedForward.prototype.getOutput = function (xInputs) {

    var output = new Array();
    var i, j, k;
    var activation = 0;
    var offset = 0;
    var synapses = 0;

    // TODO: validate slope calculations esp signs, m.
    // Calculate slope and offset.

    // Sigmoid conditioning levels.
    var y1Min = -6;
    var y1Max = 6;

    // TODO: set input levels from trainingSets min/max 
    // Max input levels.
    var y2Min = -5;
    var y2Max = 5;

    // Resulting slope and offset.
    var c = ((y1Max - y1Min) * .5) / ((y2Max - y2Min) * .5);
    var m = y1Min - y2Min;

    var outputType = "Binary";

    // Recures network layers: input, nHiddenLayers and output to calculate and
    // return the NN's output(s)

    //TODO trap xInputs;
    if (this.nInputs != xInputs.length) throw ("Error: Inputs length discreptancy in FeedForward.prototype.getOutput");


    // Each neuron in input layer.
    for (i = 0; i < this.nInputNeurons; i++) {

        // Program neuron's synapses.
        for (j = 0; j < this.nInputs; j++) {

            activation += (c * xInputs[j] + m) * this.getWeight(offset++);

        }
        // Bias conditioned to +/- 5.
        activation += (-1 * this.getWeight(offset));
        output.push(c * (this.sigmoid(activation, this.CONSTResponse)) + m);

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
            output.push(c * (sigmoid(activation, CONSTResponse)) + m);

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
        output.push(this.sigmoid(activation, this.CONSTResponse));
        activation = 0;


    }

    return output;
}


function randomClamped() {

    // Returns a random wordLength number, E.g., 10 bit = 0~1023.

    return Math.floor(getRandom(0, 1) * Math.pow(2, this.wordLength));

}

FeedForward.prototype.sigmoid = function (activation, response) {

    return 1 / (1 + Math.pow(Math.E, -activation / response));

}

