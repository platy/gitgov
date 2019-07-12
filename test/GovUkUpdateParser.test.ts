import { promises as fs } from "fs";
import { parseBulk, GovUkChange } from "../src/GovUkUpdateParser"
import { URL } from "url"


describe("gov.uk update email parser", () => {
    describe("when given the new format body", () => {
        let result: GovUkChange[]

        beforeAll(async () => {
            const bodyHtml = await fs.readFile("test/data/new-email-format.html", {encoding: "utf8"})
            result = await parseBulk(bodyHtml)
        })

        it("has a result", () => {
            expect(result).toEqual([
                {
                    summary: "10:35am, 10 July 2019: Forms EC3163 and EC3164 updated",
                    url: new URL("https://www.gov.uk/guidance/export-live-animals-special-rules")
                }
            ])
        })
    })
})
