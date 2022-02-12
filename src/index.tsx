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
  1: "",
  2: "",
  3: "",
  4: "",
  44787: "https://alfajores-forno.celo-testnet.org",
  42220: "https://forno.celo.org"
};

// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = (_config: ConnectorsConfig) => {
  const network = getNetwork(_config.chainId ?? defaultChain.id);

  const rpcUrl = rpcMap[network.chainId];
  console.log({ rpc: rpcUrl });
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
  console.log({ Nework: network });
  const wProviders = new WalletConnectProvider({
    rpc: {
      [`${network.chainId}`]: rpcUrl
    }
  });
  const JProviders = new JsonRpcProvider(rpcUrl);
  console.log({ Jprov: JProviders, wProv: wProviders });
  return wProviders;
};

console.log({
  network: getNetwork(defaultChain.id),
  rpcMap: rpcMap,
  connector: connectors(getNetwork(defaultChain.id)),
  providers: providers(defaultChain.id, connectors(getNetwork(defaultChain.id)))
});

const rootElement = document.getElementById("root");
render(
  <Provider provider={providers} connectors={connectors}>
    <App />
  </Provider>,
  rootElement
);
