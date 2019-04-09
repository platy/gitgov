"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = require("fs");
const path_1 = require("path");
function readTree(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield util_1.promisify(fs_1.readdir)(path, { withFileTypes: true });
        const subdirfiles = Promise.all(entries.filter(file => file.isDirectory()).map(dir => readTree(path + path_1.sep + dir.name).then(files => files.map(filename => dir.name + path_1.sep + filename))));
        const filenames = entries.filter(file => !file.isDirectory()).map(file => file.name);
        for (let onesubdirfiles of yield subdirfiles) {
            filenames.push(...onesubdirfiles);
        }
        return Promise.resolve(filenames);
    });
}
exports.readTree = readTree;
//# sourceMappingURL=util.js.map