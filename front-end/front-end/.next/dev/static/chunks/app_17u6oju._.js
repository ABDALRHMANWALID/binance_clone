(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/lib/format.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatUnits6",
    ()=>formatUnits6,
    "rawToInput",
    ()=>rawToInput,
    "trimDecimals",
    ()=>trimDecimals
]);
function formatUnits6(raw) {
    const n = BigInt(raw);
    const whole = n / 1_000_000n;
    const frac = (n % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
    return frac ? `${whole.toLocaleString("en-US")}.${frac}` : whole.toLocaleString("en-US");
}
function trimDecimals(value) {
    return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
}
function rawToInput(raw) {
    return formatUnits6(raw).replace(/,/g, "");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p2p/AdForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$useAssetBalance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/p2p/useAssetBalance.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const API_URL = "http://localhost:4000";
const ASSET = "ETH";
const FIAT = "EGP";
const authHeaders = ()=>({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    });
const formatEth = (value)=>(Math.floor(value * 1e8) / 1e8).toFixed(8).replace(/\.?0+$/, "");
const toFieldErrors = (issues)=>{
    const fieldErrors = {};
    issues.forEach((issue)=>{
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    });
    return fieldErrors;
};
const baseFields = {
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Price is required"),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Total is required"),
    minFiat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Minimum amount is required"),
    maxFiat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Maximum amount is required"),
    paymentMethodIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()).min(1, "Select at least one payment method").max(10, "You can select up to 10 payment methods")
};
function checkAmounts(data, ctx, maxTotal) {
    const add = (path, message)=>ctx.addIssue({
            code: "custom",
            path: [
                path
            ],
            message
        });
    if (Number(data.price) <= 0) {
        add("price", "Price must be greater than 0");
    }
    if (Number(data.total) <= 0) {
        add("total", "Total must be greater than 0");
    } else if (maxTotal !== null && Number(data.total) > maxTotal + 1e-12) {
        add("total", `You can sell up to ${formatEth(maxTotal)} ${ASSET}`);
    }
    if (Number(data.minFiat) <= 0) {
        add("minFiat", "Minimum amount must be greater than 0");
    }
    if (Number(data.maxFiat) <= 0) {
        add("maxFiat", "Maximum amount must be greater than 0");
    }
    if (Number(data.minFiat) > Number(data.maxFiat)) {
        add("maxFiat", "Maximum amount must be greater than minimum amount");
    }
}
const buildCreateSchema = (maxTotal)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "buy",
            "sell"
        ]),
        asset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(ASSET),
        fiat: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal(FIAT),
        ...baseFields
    }).superRefine((data, ctx)=>checkAmounts(data, ctx, maxTotal));
const buildUpdateSchema = (maxTotal)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        ...baseFields,
        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "active",
            "paused"
        ])
    }).superRefine((data, ctx)=>checkAmounts(data, ctx, maxTotal));
