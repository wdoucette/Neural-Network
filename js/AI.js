function AI(args) {

    // TODO: Expose train methods.
    // TODO: Register callback
    poolSize = 2;

    if (typeof args == 'undefined') return new interfaceAI();
    
    else {

        this.Network = {};

        Trainer = function (args) {

            // Generate net
            var NetworkLayers = new FeedForward(args[0], args[1], args[2], args[3], args[4]);
            var seed = NetworkLayers.getWeights();
            var GA = new GeneticAlgorithm(seed.length, NetworkLayers.wordLength);
            GA.initPool(seed, poolSize);
            this.chromosoneIndex = 0;

            this.AutoEvaluate = function (dataSets, callback) {

                // TODO: fix this Global
                trainingSets = dataSets;
                GA.evaluatePool(NetworkLayers);
                callback(NetworkLayers.update(inputs));

            }

            this.DynamicEvaluate = function (inputs) {

                // TODO: fix this Global

                var results = NetworkLayers.update(inputs, GA.pool[this.chrmosoneIndex]);
                
                return results;
            }

            this.setFitness = function (fs) {

                GA.setChromosoneFS(fs, this.chromosoneIndex);

            }

            this.incChromosoneIndex = function () {

                this.chromosoneIndex++;
                if (this.chromosoneIndex == GA.pool.length) {

                    this.chromosoneIndex = 0;
                    GA.epoch();

                }

            }

            this.Evolve = function () {

                GA.epoch();
            }
            // send result
            // take fitness.
            // repeat
        }

        var Network = new Trainer(args);
        return Network;
        
    }
}


    function interfaceAI() {

    // This has to be called AFTER page load -not immediate.
    Interface = function () {

        //this.Lib = Lib;
        // Object representing the UI for controller interface. 
        //json interface.
        // Implements
        // Methods:
        // log(msg, lb)
        // status(msg, color)
        // Properties:
        // NeuralNetwork(arguments)
        // parameters

        var Obj = {

            // Get/Set.
            nInputs: function (value) {
                var el = document.getElementById("tbnInputs");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            nInputNeurons: function (value) {
                el = document.getElementById("tbnInputNeurons");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            nHidden: function (value) {
                el = document.getElementById("tbnHiddenLayers");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            nNeurons: function (value) {
                el = document.getElementById("tbnNeuronsPerHiddenLayer");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            nOutputs: function (value) {
                el = document.getElementById("tbnOutputs");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            chromosone: function (value) {
                el = document.getElementById("tbChromosone");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            response: function (value) {
                el = document.getElementById("tbResponse");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            weightFactor: function (value) {
                el = document.getElementById("tbWeightFactor");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            epoch: function (value) {
                el = document.getElementById("tbEpoch");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            maxEpochs: function (value) {
                el = document.getElementById("tbMaxEpochs");
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            netName: function (value) {
                el = document.getElementById('tbNetName');
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            setCount: function (value) {
                el = document.getElementById('nSets');
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            nTrainingSets: function (value) {
                el = document.getElementById('nSets');
                if (typeof value != 'undefined') {
                    el.value = value;
                }
                return el.value;
            },
            trainingSets: function (obj) {
                return obj.Lib.parseTrainingSets();
            },
            importNetwork: function (value) {
                Network.Lib.importNetwork(value);
            },
            initNetExport: function (print, save,obj) {
                obj.Lib.initNetExport(print, save);
            },

            status: function (msg, color) {

                el = document.getElementById('status');
                el.style.backgroundColor = color;
                el.innerHTML = msg;
                return;
            },

            log: function (msg, lb,obj) {
                obj.Lib.log(msg, lb);
            },

            validate: function () { }
        }

        return Obj;
    };


    // TODO: Rewrite.

    this.evaluateChromosone = function (n, navToggle) {

        var results;
        var ele;
        var match = "";

        var GA = this.GA;
        var Network = this.Network;


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

            results = Network.NetworkLayers.update(inputs, GA.pool[iCurrentChromosone]);

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
            // Shdow stats.

            // Print network json.
            this.Interface.initNetExport(true, false, this.Network);

            this.Interface.status("Completed.", "lightgreen");
            this.Interface.log("Completed.",false,this.Network);

            // Success
            return true;
        }

        else return false
    }


    this.exportNetwork = function () {

        var obj = {};

        obj.network = this.Network.NetworkLayers.snapshot();
        obj.chromosone = this.Network.GA.getTopChromosone(this.Network.NetworkLayers);
        obj.fs = obj.chromosone.fs;
        obj.version = this.Network.NeuralNetwork.version;
        obj.epoch = this.Network.NetworkLayers.count;
        obj.response = this.Network.NetworkLayers.CONSTResponse;
        obj.weightFactor = this.Network.GA.weightFactor;

        // obj...=...
        return obj;
    };


    this.ticks = function (obj) {

        var completed = false;

        // Pause ticker.
        clearInterval(this.ticksTimer);


        // Do stuff...

        this.GA.evaluatePool(this.Network.NetworkLayers);

        // Evaluate completion status.
        completed = this.evaluateChromosone(0);

        status("Epoch: " + (this.Network.NetworkLayers.count + 1));

        this.Network.NetworkLayers.count++;

        if (this.Network.NetworkLayers.count < maxEpochs && !completed) {

            // Resume.

            // Evolve network.
            this.GA.epoch(this.GA.pool.slice(0, poolSize));


            this.ticksTimer = setInterval(function (obj) {

                (function () {

                    setTimeout(function () { obj.ticks(obj) }, 1);

                }
                        )(obj);

            } (obj), 1);


        }

        // Else ticker remains suspended -wait for a UI event.
        else {    
        
        // Print current network.
            this.Interface.initNetExport(true, false, this);
        }

    }


    this.resume = function () {

        // Ensure UI hasen't changed network topology.
        this.createNetwork(this.Network); 
        
        // Reload an existing chromosone.
        if (typeof this.chromosone != 'undefined' && this.chromosone != "") {

            // Restoring previous network.

            // Load chromosone.
            this.GA.pool[0] = this.chromosone.split(',');

        }

        this.ticks(this.Network);

    }


    this.createNetwork = function (obj) {

        var nInputs;
        var nOutputs;
        var nHidden;
        var nNeurons;

        var epoch;

        var seed;
        var poolSize = 5;


        // Parse UI parameters.

        // TODO: UI.validate();
        nInputs = this.Interface.nInputs();
        nInputNeurons = this.Interface.nInputNeurons();
        nHidden = this.Interface.nHidden();
        nNeurons = this.Interface.nNeurons();
        nOutputs = this.Interface.nOutputs();
        this.chromosone = this.Interface.chromosone();
        weightFactor = this.Interface.weightFactor();
        response = this.Interface.response();
        epoch = this.Interface.epoch();
        maxEpochs = this.Interface.maxEpochs();
        trainingSets = this.Interface.trainingSets(obj);


        // Create a new Neural Network and Genetic Algorithm.
        this.NetworkLayers = new FeedForward(nInputs, nInputNeurons, nHidden, nNeurons, nOutputs);
        var seed = this.NetworkLayers.getWeights();
        this.GA = new GeneticAlgorithm(seed.length, this.Network.NetworkLayers.wordLength, this.Network);

        // Entry point.

        // Load current UI.
        //      this.registerUI(_UI.Interface());

        this.GA.initPool(seed, poolSize);
        this.Interface.status("Init.", "lightpink");

        // TODO: Update link upon export event.

        // Initalize UI outputs

        //UI.log();
        this.Interface.log(this.Network.NetworkLayers.neurons + " Neurons created.", false, this.Network);
        this.Interface.log(this.Network.NetworkLayers.synapses + " synapses.", false, this.Network);
        this.Interface.log("Network entropy: " + (this.Network.NetworkLayers.wordLength * this.Network.NetworkLayers.synapses).toExponential(),true, this.Network);

    }

        // Create UI Lib.
        this.Lib = new InterfaceLibrary();

        // Create Interface against UI.
        this.Interface = Interface(this.UI);

        // Register Interface.
        this.Lib.initInterface(this.Interface);

        // Initialize UI elements.
        this.Lib.initUI();

        // Instanciate Network Object and register Interface.
        this.NeuralNetwork = new NeuralNetwork(this.Interface);


        //Network = this; //.Network;
        this.Network = this;
        this.Lib.registerNetwork(this);
        this.Lib.attachEvents(this);

        //Network = this;
        return this; // Network;
    }


NeuralNetwork = function (interface) {

    //   this._UI = _UI;
    //   this._UI.initUI();
    this.Interface = interface;


    this.Network;
    this.GA;
    this.chromosone;

    // Wires NeuralNetwork with learning methods and algorithm.
    this.registerUI(this._UI);

    this.ticksTimer;
    this.version = "0.1";
    var sigFigures = 2;


    // TODO: Rewrite eval:
    iCurrentChromosone = 0;
    this.navDisabled = false;



    this.pause = function () {

        clearInterval(this.ticksTimer);

        this.UI.status("Paused.");
    }



    this.setWeightFactor = function (value) {

        //this.GA.weightFactor = value;
        this.NeuralNetwork.setWeightFactor(parseFloat(value));

    }


    this.setResponse = function (value) {

        //this.GA.weightFactor = value;
        this.NeuralNetwork.setResponse(parseFloat(value));

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


}

NeuralNetwork.prototype.registerUI = function (InterfaceLibrary) {

    // InterfaceLibrary is a JSON interface to UI view and events.
    this.UI = InterfaceLibrary;

}





// Type Prototypes.
Array.prototype.forEach = function (fn, obj) {

    // Pass key/value pairs to returning function.
    for (var i = 0; i < this.length; i++) {
        fn(i, this[i],obj);
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



    function status (msg) { document.getElementById('status').innerHTML = msg; }

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


    getRandom = function (min, max) {

        return max - (Math.random() * (max - min));

    }


    function slopeMC(value, inputMin,inputMax, toMin, toMax){

        // Returns m and c of slope.
        // Assumes input is offset 0, +/- (delta/2)
        var y1Min = (typeof toMin =='undefined') ? -6: toMin;
        var y1Max = (typeof toMax == 'undefined') ? 6 : toMax;

        var y2Min = inputMin;
        var y2Max = inputMax;

        var dy1 = (y1Min - y1Max);
        var dy2 = (y1Min - y1Max);

        var m = ((y1Max - y1Min) * .5) / ((y2Max - y2Min) * .5);
        var c = y1Min - m* y2Min;

        return value * m + c;

}


// Sigmoid conditioning levels.
var y1Min = -6;
var y1Max = 6;


// Max input levels.
var y2Min = 0;
var y2Max = 100;

// Resulting slope and offset.
var m = ((y1Max - y1Min) * .5) / ((y2Max - y2Min) * .5);
var c = y1Min - y2Min;
