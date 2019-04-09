import fs from "fs"
import { readTree } from "../src/util";

export const deleteFolderRecursive = function(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
        const curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
        } else { // delete file
            fs.unlinkSync(curPath);
        }
        });
        fs.rmdirSync(path);
    }
};

describe("readTree function", () => {
    it("can read files in test dir", () => {
        return expect(readTree("./test")).resolves.toContain("util.test.ts")
    })

    it("can read files in subdirs of test dir", () => {
        return expect(readTree("./test")).resolves.toContain("data/blankfile")
    })
})
