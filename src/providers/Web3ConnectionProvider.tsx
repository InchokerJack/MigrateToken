import { createWeb3ReactRoot, UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { providers } from "ethers";
import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAsyncFn, useLocalStorage } from "react-use";
import useAsync, { AsyncState } from "react-use/lib/useAsync";

import {
  ConnectorDetails,
  ConnectorId,
  ConnectorState,
  SUPPORTED_CONNECTORS,
} from "@src/connectors";
import { networkConnector } from "@src/connectors/networkConnector";
import { getLibrary } from "@src/utils/web3-utils";

// anonymous web3 provider
const Web3NetworkProvider = createWeb3ReactRoot("Network");

// account web3 provider
const Web3AccountProvider = createWeb3ReactRoot("Account");

export const Web3ConnectionContext = createContext<
  Omit<
    Web3ReactContextInterface<providers.Web3Provider>,
    "activate" | "deactivate" | "setError"
  > & {
    connect: (connectorId: ConnectorId) => Promise<boolean | Error>;
    disconnect: () => void;
    availableConnectors: ConnectorDetails[];
    web3NetworkState: AsyncState<boolean | Error>;
    web3AccountState: AsyncState<boolean | Error>;
    isConnectionReady: boolean;
    isWrongNetwork: boolean;
  }
>({
  active: false,
  isConnectionReady: false,
  isWrongNetwork: false,
  connect: async () => true,
  disconnect: () => {},
  availableConnectors: [],
  web3NetworkState: {
    loading: false,
  },
  web3AccountState: {
    loading: false,
  },
});

const Web3ManagerProvider: FunctionComponent = ({ children }) => {
  const [selectedConnectorDetails, setSelectedConnectorDetails] = useState<ConnectorDetails>();
  const web3Network = useWeb3React<providers.Web3Provider>("Network");
  const web3Account = useWeb3React<providers.Web3Provider>("Account");
  const [
    storedConnectorId,
    setStoredConnectorId,
    removedStoredConnectorId,
  ] = useLocalStorage<ConnectorId>("connectorId");

  // connect to account connector using connector id
  const [web3AccountState, connect] = useAsyncFn(
    async (connectorId: ConnectorId) => {
      const connectorDetails = SUPPORTED_CONNECTORS[connectorId];
      if (connectorDetails?.isAvailable) {
        // remember the selected connector
        setSelectedConnectorDetails(connectorDetails);
        // if wallet connect clean up cache before connecting
        if (
          connectorDetails.connector instanceof WalletConnectConnector &&
          connectorDetails.connector.walletConnectProvider?.wc?.uri
        ) {
          connectorDetails.connector.walletConnectProvider = undefined;
        }
        // try activate
        await web3Account.activate(connectorDetails.connector, undefined, true);
        // store the selected connectorId if success
        if (connectorId !== storedConnectorId) {
          setStoredConnectorId(connectorId);
        }
      }
      return true;
    },
    [setStoredConnectorId, storedConnectorId, web3Account],
  );

  // retry connecting to the last selected connector
  const retry = useCallback(() => {
    if (!web3Account.active && selectedConnectorDetails?.id) {
      connect(selectedConnectorDetails?.id);
    }
  }, [connect, selectedConnectorDetails?.id, web3Account.active]);

  // disconnect from the account connector
  const disconnect = () => {
    web3Account.deactivate();
    removedStoredConnectorId();
  };

  // connection change side effects (this needed if the app started with wrong network)
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum?.on && !web3Account.active && !web3Account.error) {
      ethereum.on("chainChanged", retry);
      ethereum.on("accountsChanged", retry);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", retry);
          ethereum.removeListener("accountsChanged", retry);
        }
      };
    }
    return undefined;
  }, [connect, retry, selectedConnectorDetails, web3Account]);

  // the available connectors including their status
  const availableConnectors = useMemo(
    () =>
      Object.values(SUPPORTED_CONNECTORS)
        .filter(({ isAvailable, install }) => isAvailable || install)
        .map(connectorDetails => {
          let connectorError;
          let connectorState: ConnectorState = "idle";
          if (connectorDetails.connector === web3Account.connector) {
            if (web3Account.active) {
              connectorState = "active";
            } else if (web3AccountState.loading) {
              connectorState = "connecting";
            } else if (web3Account.error || web3AccountState.error) {
              connectorState = "error";
              connectorError = web3Account.error || web3AccountState.error;
            }
          } else if (connectorDetails.connector === selectedConnectorDetails?.connector) {
            if (web3AccountState.loading) {
              connectorState = "connecting";
            } else if (web3AccountState.error) {
              connectorState = "error";
              connectorError = web3AccountState.error;
            }
          }
          return { ...connectorDetails, state: connectorState, error: connectorError };
        }),
    [
      selectedConnectorDetails?.connector,
      web3Account.active,
      web3Account.connector,
      web3Account.error,
      web3AccountState.error,
      web3AccountState.loading,
    ],
  );

  // network connector effect and status
  const web3NetworkState = useAsync(async () => {
    // only run after eager connection
    if (!web3Network.active && !web3Network.error) {
      await web3Network.activate(networkConnector, undefined, true);
    }
    return true;
  }, [web3Network]);

  // eager connect effect
  const eagerConnectionState = useAsync(async () => {
    try {
      if (!web3Account.active && storedConnectorId) {
        const supportedConnector = SUPPORTED_CONNECTORS[storedConnectorId];
        if (supportedConnector?.isAvailable) {
          if (
            storedConnectorId !== "INJECTED" ||
            (await (supportedConnector.connector as InjectedConnector)?.isAuthorized())
          ) {
            await connect(storedConnectorId);
          }
        }
      }
    } catch (_) {
      // ignore
    }
    return true;
  }, []);

  // resolved the active web3 context
  const activeWeb3 = useMemo(
    () => (web3Account?.active && web3Account?.account ? web3Account : web3Network),
    [web3Account, web3Network],
  );

  // the application ready only after eager connection
  const isConnectionReady = useMemo(
    () => Boolean(eagerConnectionState.value && activeWeb3.active),
    [eagerConnectionState.value, activeWeb3.active],
  );

  // check if the error is a wrong network error
  const isWrongNetwork = useMemo(
    () =>
      web3Account.error instanceof UnsupportedChainIdError ||
      web3AccountState.error instanceof UnsupportedChainIdError,
    [web3Account.error, web3AccountState.error],
  );

  return (
    <Web3ConnectionContext.Provider
      value={{
        // active web3 context
        ...activeWeb3,
        // our context
        connect,
        disconnect,
        availableConnectors,
        web3NetworkState,
        web3AccountState,
        isConnectionReady,
        isWrongNetwork,
      }}
    >
      {children}
    </Web3ConnectionContext.Provider>
  );
};

/**
 * connection provider
 * @param children
 * @constructor
 */
export const Web3ConnectionProvider: FunctionComponent = ({ children }) => (
  <Web3NetworkProvider getLibrary={getLibrary}>
    <Web3AccountProvider getLibrary={getLibrary}>
      <Web3ManagerProvider>{children}</Web3ManagerProvider>
    </Web3AccountProvider>
  </Web3NetworkProvider>
);

// useWeb3Connection hook
export const useWeb3Connection = () => useContext(Web3ConnectionContext);
