#include "stdafx.h"
//#include <stdlib.h>
//#include <crtdbg.h>
//#define _CRTDBG_MAP_ALLOC


#include <iostream>
//#include "conio.h"
#include <sstream> //cout << stringstream(mystr);
//#include <vector>
#include <string>
#include "math.h"
#include <regex>
#include "GeneticAlgorithm.h"
#include "Layer.h"	
#include "TemplateTest.h"



using namespace std;


const string INVALID_USAGE = "\n\nInvalid argument(s).\n\n\nUsage:\n\nnn.exe #Inputs #InputNeurons  #NeuronsPerHidden #HiddenLayers #Outputs";
string * mystrptr;

int myFunction (void);
bool getRegEx(string, const string&);

short mutate(short);
//float sigmoidConditioned(float, float);
bool getIntVal(string, short *);
short *tmp;
//void process(void);
	

class NeuralNetwork{

	char thisObjectNumber;
		float * myInputs;
		float * myOutputs;
		
	char nInputs;
	char nInputNeurons;
	char nNeuronsPerHiddenLayer;
	char nHiddenLayers;
	char  nOutputs;	
	char  totalNeurons;
	char  totalLayers;
	char seedSize;
	short chromosoneLength;
	short nSynapses;
	Layer * NetworkLayers;
	
	//	short weights[32000];

public:	
	short wordLength;
	// Class properties.
	static char objectCounter;
	GeneticAlgorithm * GA;

	// Instance properties.

	short getnInputs(){return nInputs;}
	short getnOutputs(){return nOutputs;}
	//float getWeight(int i){ return (float) weights[i] /100;}
	
	//void getOutputs(float*);
	void setWeights(short *value){ 

		//for (int i =0 ; i< chromosoneLength ;i++)
		//	weights[i] = *(value++);
	}



	// Class methods.
	static void externTest(int, int);

	// Instance methods.

	// Class constructor - No return type 
	NeuralNetwork(char nInputs, char nInputNeurons, char nHiddenLayers, char nNeuronsPerHiddenLayer, char nOutputs){
		
		seedSize =5;
			
		NeuralNetwork::nInputs = nInputs;
		NeuralNetwork::nInputNeurons = nInputNeurons;
		NeuralNetwork::nNeuronsPerHiddenLayer = nNeuronsPerHiddenLayer;
		NeuralNetwork::nHiddenLayers = nHiddenLayers;
		NeuralNetwork::nOutputs = nOutputs;
		NeuralNetwork::wordLength = 10;

		
		totalNeurons = nInputNeurons + nNeuronsPerHiddenLayer * nHiddenLayers + nOutputs;
		totalLayers = 2 + nHiddenLayers;
		
		//	_CrtDumpMemoryLeaks();
		
		// Build network.
		NetworkLayers = NeuralNetwork::init();
		// Inititialize GA
		GeneticAlgorithm::wordLength = NeuralNetwork::wordLength;
		GA = new GeneticAlgorithm(seedSize,nSynapses);
	
		// Prep
	/// Test cases 
		// TODO - read from specs from file.
		// eg, binary to BCD spec format.
		// 0,0,0,0 ; 0,0,0
		// 0,0,0,1 ; 0,0,1
		// 0,0,1,0 ; 0,1,0
		// 0,0,1,1 ; 1,0,0	
		// 0,1,0,0 ; 1,0,1

		int nTestCases =5;
		float one = -6.0;
		float zero = 6.0;

		TestCase * testCases;
		testCases = new TestCase[nTestCases];

		TestCase testCaseA;

		float myInputsA[3] = {zero,zero,zero};
		float myOutputsA[4] = {0,0,0,0};
		testCaseA.inputs = myInputsA; 
		testCaseA.targets = myOutputsA;
		testCases[0] = testCaseA;
	
		TestCase testCaseB;
	
		float myInputsB[3] = {zero,zero,one};
		float myOutputsB[4] = {0,0,0,1};
		testCaseB.inputs = myInputsB; 
		testCaseB.targets = myOutputsB;
		testCases[1] = testCaseB;

		TestCase testCaseC;
	
		float myInputsC[3] = {zero,one,zero};
		float myOutputsC[4] = {0,0,1,0};
		testCaseC.inputs = myInputsC; 
		testCaseC.targets = myOutputsC;
		testCases[2] = testCaseC;

		TestCase testCaseD;
		
		float myInputsD[3] = {zero,one,one};
		float myOutputsD[4] = {0,1,0,0};
		testCaseD.inputs = myInputsD; 
		testCaseD.targets = myOutputsD;
		testCases[3] = testCaseD;

		TestCase testCaseE;
	
		float myInputsE[3] = {one,zero,zero};
		float myOutputsE[4] = {1,0,0,0};
		testCaseE.inputs = myInputsE; 
		testCaseE.targets = myOutputsE;
		testCases[4] = testCaseE;

		// init 
		computeNetwork(myInputsA,GA->genePool[0], NetworkLayers);

		float result;

		for(int i= 0; i<150000; i++){
	
			testLoop(testCases, nTestCases, result) ;
			
			if(i%500 == 0) {
				
				testCaseResults(testCases,nTestCases);
			
				GA->dumpPool(0,5);
				cerr <<endl;
				GA->dumpPool(5,1);
				
				cerr << "Iteration: " <<i<<endl ;
				cerr << "Fitness: " << result <<endl;
				
			}
		
			
			if(result<0.1) {
				
				cerr << "Result found in " << i << " iterations.\n" ;
				cout << "Fitness: " << result << endl;
				testCaseResults(testCases, nTestCases);
				
				cout <<"Continue?\n";
				string str;
				getline(cin, str);
				if(str == "y") {i=0; continue;}
				else break;
			}
		
			if(i==149999) {
				testCaseResults(testCases, nTestCases);
				cout <<"Continue?\n";
				string str;
				getline(cin, str);
				if(str == "y") i=0;
			}
		}
		
		testCaseA.~TestCase();
		testCaseB.~TestCase();
		testCaseC.~TestCase();
		testCaseD.~TestCase();
		testCaseE.~TestCase();
		


};	


