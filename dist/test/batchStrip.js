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
const util_test_1 = require("./util.test");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const basedir = process.argv[2];
        const files = yield util_test_1.readTree(basedir);
        console.log(files);
    });
}
main().catch(console.error);
//# sourceMappingURL=batchStrip.js.map