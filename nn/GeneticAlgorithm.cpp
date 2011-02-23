#include "GeneticAlgorithm.h"



using namespace std;

char GeneticAlgorithm::wordLength=0;
typedef unsigned short ushort;


GeneticAlgorithm::GeneticAlgorithm(char seedSz, char chromosoneLn)
{
	seedSize = seedSz;
	chromosoneLength = chromosoneLn;

	weightFactor = .1;
	weightZero = 0;

	genePool = new short*[seedSize*seedSize];
	genePool[0] = NULL;
	
	chromosones = new Chromosone[seedSize*seedSize];
	
	initPool();


}




void GeneticAlgorithm::initPool() {

	// Clean up previous.
	deletePool();

	for(int i=0; i < seedSize * seedSize; i++){

		short * tmpArr =new short[chromosoneLength];

		for(int j = 0; j < chromosoneLength; j++){
		
			// +/- 2^wordLength. E.g., 10-bit = +/- (1024/2) 
			tmpArr[j] = getRandomClamped();	
			
		}
		genePool[i] = tmpArr;
		chromosones[i].genePoolPtr = tmpArr;
		// No need to delete [] tmpArr ptr **genePool[] has same addr;
	}

}

void GeneticAlgorithm::testInit(int cycles){

	for(int x=0;x< cycles;x++){

		initPool();

		for( int i=0; i<seedSize*seedSize; i++ ){		
		
			cerr << "Genome: \n";
			
			for( int j = 0; j<chromosoneLength; j++ ){
			
				cerr << (float)genePool[i][j] * weightFactor <<" ";
			}
			cerr << endl;
		}
		cerr << endl;

	}
}

void GeneticAlgorithm::deletePool(void){

	// Clean up.
	if(genePool[0]){
		for(int i=0; i < seedSize * seedSize ;i++){
			delete [] genePool[i];
		}
	}

}

short GeneticAlgorithm::getRandom(int min, int max){

	return rand()  % max + min/2; 

}

short GeneticAlgorithm::getRandomClamped(void){

	// +/- 2^wordLength/2
	return  getRandom(0, pow( 2.0,wordLength));// pow( 2.0, wordLength) / 2 - getRandom(0, pow( 2.0,wordLength));	


}

short GeneticAlgorithm::mutate(short& value) {

	// XOR random bit mask.

	// Get a random bit position 1~wordLength
	int mask = ( GeneticAlgorithm::getRandom(1, wordLength) );

	// Turn that bit on ... 2^(n-1) - 0,1,2,4,8...wordLength.
	mask = (int)floor(pow(2.0, (mask - 1)));     

	// XOR with value.
	value = value ^ mask;

	return 0;
}



bool GeneticAlgorithm::dumpPool(short start,short count){

	if (count == NULL) count =seedSize*seedSize; 

	if(genePool[0]){
		for(int i=start;i<start+count ;i++){		
			//		cerr << "Genome: \n";
			for(int j = 0; j<chromosoneLength; j++){
				cout << (float)genePool[i][j] ;
				if(j<chromosoneLength-1) cout <<",";
			}

			cout << endl;
		}
		cout << endl;
	}

	return 0;
}

int GeneticAlgorithm::epoch(){

	float crossoverRate = 1;
	float rnd = 0;
	int offset =0;
	int k = 0;
	mutationRate = .01	;
	
	// Push latent genes.
	// Apply roulette selection of fittess members
	
	
	// Step through parent gene pool.
	for (int i = 0; i < seedSize; i++) {

		// Inherit X from parent.
		short * x = genePool[i];

		// Process X against all other parent genomes
		for (int j=0 ; j< seedSize-1; j++) {

			int crossoverPoint = getRandom(0, wordLength*chromosoneLength);

			// Do not cross with self -n^(n-1) 
			//if (j == i) continue;

			rnd = getRandom(1,10);

			// Not tonight, I have a headache...
			if (rnd/10 > crossoverRate) {
			
				continue;
			}

			// Inherit Y from parent.
			short* y = genePool[j];

			// Apply crossover between two genomes.
			short *xy = new short[chromosoneLength]; 

			
	
		/////////////////
		
		// TODO ugly!
			int leftWords = (int)floor((double) (crossoverPoint/wordLength));
			
			
			for( k=0; k< leftWords ; k++ ){
			
				xy[k]=x[k];

					// Random mutaton.
				rnd = (float)getRandom(1,10);
		
				if( rnd/10 > mutationRate ){
			
					mutate(xy[k]);
					nMutations++;
			}
				
				
			}
		
			// Split point.
			if(leftWords){  
		//
		///////////////////////////	
							
				// Crossover X MSB.
				// 2^(n) -1 eg, 10-bit base = 1023 1111111111
				short base = pow( 2.0, wordLength ) -1;
				short msb = base - ( pow( 2.0, crossoverPoint % wordLength ) -1 );
				short lsb = base - msb;
				xy[k] = x[k] & msb;

				// Crossover Y LSB.
				xy[k] += y[k] & lsb;
				k++;
			}
	
			// Crossover remaining words from Y.
			for( ; k < chromosoneLength; k++ ){

				xy[k]=y[k];

				// Random mutaton.
				rnd = (float)getRandom(1,10)/10;
		
				if( rnd > mutationRate ){
			
						mutate(xy[k]);
						nMutations++;
				}
			
			}
		
			// Append new XY genome below parents. 
			for(int m =0; m<chromosoneLength;m++){

			genePool[ seedSize + offset][m] = xy[m];
			}
			
			offset++;
			//cerr << endl << crossoverPoint << endl;

			for(int m =0; m<chromosoneLength;m++){
			
				//cerr << x[m]<<" ";
			}
			
			//cerr << endl;
			
			for(int m =0; m<chromosoneLength;m++){
			
				//cerr << y[m]<<" ";
			}
			
			//cerr <<endl;
			
			for(int m =0; m<chromosoneLength;m++){
			
	//			cerr << genePool[ seedSize + (--offset)++][m] <<" ";
			}
		//cerr << endl;
			//cerr << endl;
			// Clean up.
			delete [] xy;
			
		}
		
		//cerr << endl; 
	
	}

	return 0;
}

GeneticAlgorithm::~GeneticAlgorithm(void)
{
	//delete stuff
}



