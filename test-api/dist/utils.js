"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.authenticateUser = exports.persistDB = exports.SEPERATOR = exports.db = void 0;
var db_json_1 = __importDefault(require("./db.json"));
exports.db = {
    data: db_json_1["default"].data,
    users: db_json_1["default"].users
};
exports.SEPERATOR = ";;;";
function persistDB() {
    require("fs").writeFileSync("./src/db.json", JSON.stringify(exports.db, null, 2));
}
exports.persistDB = persistDB;
function authenticateUser(token) {
    var _a = token.split(exports.SEPERATOR), email = _a[0], password = _a[1];
    console.log({ email: email, password: password });
    if (!email || !password || !exports.db.users[email] || exports.db.users[email].password !== password) {
        return { error: "Invalid token" };
    }
    return {
        email: email,
        password: password
    };
}
exports.authenticateUser = authenticateUser;
