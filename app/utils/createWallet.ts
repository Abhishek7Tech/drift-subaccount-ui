import { loadKeypair, Wallet } from "@drift-labs/sdk";
import { Keypair } from "@solana/web3.js";

const KEY_PAIR_DEV = process.env.NEXT_PUBLIC_KEY_PAIR;
const KEY_PAIR_PROD = process.env.SOLANA_KEYPAIR;
function createWallet(env: string) {
  if (env === "dev") {
    if (!KEY_PAIR_DEV) {
      throw new Error("Key pair not found.");
    }

    console.log("KEY_PAIR_DEV", KEY_PAIR_DEV);
    const wallet = new Wallet(loadKeypair(KEY_PAIR_DEV));

    return wallet;
  }

  if (env === "prod") {
    if (!KEY_PAIR_PROD) {
      throw new Error("Key pair not found.");
    }
    const secretKeyArray = JSON.parse(KEY_PAIR_PROD);
    const secretKey = Uint8Array.from(secretKeyArray);
    const keypair = Keypair.fromSecretKey(secretKey);

    const wallet = new Wallet(keypair);
    return wallet;
  }
}

export default createWallet;