	struct TestCase {

public:
	
	float * targets;
	float * inputs;

	TestCase(){
		
	}

	~TestCase(){
		
	}

};

	void NeuralNetwork::testCaseResults(TestCase * testCases, short count){
	
		cout <<" Results:" <<endl;
			for(int i=0; i < count ; i++){
				computeNetwork(testCases[i].inputs,GA->genePool[0], NetworkLayers);
				dumpOutputs();
				cout << endl;
			}
	}

void NeuralNetwork::testLoop(NeuralNetwork::TestCase * testCases, int nTestCases, float& networkFitness){
	
		// Compare target vs actual outputs given an input set. 
		GA->epoch();
		evaluateNet(testCases, nTestCases);
		orderByFitness(networkFitness);
	
		// Display outputs.
		//computeNetwork(myInputsE,GA->genePool[0], NetworkLayers);
		//dumpOutputs();
		//GA->dumpPool(5);
		
		
		//GA->epoch();
	//	return 1;		
	}

	void NeuralNetwork::getOutputs(float* ptrOutputs){
		
		// Get outputs of final layer.
		NetworkLayers[Layer::layerCount-1].getOutputs(ptrOutputs);
		
		for(int i =0; i<nOutputs; i++){
		
			ptrOutputs[i] =Neuron::sigmoid(ptrOutputs[i]);// ((2 * ptrOutputs[i])/12 +1)/2;//Neuron::sigmoid(ptrOutputs[i]);
			 
		}
	
	}

