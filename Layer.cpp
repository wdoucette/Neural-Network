//#include "StdAfx.h"	
//#include "iostream"
#include "Layer.h"

using namespace std;

char Layer::layerCount=0;

Layer::Layer(){
	
	layerCount++;
	layerId = layerCount;
}

void Layer::config(unsigned short nI, unsigned short nN, int offset){

	nNeurons = nN;
	nInputs = nI;
	
	nSynapses = nNeurons * (1 + nInputs); 
	nOffset = offset + nSynapses;
	
	// This layer's empty neuron set.
	pNeurons = new Neuron[nNeurons];
	
	for(int i=0;i<nNeurons;i++){
	
		pNeurons[i].config(nInputs); 
	}

}
void Layer::update(float * pIn, short * pWeight){

	for(int i=0; i<nNeurons; i++){

		// Point weight to first input of each neuron 
		pNeurons[i].update(pIn,  & pWeight[nOffset-nSynapses +  i* (nInputs+1) ]);
	}
}

char Layer::getNeuronCount(void){

	return nNeurons;

}

int Layer::getOffset(void){

	return nOffset;

}


void Layer::getOutputs(float* out){
	

	for(int i=0; i<nNeurons; i++){

		 out[i] = pNeurons[i].getOutput();

	}

}

Layer::Layer(float * finalOutput){

	// Overload Layer's output pointer in case of the final output layer

}

int Layer::getSynapsesCount(void){

	return nSynapses;
}

Layer::~Layer(void)
{

delete [] pNeurons;

}
	
	
