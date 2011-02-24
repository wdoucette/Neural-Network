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
	static char wordLength;
	static short getRandom(int,int);
	static short mutate(short&);
	
	short ** genePool;

	bool dumpPool(short, short=NULL);
	void initPool();
	void testInit(int);
	int epoch();
	
	GeneticAlgorithm(char,char);
	~GeneticAlgorithm(void);

};

	
