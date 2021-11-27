"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSafeDispatch = void 0;
var React = __importStar(require("react"));
// Hide `useLayoutEffect` warning with SSR
// See: https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
function useSafeDispatch(dispatch) {
    var mountedRef = React.useRef(false);
    useIsomorphicLayoutEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    }, []);
    var safeDispatch = React.useCallback(function (action) {
        if (mountedRef.current) {
            dispatch(action);
        }
    }, [dispatch]);
    return safeDispatch;
}
exports.useSafeDispatch = useSafeDispatch;
