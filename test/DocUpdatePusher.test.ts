import { DocUpdate } from "../src/DocUpdate"
import { resolve } from "path"
import { Readable } from "stream"
import { default as fs, readFileSync, mkdirSync } from "fs"
import git from "simple-git/promise"
import DocUpdatePusher from "../src/DocUpdatePusher"
import { deleteFolderRecursive } from "./util.test";

describe("document update pusher", () => {
    describe("when given a change on a new file", () => {
        let basePath: string
        let repo: git.SimpleGit
        let change: DocUpdate

        beforeAll(async () => {
            basePath = resolve("temp/testrepo")
            mkdirSync(basePath, { recursive: true })
            repo = git(basePath)
            await repo.init()

            const pusher = new DocUpdatePusher(basePath)
            change = {
                path: "/testdir/testfile",
                changeMessage: "COMMIT",
                content: "CONTENT"
            }
            return pusher.push(change)
        })

        it("writes the new file", () => {
            return expect(readFileSync(basePath + change.path, { encoding: "UTF-8"})).toBe("CONTENT")
        })

        it("adds a commit", async () => {
            const log = await repo.log()
            expect(log.latest.message).toBe("COMMIT")
        })

        it("doesn't leave workspace dirty", async () => {
            const status = await repo.status()
            expect(status.isClean()).toBe(true)
        })

        afterAll(() => {
            deleteFolderRecursive(basePath)
        })
    })
})
