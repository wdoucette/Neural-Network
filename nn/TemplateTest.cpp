#include "StdAfx.h"
#include "TemplateTest.h"
#include "iostream"


using namespace std;

template <class T, typename U> 
	T GetMax (T a, U b) {
	return (a>b?a:b);
	}

template <class T>
	class mypair{
	T a, b;

	public:
		mypair(T first, T second)
		{a=first; b=second;}

		T getMax();
		T getMin() {
				return (a<b)?a:b;
		}
		
	};
	
	template <class T> 
	T mypair<T>::getMax(){
	
		T retval;
		retval = (a>b)?a:b;
		return retval;
	}
	
	class Class{
		
		int mySize;
		
	public:
		int * array ;
		
		Class(int x) : array(new int[x]) {
			
			mySize = x;
			cout << "instanciating array, size is: " <<mySize << endl;
			
		} ;
	
		int getSize(){return mySize;}
	};
	
int TemplateTest::myFunction(void){

		//mystrptr = &mystring;
		//*mystrptr = *mystrptr + " Doucette";

		//cout << "Pointer value is: "  << *mystrptr;
		//catch (int) { cerr << "caught int\n"; }
		//catch (bad_exception be) { cerr << "caught bad_exception\n"; }
		//catch(...) { return -1; }//cerr << "caught other exception (non-compliant compiler?)\n"; }


		// Dynamic memory;
		/*	NeuralNetwork * pointer;
		pointer = new (nothrow) NeuralNetwork[10000];

		if(pointer == 0){
		cout << "Dynamic allocation failed.";
		}else cout << "Dynamic allocation succeeded.";
		*/	

		/*	for(int i =0; i<1000; i++){
		count++;
		fp = *(ptr++);
		fp /= 100;
		cout << fp;
		if(i<999) cout << ",";
		}
		cerr << "Total values: " << count;

		*/
		
	// Overrides

	//	NeuralNetwork operator + (NeuralNetwork);	
	/*NeuralNetwork NeuralNetwork::operator + (NeuralNetwork param){

		NeuralNetwork tmp(2,2,3,1,3);
		tmp.classString = classString + " + " + param.classString;
		return tmp;
	}
*/
//		class Class{
//
//	int mySize;
//
//public:
//	float * array ;
//
//	Class(int x) : array(new float[x]) {
//
//		mySize = x;
//	//	cout << "instanciating array, size is: " <<mySize << endl;
//
//	} ;
//
//	int getSize(){return mySize;}
//};


		typedef unsigned int WORD;
		typedef char * pChar;
		const int nArgs = 5;

		struct myStruct{
			int a;
			string name;
			pChar ptr;

		} declOptStructObjs ;

		myStruct * testStruct;
		testStruct = &declOptStructObjs;

		testStruct->name ="this is my name";
		declOptStructObjs.a =007;

		//union mix_t {
		//	long l;
		//	struct {
		//		short hi;
		//		short lo;
		//	} s;//or anonomous
		//	char c[4];
		//} mix;

		/*enum months_t { january=1, february, march, april,
		may, june, july, august,
		september, october, november, december} y2k;
		months_t myMonths = january;

		if(myMonths ==1) cout << "January is "  << january;
		*/

		//struct structParams{
		//	short nInputs;
		//	short nInputNeurons;
		//	short nNeuonsPerHiddenLayer;
		//	short nHiddenLayers;
		//	short nOutputs;

		//} * sParams;

		return 0;
	} 



	
	TemplateTest::TemplateTest(void) {


	}

TemplateTest::~TemplateTest(void)
{
}
