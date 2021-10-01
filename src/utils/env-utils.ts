/**
 * environment name
 */
export const ENVIRONMENT: "development" | "staging" | "production" =
  (process.env.NODE_ENV as any) ?? "development";

/**
 * is production build
 */
export const IS_PRODUCTION: boolean = ENVIRONMENT === "production";

/**
 * is staging build
 */
export const IS_STAGING: boolean = ENVIRONMENT === "staging";

/**
 * is development build
 */
export const IS_DEVELOPMENT: boolean = ENVIRONMENT === "development";

/**
 * network url for the web3 network connector
 */
export const NETWORK_URL: string = process.env.REACT_APP_NETWORK_URL ?? "";

/**
 * the web3 network id
 */
export const NETWORK_ID: number = Number(process.env.REACT_APP_NETWORK_ID) ?? 1;

/**
 * the web3 network chain id
 */
export const CHAIN_ID: number = Number(process.env.REACT_APP_CHAIN_ID) ?? 1;

/**
 * the web3 etherscan prefix
 */
export const ETHERSCAN_PREFIX: string = process.env.REACT_APP_ETHERSCAN_PREFIX ?? "";

/**
 * Google Analytics ID
 */
export const GA_TRACK_ID: string = process.env.REACT_APP_GA_TRACK_ID ?? "";
