
This directory is a truffle project with the following sub-directories:

Build (compiled contracts)
migrations (instructions for deployment)
test (unit tests)

It is recommended you test this using a Windows based machine. To test the contract do the following terminal commands in the folder:

npm install
npm install -g ganache-cli
ganache-cli
(in a new tab) truffle test
