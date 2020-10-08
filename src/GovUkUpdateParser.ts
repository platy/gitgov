import { MailParser, HeaderValue, AddressObject } from "mailparser";
import { URL } from "url";
import { DomHandler, Parser as HTMLParser, DomUtils, DomElement } from "htmlparser2"
import { Stream } from "stream";

export interface GovUkChange {
    url: URL
    summary: string
}

export function parseBulk(emailHtml: string): Promise<GovUkChange[]> {
    return new Promise((resolve, reject) => {
        const handler = new DomHandler((error, dom) => {
            if (error) {
                reject(error)
            } else {
                try {
                    let changes = extractBulk(dom)
                    if (changes.length === 0) {
                        // maybe its a single
                        const {change} = extractSingle(DomUtils.findOne((elem: DomElement) => elem.name === "p", dom))
                        changes = [change]
                    }
                    resolve(changes)
                } catch (err) {
                    console.error(new Date().toISOString(), "Failed parsing message from email body", emailHtml)
                    reject(err)
                }
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

/** Get the next sibling tag, potentially with the specified name */
function nextElem(elem: DomElement, name?: string) {
    do {
        elem = elem.next
    } while (elem.type !== "tag" || (name && name !== elem.name))
    return elem
}

function extractSingle(titleElem: DomElement) {
    if (nextElem(titleElem).name === "hr") {
        titleElem = nextElem(titleElem, "p") // maybe all of them are like this but this is keeping it backwards compatible
    }
    const url = new URL(unescape(titleElem.children[0].attribs.href))
    url.search = ""
    const descElem = nextElem(titleElem, "p")
    console.assert((descElem.children[0].data as string).replace(/\W+/, " ") === "Page summary", (descElem.children[0].data as string).replace(/\w+/, " ") + "not Page summary")
    const changeDescElem = nextElem(descElem, "p")
    console.assert((changeDescElem.children[0].data as string).replace(/\W+/, " ") === "Change made", (changeDescElem.children[0].data as string).replace(/\w+/, " ") + " not Change made")
    const updateTimeElem = nextElem(changeDescElem, "p")
    console.assert((updateTimeElem.children[0].data as string).replace(/\W+/, " ") === "Time updated", (updateTimeElem.children[0].data as string).replace(/\w+/, " ") + " not Time updated")
    console.assert(updateTimeElem.next.name === "hr", new Date().toISOString(), "Expecting a HR after each change section")
    return {
        change: {
            url: url,
            summary: updateTimeElem.children[2].data.trim() + ": " + changeDescElem.children[2].data.trim(),
        },
        nextTitle: nextElem(updateTimeElem, "p")
    }
}

export default function read(emailStream: Stream): Promise<[GovUkChange[], string]> {
    const parser = new MailParser()
    return new Promise((resolve, reject) => {
        let junk = false
        let topic = "Unknown"
        parser.on("headers", (headers: Map<string, HeaderValue>) => {
            console.log(new Date().toISOString(), "Received mail:", headers)
            const from = (headers.get("from") as AddressObject).value[0].address;
            const to = (headers.get("to") as AddressObject).value[0].address;
            if (!from.includes("gov.uk")) {
                junk = true
            } else {
                topic = to.split("@")[0]
            }
        })
        parser.on("data", data => {
            if (junk) {
                console.log(new Date().toISOString(), "Discarded as junk", data)
                resolve([[], "junk"])
            } else if (data.type === "text" && typeof data.html === "string") {
                if (topic === "govuk") {
                    topic = "Brexit"
                }
                if (topic === "covid") {
                    topic = "Covid-19"
                }
                if (topic === "news") {
                    topic = "News"
                }
                parseBulk(data.html).then(parsed => resolve([parsed, topic]))
            } else {
                reject("no html in message")
            }
        })
        emailStream.pipe(parser)
    })
}