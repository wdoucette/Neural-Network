#pragma once

class Neuron
{
	unsigned short nInputs;
	float   pOutput;
	short * pWeights; 
	float activation;

public:
	float * pInputs;
	float static sigmoid(float);
	float static sigmoidConditioned(float);
	float scaleWeight(float);
	

	static const float CONST_RESPONSE;
	static const float e;

	float getOutput(void);
	void config(unsigned short);
	void update(float *, short *);
	//void Neuron::Neuron::setInputs(float *);
	
	Neuron(void);
	~Neuron(void);



};

