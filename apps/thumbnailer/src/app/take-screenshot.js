"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.killBrowser = killBrowser;
var puppeteer = require("puppeteer");
var logger_1 = require("./logger");
var browser = null;
function getBrowserInstance() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!browser) return [3 /*break*/, 2];
                    logger_1.default.info("Creating a new browser");
                    return [4 /*yield*/, puppeteer.launch({
                            headless: true, // eller "headless: false" hvis du trenger et GUI
                            args: [
                                "--no-sandbox",
                                "--disable-setuid-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-accelerated-2d-canvas",
                                "--no-first-run",
                                "--no-zygote",
                                "--single-process",
                                "--disable-gpu",
                            ],
                        })];
                case 1:
                    browser = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, browser];
            }
        });
    });
}
function takeScreenshot(url, token, waitForSelector) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata, browser, page, screenshotBuffer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadata = { component: "takeScreenshot" };
                    return [4 /*yield*/, getBrowserInstance()];
                case 1:
                    browser = _a.sent();
                    page = null;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, 11, 14]);
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.setExtraHTTPHeaders({ Authorization: "Bearer ".concat(token) })];
                case 4:
                    _a.sent();
                    page.setDefaultNavigationTimeout(13000);
                    return [4 /*yield*/, page.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: "networkidle0" })];
                case 6:
                    _a.sent();
                    if (!waitForSelector) return [3 /*break*/, 8];
                    logger_1.default.info("Waiting for selector: " + waitForSelector, metadata);
                    return [4 /*yield*/, page.waitForSelector(waitForSelector, { visible: true })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4 /*yield*/, page.screenshot({ type: "png", encoding: "binary" })];
                case 9:
                    screenshotBuffer = _a.sent();
                    if (!(screenshotBuffer instanceof Buffer)) {
                        throw new Error("Screenshot failed, did not return a buffer");
                    }
                    return [2 /*return*/, screenshotBuffer];
                case 10:
                    error_1 = _a.sent();
                    logger_1.default.error("Error taking screenshot: " + error_1.message, metadata);
                    throw error_1; // Re-throw the error for the caller to handle
                case 11:
                    if (!page) return [3 /*break*/, 13];
                    return [4 /*yield*/, page.close()];
                case 12:
                    _a.sent(); // Make sure to close the page to free up resources
                    _a.label = 13;
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function killBrowser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!browser) return [3 /*break*/, 2];
                    return [4 /*yield*/, browser.close()];
                case 1:
                    _a.sent();
                    browser = null; // Set browser to null to ensure clean re-initialization
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.default = takeScreenshot;
