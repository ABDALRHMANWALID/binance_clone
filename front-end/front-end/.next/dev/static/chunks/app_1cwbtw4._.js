(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NotificationsBell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/NotificationsBell.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const Header = ()=>{
    _s();
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const syncLogin = {
                "Header.useEffect.syncLogin": ()=>setIsLoggedIn(!!localStorage.getItem("token"))
            }["Header.useEffect.syncLogin"];
            syncLogin();
            window.addEventListener("storage", syncLogin);
            return ({
                "Header.useEffect": ()=>window.removeEventListener("storage", syncLogin)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-b border-slate-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "text-xl font-bold",
                    children: [
                        "Binance",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-yellow-400",
                            children: "."
                        }, void 0, false, {
                            fileName: "[project]/app/components/Header.tsx",
                            lineNumber: 23,
                            columnNumber: 18
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Header.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "hidden items-center gap-8 md:flex",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/p2p",
                            className: "text-sm text-slate-300 transition hover:text-white",
                            children: "P2P"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Header.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/markets",
                            className: "text-sm text-slate-300 transition hover:text-white",
                            children: "Markets"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Header.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/trade",
                            className: "text-sm text-slate-300 transition hover:text-white",
                            children: "Trade"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Header.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Header.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: isLoggedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NotificationsBell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                fileName: "[project]/app/components/Header.tsx",
                                lineNumber: 52,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/deposit",
                                className: "rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300",
                                children: "Deposit"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Header.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/profile",
                                className: "flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-yellow-400 hover:text-yellow-400",
                                "aria-label": "Profile",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-5 w-5",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    strokeWidth: 2,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M15.75 6a3.75 3.75 0 11-7.5 0\n                                        3.75 3.75 0 017.5 0z\n                                        M4.5 20.25a8.25 8.25 0 0115 0"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Header.tsx",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Header.tsx",
                                    lineNumber: 66,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/Header.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Header.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white",
                                children: "Login"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Header.tsx",
                                lineNumber: 86,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/register",
                                className: "rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300",
                                children: "Register"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Header.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Header.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Header.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Header.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/Header.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Header, "fKLMlyFH2GMrhNeUDpp+0z1yiCo=");
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/NotificationsBell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotificationsBell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/chatApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/chatSocket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$orderUi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/p2p/orderUi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const timeAgo = (iso)=>{
    const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
};
const preview = (item)=>{
    const last = item.lastMessage;
    if (!last) return "Order started";
    if (last.content) return last.content;
    return last.type === "image" ? "📷 Image" : "📎 File";
};
function NotificationsBell() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reloadTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationsBell.useCallback[load]": async ()=>{
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConversations"])(10);
                setItems(data.items);
            } catch  {} finally{
                setLoading(false);
            }
        }
    }["NotificationsBell.useCallback[load]"], []);
    const scheduleReload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotificationsBell.useCallback[scheduleReload]": ()=>{
            if (reloadTimer.current) clearTimeout(reloadTimer.current);
            reloadTimer.current = setTimeout({
                "NotificationsBell.useCallback[scheduleReload]": ()=>void load()
            }["NotificationsBell.useCallback[scheduleReload]"], 300);
        }
    }["NotificationsBell.useCallback[scheduleReload]"], [
        load
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationsBell.useEffect": ()=>{
            void load();
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChatSocket"])();
            if (!socket) return;
            socket.on("connect", scheduleReload);
            socket.on(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].UNREAD_UPDATED, scheduleReload);
            socket.on(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].CONVERSATION_CREATED, scheduleReload);
            socket.on(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].ORDER_UPDATED, scheduleReload);
            return ({
                "NotificationsBell.useEffect": ()=>{
                    socket.off("connect", scheduleReload);
                    socket.off(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].UNREAD_UPDATED, scheduleReload);
                    socket.off(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].CONVERSATION_CREATED, scheduleReload);
                    socket.off(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_EVENTS"].ORDER_UPDATED, scheduleReload);
                    if (reloadTimer.current) clearTimeout(reloadTimer.current);
                }
            })["NotificationsBell.useEffect"];
        }
    }["NotificationsBell.useEffect"], [
        load,
        scheduleReload
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationsBell.useEffect": ()=>{
            if (!open) return;
            const onClick = {
                "NotificationsBell.useEffect.onClick": (e)=>{
                    if (!wrapperRef.current?.contains(e.target)) setOpen(false);
                }
            }["NotificationsBell.useEffect.onClick"];
            const onKey = {
                "NotificationsBell.useEffect.onKey": (e)=>e.key === "Escape" && setOpen(false)
            }["NotificationsBell.useEffect.onKey"];
            document.addEventListener("mousedown", onClick);
            document.addEventListener("keydown", onKey);
            return ({
                "NotificationsBell.useEffect": ()=>{
                    document.removeEventListener("mousedown", onClick);
                    document.removeEventListener("keydown", onKey);
                }
            })["NotificationsBell.useEffect"];
        }
    }["NotificationsBell.useEffect"], [
        open
    ]);
    const needsUser = (item)=>item.unreadCount > 0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$orderUi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionHint"])(item.role, item.order.status) !== null;
    const attention = items.filter(needsUser).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                "aria-label": "Notifications",
                "aria-expanded": open,
                className: "relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-yellow-400 hover:text-yellow-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        strokeWidth: 2,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                        }, void 0, false, {
                            fileName: "[project]/app/components/NotificationsBell.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/NotificationsBell.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    attention > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white",
                        children: attention > 9 ? "9+" : attention
                    }, void 0, false, {
                        fileName: "[project]/app/components/NotificationsBell.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/NotificationsBell.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white",
                        children: "Notifications"
                    }, void 0, false, {
                        fileName: "[project]/app/components/NotificationsBell.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-96 overflow-y-auto",
                        children: [
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-4 py-6 text-center text-sm text-slate-500",
                                children: "Loading..."
                            }, void 0, false, {
                                fileName: "[project]/app/components/NotificationsBell.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, this),
                            !loading && items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-4 py-6 text-center text-sm text-slate-500",
                                children: "No conversations yet."
                            }, void 0, false, {
                                fileName: "[project]/app/components/NotificationsBell.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this),
                            items.map((item)=>{
                                const hint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$orderUi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionHint"])(item.role, item.order.status);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setOpen(false);
                                        router.push(`/p2p/order/${item.orderId}`);
                                    },
                                    className: "block w-full border-b border-slate-800 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-800/60",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-sm font-medium text-white",
                                                    children: [
                                                        item.role === "buyer" ? "Buying" : "Selling",
                                                        " ",
                                                        item.order.amount,
                                                        " ",
                                                        item.order.asset
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "shrink-0 text-[11px] text-slate-500",
                                                    children: timeAgo(item.updatedAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 159,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/NotificationsBell.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-0.5 flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-xs text-slate-400",
                                                    children: [
                                                        item.counterpart,
                                                        ": ",
                                                        preview(item)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this),
                                                item.unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400 px-1 text-[11px] font-bold text-slate-950",
                                                    children: item.unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/NotificationsBell.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1.5 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `rounded-full px-2 py-0.5 text-[11px] ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$orderUi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_STYLE"][item.order.status]}`,
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$orderUi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STATUS_LABEL"][item.order.status]
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this),
                                                hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-semibold text-yellow-400",
                                                    children: hint
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/NotificationsBell.tsx",
                                            lineNumber: 176,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/app/components/NotificationsBell.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/NotificationsBell.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/NotificationsBell.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/NotificationsBell.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(NotificationsBell, "Ok4MtvDI/uU+NCChhv4mfIPd/ek=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NotificationsBell;
var _c;
__turbopack_context__.k.register(_c, "NotificationsBell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/axios.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:4000") ?? "http://localhost:4000"
});
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/chatApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALLOWED_FILE_TYPES",
    ()=>ALLOWED_FILE_TYPES,
    "MAX_FILE_BYTES",
    ()=>MAX_FILE_BYTES,
    "cancelOrder",
    ()=>cancelOrder,
    "confirmOrder",
    ()=>confirmOrder,
    "createOrder",
    ()=>createOrder,
    "errorMessage",
    ()=>errorMessage,
    "getAttachmentUrl",
    ()=>getAttachmentUrl,
    "getConversation",
    ()=>getConversation,
    "getConversations",
    ()=>getConversations,
    "getMessages",
    ()=>getMessages,
    "getOrder",
    ()=>getOrder,
    "getPaymentMethods",
    ()=>getPaymentMethods,
    "markReadRest",
    ()=>markReadRest,
    "payOrder",
    ()=>payOrder,
    "sendMessageRest",
    ()=>sendMessageRest,
    "uploadFile",
    ()=>uploadFile,
    "validateFile",
    ()=>validateFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/axios.tsx [app-client] (ecmascript)");
;
;
const auth = ()=>({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`
        }
    });
function errorMessage(e, fallback = "Something went wrong") {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(e)) {
        const m = e.response?.data?.message;
        return Array.isArray(m) ? m.join(", ") : m || fallback;
    }
    if (e instanceof Error) return e.message;
    return fallback;
}
const getPaymentMethods = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/payment-methods", auth()).then((r)=>r.data);
const createOrder = (adId, body)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/ads/${adId}/orders`, body, auth()).then((r)=>r.data);
const getOrder = (orderId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/orders/${orderId}`, auth()).then((r)=>r.data);
const payOrder = (orderId, body)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/orders/${orderId}/pay`, body, auth()).then((r)=>r.data);
const confirmOrder = (orderId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/orders/${orderId}/confirm`, {}, auth()).then((r)=>r.data);
const cancelOrder = (orderId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/orders/${orderId}/cancel`, {}, auth()).then((r)=>r.data);
const getConversations = (limit = 10)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/conversations", {
        ...auth(),
        params: {
            limit
        }
    }).then((r)=>r.data);
const getConversation = (conversationId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/conversations/${conversationId}`, auth()).then((r)=>r.data);
const getMessages = (conversationId, params)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/conversations/${conversationId}/messages`, {
        ...auth(),
        params
    }).then((r)=>r.data);
const sendMessageRest = (conversationId, body)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/messages`, body, auth()).then((r)=>r.data);
const markReadRest = (conversationId, lastReadMessageId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/read`, {
        lastReadMessageId
    }, auth()).then((r)=>r.data);
const uploadFile = (conversationId, file)=>{
    const form = new FormData();
    form.append("file", file);
    return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/uploads`, form, auth()).then((r)=>r.data);
};
const getAttachmentUrl = (attachmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/attachments/${attachmentId}/url`, auth()).then((r)=>r.data);
const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
];
const MAX_FILE_BYTES = 5 * 1024 * 1024;
function validateFile(file) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return "Only JPEG, PNG, WEBP or PDF files are allowed";
    }
    if (file.size > MAX_FILE_BYTES) return "File size cannot exceed 5MB";
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/chatSocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHAT_EVENTS",
    ()=>CHAT_EVENTS,
    "disconnectChatSocket",
    ()=>disconnectChatSocket,
    "getChatSocket",
    ()=>getChatSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/axios.tsx [app-client] (ecmascript)");
