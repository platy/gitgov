import { MailParser, HeaderValue } from "mailparser";
import { URL } from "url";
import { DomHandler, Parser as HTMLParser, DomUtils, DomElement } from "htmlparser2"
import { Stream } from "stream";

export interface GovUkChange {
    url: URL
    summary: string
}

function parseBulk(emailHtml: string): Promise<GovUkChange[]> {
    return new Promise((resolve, reject) => {
        const handler = new DomHandler((error, dom) => {
            if (error) {
                reject(error)
            } else {
                let changes = extractBulk(dom)
                if (changes.length === 0) {
                    // maybe its a single
                    const {change} = extractSingle(DomUtils.findOne((elem: DomElement) => elem.name === "p", dom))
                    changes = [change]
                }
                resolve(changes)
            }
        })
        const parser = new HTMLParser(handler)
        parser.write(emailHtml)
        parser.end()
    })
}

function extractBulk(dom: DomElement[]) {
    const changes: GovUkChange[] = []
    // each section starts with a h2
    const h2s = DomUtils.findAll((element: DomElement) => {
        return element.name === "h2"
    }, dom)

    for (const h2 of h2s) {
        let titleElem = h2.next
        do {
            const {change, nextTitle} = extractSingle(titleElem)
            titleElem = nextTitle
            changes.push(change)
        } while (titleElem.next.next.next.name === "hr")
    }
    return changes
}

function extractSingle(titleElem: DomElement) {
    const descElem = titleElem.next
    const changeDescElem = descElem.next
    const url = new URL(unescape(titleElem.children[0].attribs.href))
    url.search = ""
    console.assert(changeDescElem.next.name === "hr", "Expecting a HR after each change section")
    return {
        change: {
            url: url,
            summary: changeDescElem.children[0].data.trim(),
        },
        nextTitle: changeDescElem.next.next
    }
}

export default function read(emailStream: Stream): Promise<GovUkChange[]> {
    const parser = new MailParser()
    return new Promise((resolve, reject) => {
        parser.on('headers', (headers: Map<string, HeaderValue>) => {
            console.log("Received mail:", headers)
        })
        parser.on('data', data => {
            if (data.type === 'text' && typeof data.html === "string") {
                resolve(parseBulk(data.html))
            } else {
                reject("no html in message")
            }
        })
        emailStream.pipe(parser)
    })
}