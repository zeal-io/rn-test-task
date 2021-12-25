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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.root = void 0;
var nanoid_1 = require("nanoid");
var utils_1 = require("./utils");
var root = function (fastify) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fastify.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, email, password, name;
            return __generator(this, function (_b) {
                _a = req.body, email = _a.email, password = _a.password, name = _a.name;
                if (!email || !password) {
                    res.status(400).send({ error: "Missing info" });
                }
                if (utils_1.db.users[email]) {
                    res.status(400).send({ error: "User already exists" });
                    return [2 /*return*/];
                }
                if (password.includes(utils_1.SEPERATOR)) {
                    res.status(400).send({ error: "Invalid Password" });
                    return [2 /*return*/];
                }
                utils_1.db.users[email] = { password: password, name: name };
                utils_1.db.data[email] = {
                    locations: {},
                    users: {}
                };
                (0, utils_1.persistDB)();
                res.send({
                    token: "".concat(email).concat(utils_1.SEPERATOR).concat(password)
                });
                return [2 /*return*/];
            });
        }); });
        fastify.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, email, password;
            return __generator(this, function (_b) {
                _a = req.body, email = _a.email, password = _a.password;
                console.log(email, password);
                if (!utils_1.db.users[email] || utils_1.db.users[email].password !== password) {
                    return [2 /*return*/, res.status(401).send({ error: "Invalid credentials" })];
                }
                res.send({
                    token: "".concat(email).concat(utils_1.SEPERATOR).concat(password)
                });
                return [2 /*return*/];
            });
        }); });
        fastify.get("/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo;
            var _a, _b;
            return __generator(this, function (_c) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    return [2 /*return*/, res.status(401).send({ error: authInfo.error })];
                }
                res.send({
                    users: Object.values((_b = (_a = utils_1.db.data[authInfo.email]) === null || _a === void 0 ? void 0 : _a.users) !== null && _b !== void 0 ? _b : {}).map(function (x) {
                        delete x.locationsIndexes;
                        return x;
                    })
                });
                return [2 /*return*/];
            });
        }); });
        // create user
        fastify.post("/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, _a, _b, locations, person, ids;
            return __generator(this, function (_c) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                _a = req.body, _b = _a.locations, locations = _b === void 0 ? [] : _b, person = __rest(_a, ["locations"]);
                if (!person.email || !person.name) {
                    res.status(400).send({ error: "Invalid person" });
                }
                if (utils_1.db.data[authInfo.email].users[person.email]) {
                    res.status(400).send({ error: "User already exists" });
                }
                ids = locations.reduce(function (acc, location) {
                    var id = (0, nanoid_1.nanoid)();
                    acc[id] = true;
                    utils_1.db.data[authInfo.email].locations[id] = location;
                    return acc;
                }, {});
                utils_1.db.data[authInfo.email].users[person.email] = __assign(__assign({}, person), { locationsIndexes: ids !== null && ids !== void 0 ? ids : {} });
                (0, utils_1.persistDB)();
                return [2 /*return*/, {
                        success: true
                    }];
            });
        }); });
        fastify.patch("/user/:email", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, email, person;
            return __generator(this, function (_a) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                email = req.params.email;
                person = req.body;
                if (!utils_1.db.data[authInfo.email].users[email]) {
                    res.status(400).send({ error: "No Such User" });
                }
                utils_1.db.data[authInfo.email].users[email] = __assign(__assign({}, utils_1.db.data[authInfo.email].users[email]), { name: person.name || utils_1.db.data[authInfo.email].users[email].name, email: person.email || email });
                (0, utils_1.persistDB)();
                return [2 /*return*/, {
                        success: true
                    }];
            });
        }); });
        fastify["delete"]("/user/:email", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, email, user;
            var _a;
            return __generator(this, function (_b) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                email = req.params.email;
                user = utils_1.db.data[authInfo.email].users[email];
                if (!user) {
                    res.status(400).send({ error: "No Such User" });
                }
                Object.keys((_a = user.locationsIndexes) !== null && _a !== void 0 ? _a : {}).forEach(function (id) {
                    delete utils_1.db.data[authInfo.email].locations[id];
                });
                // db.data[authInfo.email!].users[email] = undefined
                delete utils_1.db.data[authInfo.email].users[email];
                (0, utils_1.persistDB)();
                return [2 /*return*/, {
                        success: true
                    }];
            });
        }); });
        fastify.get("/location", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, locations;
            var _a, _b;
            return __generator(this, function (_c) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                locations = Object.entries((_b = (_a = utils_1.db.data[authInfo === null || authInfo === void 0 ? void 0 : authInfo.email]) === null || _a === void 0 ? void 0 : _a.locations) !== null && _b !== void 0 ? _b : {}).map(function (_a) {
                    var id = _a[0], location = _a[1];
                    return __assign(__assign({}, location), { id: id });
                });
                res.send({
                    locations: locations
                });
                return [2 /*return*/];
            });
        }); });
        fastify.post("/location/:userEmail", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, userEmail, _a, lat, lng, id;
            return __generator(this, function (_b) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                userEmail = req.params.userEmail;
                _a = req.body, lat = _a.lat, lng = _a.lng;
                id = (0, nanoid_1.nanoid)();
                utils_1.db.data[authInfo.email].locations[id] = { lat: lat, lng: lng };
                utils_1.db.data[authInfo.email].users[userEmail].locationsIndexes[id] = true;
                (0, utils_1.persistDB)();
                res.send({
                    success: true
                });
                return [2 /*return*/];
            });
        }); });
        fastify.get("/location/:userEmail", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, userEmail, ids, locations;
            var _a;
            return __generator(this, function (_b) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                userEmail = req.params.userEmail;
                ids = Object.keys((_a = utils_1.db.data[authInfo.email].users[userEmail].locationsIndexes) !== null && _a !== void 0 ? _a : {});
                locations = ids.map(function (id) { return (__assign(__assign({}, utils_1.db.data[authInfo.email].locations[id]), { id: id })); });
                res.send({
                    locations: Object.values(locations)
                });
                return [2 /*return*/];
            });
        }); });
        fastify.patch("/location/:locationId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, locationId, _a, lat, lng;
            return __generator(this, function (_b) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                locationId = req.params.locationId;
                _a = req.body, lat = _a.lat, lng = _a.lng;
                if (!utils_1.db.data[authInfo.email].locations[locationId]) {
                    res.status(400).send({ error: "No Such Location" });
                }
                utils_1.db.data[authInfo.email].locations[locationId] = { lat: parseFloat(lat), lng: parseFloat(lng) };
                (0, utils_1.persistDB)();
                res.send({
                    success: true
                });
                return [2 /*return*/];
            });
        }); });
        fastify["delete"]("/location/:locationId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var token, authInfo, locationId;
            return __generator(this, function (_a) {
                token = req.headers.token;
                authInfo = (0, utils_1.authenticateUser)(token);
                if (authInfo.error) {
                    res.status(401).send({ error: authInfo.error });
                }
                locationId = req.params.locationId;
                if (!utils_1.db.data[authInfo.email].locations[locationId]) {
                    res.status(400).send({ error: "No Such Location." });
                }
                delete utils_1.db.data[authInfo.email].locations[locationId];
                Object.keys(utils_1.db.data[authInfo.email].users).forEach(function (user) {
                    var locationsIndexes = utils_1.db.data[authInfo.email].users[user].locationsIndexes;
                    delete locationsIndexes[locationId];
                });
                (0, utils_1.persistDB)();
                res.send({
                    success: true
                });
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.root = root;
