import { MetaMaskState } from "./metamask-context";
interface MetaMaskUnavailable {
    type: "metaMaskUnavailable";
}
interface MetaMaskLocked {
    type: "metaMaskLocked";
    payload: {
        chainId: string;
    };
}
interface MetaMaskUnlocked {
    type: "metaMaskUnlocked";
    payload: {
        chainId: string;
    };
}
interface MetaMaskConnected {
    type: "metaMaskConnected";
    payload: {
        accounts: string[];
        chainId?: string;
    };
}
interface MetaMaskConnecting {
    type: "metaMaskConnecting";
}
interface PermissionRejected {
    type: "metaMaskPermissionRejected";
}
interface AccountsChanged {
    type: "metaMaskAccountsChanged";
    payload: string[];
}
interface ChainChanged {
    type: "metaMaskChainChanged";
    payload: string;
}
export declare type Action = MetaMaskUnavailable | MetaMaskLocked | MetaMaskUnlocked | MetaMaskConnected | MetaMaskConnecting | PermissionRejected | AccountsChanged | ChainChanged;
export declare function reducer(state: MetaMaskState, action: Action): MetaMaskState;
export {};
