import { loadStdlib } from "@reach-sh/stdlib";

/* Note: you can change these to environment variables */
const network = "ALGO";
const ledger = "TestNet";

// Main export (to simplify global DApp network config)
const Reach = loadStdlib(network);
Reach.setSignStrategy("AlgoSigner");
Reach.setProviderByName(ledger);

/**
 * Default configured `Reach` stdlib object
 */
export default Reach;

export const { AlgoSigner = null } = window;

/**
 * Connect to Algorand Network using `AlgoSigner` (window object)
 * @returns {string[]} List of accounts
 */
export async function connectToAlgorand() {
  AlgoSigner.connect();
  return await AlgoSigner.accounts({ ledger });
}

/**
 * Copy provided string to clipboard (if permissions available). Returns
 * boolean indicating success/failure of clipboard write.
 * @param {string} text Text to copy
 * @returns {boolean} Success status of "copy" action
 */
export function copyToClipboard(text) {
  if (window.navigator.permissions.query({ name: "clipboard-write" })) {
    window.navigator.clipboard.writeText(text);
    return true;
  }

  return false;
}

/**
 * Strip `\0000` characters from byte string
 * @param {stringn} str String with empty `\0000` characters to remove
 * @returns
 */
export function trimByteString(str) {
  return str && str.replace(/\0/g, "");
}

/**
 * Truncates Account string to `XX...XXXX`
 * @param {string} acct Account string
 * @returns {string}
 */
export function truncateAccountString(acct) {
  const { length } = acct;
  const start = acct.substr(0, 2);
  return `${start}...${acct.substr(length - 4, length)}`;
}