	void NeuralNetwork::dumpOutputs(){
		
		float * ptrOutputs = new float[nOutputs];
		// Get outputs of final layer.
		getOutputs(ptrOutputs);
		//NetworkLayers[Layer::layerCount-1].getOutputs(ptrOutputs);
		cout << "\nOutputs:\n";
		for(int i =0; i<nOutputs; i++){
		
			stringstream out;
			//ptrOutputs[i] = Neuron::sigmoid(ptrOutputs[i]);
			out << ptrOutputs[i];
			cout <<i+1 << " " <<out.str() <<endl;
		
		}
	 cout << endl;
	 delete [] ptrOutputs;
	}


int NeuralNetwork::evaluateNet(TestCase * testCases, char tcCount){
	
	// Test and rank fitness of chromosones.
	for(int i=0; i<seedSize*seedSize; i++){

		// Reset chromosone.
		GA->chromosones[i].fs = 0;
		GA->chromosones[i].genePoolPtr = GA->genePool[i];
		
		float delta = 0;
		float result = 0;
		
		// Each test case
		for( int j = 0; j < tcCount; j++ ){
			
			// Program net inputs
			
			float * ptrInputs = testCases[j].inputs;
			float * pNetOutputs;
			pNetOutputs = new float[nOutputs];

			// Recompute network against current chromosone with test case's I/Os.
			
			computeNetwork(ptrInputs,GA->genePool[i], NetworkLayers);

			// Resulting outputs.
			getOutputs(pNetOutputs);
				
			// Accumulate error delta between desired targets and actual outputs.
			for( int k=0; k < nOutputs; k++ ){
				
				float target = testCases[j].targets[k];
				float output = pNetOutputs[k];
				
				delta = abs( target  - output );
				
				// Compensate rounding -may need adjustment with analog control net.
				if( delta < .5 ) {
					
					delta *= delta;
				}

				// Update fitness score.
				GA->chromosones[i].fs += delta;
			}
		
			// Next test case.
			delta = 0;	
			delete [] pNetOutputs;
		}
		// Next chromosone in pool.				
	}

	return 0;
}

void NeuralNetwork::orderByFitness(float& networkFitness){

	// Purcolates seedSize chromosones with LOWEST fitness score to top in seedSize passes.
	int iRef;

	
	// Start with a reference seed chromosone. 
	networkFitness =GA->chromosones[0].fs ;
		
	for( int i=0; i < seedSize; i++	) {
			
		iRef = 0;

			for( int j=i+1; j < seedSize*seedSize; j++ ) {
			
				if(GA->chromosones[j].fs == NULL) continue;

				// Compare reference to pool descendants.
				if( networkFitness > GA->chromosones[j].fs ) {
			
					// Found improved reference.
					networkFitness = GA->chromosones[j].fs;	
					iRef = j;
				}
			}
				
			
			if(iRef) {
									
				// Plant new seed.
				for( int k =0 ; k < GA->chromosoneLength; k++ ){
					
					GA->genePool[i][k] = GA->genePool[iRef][k];

					//seed random
					GA->genePool[4][k] = GA->getRandomClamped();
					
				}
				
				// Update status.
				if(i == 0) {
			
					cout << "New fs index: " <<i << " iRef: " << iRef<<" " << networkFitness << endl;
	
				}
				
			GA->chromosones[iRef].fs =NULL;		
			
			}
					}

// Plant new seed.
					
					for( int k =0 ; k < GA->chromosoneLength; k++ ){
					
						//seed random
						GA->genePool[4][k] = GA->getRandomClamped();
					}



}

	void NeuralNetwork::testCycle(int cycles){
	
		short * pool;
		float * pIn; 

		cerr << "Starting " << cycles <<" cycle test";
				
		for(int i=0;i<cycles;i++){
		if(i%1000 == 0) cerr <<".";
			pIn = new float[nInputs]; 
			//pool = new short[100];
	
			GA->initPool();
			for(int i=0 ; i < nInputs; i++){
				// Generate random inputs.
				pIn[i] =  (float)GeneticAlgorithm::getRandom(-50,50)/10;
			}
			
		 computeNetwork(pIn, GA->genePool[0], NetworkLayers);
			
			// Clean up.
			if(i< cycles-1) {
				
				delete []pIn;
			}
		}
	
		cerr << "\n" << cycles << " test cycles completed.\nDumping pool to STDOUT:\n";
		
		GA->dumpPool(0,25);

		// Clean up
		delete [] pIn;

	}

	
	Layer * NeuralNetwork::init(){
		
		unsigned short nNeurons;
		int i=0;
		nSynapses = 0; 

		Layer * pLayers = new Layer[totalLayers];
		
		// Input layer.
		
		nNeurons = nInputNeurons;	
		pLayers[i].config(nInputs, nNeurons, 0);
		nSynapses += nNeurons * (nInputs+1);
		
		for(; i< nHiddenLayers;i++){
		
			// Each hidden layer.
			
			// Get previous layer's outputs.
			nInputs = pLayers[i].getNeuronCount();
	
			// Set this layer's inputs.
			nNeurons = nNeuronsPerHiddenLayer;
			pLayers[i+1].config(nInputs, nNeurons, pLayers[i].getOffset());
			nSynapses += nNeurons * (nInputs+1);	
		}
			
			// Output layer.
			
			// Get previous layer's outputs.
			nInputs = pLayers[i].getNeuronCount();
			
			// Set this layer's inputs.
			nNeurons = nOutputs;
			pLayers[i+1].config(nInputs, nNeurons,pLayers[i].getOffset());
			nSynapses += nNeurons * (nInputs+1);
		
		return pLayers;
		
	}



