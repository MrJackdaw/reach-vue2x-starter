import APIConfig from "./api-config";

// const { METHODS } = APIConfig;
// const { VITE_ALGOEXPLORER: algoexplorerapi } = import.meta.env;

const algoexplorerapi = "https://testnet.algoexplorerapi.io";

const API = new APIConfig({
  getAccountByAddress: {
    url: (address) => `${algoexplorerapi}/v2/accounts/${address}`,
  },

  getAssetById: {
    url: (assetId) => `${algoexplorerapi}/v1/asset/${assetId}`,
  },
});

console.log(
  API.routes.getAccountByAddress.url(),
  API.routes.getAssetById.url()
);
export default API;
