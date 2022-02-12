import { render } from "react-dom";

// Imports
import { getNetwork, JsonRpcProvider } from "@ethersproject/providers";
import { Provider, Connector } from "wagmi";
import { Celo, Alfajores } from "../constants";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { App } from "./App";

// Pick chains
const chains = [Celo, Alfajores];
const defaultChain = Alfajores;
console.debug({ chains: chains, defaultChain: defaultChain });

const rpcMap = {
  44787: "https://alfajores-forno.celo-testnet.org",
  42220: "https://forno.celo.org"
};
// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = (_config: ConnectorsConfig) => {
  const network = getNetwork(_config.chainId ?? defaultChain.id);

  const rpcUrl = rpcMap[network.chainId];
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          [`${network.chainId}`]: rpcUrl
        }
      }
    })
  ];
};

const providers = (_config: { chainId?: number; connector?: Connector }) => {
  const network = getNetwork(_config.chainId ?? defaultChain.id);

  const rpcUrl = rpcMap[network.chainId];
  console.log(rpcUrl);
  let wProvider = new WalletConnectProvider({
    rpc: {
      [`${network.chainId}`]: rpcUrl
    }
  });
  wProvider.rpcUrl = rpcUrl;
  wProvider.http.url = rpcUrl;
  wProvider.chainId = network.chainId;
  wProvider.enable();

  jProvider = new JsonRpcProvider(rpcUrl);
  jProvider.rpcUrl = rpcUrl;
  if (Connector.id == "injectedConnector") {
    return jProvider[0];
  } else {
    return wProvider[0];
  }
};
let networkTest = getNetwork(defaultChain.id);
let connectorTest = connectors(networkTest.chainId)[1];
let providerTest = providers(networkTest.chainId, connectorTest);
console.log({
  network: networkTest,
  rpcMap: rpcMap,
  connector: connectorTest,
  provider: providerTest
});

const rootElement = document.getElementById("root");
render(
  <Provider provider={providers} connectors={connectors}>
    <App />
  </Provider>,
  rootElement
);
