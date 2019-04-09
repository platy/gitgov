"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = require("../src/util");
exports.deleteFolderRecursive = function (path) {
    if (fs_1.default.existsSync(path)) {
        fs_1.default.readdirSync(path).forEach(function (file) {
            const curPath = path + "/" + file;
            if (fs_1.default.lstatSync(curPath).isDirectory()) { // recurse
                exports.deleteFolderRecursive(curPath);
            }
            else { // delete file
                fs_1.default.unlinkSync(curPath);
            }
        });
        fs_1.default.rmdirSync(path);
    }
};
describe("readTree function", () => {
    it("can read files in test dir", () => {
        return expect(util_1.readTree("./test")).resolves.toContain("util.test.ts");
    });
    it("can read files in subdirs of test dir", () => {
        return expect(util_1.readTree("./test")).resolves.toContain("data/blankfile");
    });
});
//# sourceMappingURL=util.test.js.map