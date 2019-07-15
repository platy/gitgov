import { gitgovServer } from "./gitgovServer";

const repoDir = process.env["REPODIR"] || "repo"
const port = process.env["PORT"] || 25

const server = gitgovServer(repoDir)
server.listen(port, () => console.log(new Date().toISOString(), "SMTP server up"))
