"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const GovUKDocStripper_1 = require("./GovUKDocStripper");
exports.myfetch = node_fetch_1.default;
function toDocUpdate(change) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield exports.myfetch(change.url.toString());
        if (!response.ok) {
            throw "Failed to get doc";
        }
        return {
            path: change.url.pathname,
            content: yield GovUKDocStripper_1.stripDoc(response.body),
            changeMessage: change.summary,
        };
    });
}
exports.default = toDocUpdate;
function setFetch(newFetch) {
    exports.myfetch = newFetch;
}
exports.setFetch = setFetch;
//# sourceMappingURL=GovUkDocFetcher.js.map