	int NeuralNetwork::computeNetwork(float * pInputs, short * pool, Layer * pLayers){
		
		unsigned short nNeurons;
		
		int totalNeurons = nInputNeurons + nNeuronsPerHiddenLayer * nHiddenLayers + nOutputs;
		int totalLayers = 2 + nHiddenLayers;
		int i=0;
		float * pIn;
		
		// Set inputs.
		nNeurons = nInputNeurons;	
		pLayers[i].update(pInputs, pool);
		
		for(; i< nHiddenLayers;i++){
			// Each hidden layer.
			
			// Get previous layer's outputs.
			nInputs = pLayers[i].getNeuronCount();
			pIn = new float[nInputs];
			pLayers[i].getOutputs(pIn);
		
			// Set this layer's inputs.
			pLayers[i+1].update(pIn, pool);
			delete [] pIn;
			nNeurons = nNeuronsPerHiddenLayer;
		}
			
			// Output layer.
			
			// Get previous layer's outputs.
			nInputs = pLayers[i].getNeuronCount();
			pIn = new float[nInputs];
			pLayers[i].getOutputs(pIn);
			
			// Set this layer's inputs.
			nNeurons = nOutputs;
			pLayers[i+1].update(pIn, pool);
			delete [] pIn;

			// Get output layer's outputs.
			//pIn = new float[nOutputs];
			//pLayers[i+1].getOutputs(pIn);
				
			//delete [] pIn;		

			return 0;//pLayers;
		
	}


//Layer * init3(short * pool){
//		
//		short * weights =pool;
//		unsigned short nNeurons;
//		float * pIn;
//		int totalNeurons = nInputNeurons + nNeuronsPerHiddenLayer * nHiddenLayers + nOutputs;
//		int totalLayers = 2 + nHiddenLayers;
//		int iLayer;
//		int i;
//
//		Layer * pLayers = new Layer[totalLayers];
//		
//		// Input layer.
//		pIn = new float[nInputs];
//		
//		// Generate random inputs.
//		for(i=0 ; i < nInputs; i++){
//			pIn[i] =  GeneticAlgorithm::getRandom(-50,50)/10;
//		}
//
//		i =0;
//		
//		// Set inputs.
//		nNeurons = nInputNeurons;	
//		pLayers[i].config(nInputs, nNeurons, pIn, 0);
//		pLayers[i].setWeights(weights);
//		delete [] pIn;
//		
//		for(; i< nHiddenLayers;i++){
//			// Each additional hidden layer.
//			
//			// Get previous layer's outputs.
//			nInputs = pLayers[i].getNeuronCount();
//			pIn = new float[nInputs];
//			pLayers[i].getOutputs(pIn);
//		
//			// Set this layer's inputs.
//			//iLayer++;
//			pLayers[i+1].config(nInputs, nNeurons, pIn, pLayers[i].getOffset());
//			pLayers[i+1].setWeights(weights);
//			delete [] pIn;
//			nNeurons = nNeuronsPerHiddenLayer;
//		}
//			
//			// Output layer.
//			
//			// Get previous layer's outputs.
//			nInputs = pLayers[i].getNeuronCount();
//			pIn = new float[nInputs];
//			pLayers[i].getOutputs(pIn);
//			
//			// Set this layer's outputs.
//			nNeurons = nOutputs;
//			pLayers[i+1].config(nInputs, nNeurons, pIn,pLayers[i].getOffset());
//			pLayers[i+1].setWeights(weights);
//			delete [] pIn;
//
//			pIn = new float[nOutputs];
//			pLayers[i+1].getOutputs(pIn);
//
//			
//			cout.precision(2);
//			for(int i=0; i<nNeurons;i++){
//			
//		cout << fixed << "layer outputs : " << pIn[i] <<endl;
//		
//		}cout << endl;
//		
//		//delete [] pLayers;
//		delete [] pIn;		
//		
//		return pLayers;
//		
//	}