function AdForm({ adId, initialData, onSuccess }) {
    _s();
    const isEdit = Boolean(adId);
    const [paymentMethods, setPaymentMethods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [serverError, setServerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        side: initialData?.side ?? "buy",
        price: initialData?.price ?? "",
        total: initialData?.total ?? "",
        minFiat: initialData?.minFiat ?? "",
        maxFiat: initialData?.maxFiat ?? "",
        paymentMethodIds: initialData?.paymentMethodIds ?? [],
        status: initialData?.status ?? "active"
    });
    const isSell = form.side === "sell";
    const { available, loading: loadingBalance, error: balanceError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$useAssetBalance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssetBalance"])(ASSET, isSell);
    const adTotal = isEdit ? Number(initialData?.total ?? 0) : 0;
    const maxTotal = isSell && available !== null ? available + adTotal : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdForm.useEffect": ()=>{
            const fetchPaymentMethods = {
                "AdForm.useEffect.fetchPaymentMethods": async ()=>{
                    try {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/payment-methods`, {
                            headers: authHeaders()
                        });
                        setPaymentMethods(response.data);
                    } catch (error) {
                        console.error(error);
                        setServerError("Failed to load payment methods");
                    } finally{
                        setLoadingPaymentMethods(false);
                    }
                }
            }["AdForm.useEffect.fetchPaymentMethods"];
            fetchPaymentMethods();
        }
    }["AdForm.useEffect"], []);
    const handleChange = (field, value)=>{
        setForm((prev)=>({
                ...prev,
                [field]: value
            }));
        setErrors((prev)=>({
                ...prev,
                [field]: ""
            }));
    };
    const handleTotalChange = (value)=>{
        if (!/^\d*\.?\d{0,18}$/.test(value)) return;
        if (maxTotal !== null && Number(value) > maxTotal + 1e-12) {
            setErrors((prev)=>({
                    ...prev,
                    total: `You can sell up to ${formatEth(maxTotal)} ${ASSET}`
                }));
            return;
        }
        handleChange("total", value);
    };
    const togglePaymentMethod = (id)=>{
        setForm((prev)=>{
            const exists = prev.paymentMethodIds.includes(id);
            if (exists) {
                return {
                    ...prev,
                    paymentMethodIds: prev.paymentMethodIds.filter((methodId)=>methodId !== id)
                };
            }
            if (prev.paymentMethodIds.length >= 10) {
                return prev;
            }
            return {
                ...prev,
                paymentMethodIds: [
                    ...prev.paymentMethodIds,
                    id
                ]
            };
        });
        setErrors((prev)=>({
                ...prev,
                paymentMethodIds: ""
            }));
    };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setErrors({});
        setServerError("");
        if (isEdit) {
            const result = buildUpdateSchema(maxTotal).safeParse({
                price: form.price,
                total: form.total,
                minFiat: form.minFiat,
                maxFiat: form.maxFiat,
                status: form.status,
                paymentMethodIds: form.paymentMethodIds
            });
            if (!result.success) {
                setErrors(toFieldErrors(result.error.issues));
                return;
            }
            try {
                setSubmitting(true);
                await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`${API_URL}/ads/${adId}`, result.data, {
                    headers: authHeaders()
                });
                onSuccess?.();
            } catch (error) {
                console.error(error);
                setServerError(error?.response?.data?.message || "Failed to update ad");
            } finally{
                setSubmitting(false);
            }
            return;
        }
        const result = buildCreateSchema(maxTotal).safeParse({
            side: form.side,
            asset: ASSET,
            fiat: FIAT,
            price: form.price,
            total: form.total,
            minFiat: form.minFiat,
            maxFiat: form.maxFiat,
            paymentMethodIds: form.paymentMethodIds
        });
        if (!result.success) {
            setErrors(toFieldErrors(result.error.issues));
            return;
        }
        try {
            setSubmitting(true);
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/ads`, result.data, {
                headers: authHeaders()
            });
            onSuccess?.();
        } catch (error) {
            console.error(error);
            setServerError(error?.response?.data?.message || "Failed to create ad");
        } finally{
            setSubmitting(false);
        }
    };
    const balanceNotReady = isSell && (loadingBalance || maxTotal === null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-white",
                        children: isEdit ? "Update Ad" : "Create Ad"
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-slate-400",
                        children: isEdit ? "Update your P2P advertisement" : "Create a new P2P advertisement"
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/p2p/AdForm.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "space-y-6",
                children: [
                    !isEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-2 block text-sm font-medium text-slate-300",
                                children: "I want to"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    "buy",
                                    "sell"
                                ].map((side)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleChange("side", side),
                                        className: `rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${form.side === side ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"}`,
                                        children: [
                                            side,
                                            " ",
                                            ASSET
                                        ]
                                    }, side, true, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 328,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 326,
                                columnNumber: 13
                            }, this),
                            errors.side && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-red-400",
                                children: errors.side
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 344,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-sm font-medium text-slate-300",
                                        children: "Asset"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white",
                                        children: ASSET
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-sm font-medium text-slate-300",
                                        children: "Fiat"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 361,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white",
                                        children: FIAT
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 365,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-2 block text-sm font-medium text-slate-300",
                                children: [
                                    "Price (per ",
                                    ASSET,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.price,
                                        onChange: (e)=>handleChange("price", e.target.value),
                                        placeholder: "e.g. 150000",
                                        inputMode: "decimal",
                                        className: `w-full rounded-xl border bg-slate-950 px-4 py-3 pr-16 text-white outline-none transition placeholder:text-slate-600 ${errors.price ? "border-red-500" : "border-slate-800 focus:border-yellow-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500",
                                        children: FIAT
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 376,
                                columnNumber: 11
                            }, this),
                            errors.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-red-400",
                                children: errors.price
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-2 block text-sm font-medium text-slate-300",
                                children: "Total"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: form.total,
                                        onChange: (e)=>handleTotalChange(e.target.value),
                                        placeholder: "e.g. 0.5",
                                        inputMode: "decimal",
                                        className: `w-full rounded-xl border bg-slate-950 px-4 py-3 pr-16 text-white outline-none transition placeholder:text-slate-600 ${errors.total ? "border-red-500" : "border-slate-800 focus:border-yellow-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500",
                                        children: ASSET
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            isSell && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex items-center justify-between text-xs text-slate-500",
                                children: loadingBalance ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Loading your balance..."
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/AdForm.tsx",
                                    lineNumber: 425,
                                    columnNumber: 17
                                }, this) : maxTotal !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "Available: ",
                                                formatEth(available ?? 0),
                                                " ",
                                                ASSET,
                                                isEdit && ` (+ ${formatEth(adTotal)} ${ASSET} already in this ad)`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/p2p/AdForm.tsx",
                                            lineNumber: 428,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleChange("total", formatEth(maxTotal)),
                                            className: "font-medium text-yellow-400 hover:underline",
                                            children: "Max"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/AdForm.tsx",
                                            lineNumber: 434,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/AdForm.tsx",
                                    lineNumber: 427,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-400",
                                    children: balanceError || "Could not load your balance"
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/AdForm.tsx",
                                    lineNumber: 443,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 423,
                                columnNumber: 13
                            }, this),
                            errors.total && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-red-400",
                                children: errors.total
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 451,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-sm font-medium text-slate-300",
                                        children: "Minimum Order"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 457,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: form.minFiat,
                                                onChange: (e)=>handleChange("minFiat", e.target.value),
                                                placeholder: "e.g. 500",
                                                inputMode: "decimal",
                                                className: `w-full rounded-xl border bg-slate-950 px-4 py-3 pr-16 text-white outline-none transition placeholder:text-slate-600 ${errors.minFiat ? "border-red-500" : "border-slate-800 focus:border-yellow-400"}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 462,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500",
                                                children: FIAT
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 474,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 461,
                                        columnNumber: 13
                                    }, this),
                                    errors.minFiat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-xs text-red-400",
                                        children: errors.minFiat
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-sm font-medium text-slate-300",
                                        children: "Maximum Order"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: form.maxFiat,
                                                onChange: (e)=>handleChange("maxFiat", e.target.value),
                                                placeholder: "e.g. 50000",
                                                inputMode: "decimal",
                                                className: `w-full rounded-xl border bg-slate-950 px-4 py-3 pr-16 text-white outline-none transition placeholder:text-slate-600 ${errors.maxFiat ? "border-red-500" : "border-slate-800 focus:border-yellow-400"}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500",
                                                children: FIAT
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 502,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 489,
                                        columnNumber: 13
                                    }, this),
                                    errors.maxFiat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-xs text-red-400",
                                        children: errors.maxFiat
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 508,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 484,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this),
                    isEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-2 block text-sm font-medium text-slate-300",
                                children: "Status"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 515,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                    "active",
                                    "paused"
                                ].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleChange("status", status),
                                        className: `rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${form.status === status ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"}`,
                                        children: status
                                    }, status, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 521,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 519,
                                columnNumber: 13
                            }, this),
                            errors.status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-red-400",
                                children: errors.status
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 537,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 514,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-2 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm font-medium text-slate-300",
                                        children: "Payment Methods"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 544,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-slate-500",
                                        children: [
                                            form.paymentMethodIds.length,
                                            "/10 selected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 548,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 543,
                                columnNumber: 11
                            }, this),
                            loadingPaymentMethods ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-500",
                                children: "Loading payment methods..."
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 554,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
                                children: paymentMethods.map((method)=>{
                                    const selected = form.paymentMethodIds.includes(method.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>togglePaymentMethod(method.id),
                                        className: `flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected ? "border-yellow-400 bg-yellow-400/10" : "border-slate-800 bg-slate-950 hover:border-slate-700"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `flex h-5 w-5 items-center justify-center rounded-md border text-xs ${selected ? "border-yellow-400 bg-yellow-400 text-slate-950" : "border-slate-600"}`,
                                                children: selected ? "✓" : ""
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 573,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: selected ? "text-sm text-white" : "text-sm text-slate-400",
                                                children: method.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/p2p/AdForm.tsx",
                                                lineNumber: 583,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, method.id, true, {
                                        fileName: "[project]/app/p2p/AdForm.tsx",
                                        lineNumber: 563,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 558,
                                columnNumber: 13
                            }, this),
                            errors.paymentMethodIds && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-red-400",
                                children: errors.paymentMethodIds
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/AdForm.tsx",
                                lineNumber: 599,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this),
                    serverError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400",
                        children: serverError
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 606,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: submitting || balanceNotReady,
                        className: "w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50",
                        children: submitting ? isEdit ? "Updating..." : "Creating..." : isEdit ? "Update Ad" : "Create Ad"
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/AdForm.tsx",
                        lineNumber: 611,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/p2p/AdForm.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/p2p/AdForm.tsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
_s(AdForm, "iO7tAbYP1/NskG5WXMqNjRMn44c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$useAssetBalance$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssetBalance"]
    ];
});
_c = AdForm;
var _c;
__turbopack_context__.k.register(_c, "AdForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p2p/components/TakeAdModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TakeAdModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/chatApi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const DECIMAL = /^\d+(\.\d{1,18})?$/;
const floorTo8 = (value)=>(Math.floor(value * 1e8) / 1e8).toFixed(8).replace(/\.?0+$/, "");
function TakeAdModal({ ad, mode, paymentMethods, onClose }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const adMethods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TakeAdModal.useMemo[adMethods]": ()=>paymentMethods.filter({
                "TakeAdModal.useMemo[adMethods]": (m)=>ad.paymentMethods.includes(m.name)
            }["TakeAdModal.useMemo[adMethods]"])
    }["TakeAdModal.useMemo[adMethods]"], [
        paymentMethods,
        ad.paymentMethods
    ]);
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [methodId, setMethodId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(adMethods.length === 1 ? adMethods[0].id : "");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TakeAdModal.useEffect": ()=>{
            if (methodId === "" && adMethods.length === 1) setMethodId(adMethods[0].id);
        }
    }["TakeAdModal.useEffect"], [
        adMethods,
        methodId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TakeAdModal.useEffect": ()=>{
            const onKey = {
                "TakeAdModal.useEffect.onKey": (e)=>e.key === "Escape" && onClose()
            }["TakeAdModal.useEffect.onKey"];
            document.addEventListener("keydown", onKey);
            const previous = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "TakeAdModal.useEffect": ()=>{
                    document.removeEventListener("keydown", onKey);
                    document.body.style.overflow = previous;
                }
            })["TakeAdModal.useEffect"];
        }
    }["TakeAdModal.useEffect"], [
        onClose
    ]);
    const price = Number(ad.price);
    const remaining = Number(ad.remaining);
    const minFiat = Number(ad.minFiat);
    const maxFiat = Number(ad.maxFiat);
    const fiatTotal = DECIMAL.test(amount) ? Number(amount) * price : null;
    const maxAmount = Math.min(remaining, maxFiat / price);
    const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TakeAdModal.useMemo[schema]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
                amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(DECIMAL, "Enter a valid amount"),
                paymentMethodId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1, "Select a payment method")
            }).superRefine({
                "TakeAdModal.useMemo[schema]": (data, ctx)=>{
                    const value = Number(data.amount);
                    const fiat = value * price;
                    const issue = {
                        "TakeAdModal.useMemo[schema].issue": (message)=>ctx.addIssue({
                                code: "custom",
                                path: [
                                    "amount"
                                ],
                                message
                            })
                    }["TakeAdModal.useMemo[schema].issue"];
                    if (value <= 0) return issue("Amount must be greater than 0");
                    if (value > remaining) {
                        return issue(`Only ${ad.remaining} ${ad.asset} is available`);
                    }
                    if (fiat < minFiat || fiat > maxFiat) {
                        issue(`Order value must be between ${ad.minFiat} and ${ad.maxFiat} ${ad.fiat}`);
                    }
                }
            }["TakeAdModal.useMemo[schema]"])
    }["TakeAdModal.useMemo[schema]"], [
        price,
        remaining,
        minFiat,
        maxFiat,
        ad
    ]);
    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError("");
        const result = schema.safeParse({
            amount,
            paymentMethodId: methodId === "" ? 0 : methodId
        });
        if (!result.success) {
            setError(result.error.issues[0]?.message ?? "Invalid data");
            return;
        }
        try {
            setSubmitting(true);
            const order = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createOrder"])(ad.id, result.data);
            router.push(`/p2p/order/${order.id}`);
        } catch (e) {
            setError((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorMessage"])(e, "Failed to start the order"));
            setSubmitting(false);
        }
    };
    const isBuy = mode === "buy";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4",
        onClick: onClose,
        role: "dialog",
        "aria-modal": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto my-4 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:my-10",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-5 flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-white",
                                    children: [
                                        isBuy ? "Buy" : "Sell",
                                        " ",
                                        ad.asset
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm text-slate-400",
                                    children: [
                                        "with ",
                                        ad.advertiser
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close",
                            className: "flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-5 space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-slate-500",
                                    children: "Price"
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white",
                                    children: [
                                        ad.price,
                                        " ",
                                        ad.fiat
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-slate-500",
                                    children: "Available"
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white",
                                    children: [
                                        ad.remaining,
                                        " ",
                                        ad.asset
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-slate-500",
                                    children: "Limit"
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white",
                                    children: [
                                        ad.minFiat,
                                        " - ",
                                        ad.maxFiat,
                                        " ",
                                        ad.fiat
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-slate-300",
                                            children: isBuy ? "I want to buy" : "I want to sell"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setAmount(floorTo8(maxAmount)),
                                            className: "text-xs font-medium text-yellow-400 hover:underline",
                                            children: "Max"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: amount,
                                            onChange: (e)=>{
                                                setAmount(e.target.value);
                                                setError("");
                                            },
                                            placeholder: "0.00",
                                            inputMode: "decimal",
                                            className: "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-16 text-base text-white outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500",
                                            children: ad.asset
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-xs text-slate-500",
                                    children: [
                                        isBuy ? "You will pay" : "You will receive",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-slate-300",
                                            children: [
                                                fiatTotal !== null ? fiatTotal.toFixed(2) : "0.00",
                                                " ",
                                                ad.fiat
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 166,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "mb-2 block text-sm font-medium text-slate-300",
                                    children: "Payment method"
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: methodId,
                                    onChange: (e)=>{
                                        setMethodId(e.target.value ? Number(e.target.value) : "");
                                        setError("");
                                    },
                                    className: "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-white outline-none focus:border-yellow-400 sm:text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select payment method"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        adMethods.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: m.id,
                                                children: m.name
                                            }, m.id, false, {
                                                fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                                lineNumber: 220,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-400",
                            children: isBuy ? "After you start, you have a limited time to pay and send the transfer proof in the chat." : "Your ETH will be locked until the order is completed or cancelled."
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: submitting,
                            className: `w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isBuy ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-red-500 text-white hover:bg-red-400"}`,
                            children: submitting ? "Starting..." : `${isBuy ? "Buy" : "Sell"} ${ad.asset}`
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/p2p/components/TakeAdModal.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
_s(TakeAdModal, "6FbifaiOQxcqj7iMJ7G+TdPgjPo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TakeAdModal;
var _c;
__turbopack_context__.k.register(_c, "TakeAdModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p2p/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>P2PMarket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/axios.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/chatApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/format.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$AdForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/p2p/AdForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$components$2f$TakeAdModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/p2p/components/TakeAdModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const DECIMAL = /^\d+(\.\d{1,18})?$/;
const errMsg = (e, fallback)=>{
    const m = e?.response?.data?.message;
    return Array.isArray(m) ? m.join(", ") : m || fallback;
};
const MobileLabel = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "mb-0.5 block text-[11px] uppercase tracking-wide text-slate-500 md:hidden",
        children: children
    }, void 0, false, {
        fileName: "[project]/app/p2p/page.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = MobileLabel;
const fieldClass = "w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-white outline-none placeholder:text-slate-600 focus:border-yellow-400 sm:text-sm";
function P2PMarket() {
    _s();
    const [paymentTypes, setPaymentTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "P2PMarket.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$chatApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaymentMethods"])().then(setPaymentTypes).catch({
                "P2PMarket.useEffect": (error)=>console.error(error)
            }["P2PMarket.useEffect"]);
        }
    }["P2PMarket.useEffect"], []);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("buy");
    const [paymentMethod, setPaymentMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [minRemainingInput, setMinRemainingInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [minRemaining, setMinRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [ads, setAds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showForm, setShowForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedAd, setSelectedAd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "P2PMarket.useEffect": ()=>{
            const t = setTimeout({
                "P2PMarket.useEffect.t": ()=>setMinRemaining(DECIMAL.test(minRemainingInput) ? minRemainingInput : "")
            }["P2PMarket.useEffect.t"], 400);
            return ({
                "P2PMarket.useEffect": ()=>clearTimeout(t)
            })["P2PMarket.useEffect"];
        }
    }["P2PMarket.useEffect"], [
        minRemainingInput
    ]);
    const fetchAds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "P2PMarket.useCallback[fetchAds]": async (signal)=>{
            setLoading(true);
            setError("");
            try {
                const endpoint = tab === "buy" ? "/ads/sell" : "/ads/buy";
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$axios$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(endpoint, {
                    signal,
                    params: {
                        asset: "ETH",
                        ...paymentMethod && {
                            paymentMethod
                        },
                        ...minRemaining && {
                            minRemaining
                        }
                    }
                });
                setAds(data.items);
            } catch (e) {
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(e)) return;
                setError(errMsg(e, "Failed to load ads"));
            } finally{
                if (!signal?.aborted) setLoading(false);
            }
        }
    }["P2PMarket.useCallback[fetchAds]"], [
        tab,
        paymentMethod,
        minRemaining
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "P2PMarket.useEffect": ()=>{
            const controller = new AbortController();
            fetchAds(controller.signal);
            return ({
                "P2PMarket.useEffect": ()=>controller.abort()
            })["P2PMarket.useEffect"];
        }
    }["P2PMarket.useEffect"], [
        fetchAds,
        refreshKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "P2PMarket.useEffect": ()=>{
            if (!showForm) return;
            const onKey = {
                "P2PMarket.useEffect.onKey": (e)=>e.key === "Escape" && setShowForm(false)
            }["P2PMarket.useEffect.onKey"];
            document.addEventListener("keydown", onKey);
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return ({
                "P2PMarket.useEffect": ()=>{
                    document.removeEventListener("keydown", onKey);
                    document.body.style.overflow = prevOverflow;
                }
            })["P2PMarket.useEffect"];
        }
    }["P2PMarket.useEffect"], [
        showForm
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto w-full max-w-5xl px-4 py-6 sm:px-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold text-white sm:text-2xl",
                        children: "P2P Market"
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowForm(true),
                        className: "w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 sm:w-auto sm:py-2.5",
                        children: "+ Create Ad"
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 grid grid-cols-2 gap-2 sm:max-w-xs",
                children: [
                    "buy",
                    "sell"
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(t),
                        className: `rounded-xl border px-4 py-3 text-sm font-medium capitalize transition sm:py-2.5 ${tab === t ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"}`,
                        children: [
                            t,
                            " ETH"
                        ]
                    }, t, true, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-xs text-slate-400",
                                children: "Asset"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-white sm:text-sm",
                                children: "ETH"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-xs text-slate-400",
                                children: "Payment method"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: paymentMethod,
                                onChange: (e)=>setPaymentMethod(e.target.value),
                                className: fieldClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/app/p2p/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this),
                                    paymentTypes.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: item.name,
                                            children: item.name
                                        }, item.id, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "mb-1 block text-xs text-slate-400",
                                children: "Min available (ETH)"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: minRemainingInput,
                                onChange: (e)=>setMinRemainingInput(e.target.value),
                                placeholder: "e.g. 0.5",
                                inputMode: "decimal",
                                className: fieldClass
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-hidden rounded-2xl border border-slate-800 bg-slate-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden grid-cols-12 gap-4 border-b border-slate-800 px-4 py-3 text-xs text-slate-500 md:grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2",
                                children: "Advertiser"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2",
                                children: "Price"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-3",
                                children: "Available / Limit"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-3",
                                children: "Payment"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-2 text-right",
                                children: "Trade"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    ads.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-10 text-center text-sm text-slate-500",
                        children: "No ads match your filters."
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this),
                    ads.map((ad)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 items-center gap-x-4 gap-y-3 border-b border-slate-800 p-4 last:border-b-0 md:grid-cols-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 md:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileLabel, {
                                            children: "Advertiser"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 211,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "truncate text-sm font-medium text-white",
                                            children: ad.advertiser
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-right md:col-span-2 md:text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileLabel, {
                                            children: "Price"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-semibold text-white",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trimDecimals"])(ad.price)
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500",
                                            children: ad.fiat
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/page.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 md:col-span-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileLabel, {
                                            children: "Available / Limit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-slate-300",
                                            children: [
                                                ad.remaining,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-500",
                                                    children: ad.asset
                                                }, void 0, false, {
                                                    fileName: "[project]/app/p2p/page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-slate-500",
                                            children: [
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trimDecimals"])(ad.minFiat),
                                                " - ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$format$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trimDecimals"])(ad.maxFiat),
                                                ad.fiat
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 md:col-span-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileLabel, {
                                            children: "Payment"
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-1.5",
                                            children: ad.paymentMethods.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300",
                                                    children: type
                                                }, type, false, {
                                                    fileName: "[project]/app/p2p/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/p2p/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/p2p/page.tsx",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 md:text-right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedAd(ad),
                                        className: `w-full rounded-lg px-4 py-3 text-sm font-semibold transition md:w-auto md:py-2 ${tab === "buy" ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-red-500 text-white hover:bg-red-400"}`,
                                        children: [
                                            tab === "buy" ? "Buy" : "Sell",
                                            " ETH"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/p2p/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/p2p/page.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, ad.id, true, {
                            fileName: "[project]/app/p2p/page.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-6 text-center text-sm text-slate-500",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/app/p2p/page.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            selectedAd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$components$2f$TakeAdModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                ad: selectedAd,
                mode: tab,
                paymentMethods: paymentTypes,
                onClose: ()=>setSelectedAd(null)
            }, void 0, false, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this),
            showForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4",
                onClick: ()=>setShowForm(false),
                role: "dialog",
                "aria-modal": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto my-2 w-full max-w-3xl sm:my-8",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex justify-end",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowForm(false),
                                "aria-label": "Close",
                                className: "flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/app/p2p/page.tsx",
                                lineNumber: 294,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/page.tsx",
                            lineNumber: 293,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$p2p$2f$AdForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onSuccess: ()=>{
                                setShowForm(false);
                                setRefreshKey((k)=>k + 1);
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/p2p/page.tsx",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/p2p/page.tsx",
                    lineNumber: 289,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/p2p/page.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/p2p/page.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s(P2PMarket, "ZdxrHNFnCqahmtmw7cd0p1f3iXg=");
_c1 = P2PMarket;
var _c, _c1;
__turbopack_context__.k.register(_c, "MobileLabel");
__turbopack_context__.k.register(_c1, "P2PMarket");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p2p/useAssetBalance.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssetBalance",
    ()=>useAssetBalance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const balanceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    asset: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    available: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number()
});
function pickAvailable(data, asset) {
    const raw = data;
    const list = Array.isArray(data) ? data : Array.isArray(raw?.balances) ? raw.balances : [
        data
    ];
    const items = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(balanceSchema).safeParse(list);
    if (!items.success) return null;
    const item = items.data.find((b)=>!b.asset || b.asset === asset);
    return item ? item.available : null;
}
function useAssetBalance(asset, enabled) {
    _s();
    const [available, setAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAssetBalance.useEffect": ()=>{
            if (!enabled) return;
            let cancelled = false;
            const load = {
                "useAssetBalance.useEffect.load": async ()=>{
                    try {
                        setLoading(true);
                        setError("");
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:4000/balances/my-balance", {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            },
                            params: {
                                asset
                            }
                        });
                        const value = pickAvailable(response.data, asset);
                        if (cancelled) return;
                        if (value === null) {
                            setError("Could not read your balance");
                        } else {
                            setAvailable(value);
                        }
                    } catch  {
                        if (!cancelled) setError("Failed to load your balance");
                    } finally{
                        if (!cancelled) setLoading(false);
                    }
                }
            }["useAssetBalance.useEffect.load"];
            load();
            return ({
                "useAssetBalance.useEffect": ()=>{
                    cancelled = true;
                }
            })["useAssetBalance.useEffect"];
        }
    }["useAssetBalance.useEffect"], [
        asset,
        enabled
    ]);
    return {
        available,
        loading,
        error
    };
}
_s(useAssetBalance, "jVfWjglNUKwfnT8L/FMeNUfrYV8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_17u6oju._.js.map