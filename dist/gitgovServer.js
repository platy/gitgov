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
const smtp_server_1 = require("smtp-server");
const GovUkUpdateParser_1 = __importDefault(require("./GovUkUpdateParser"));
const GovUkDocFetcher_1 = __importDefault(require("./GovUkDocFetcher"));
const DocUpdatePusher_1 = __importDefault(require("./DocUpdatePusher"));
function gitgovServer(repoPath) {
    const pusher = new DocUpdatePusher_1.default(repoPath);
    const server = new smtp_server_1.SMTPServer({
        secure: false,
        authOptional: true,
        onMailFrom(_address, _session, callback) {
            callback();
        },
        onRcptTo(_address, _session, callback) {
            callback();
        },
        onData(stream, _session, callback) {
            console.log("DATA");
            function promised() {
                return __awaiter(this, void 0, void 0, function* () {
                    const changes = yield GovUkUpdateParser_1.default(stream);
                    const updates = changes.map(GovUkDocFetcher_1.default);
                    // await and push each update sequentially
                    for (const update of updates) {
                        yield pusher.push(yield update);
                    }
                });
            }
            promised().then(() => callback(), callback);
        },
        onClose(session) {
            console.log("Closed session", session);
        }
    });
    return server;
}
exports.gitgovServer = gitgovServer;
//# sourceMappingURL=gitgovServer.js.map