"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailparser_1 = require("mailparser");
const url_1 = require("url");
const htmlparser2_1 = require("htmlparser2");
function parse(emailHtml) {
    return new Promise((resolve, reject) => {
        const handler = new htmlparser2_1.DomHandler((error, dom) => {
            if (error) {
                reject(error);
            }
            else {
                const changes = [];
                // each section starts with a h2
                const h2s = htmlparser2_1.DomUtils.findAll((element) => {
                    return element.name === "h2";
                }, dom);
                for (const h2 of h2s) {
                    let titleElem = h2.next;
                    do {
                        const descElem = titleElem.next;
                        const changeDescElem = descElem.next;
                        const url = new url_1.URL(unescape(titleElem.children[0].attribs.href));
                        url.search = "";
                        changes.push({
                            url: url,
                            summary: changeDescElem.children[0].data.trim(),
                        });
                        console.assert(changeDescElem.next.name === "hr", "Expecting a HR after each change section");
                        titleElem = changeDescElem.next.next;
                    } while (titleElem.next.next.next.name === "hr");
                }
                resolve(changes);
            }
        });
        const parser = new htmlparser2_1.Parser(handler);
        parser.write(emailHtml);
        parser.end();
    });
}
function read(emailStream) {
    const parser = new mailparser_1.MailParser();
    return new Promise((resolve, reject) => {
        parser.on('headers', (headers) => {
            console.log("Received mail:", headers);
        });
        parser.on('data', data => {
            if (data.type === 'text' && typeof data.html === "string") {
                resolve(parse(data.html));
            }
            else {
                reject("no html in message");
            }
        });
        emailStream.pipe(parser);
    });
}
exports.default = read;
//# sourceMappingURL=GovUkUpdateParser.js.map