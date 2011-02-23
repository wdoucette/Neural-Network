//#include "StdAfx.h"
#include "Neuron.h"
#include "iostream"
#include "math.h"
#include "GeneticAlgorithm.h"

using namespace std;

const float Neuron::CONST_RESPONSE = 1.0;
const float Neuron::e = 2.71828182845904523536;
	
Neuron::Neuron()	{
	
	//pInputs = new float[1];
	//nInputs = 0;
	
	}


void Neuron::config(unsigned short nIn){

	nInputs = nIn;
	pInputs = new float[nIn];

	
}

void Neuron::update(float * pIn, short * pWs){

	pWeights = pWs;
	
	for(int i = 0; i< nInputs;i++){
	pInputs[i] = pIn[i];
	//cout << "neuron inputs: " << pInputs[i] << " weight: " << pWeights[i] <<endl;

}
}

float  Neuron::getOutput(){
	
		int i = 0;
		activation = 0;
	
		for(i = 0; i< nInputs; i++){
			
			activation += pInputs[i] * scaleWeight(pWeights[i]);	
		}
	
		activation += ( -1 * scaleWeight(pWeights[i])  );
		pOutput = sigmoidConditioned( activation );

	return pOutput;

}

// Scale short weight to fp
float Neuron::scaleWeight(float value)

{ 
	value = (value - pow(2.0,GeneticAlgorithm::wordLength)/2) /100 ;
	return value;

}


float Neuron::sigmoidConditioned(float value) {

	value = 5 - sigmoid(value) *10;
	return  value;
		
}


float Neuron::sigmoid(float activation){
	
	activation = 1 / (1 + pow(e, -activation / CONST_RESPONSE));
	return activation;

}



Neuron::~Neuron(void)
{

	//	cout << "neuron destructor called \n"; 
	delete [] pInputs;
	
}
