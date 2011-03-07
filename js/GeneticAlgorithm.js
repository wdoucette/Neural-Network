//  NeuralNetwork API Copyright 2011 Wayne Doucette, http://wayne-doucette.blogspot.com.
//  All rights reserved.
//  Simplified BSD License _Appllies.


function GeneticAlgorithm(chromosoneLength,wordLength) {

    // Genetic Algorithm
    this.wordLength =wordLength;
    this.mutationRate = .01;
    this.crossoverRate = 1;
    var maxEpochs = 100;
    this.includeParents = true;


    // Holds the population.
    this.pool = new Array();
    this.chromosoneLength = chromosoneLength;

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

            value.push(Math.floor(getRandom(0, 1) * Math.pow(2, this.wordLength)));
        }

        genePool.push(value);
    }

    this.pool = genePool;
}

GeneticAlgorithm.prototype.getTopChromosone = function () {

    // calc fs
    this.evaluatePool()
    return this.pool[0];

}

GeneticAlgorithm.prototype.epoch = function (genePool) {

    // Push latent genes.
    // genePool.push(latentGenome);

    var ngChromosones = new Array();

    // _Apply genetic crosssover 70% chance.
    // _Apply genetic mutation .1% chance.
    // _Apply roulette selection of fittess members
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
            var crossoverPoint = Math.round(getRandom(0, 1) * this.wordLength * this.chromosoneLength);

            // Do not cross with self
            //if (j == i) continue;


            // Not tonight, I have a headache...
            if (getRandom(0, 1) > this.crossoverRate) continue;

            // Inherit yChromosone from parent.
            genePool[j].forEach(function (key, value) {

                yChromosone.push(value);

            });


            // _Apply crossover between genomes creating a next-generation chromosone.

            var xy = new Array();
            var leftWords = Math.floor(crossoverPoint / this.wordLength);

            for (k = 0; k < leftWords; k++) {

                xy[k] = xChromosone[k];
                var rnd = getRandom(0, 1); // Math.floor(Math.random() /this.mutationRate) + 1;

                if (rnd > (this.mutationRate)) {

                    xy[k] = this.mutate(xy[k]);
                    this.gMutations++;

                }
            }

            // Split point.
            if (leftWords) {
                //
                ///////////////////////////	

                // Crossover X MSB.
                // 2^(n) -1 eg, 10-bit base = 1023 1111111111
                var base = Math.pow(2.0, this.wordLength) - 1;

                // known bug
                var msb = base - (Math.pow(2.0, this.wordLength - crossoverPoint % this.wordLength) - 1);
                var lsb = base - msb;

                xy[k] = (xChromosone[k] & msb);

                // Crossover Y LSB.
                xy[k] += (yChromosone[k] & lsb);

                // Random mutaton.
                var rnd = getRandom(0, 1);

                if (rnd > (this.mutationRate)) {

                    xy[k] = this.mutate(xy[k]);
                    this.gMutations++;
                }



                k++;
            }

            // Crossover remaining words from Y.
            for (; k < this.chromosoneLength; k++) {

                xy[k] = yChromosone[k];

                // Random mutaton.
                var rnd = getRandom(0, 1);

                if (rnd > (this.mutationRate)) {

                    xy[k] = this.mutate(xy[k]);
                    this.gMutations++;
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

    if (this.includeParents) ngChromosones = ngChromosones.concat(genePool.slice(0, 5));

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
    while (out.length < this.wordLength) out = "0" + out;
    binary.push(out);

    return binary;

}

GeneticAlgorithm.prototype.getBinaryString = function (index) {


    var binary = new Array();
    this.pool[index].forEach(function (key, value) {

        var out = parseFloat(value).toString(2);
        while (out.length < this.wordLength) out = "0" + out;
        binary.push(out);
    });

    return binary;

}

GeneticAlgorithm.prototype.evaluatePool = function () {

    var pool = this.pool;

    // Each chromosone.

    pool.forEach(function (pKey, value) {

        // Reset fitness.
        pool[pKey].fs = 0;

        // Each training set.
        trainingSets.forEach(function (tsKey, value) {

            inputs = trainingSets[tsKey].inputs;
            targets = trainingSets[tsKey].outputs;

            var results = __App.NeuralNetwork.update(inputs, pool[pKey]);

            // Evaluate fitness and set new score.
            results.forEach(function (index, value) {

                var delta = Math.abs(targets[index] - results[index]);

                // LMS 
                delta *= delta;

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



GeneticAlgorithm.prototype.mutate = function(value) {

    // Returns value with bitwise mutation -flips a random bit. 

    var mask;

    // 1 ~ wordLength
    mask = Math.round(Math.random() * Math.ceil(Math.log(Math.pow(2, this.wordLength)) / Math.log(2) - 1));

    // 2^(n-1) - 0,1,2,4,8...
    mask = Math.floor(Math.pow(2, (mask - 1)));

    return (value ^ mask);

}
//END GA

