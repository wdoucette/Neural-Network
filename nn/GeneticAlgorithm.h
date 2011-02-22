#pragma once
#include <string>
#include <math.h>
#include <iostream>
#include <time.h>

struct Chromosone {

	
	// Holds fitness score.	
	float fs;

	// genePool ref
	short * genePoolPtr;

	float getFS(void){

		return fs;
	}

	void setFS(float value){
		
		fs = value;
	}
	~Chromosone(){}
};
	


class GeneticAlgorithm
{
	char seedSize;
	float weightFactor;
	float weightZero;
	float mutationRate;
	int nMutations;
	
	void deletePool(void);

public:

	Chromosone * chromosones;
	char chromosoneLength;
	short getRandomClamped(void);
	static char GeneticAlgorithm::wordLength;
	static short GeneticAlgorithm::getRandom(int,int);
	static short GeneticAlgorithm::mutate(short&);
	
	short ** genePool;

	bool GeneticAlgorithm::dumpPool(short, short=NULL);
	void GeneticAlgorithm::initPool();
	void GeneticAlgorithm::testInit(int);
	int GeneticAlgorithm::epoch();
	
	GeneticAlgorithm(char,char);
	~GeneticAlgorithm(void);

};

	