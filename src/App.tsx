import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { useState, useEffect } from "react";

import {
  useConnect,
  useAccount,
  useProvider,
  useNetwork,
  useSigner,
  useContract,
  useContractWrite,
  useContractRead
} from "wagmi";

import SmartStorageAbi from "./contract/SmartStorageAbi.json";

export const App = () => {
  let cpt = "100";
  const SmartStorageContractAddressTestnet =
    "0x3703f92F254C2b36c09a04c0112f0aA5ecd78660";

  const [
    {
      data: { connected, connector, connectors },
      errorConnect,
      loadingConnect
    },
    connect
  ] = useConnect();

  const [
    { data: networkData, error: networkEroor, loading: networkLoading },
    changeNetwork
  ] = useNetwork();

  const [{ data: accountData }, disconnect] = useAccount();
  const [{ signer, loadSigner, errorSigner }, getSigner] = useSigner();
  const provider = useProvider();

  const contract = useContract({
    addressOrName: SmartStorageContractAddressTestnet,
    contractInterface: SmartStorageAbi,
    signerOrProvider: provider
  });

  const [
    { data: nb, loading: nbLoad, error: nbError },
    write
  ] = useContractWrite(
    {
      addressOrName: SmartStorageContractAddressTestnet,
      contractInterface: SmartStorageAbi
    },
    "store",
    {
      args: cpt
    }
  );
  const [
    { data: nbr, loading: nbrLoad, error: nbrError },
    read
  ] = useContractRead(
    {
      addressOrName: SmartStorageContractAddressTestnet,
      contractInterface: SmartStorageAbi
    },
    "getTotalStoringTransactions"
  );
  if (connected) {
    console.debug({
      Connection: connector,
      Provider: provider,
      Network: networkData,
      SmartStorageContract: contract,
      SmartStorageAbi: SmartStorageAbi,
      contract: contract,
      read: read,
      write: write,
      account: accountData,
      Number: cpt
    });
    return (
      <div>
        <p>Account address: {accountData.address}</p>
        <p>Connected to {networkData.chain?.name}</p>
        <p>Connected via {accountData.connector?.name}</p>
        <p>
          Contract address `{SmartStorageContractAddressTestnet.toString()}`{" "}
        </p>
        <p>Nb total call requests {nbr?.toString()} </p>

        <button
          onClick={async function () {
            console.log("Waiting updating data");
            write()
              .then((rp) => {
                console.log(rp);
                alert("TX: " + rp.data.hash);
              })
              .catch((err) => console.error(err));
          }}
        >
          SetStorage
        </button>
        <button onClick={disconnect}>Disconnect</button>
        <button
          onClick={async function readNb() {
            console.log("Reading nb Calls");
            read()
              .then((rp) => {
                console.log({ Number: rp });
                alert(rp.Number);
                cpt = rp.Number + 1;
              })
              .catch((err) => console.error(err));
          }}
        >
          Read
        </button>
      </div>
    );
  }
  return (
    <div>
      <div>
        {connectors.map((x) => (
          <button
            disabled={!x.ready}
            key={x.name}
            onClick={async function () {
              connect(x)
                .then((rep) => {
                  console.log({ Connect: rep });
                })
                .catch((err) => console.error({ message: err }));
            }}
          >
            {x.name}
            {!x.ready && " (unsupported)"}
            {loadingConnect && x.name === connector?.name && "…"}
          </button>
        ))}
      </div>
      <div>
        {errorConnect && (errorConnect?.message ?? "Failed to connect")}
      </div>
    </div>
  );
};
