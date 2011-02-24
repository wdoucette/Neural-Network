SOURCES=nn.cpp GeneticAlgorithm.cpp Layer.cpp Neuron.cpp
OBJECTS=$(SOURCES:.cpp=.o)
EXECUTABLE=NeuralNetwork
ALL_CFLAGS =  -Wall -g $(CFLAGS) 

#CONFIGURE_ARGS =

#//CFLAGS = -c -g -fpic -Wall -Wno-deprecated 

all: NeuralNetwork

NeuralNetwork: $(OBJECTS) 
	
	echo "Linking"
	$(CXX) $(LDFLAGS) -o $(EXECUTABLE) $(OBJECTS) 


$(OBJECTS): $(SOURCES)  
	
	echo "Compiling"
	$(CXX) -c $(ALL_CFLAGS) $(SOURCES) 

clean: 
	rm -rf ./*o


.PHONY : install 
install : 
	//cp libcppsocket.so /usr/lib/
	//cp $(headers) /usr/include/
	//cp $(headers) /usr/local/include/

.PHONY : clean
clean :
	rm -rf ./*o 
	