	void process(){
	
		cout.precision(2);
			
		float * ptrIn = new (nothrow) float[getnInputs()];
		float * ptrOut = new (nothrow) float[getnOutputs()];
		

		for(int i = 0; i< 1000; i++){
			
			// Set input 'test' values
			for(int i =0; i <getnInputs(); i++){
		
				ptrIn[i] = (float) GeneticAlgorithm::getRandom(-512,512)/100;//1;
			}
			
		
			for(int i=0; i < nOutputs; i++){
				cout << fixed << (ptrOut[i]);
				if(i<nOutputs-1) cout << ", ";
				
			}
			
			cout << endl;
			}

	}

	double round(double r) {
    return (r > 0.0) ? floor(r + 0.5) : ceil(r - 0.5);
}
	
};

char	NeuralNetwork::objectCounter ;




	bool getIntVal(string strConvert, short *result) { 

		// String must contain at least 1 digit.
		string regEx = "(\\d{1})";

		if(getRegEx(regEx, strConvert))	{

			// If the string is not a valid integer, zero will be returned. 
			*result = atoi(strConvert.c_str()); 
			return true;

		}
		else return false;
	}


	bool getRegEx(string regEx , const std::string& s) {

		static const regex e(regEx);

		//	bool rv = regex_match(str.begin(), str.end(), rx);

		return regex_match(s, e);

	}

		int _tmain(int argc, _TCHAR* argv[])
	{
		
		// Static 
//		NeuralNetwork::Layer::count =0;
	
		const char nArgs =5;

		char nOutputs;
		char nHiddenLayers;
		char nNeuronsPerHiddenLayer;
		char nInputNeurons; 
		char nInputs;

		string sArgs[nArgs];

		TemplateTest T;

		// TODO implement switches.
		// Parse arguments.
		try{ 
			if(argc <nArgs+1) {
				cerr << INVALID_USAGE << "\n\n\nExiting";
				return -1;
			}
		}
		catch(exception& e){ cerr << e.what() << endl;}

		try{
			for(int i = 1; i < nArgs+1; i++){
				while( *argv[i] != 0 ) {
					sArgs[i-1] += (char)( *argv[i]++ );
				}
			}

			// TODO crapping out with two-digit numbers.
			// Parse int from sArgs.	
			short  iArgs[nArgs];
			short * pPtr = iArgs;

			for(int i =0; i < nArgs; i++){
				if(!getIntVal(sArgs[i], pPtr)) throw(0);
				pPtr++;
			}

			// Initialize. 
			nOutputs =(char)*(--pPtr);
			nHiddenLayers = (char)*(--pPtr);
			nNeuronsPerHiddenLayer = (char)*(--pPtr);
			nInputNeurons = (char)*(--pPtr); 
			nInputs = (char)*(--pPtr);	

			if(nInputs ==0 || nOutputs <1 || nInputNeurons < 1 || (nHiddenLayers >0 && nNeuronsPerHiddenLayer <1)) {

				throw(0);
			}
		}
		catch(int){	
			cerr <<INVALID_USAGE << "\n\n"; 
			cerr <<"#Inputs " << nInputs << "\n#InputNeurons " << nInputNeurons << "\n#NeuronsPerHidden " << nNeuronsPerHiddenLayer << "\n#HiddenLayers " << nHiddenLayers << "\n#Outputs: " <<nOutputs << "\n\n";
			cerr << "Exiting.\n";
			return -1;
		}


		//////////////////////////////////
		// Seed rand().
		srand( time(NULL));

		// Initalize static member.
		NeuralNetwork::objectCounter = 0;

		// Define network. 
		NeuralNetwork myNN(nInputs,nInputNeurons,nNeuronsPerHiddenLayer, nHiddenLayers,nOutputs);	
		
		//myNN.GA->testInit(10000);		
		//myNN.testCycle(10000);
		//myNN.GA->epoch();

		// TODO cerr network topology
		// TODO some topologies crash -use cases.

		return 0;
	}


	
	
 