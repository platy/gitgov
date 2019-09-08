import { gitgovServer } from "./gitgovServer";
import { fstat, writeFileSync } from "fs";

const repoDir = process.env["REPODIR"] || "repo"
const port = process.env["PORT"] || 25

process.on("uncaughtException", (err: Error) => {
    writeFileSync(
        "/dev/termination-log",
        err,
    )
    process.exit(1)
})

const server = gitgovServer(repoDir)
server.listen(port, () => console.log(new Date().toISOString(), "SMTP server up"))
