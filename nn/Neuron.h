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
	float Neuron::scaleWeight(float);
	

	static const float CONST_RESPONSE;
	static const float e;

	float Neuron::getOutput(void);
	void Neuron::config(unsigned short);
	void Neuron::update(float *, short *);
	//void Neuron::Neuron::setInputs(float *);
	
	Neuron(void);
	~Neuron(void);



};

