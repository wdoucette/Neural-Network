#pragma once
#include "Neuron.h"

class Layer
{		
		char layerId;
		unsigned short nInputs;
		//unsigned short nOutputs;
		unsigned short nNeurons;
		
		//float * pInputs;	
		int nSynapses;
		Neuron* pNeurons;
		int nOffset;
public:

	static char layerCount;

	//float * pOutputs;
	int getSynapsesCount(void);
	int getOffset(void);
	void getOutputs(float*);
	char getNeuronCount(void);
	void update(float *, short *);
	void config(unsigned short, unsigned short, int);
	Layer();
	Layer(float *);
	~Layer(void);
	
};

