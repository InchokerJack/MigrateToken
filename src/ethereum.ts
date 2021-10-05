import detectEthereumProvider from '@metamask/detect-provider';
import {Contract, ethers} from 'ethers';
import tokenMigration from './config/token_migration.json';
import testOldSponToken from './config/testOldSponToken.json'
import testNewSponToken from './config/testNewSponToken.json'

interface IBlockchain {
    tokenMigration: any,
    oldSpon: any,
    newSpon: any,
}

const getBlockchain = (): Promise<IBlockchain> =>
    new Promise(async (resolve, reject) => {
        try {
            let provider = await detectEthereumProvider();
            if (provider) {
                const result = await (provider as any).request({method: 'eth_requestAccounts'});
                console.log(result)
                const networkId = await (provider as any).request({method: 'net_version'})
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
                const newSpon = new Contract(
                    (testNewSponToken as any).networks[networkId].address,
                    testNewSponToken.abi,
                    signer
                );
                resolve({tokenMigration: token_migration, oldSpon, newSpon});
                return;
            }
        } catch (e) {
            reject(e)
        }
            reject('Install Metamask');
    });

export default getBlockchain;
