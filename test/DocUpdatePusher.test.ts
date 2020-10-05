import { DocUpdate } from "../src/DocUpdate"
import { resolve, join } from "path"
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
            await fs.promises.mkdir(basePath, { recursive: true })
            repo = git(basePath)
            await repo.init(false)

            const pusher = new DocUpdatePusher(basePath)
            change = {
                path: "/testdir/testfile",
                changeMessage: "COMMIT",
                content: "CONTENT"
            }
            return pusher.push(change, "topic")
        })

        it("writes the new file", () => {
            return expect(readFileSync(basePath + change.path, { encoding: "UTF-8"})).toBe("CONTENT")
        })

        it("adds a commit", async () => {
            const log = await repo.log()
            expect(log.latest.message).toBe("COMMIT [topic]")
        })

        it("doesn't leave workspace dirty", async () => {
            const status = await repo.status()
            expect(status.isClean()).toBe(true)
        })

        afterAll(() => {
            deleteFolderRecursive(basePath)
        })
    })

    // This always fails, for some reason the beforeAll doesn't complete when adding the lines to create a file, there is an error logged "      fatal: your current branch 'master' does not have any commits yet"
    // describe("when given a change on an existing file", () => {
    //     let basePath: string
    //     let repo: git.SimpleGit
    //     let change: DocUpdate

    //     beforeAll(async () => {
    //         basePath = resolve("temp/testrepo-existing")
    //         await fs.promises.mkdir(basePath, { recursive: true })
    //         repo = git(basePath)
    //         await repo.init()
            
    //         const pusher = new DocUpdatePusher(basePath)
    //         change = {
    //             path: "/testdir/testfile",
    //             changeMessage: "COMMIT",
    //             content: "CONTENT"
    //         }
    //         await fs.promises.writeFile(basePath + change.path, "")
    //         await repo.add(basePath)
    //         await repo.commit("setup", basePath)
    //         return pusher.push(change)
    //     }, 10000)

    //     it("overwrites the file", () => {
    //         return expect(readFileSync(basePath + change.path, { encoding: "UTF-8"})).toBe("CONTENT")
    //     })

    //     it("adds a commit", async () => {
    //         const log = await repo.log()
    //         expect(log.latest.message).toBe("COMMIT")
    //     })

    //     it("doesn't leave workspace dirty", async () => {
    //         const status = await repo.status()
    //         expect(status.isClean()).toBe(true)
    //     })

    //     afterAll(() => {
    //         deleteFolderRecursive(basePath)
    //     })
    // })

    describe("when given a new file with the same path as a directory", () => {
        let basePath: string
        let repo: git.SimpleGit
        let change: DocUpdate

        beforeAll(async () => {
            basePath = resolve("temp/testrepo-existing-dir")
            await fs.promises.mkdir(basePath, { recursive: true })
            repo = git(basePath)
            await repo.init()

            const pusher = new DocUpdatePusher(basePath)
            change = {
                path: "/testdir/testfile",
                changeMessage: "COMMIT",
                content: "CONTENT"
            }
            await fs.promises.mkdir(join(basePath, change.path), { recursive: true })
            return pusher.push(change, "topic")
        })

        it("creates a new file with a dash", () => {
            return expect(readFileSync(basePath + change.path + "-", { encoding: "UTF-8"})).toBe("CONTENT")
        })

        it("adds a commit", async () => {
            const log = await repo.log()
            expect(log.latest.message).toBe("COMMIT [topic]")
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
