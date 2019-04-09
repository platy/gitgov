import { readTree } from "./util";
import { createReadStream, writeFile, mkdir } from "fs";
import { resolve, dirname } from "path";
import { stripDoc } from "./GovUKDocStripper";
import { promisify } from "util";

async function main() {

    const basedir = process.argv[2]
    const outputdir = basedir + "-stripped"

    const files = await readTree(basedir)

    console.log(files)

    for (const file of files) {
        const instream = createReadStream(resolve(basedir, file))
        const strippedData = await stripDoc(instream)
        const outputfilepath = resolve(outputdir, file)
        await promisify(mkdir)(dirname(outputfilepath), { recursive: true })
        await promisify(writeFile)(outputfilepath, strippedData)
    }
}

main().catch(console.error)
