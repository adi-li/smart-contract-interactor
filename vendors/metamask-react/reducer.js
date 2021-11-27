"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
function reducer(state, action) {
    switch (action.type) {
        case "metaMaskUnavailable":
            return {
                chainId: null,
                account: null,
                status: "unavailable",
            };
        case "metaMaskLocked":
            return __assign(__assign({}, state), { chainId: action.payload.chainId, account: null, status: "notConnected" });
        case "metaMaskUnlocked":
            return __assign(__assign({}, state), { chainId: action.payload.chainId, account: null, status: "notConnected" });
        case "metaMaskConnected":
            var unlockedAccounts = action.payload.accounts;
            return {
                chainId: action.payload.chainId || state.chainId,
                account: unlockedAccounts[0],
                status: "connected",
            };
        case "metaMaskConnecting":
            return __assign(__assign({}, state), { account: null, status: "connecting" });
        case "metaMaskPermissionRejected":
            return __assign(__assign({}, state), { account: null, status: "notConnected" });
        case "metaMaskAccountsChanged":
            var accounts = action.payload;
            if (accounts.length === 0) {
                return __assign(__assign({}, state), { account: null, status: "notConnected" });
            }
            return __assign(__assign({}, state), { account: accounts[0] });
        case "metaMaskChainChanged":
            return __assign(__assign({}, state), { chainId: action.payload });
        // no default
    }
}
exports.reducer = reducer;
