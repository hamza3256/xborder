const HDWalletProvider = require('truffle-hdwallet-provider')

const MNEMONIC = "camp sing true virtual uphold lizard dinosaur actual fiber fever palace weasel";
var MNEMONIC2 = "drip noodle cotton radio manual pet small toward diet copper castle return";
module.exports = {
  networks: {
    cldev: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    live: {
      provider: () => {
        //return new HDWalletProvider(process.env.MNEMONIC, process.env.RPC_URL)
        return new HDWalletProvider(MNEMONIC, "HTTP://127.0.0.1:8545")

      },
      network_id: '*',
      // Necessary due to https://github.com/trufflesuite/truffle/issues/1971
      // Should be fixed in Truffle 5.0.17
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.4.24',
    },
  },
}
