SOURCEPATH=./src/
INSTALLPATH=../Release
SOURCES=nn.cpp GeneticAlgorithm.cpp Layer.cpp Neuron.cpp
OBJECTS=$(SOURCES:.cpp=.o)
EXECUTABLE=NeuralNetwork
ALL_CFLAGS =  -Wall -g $(CFLAGS) 

#CONFIGURE_ARGS =

#//CFLAGS = -c -g -fpic -Wall -Wno-deprecated 

all: NeuralNetwork install

NeuralNetwork:$(OBJECTS)
	
	@echo Linking
	cd $(SOURCEPATH); $(CXX) $(LDFLAGS) -o $(EXECUTABLE) $(OBJECTS) 


$(OBJECTS):  
	
	@echo Compiling
	cd $(SOURCEPATH); $(CXX) -c $(ALL_CFLAGS) $(SOURCES) 
	
.PHONY : install 
install:  
	@echo Installing
	cd $(SOURCEPATH); chmod +x NeuralNetwork 
	cd $(SOURCEPATH); mv NeuralNetwork $(INSTALLPATH)
	@echo Done
#	//cp $(headers) /usr/include/
#	//cp $(headers) /usr/local/include/

.PHONY : clean
clean:
	cd $(SOURCEPATH); rm -rf ./*o 


