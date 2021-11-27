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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMaskProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = __importStar(require("react"));
var metamask_context_1 = require("./metamask-context");
var reducer_1 = require("./reducer");
var useSafeDispatch_1 = require("./utils/useSafeDispatch");
function synchronize(dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var ethereum, isMetaMaskAvailable, chainId, isUnlocked, accessibleAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethereum = window.ethereum;
                    isMetaMaskAvailable = Boolean(ethereum) && ethereum.isMetaMask;
                    if (!isMetaMaskAvailable) {
                        dispatch({ type: "metaMaskUnavailable" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ethereum.request({
                            method: "eth_chainId",
                        })];
                case 1:
                    chainId = _a.sent();
                    return [4 /*yield*/, ethereum._metamask.isUnlocked()];
                case 2:
                    isUnlocked = _a.sent();
                    if (!isUnlocked) {
                        dispatch({ type: "metaMaskLocked", payload: { chainId: chainId } });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ethereum.request({
                            method: "eth_accounts",
                        })];
                case 3:
                    accessibleAccounts = _a.sent();
                    if (accessibleAccounts.length === 0) {
                        dispatch({ type: "metaMaskUnlocked", payload: { chainId: chainId } });
                    }
                    else {
                        dispatch({
                            type: "metaMaskConnected",
                            payload: { accounts: accessibleAccounts, chainId: chainId },
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function subsribeToAccountsChanged(dispatch) {
    var ethereum = window.ethereum;
    var onAccountsChanged = function (accounts) {
        return dispatch({ type: "metaMaskAccountsChanged", payload: accounts });
    };
    ethereum.on("accountsChanged", onAccountsChanged);
    return function () {
        ethereum.removeListener("accountsChanged", onAccountsChanged);
    };
}
function subscribeToChainChanged(dispatch) {
    var ethereum = window.ethereum;
    var onChainChanged = function (chainId) {
        return dispatch({ type: "metaMaskChainChanged", payload: chainId });
    };
    ethereum.on("chainChanged", onChainChanged);
    return function () {
        ethereum.removeListener("chainChanged", onChainChanged);
    };
}
function requestAccounts(dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var ethereum, accounts, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethereum = window.ethereum;
                    dispatch({ type: "metaMaskConnecting" });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ethereum.request({
                            method: "eth_requestAccounts",
                        })];
                case 2:
                    accounts = _a.sent();
                    dispatch({ type: "metaMaskConnected", payload: { accounts: accounts } });
                    return [2 /*return*/, accounts];
                case 3:
                    err_1 = _a.sent();
                    dispatch({ type: "metaMaskPermissionRejected" });
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var initialState = {
    status: "initializing",
    account: null,
    chainId: null,
};
function MetaMaskProvider(props) {
    var _a = React.useReducer(reducer_1.reducer, initialState), state = _a[0], unsafeDispatch = _a[1];
    var dispatch = useSafeDispatch_1.useSafeDispatch(unsafeDispatch);
    var status = state.status;
    var isInitializing = status === "initializing";
    React.useEffect(function () {
        if (isInitializing) {
            synchronize(dispatch);
        }
    }, [dispatch, isInitializing]);
    var isConnected = status === "connected";
    React.useEffect(function () {
        if (!isConnected)
            return function () { };
        var unsubscribe = subsribeToAccountsChanged(dispatch);
        return unsubscribe;
    }, [dispatch, isConnected]);
    var isAvailable = status !== "unavailable" && status !== "initializing";
    React.useEffect(function () {
        if (!isAvailable)
            return function () { };
        var unsubscribe = subscribeToChainChanged(dispatch);
        return unsubscribe;
    }, [dispatch, isAvailable]);
    var connect = React.useCallback(function () {
        if (!isAvailable) {
            console.warn("`enable` method has been called while MetaMask is not available or synchronising. Nothing will be done in this case.");
            return Promise.resolve([]);
        }
        return requestAccounts(dispatch);
    }, [dispatch, isAvailable]);
    var value = React.useMemo(function () { return (__assign(__assign({}, state), { connect: connect, ethereum: isAvailable
            ? window.ethereum
            : null })); }, [connect, state, isAvailable]);
    return jsx_runtime_1.jsx(metamask_context_1.MetamaskContext.Provider, __assign({ value: value }, props), void 0);
}
exports.MetaMaskProvider = MetaMaskProvider;
