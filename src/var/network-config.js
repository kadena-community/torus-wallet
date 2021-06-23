//------------------------------------------------------------------------------------------------------------------------
//                  NETWORK CONSTS
//------------------------------------------------------------------------------------------------------------------------

const NETWORK_ID = process.env.REACT_APP_KADENA_NETWORK_ID;
const SERVER = process.env.REACT_APP_KADENA_SERVER;
//
//
const TTL = 28800;
const GAS_PRICE = 0.0000000001;
const GAS_LIMIT = 10000;
const creationTime = () => Math.round((new Date).getTime()/1000)-15
const host = (chainId) => `https://${SERVER}/chainweb/0.0/${NETWORK_ID}/chain/${chainId}/pact`

module.exports = {
  NETWORK_ID,
  SERVER,
  TTL,
  GAS_PRICE,
  GAS_LIMIT,
  creationTime,
  host
}