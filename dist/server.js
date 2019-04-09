"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gitgovServer_1 = require("./gitgovServer");
const server = gitgovServer_1.gitgovServer("repo");
server.listen(25, () => console.log("SMTP server up"));
//# sourceMappingURL=server.js.map