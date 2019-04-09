import { Parser, DomHandler } from "htmlparser2";

export function stripDoc(stream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
        let content = "";
        let depth = 0;
        let mainDepth = 0;
        const handler = {
            onopentag: function (name: string, attribs: {
                [s: string]: string;
            }) {
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
            ontext: function (text: string) {
                if (mainDepth) { // within main
                    content += text;
                }
            },
            onclosetag: function (name: string) {
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
        const parser = new Parser(handler as DomHandler, { decodeEntities: true });
        stream.on("data", parser.write.bind(parser));
        stream.on("end", parser.end.bind(parser));
        stream.on("error", reject);
    });
}
