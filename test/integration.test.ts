import git from "simple-git/promise"
import { resolve } from "path";
import { mkdirSync, createReadStream } from "fs";
import { SMTPServer } from "smtp-server"
import { default as fetch, Response } from "node-fetch"
import { setFetch } from "../src/GovUkDocFetcher"
import { createTransport } from "nodemailer";
import { Readable } from "stream";
import { readTree, deleteFolderRecursive } from "./util.test";
import { gitgovServer } from "../src/gitgovServer";

describe("integration", () => {
    describe("when receiving a UK Gov update email", () => {
        let basePath: string
        let repo: git.SimpleGit
        let server: SMTPServer

        beforeAll(async () => {
            basePath = resolve("temp/testrepointegration")
            mkdirSync(basePath, { recursive: true })
            repo = git(basePath)
            await repo.init()

            const mockFetch = (jest.fn((input: RequestInfo, init?: RequestInit) => {
                const content = new Readable()
                content.push('<html><body><main id="content">CONTENT</main></body></head>')
        // tslint:disable-next-line: no-null-keyword
                content.push(null)
                content._read = () => {}
                return Promise.resolve(new Response(content))
            }))
            setFetch(mockFetch as any as typeof fetch)


            server = gitgovServer(basePath)
            await new Promise((resolve, _reject) => {
                server.listen(5587, resolve)
            })

            const transporter = createTransport({
                host: "localhost",
                port: 5587,
                secure: false, // true for 465, false for other ports
                tls: {
                  // do not fail on invalid certs
                  rejectUnauthorized: false
                },
            });

            return transporter.sendMail({
                raw: createReadStream("./test/data/GOV.UK_ your daily update.eml", { encoding: "utf-8" }),
                envelope: {
                    to: "notify@gitgov.njk.onl",
                }
            })
        })

        it("has downloaded all the updated files to the repo dir", () => {
            return expect(readTree(basePath)).resolves.toEqual(expect.arrayContaining([
                "government/publications/international-agreements-if-the-uk-leaves-the-eu-without-a-deal",
                "guidance/important-eu-exit-information-for-uk-nationals-if-theres-no-deal",
                "government/news/meeting-british-citizens-across-italy",
                "guidance/living-in-belgium",
                "government/news/information-and-events-for-uk-nationals-living-in-greece",
                "government/publications/exporting-active-substance-manufacturer-in-the-uk-if-we-leave-the-eu-without-a-deal",
                "government/news/no-deal-eu-exit-government-issues-reminder-to-waste-industry",
                "government/publications/frameworks-analysis",
                "government/news/eu-workers-qualifications-will-be-recognised-after-eu-exit",
                "government/publications/find-a-professional-to-certify-export-health-certificates",
                "government/publications/health-and-social-care-staff-eu-exit-preparations-update",
                "guidance/living-in-germany",
                "guidance/social-security-contributions-for-uk-and-eu-workers-if-the-uk-leaves-the-eu-with-no-deal",
                "government/publications/policy-paper-on-the-rights-of-uk-nationals-in-the-eu",
            ]))
        })

        it("has used the correct commit messages", async () => {
            const log = await repo.log()
            return expect(log.all.map(log => log.message)).toEqual([
                "5:03pm, 4 April 2019: Updates made to the following agreements:Moldova Air Services Arrangement, Bosnia and Herzegovina Air Services Arrangement, Serbia Air Services Arrangement, Republic of North Macedonia Air Services Arrangement, Hague 2007, Hague 2005, INTERBUS, UK-US Agreement on Mutual Recognition, UK – Switzerland Trade Agreement, Norway and Iceland Trading Arrangements, UK-US Marine Mutual Recognition Agreement, Vine and Wine, Indonesia FLEGT, EU-Armenia Comprehensive and Enhanced Partnership Agreement’, Partnership and Cooperation Agreement between the European Communities and the Republic of Azerbaijan, Political Dialogue and Cooperation Agreement between the European Union and the Republic of Cuba, Partnership and Cooperation Agreement between the European Union and the Republic of Iraq, Strategic Partnership Agreement Between the European Union and Japan, Enhanced Partnership and Cooperation Agreement between the European Union and the Republic of Kazakhstan, EU-Singapore Partnership and Cooperation Agreement (ESPCA), Partnership and Cooperation Agreement between the EU and Turkmenistan (PCA), Parternship and Cooperation Agreement establishing a partnership between the European Communities and the Republic of Uzbekistan, EU-Armenia Comprehensive and Enhanced Partnership Agreement’, Partnership and Cooperation Agreement between the European Communities and the Republic of Azerbaijan, Political Dialogue and Cooperation Agreement between the European Union and the Republic of Cuba, Partnership and Cooperation Agreement between the European Union and the Republic of Iraq, Strategic Partnership Agreement Between the European Union and Japan, Enhanced Partnership and Cooperation Agreement between the European Union and the Republic of Kazakhstan, EU-Singapore Partnership and Cooperation Agreement (ESPCA), Partnership and Cooperation Agreement between the EU and Turkmenistan (PCA), Parternship and Cooperation Agreement establishing a partnership between the European Communities and the Republic of Uzbekistan, North Atlantic Ocean",
                "4:35pm, 4 April 2019: EU Exit update – added sections on accessing benefits in the UK, higher education in the UK and bringing family members to the UK.",
                "3:38pm, 4 April 2019: News citizens’ rights and EU Exit meeting",
                "2:41pm, 4 April 2019: EU Exit update: added information on the latest no deal legislation in healthcare, visas and residency, education and driving sections",
                "2:04pm, 4 April 2019: EU Exit update: confirmed time/venue for UK nationals outreach event in Kardamili",
                "1:46pm, 4 April 2019: Updated Register of Written Confirmations for UK Active Substance Manufacturers added to the page.",
                "1:12pm, 4 April 2019: Minor change to wording on potential disruption at ports",
                "11:10am, 4 April 2019: Added attachment: ‘Revised Frameworks Analysis: Breakdown of areas of EU law that intersect with devolved competence in Scotland, Wales and Northern Ireland’.",
                "10:54am, 4 April 2019: First published.",
                "10:54am, 4 April 2019: Added 30 vet and 7 local authority certifiers in England, Scotland and Wales.",
                "10:39am, 4 April 2019: First published.",
                "10:38am, 4 April 2019: EU Exit update: New information on residency and travel after EU Exit",
                "10:31am, 4 April 2019: First published.",
                "9:36am, 4 April 2019: First published.",
            ].reverse())
        })

        it("leaves the repo clean", async () => {
            const status = await repo.status()
            expect(status.isClean()).toBe(true)
        })

        afterAll(() => {
            deleteFolderRecursive(basePath)
        })
    })
})
