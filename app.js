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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_1 = __importDefault(require("firebase"));
var newTaipei_json_1 = __importDefault(require("./json/address/newTaipei.json"));
var puppeteer_1 = __importDefault(require("puppeteer"));
var path_1 = __importDefault(require("path"));
var FCM = require('fcm-node');
var node_gcm_1 = __importDefault(require("node-gcm"));
var fetch = require("node-fetch");
var express = require('express');
var app = express();
var port = 3000;
var firebaseConfig = {
    apiKey: "AIzaSyDKpQWRRwgGgdem8eULOssQ-WxmrZeDfZ0",
    authDomain: "housemoney-51217.firebaseapp.com",
    projectId: "housemoney-51217",
    storageBucket: "housemoney-51217.appspot.com",
    messagingSenderId: "1070650822941",
    appId: "1:1070650822941:web:e8550b687907ec214c11f4",
    measurementId: "G-59V0YGPGR5"
};
app.get('/', function (req, res) {
    res.send('Hello World!');
});
firebase_1.default.initializeApp(firebaseConfig);
app.listen(port, function () {
    //console.log("fcm", fcm);
    //apns();
    gcmPush();
    // printPic();
    // const dbh = firebase.firestore();
    // dbh.collection('newTaipei');
    // console.log(`Example app listening at http://localhost:${port}`)
    //initData();
});
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var initData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dbh, data, newAddress, index, api, page, formatData, row, text, index, add, newGroup, j, element, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dbh = firebase_1.default.firestore();
                data = {
                    "city": "newTaipei",
                    "apis": [
                        {
                            "key": "https://data.ntpc.gov.tw/api/datasets/ACCE802D-58CC-4DFF-9E7A-9ECC517F78BE/json",
                            "name": "110"
                        },
                    ]
                };
                newAddress = [];
                index = 0;
                _a.label = 1;
            case 1:
                if (!(index < data.apis.length)) return [3 /*break*/, 8];
                api = data.apis[index];
                page = 1;
                formatData = [""];
                _a.label = 2;
            case 2:
                if (!(formatData.length != 0)) return [3 /*break*/, 6];
                return [4 /*yield*/, sleep(300)];
            case 3:
                _a.sent();
                return [4 /*yield*/, fetch(api.key + '?size=1000&page=' + page)];
            case 4:
                row = _a.sent();
                return [4 /*yield*/, row.text()];
            case 5:
                text = _a.sent();
                formatData = JSON.parse(text);
                console.log('url!', api.key + '?size=1000&page=' + page);
                page++;
                newAddress = newAddress.concat(formatData);
                return [3 /*break*/, 2];
            case 6:
                console.log("page", page);
                _a.label = 7;
            case 7:
                index++;
                return [3 /*break*/, 1];
            case 8:
                newTaipei_json_1.default.forEach(function (add) {
                    var _a;
                    var tmp = newAddress.filter(function (address) {
                        return address.district.indexOf(add.label) > -1;
                    });
                    if (tmp != undefined) {
                        add.data = (_a = add.data) === null || _a === void 0 ? void 0 : _a.concat(tmp);
                    }
                });
                console.log('ready!!!');
                index = 0;
                _a.label = 9;
            case 9:
                if (!(index < newTaipei_json_1.default.length)) return [3 /*break*/, 17];
                add = newTaipei_json_1.default[index];
                console.log(add.data.length);
                newGroup = group(add.data, 100);
                j = 0;
                _a.label = 10;
            case 10:
                if (!(j < newGroup.length)) return [3 /*break*/, 16];
                element = newGroup[j];
                return [4 /*yield*/, sleep(1500)];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                _a.trys.push([12, 14, , 15]);
                return [4 /*yield*/, dbh.collection(data.city).doc(add.value + "_" + data.apis[0].name + "_" + j).set({
                        data: {
                            element: element,
                            year: data.apis[0].name,
                            count: element.length
                        }
                    })];
            case 13:
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                error_1 = _a.sent();
                console.log('error' + add.value + "_" + data.apis[0].name + +"_" + j);
                return [3 /*break*/, 15];
            case 15:
                j++;
                return [3 /*break*/, 10];
            case 16:
                index++;
                return [3 /*break*/, 9];
            case 17:
                console.log('done');
                return [2 /*return*/];
        }
    });
}); };
function group(array, subGroupLength) {
    var index = 0;
    var newArray = [];
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
function delay(delayInms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(2);
        }, delayInms);
    });
}
function fcmPush() {
    var serverKey = 'AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh'; //put your server key here
    var fcm = new FCM(serverKey);
    var message = {
        to: 'a05dc038c92237fb573e9906045e7bcc30c09a5299a639e41d83efd40e63cec3',
        collapse_key: 'collapse_key',
        notification: {
            title: 'Title of your push notification',
            body: 'Body of your push notification'
        },
        data: {
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        }
        else {
            console.log("Successfully sent with response: ", response);
        }
    });
}
function apns() {
    var apn = require("apn");
    var tokens = ["a05dc038c92237fb573e9906045e7bcc30c09a5299a639e41d83efd40e63cec3"];
    var service = new apn.Provider({
        cert: "ck.pem",
        key: "ipos18_prod.pem",
        passphrase: "xlinkxlink",
        gateway: 'gateway.sandbox.push.apple.com',
        port: 2195,
    });
    var note = new apn.Notification({
        alert: "Test",
    });
    // The topic is usually the bundle identifier of your application.
    note.topic = "test";
    console.log("Sending: ".concat(note.compile(), " to ").concat(tokens));
    service.send(note, tokens).then(function (result) {
        console.log("sent:", result.sent.length);
        console.log("failed:", result.failed.length);
        console.log(result.failed);
    });
}
function gcmPush() {
    // AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh
    var sender = new node_gcm_1.default.Sender('AAAAf6WFQMw:APA91bFRCkkSY8yKzhOf9Lnzh-lrJO2dYpytFn0GgOVkKvAJZbP7LzJeYpNQyeP_AQ8byvdIkg7_K7vhAiQMcNrLKjFED8G2cPHMUFBP0ktzgUUO214ZjliQ8umTcCKvJGqKz_urHMKh');
    console.log("gcmPush!");
    var message = new node_gcm_1.default.Message({
        data: {
            aps: {
                alert: "alert",
                badge: 1,
                body: "body",
                fpic: "https://www.dawu.xyz/fcmpush/pa1.jpg",
                fun: "https://www.google.com",
                title: "title",
                "mutable-content": 1,
                sound: "default"
            }
        }
    });
    // Specify which registration IDs to deliver the message to
    var regTokens = ['ddBBys6hC7I:APA91bH-RGU8NI_qIO62L6v86sZtbDHofd89TcyA-3vkZ3nbB5CmIm41umESi47qaBmH3S6RnX1vacALJv6aebr9IXOcNzQElb_dtcuSw4kAbXDNT-pZLUoAyeQ2nTPVShAmPa-0aQ3c'];
    // Actually send the message
    sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err)
            console.error(err);
        else
            console.log("error response:", response);
    });
}
var youtubeUrlRegExp = new RegExp(/^https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)(&t=(\d+))?$/);
//https://www.youtube-nocookie.com/embed/w4Ay5N0hPgk?start=18&autoplay=1
var printPic = function () {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, url, filename, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    console.log("1");
                    return [4 /*yield*/, puppeteer_1.default.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()
                        // Bridge browser console to Node (used while developing package)
                    ];
                case 2:
                    page = _a.sent();
                    // Bridge browser console to Node (used while developing package)
                    page.on("console", function (message) { return console.log("Page log:", message); });
                    return [4 /*yield*/, page.setViewport({
                            width: parseInt("1920") / 2,
                            height: parseInt("1080") / 2,
                            deviceScaleFactor: 2,
                        })];
                case 3:
                    _a.sent();
                    url = "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&start=120&end=200&modestbranding=1\n    &rel=0&autohide=1&showinfo=0&controls=0&fs=0&cc_load_policy=0&color=white&enablejsapi=1";
                    console.log("??", url);
                    return [4 /*yield*/, page.goto(url)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, delay(500)];
                case 5:
                    _a.sent();
                    console.log("2");
                    // Remove "Watch on YouTube"
                    return [4 /*yield*/, page.evaluate(function (selector) {
                            var node = document.querySelector(selector);
                            if (node) {
                                node.parentNode.removeChild(node);
                            }
                        }, ".ytp-impression-link")];
                case 6:
                    // Remove "Watch on YouTube"
                    _a.sent();
                    filename = "21212.png";
                    return [4 /*yield*/, page.screenshot({
                            path: path_1.default.resolve("/Users/liangjinkan/Downloads/作品集", filename),
                            type: "png",
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 8:
                    _a.sent();
                    console.log("3");
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _a.sent();
                    console.log("??");
                    console.error(error_2);
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
};
