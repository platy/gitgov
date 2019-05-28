import { gitgovServer } from "./gitgovServer";

const server = gitgovServer("repo")
server.listen(25, () => console.log(new Date().toISOString(), "SMTP server up"))
