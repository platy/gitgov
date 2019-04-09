"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailparser_1 = require("mailparser");
const url_1 = require("url");
const htmlparser2_1 = require("htmlparser2");
function parseBulk(emailHtml) {
    return new Promise((resolve, reject) => {
        const handler = new htmlparser2_1.DomHandler((error, dom) => {
            if (error) {
                reject(error);
            }
            else {
                let changes = extractBulk(dom);
                if (changes.length === 0) {
                    // maybe its a single
                    const { change } = extractSingle(htmlparser2_1.DomUtils.findOne((elem) => elem.name === "p", dom));
                    changes = [change];
                }
                resolve(changes);
            }
        });
        const parser = new htmlparser2_1.Parser(handler);
        parser.write(emailHtml);
        parser.end();
    });
}
function extractBulk(dom) {
    const changes = [];
    // each section starts with a h2
    const h2s = htmlparser2_1.DomUtils.findAll((element) => {
        return element.name === "h2";
    }, dom);
    for (const h2 of h2s) {
        let titleElem = h2.next;
        do {
            const { change, nextTitle } = extractSingle(titleElem);
            titleElem = nextTitle;
            changes.push(change);
        } while (titleElem.next.next.next.name === "hr");
    }
    return changes;
}
function extractSingle(titleElem) {
    const descElem = titleElem.next;
    const changeDescElem = descElem.next;
    const url = new url_1.URL(unescape(titleElem.children[0].attribs.href));
    url.search = "";
    console.assert(changeDescElem.next.name === "hr", "Expecting a HR after each change section");
    return {
        change: {
            url: url,
            summary: changeDescElem.children[0].data.trim(),
        },
        nextTitle: changeDescElem.next.next
    };
}
function read(emailStream) {
    const parser = new mailparser_1.MailParser();
    return new Promise((resolve, reject) => {
        parser.on('headers', (headers) => {
            console.log("Received mail:", headers);
        });
        parser.on('data', data => {
            if (data.type === 'text' && typeof data.html === "string") {
                resolve(parseBulk(data.html));
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