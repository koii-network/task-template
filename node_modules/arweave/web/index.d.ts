import Arweave from "./common";
declare global {
    interface Window {
        Arweave: typeof Arweave;
    }
}
export * from "./common";
export default Arweave;
