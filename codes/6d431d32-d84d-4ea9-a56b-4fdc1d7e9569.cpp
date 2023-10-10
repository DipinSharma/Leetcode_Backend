// C++ Program to show the
// use of usleep function
#include <iostream>
#include <unistd.h>

using namespace std;

int main()
{
	cout << "Take your Position\n";

	// sleep for 10 seconds
	cout << "Wait for 5 seconds\n";
	usleep(5000000);

	cout << "Run! Run!";
	return 0;
}
