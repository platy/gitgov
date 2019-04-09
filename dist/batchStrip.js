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
const util_1 = require("./util");
const fs_1 = require("fs");
const path_1 = require("path");
const GovUKDocStripper_1 = require("./GovUKDocStripper");
const util_2 = require("util");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const basedir = process.argv[2];
        const outputdir = basedir + "-stripped";
        const files = yield util_1.readTree(basedir);
        console.log(files);
        for (const file of files) {
            const instream = fs_1.createReadStream(path_1.resolve(basedir, file));
            const strippedData = yield GovUKDocStripper_1.stripDoc(instream);
            const outputfilepath = path_1.resolve(outputdir, file);
            yield util_2.promisify(fs_1.mkdir)(path_1.dirname(outputfilepath), { recursive: true });
            yield util_2.promisify(fs_1.writeFile)(outputfilepath, strippedData);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=batchStrip.js.map