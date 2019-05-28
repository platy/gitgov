import { promisify } from "util";
import { readdir } from "fs";
import { sep } from "path";

export async function readTree(path: string): Promise<string[]> {
    const entries = await promisify(readdir)(path, { withFileTypes: true })
    const subdirfiles = Promise.all(entries.filter(file => file.isDirectory()).map(dir => readTree(path + sep + dir.name).then(files => files.map(filename => dir.name + sep + filename))))
    const filenames = entries.filter(file => !file.isDirectory()).map(file => file.name)

    for (const onesubdirfiles of await subdirfiles) {
        filenames.push(...onesubdirfiles)
    }
    return Promise.resolve(filenames)
}