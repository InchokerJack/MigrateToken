import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import Token_migration from './config/token_migration.json';
import testOldSponToken from './config/testOldSponToken.json'

const getBlockchain = () =>
  new Promise( async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if(provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const networkId = await provider.request({ method: 'net_version' })
      provider = new ethers.providers.Web3Provider(provider);
      const signer = provider.getSigner();
      const token_migration = new Contract(
        Token_migration.networks[networkId].address,
        Token_migration.abi,
        signer
      );
        const oldSpon = new Contract(
            testOldSponToken.networks[networkId].address,
            testOldSponToken.abi,
            signer
        );
      resolve({token_migration,oldSpon});
      return;
    }
    reject('Install Metamask');
  });

export default getBlockchain;
