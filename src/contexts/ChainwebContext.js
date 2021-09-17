import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react/cjs/react.development";
import { chainList } from "../constants/chainList.js";
import { AuthContext } from "./AuthContext.js";
import { NetworkContext } from "./NetworkContext.js";
import { PactContext } from "./PactContext.js";
const chainweb = require("../chainweb.js");
export const ChainwebContext = createContext(null);

export const ChainwebProvider = (props) => {
  const { network } = useContext(NetworkContext);
  const auth = useContext(AuthContext);
  const pact = useContext(PactContext);
  const [networkId, setNetworkId] = useState(network.networkID);
  const [host, setHost] = useState(`https://${network.kadenaServer}`);
  const [chainEvents, setChainEvents] = useState([]);

  // get list events and filter for pubkey
  const getEvents = () => {
    Object.values(chainList).map((chain) => {
      chainweb.event.recent(chain, 3, 1000, networkId, host).then((result) => {
        const events = result.filter(
          (ev) => ev.params[0] === auth.user.publicKey
        );
        setChainEvents((prev) => [...prev, { [chain]: events }]);
      });
    });
  };

  // Probably use this
  //   chainweb.transaction
  //     .recent(0, 3, 50)
  //     .then((x) => console.log("Transactions:", x));

  return (
    <ChainwebContext.Provider
      value={{ chainEvents, setChainEvents, getEvents }}
    >
      {props.children}
    </ChainwebContext.Provider>
  );
};