;
;
const CHAT_EVENTS = {
    JOIN: "conversation:join",
    LEAVE: "conversation:leave",
    SEND: "message:send",
    READ: "conversation:read",
    NEW: "message:new",
    UNREAD_UPDATED: "conversation:unread_updated",
    CONVERSATION_CREATED: "conversation:created",
    ORDER_UPDATED: "order:updated"
};
let socket = null;
function getChatSocket() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!localStorage.getItem("token")) return null;
    if (!socket) {
        const base = (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.baseURL ?? "http://localhost:4000").replace(/\/$/, "");
        socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(`${base}/chat`, {
            transports: [
                "websocket"
            ],
            auth: (cb)=>cb({
                    token: localStorage.getItem("token")
                })
        });
    }
    return socket;
}
function disconnectChatSocket() {
    socket?.disconnect();
    socket = null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p2p/orderUi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STATUS_LABEL",
    ()=>STATUS_LABEL,
    "STATUS_STYLE",
    ()=>STATUS_STYLE,
    "actionHint",
    ()=>actionHint,
    "isOpen",
    ()=>isOpen
]);
const STATUS_LABEL = {
    pending_payment: "Waiting for payment",
    paid: "Payment sent",
    completed: "Completed",
    cancelled: "Cancelled"
};
const STATUS_STYLE = {
    pending_payment: "bg-yellow-400/10 text-yellow-400",
    paid: "bg-blue-500/10 text-blue-400",
    completed: "bg-green-500/10 text-green-400",
    cancelled: "bg-slate-700/40 text-slate-400"
};
const isOpen = (status)=>status === "pending_payment" || status === "paid";
function actionHint(role, status) {
    if (role === "buyer" && status === "pending_payment") return "Pay now";
    if (role === "seller" && status === "paid") return "Confirm payment";
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_1cwbtw4._.js.map