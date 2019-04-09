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
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const promise_1 = __importDefault(require("simple-git/promise"));
class DocUpdatePusher {
    constructor(repoPath) {
        this.repoPath = repoPath;
        this.repo = promise_1.default(repoPath);
    }
    push(change) {
        return __awaiter(this, void 0, void 0, function* () {
            console.assert(yield this.isClean(), "Repo must be clean before pushing a change");
            const filepath = this.repoPath + change.path;
            const repopath = path_1.relative(this.repoPath, filepath);
            yield this.writeFile(filepath, change.content);
            yield this.repo.add(repopath);
            yield this.repo.commit(change.changeMessage, repopath);
            if (yield this.hasRemote()) {
                yield this.repo.push();
            }
        });
    }
    isClean() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.repo.status();
            return status.isClean();
        });
    }
    hasRemote() {
        return __awaiter(this, void 0, void 0, function* () {
            const remotes = yield this.repo.getRemotes(false);
            return remotes.length > 0;
        });
    }
    writeFile(filepath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.promisify(fs_1.mkdir)(path_1.dirname(filepath), { recursive: true });
            const writeStream = fs_1.createWriteStream(filepath);
            yield new Promise((resolve, reject) => {
                writeStream.on("finish", resolve);
                writeStream.on("error", reject);
                writeStream.write(content);
                writeStream.close();
            });
        });
    }
}
exports.default = DocUpdatePusher;
//# sourceMappingURL=DocUpdatePusher.js.map