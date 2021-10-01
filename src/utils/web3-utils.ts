import { providers, utils, BigNumber, Contract, constants, ContractInterface } from "ethers";

import { CHAIN_ID, ETHERSCAN_PREFIX } from "./env-utils";

// the window injected web3 library
export const getInjectedWeb3Lib = (): any => (window as any).ethereum || (window as any).web3;

/**
 * check if the window has injected web3 library
 */
export const hasInjectedWeb3 = (): boolean => !!getInjectedWeb3Lib();

/**
 * check if has meta mask
 */
export const hasMetaMask = (): boolean => getInjectedWeb3Lib()?.isMetaMask;

/**
 * get the provider from the connector
 * @param connector
 */
export const getLibrary = (
  connector: providers.ExternalProvider | providers.JsonRpcFetchFunc,
): providers.Web3Provider => {
  const provider = new providers.Web3Provider(connector, CHAIN_ID);
  provider.pollingInterval = 15000;
  return provider;
};

/**
 * returns the checksum address if the address is valid, otherwise returns false
 * @param value
 */
export const isAddress = (value: any): string | false => {
  try {
    return utils.getAddress(value);
  } catch {
    return false;
  }
};

/**
 * get etherscan link
 * @param data
 * @param type
 */
export const getEtherscanLink = (
  data: string,
  type: "transaction" | "token" | "address" | "block",
): string => {
  const uri = `https://${ETHERSCAN_PREFIX}etherscan.io`;

  switch (type) {
    case "transaction": {
      return `${uri}/tx/${data}`;
    }
    case "token": {
      return `${uri}/token/${data}`;
    }
    case "block": {
      return `${uri}/block/${data}`;
    }
    default: {
      return `${uri}/address/${data}`;
    }
  }
};

/**
 * calculate gas margin
 * @param value
 */
export const calculateGasMargin = (value: BigNumber): BigNumber =>
  value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));

/**
 * get signer
 * @param library
 * @param account
 */
export const getSigner = (
  library: providers.Web3Provider,
  account: string,
): providers.JsonRpcSigner => library.getSigner(account).connectUnchecked();

/**
 * get provider or signer if account is availabel
 * @param library
 * @param account
 */
export const getProviderOrSigner = (
  library: providers.Web3Provider,
  account?: string,
): providers.Web3Provider | providers.JsonRpcSigner =>
  account ? getSigner(library, account) : library;

/**
 * get contract
 * @param address
 * @param ABI
 * @param library
 * @param account
 */
export const getContract = <T extends Contract = Contract>(
  address: string,
  ABI: ContractInterface,
  library: providers.Web3Provider,
  account?: string,
): T => {
  if (!isAddress(address) || address === constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account) as any) as T;
};

// shorten the check-sum version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
  const parsed = isAddress(address);
  if (!parsed) {
    console.error(`Invalid 'address' parameter '${address}'.`);
    return address;
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
};

export const getLatestEventFilter = <T extends Contract = Contract>(
  contract: T,
  eventName: keyof T["filters"],
) =>
  ({
    ...contract.filters[eventName as string]?.apply(null, []),
    fromBlock: "latest",
  } as any);
