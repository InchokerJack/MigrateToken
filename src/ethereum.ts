import detectEthereumProvider from '@metamask/detect-provider';
import { ethers, Contract } from 'ethers';
import tokenMigration from './config/token_migration.json';
import testOldSponToken from './config/testOldSponToken.json'

interface IBlockchain {
    tokenMigration: any,oldSpon:any
}

const getBlockchain = (): Promise<IBlockchain> =>
  new Promise( async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if(provider) {
      await (provider as any).request({ method: 'eth_requestAccounts' });
      const networkId = await (provider as any).request({ method: 'net_version' })
      provider = new ethers.providers.Web3Provider((provider as any));
      const signer = (provider as any).getSigner();
      const token_migration = new Contract(
          (tokenMigration as any).networks[networkId].address,
        tokenMigration.abi,
        signer
      );
        const oldSpon = new Contract(
            (testOldSponToken as any).networks[networkId].address,
            testOldSponToken.abi,
            signer
        );
      resolve({tokenMigration:token_migration,oldSpon});
      return;
    }
    reject('Install Metamask');
  });

export default getBlockchain;
