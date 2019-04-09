import { DocUpdate } from "../src/DocUpdate"
import { dirname, relative } from "path"
import { createWriteStream, mkdir } from "fs"
import { promisify } from "util"
import git from "simple-git/promise"

export default class DocUpdatePusher {
    repoPath: string
    repo: git.SimpleGit

    constructor(repoPath: string) {
        this.repoPath = repoPath
        this.repo = git(repoPath)
    }

    async push(change: DocUpdate) {
        console.assert(await this.isClean(), "Repo must be clean before pushing a change")

        const filepath = this.repoPath + change.path;
        const repopath = relative(this.repoPath, filepath)
        await this.writeFile(filepath, change.content);
        await this.repo.add(repopath)
        await this.repo.commit(change.changeMessage, repopath)
        if (await this.hasRemote()) {
            await this.repo.push()
        }
    }

    private async isClean() {
        const status = await this.repo.status()
        return status.isClean()
    }

    private async hasRemote() {
        const remotes = await this.repo.getRemotes(false)
        return remotes.length > 0
    }

    private async writeFile(filepath: string, content: string) {
        await promisify(mkdir)(dirname(filepath), { recursive: true });
        const writeStream = createWriteStream(filepath);
        await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
            writeStream.write(content)
            writeStream.close()
        });
    }
}
