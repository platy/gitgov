import { createReadStream } from "fs";
import read from "../src/GovUkUpdateParser"
import { Stream } from "stream";
import { URL } from "url"


describe("gov.uk update email parser", () => {
    describe("when given a vcalid email with a bunch of updates", () => {
        let updateString: Stream
        beforeAll(() => {
            updateString = createReadStream("./test/data/GOV.UK_ your daily update.eml", { encoding: "utf-8" })
        })

        it("Extacts the first update", () => {
            return expect(read(updateString)).resolves.toEqual([
                {
                    url: new URL("https://www.gov.uk/government/publications/international-agreements-if-the-uk-leaves-the-eu-without-a-deal"),
                    summary: "5:03pm, 4 April 2019: Updates made to the following agreements:Moldova Air Services Arrangement, Bosnia and Herzegovina Air Services Arrangement, Serbia Air Services Arrangement, Republic of North Macedonia Air Services Arrangement, Hague 2007, Hague 2005, INTERBUS, UK-US Agreement on Mutual Recognition, UK – Switzerland Trade Agreement, Norway and Iceland Trading Arrangements, UK-US Marine Mutual Recognition Agreement, Vine and Wine, Indonesia FLEGT, EU-Armenia Comprehensive and Enhanced Partnership Agreement’, Partnership and Cooperation Agreement between the European Communities and the Republic of Azerbaijan, Political Dialogue and Cooperation Agreement between the European Union and the Republic of Cuba, Partnership and Cooperation Agreement between the European Union and the Republic of Iraq, Strategic Partnership Agreement Between the European Union and Japan, Enhanced Partnership and Cooperation Agreement between the European Union and the Republic of Kazakhstan, EU-Singapore Partnership and Cooperation Agreement (ESPCA), Partnership and Cooperation Agreement between the EU and Turkmenistan (PCA), Parternship and Cooperation Agreement establishing a partnership between the European Communities and the Republic of Uzbekistan, EU-Armenia Comprehensive and Enhanced Partnership Agreement’, Partnership and Cooperation Agreement between the European Communities and the Republic of Azerbaijan, Political Dialogue and Cooperation Agreement between the European Union and the Republic of Cuba, Partnership and Cooperation Agreement between the European Union and the Republic of Iraq, Strategic Partnership Agreement Between the European Union and Japan, Enhanced Partnership and Cooperation Agreement between the European Union and the Republic of Kazakhstan, EU-Singapore Partnership and Cooperation Agreement (ESPCA), Partnership and Cooperation Agreement between the EU and Turkmenistan (PCA), Parternship and Cooperation Agreement establishing a partnership between the European Communities and the Republic of Uzbekistan, North Atlantic Ocean"
                },
                {
                    url: new URL("https://www.gov.uk/guidance/important-eu-exit-information-for-uk-nationals-if-theres-no-deal"),
                    summary: "4:35pm, 4 April 2019: EU Exit update – added sections on accessing benefits in the UK, higher education in the UK and bringing family members to the UK.",
                },
                {
                    summary: "3:38pm, 4 April 2019: News citizens’ rights and EU Exit meeting",
                    url: new URL("https://www.gov.uk/government/news/meeting-british-citizens-across-italy"),
                },
                {
                    summary: "2:41pm, 4 April 2019: EU Exit update: added information on the latest no deal legislation in healthcare, visas and residency, education and driving sections",
                    url: new URL("https://www.gov.uk/guidance/living-in-belgium"),
                },
                {
                    summary: "2:04pm, 4 April 2019: EU Exit update: confirmed time/venue for UK nationals outreach event in Kardamili",
                    url: new URL("https://www.gov.uk/government/news/information-and-events-for-uk-nationals-living-in-greece"),
                },
                {
                    summary: "1:46pm, 4 April 2019: Updated Register of Written Confirmations for UK Active Substance Manufacturers added to the page.",
                    url: new URL("https://www.gov.uk/government/publications/exporting-active-substance-manufacturer-in-the-uk-if-we-leave-the-eu-without-a-deal"),
                },
                {
                    summary: "1:12pm, 4 April 2019: Minor change to wording on potential disruption at ports",
                    url: new URL("https://www.gov.uk/government/news/no-deal-eu-exit-government-issues-reminder-to-waste-industry"),
                },
                {
                    summary: "11:10am, 4 April 2019: Added attachment: ‘Revised Frameworks Analysis: Breakdown of areas of EU law that intersect with devolved competence in Scotland, Wales and Northern Ireland’.",
                    url: new URL("https://www.gov.uk/government/publications/frameworks-analysis"),
                },
                {
                    summary: "10:54am, 4 April 2019: First published.",
                    url: new URL("https://www.gov.uk/government/news/eu-workers-qualifications-will-be-recognised-after-eu-exit"),
                },
                {
                    summary: "10:54am, 4 April 2019: Added 30 vet and 7 local authority certifiers in England, Scotland and Wales.",
                    url: new URL("https://www.gov.uk/government/publications/find-a-professional-to-certify-export-health-certificates"),
                },
                {
                    summary: "10:39am, 4 April 2019: First published.",
                    url: new URL("https://www.gov.uk/government/publications/health-and-social-care-staff-eu-exit-preparations-update"),
                },
                {
                    summary: "10:38am, 4 April 2019: EU Exit update: New information on residency and travel after EU Exit",
                    url: new URL("https://www.gov.uk/guidance/living-in-germany"),
                },
                {
                    summary: "10:31am, 4 April 2019: First published.",
                    url: new URL("https://www.gov.uk/guidance/social-security-contributions-for-uk-and-eu-workers-if-the-uk-leaves-the-eu-with-no-deal"),
                },
                {
                    summary: "9:36am, 4 April 2019: First published.",
                    url: new URL("https://www.gov.uk/government/publications/policy-paper-on-the-rights-of-uk-nationals-in-the-eu"),
                },
            ])
        })
    })
})
