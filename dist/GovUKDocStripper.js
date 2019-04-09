"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
function stripDoc(stream) {
    return new Promise((resolve, reject) => {
        let content = "";
        let depth = 0;
        let mainDepth = 0;
        const handler = {
            onopentag: function (name, attribs) {
                depth += 1;
                if (mainDepth) { // within main
                    let tag = "<" + name;
                    for (const key in attribs) {
                        if (attribs[key]) {
                            tag = tag.concat(" ", key, '="', attribs[key], '"');
                        }
                        else {
                            tag = tag.concat(" ", key);
                        }
                    }
                    content = content.concat(tag, ">");
                }
                else if (name == "main") { // start of main
                    mainDepth = depth;
                }
            },
            ontext: function (text) {
                if (mainDepth) { // within main
                    content += text;
                }
            },
            onclosetag: function (name) {
                if (depth === mainDepth) { // end of main
                    mainDepth = 0;
                }
                else if (mainDepth) {
                    content += "</" + name + ">";
                }
                depth -= 1;
            },
            onend() {
                resolve(content.trim());
            }
        };
        const parser = new htmlparser2_1.Parser(handler, { decodeEntities: true });
        stream.on("data", parser.write.bind(parser));
        stream.on("end", parser.end.bind(parser));
        stream.on("error", reject);
    });
}
exports.stripDoc = stripDoc;
//# sourceMappingURL=GovUKDocStripper.js.map