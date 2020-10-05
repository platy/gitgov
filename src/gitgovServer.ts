import { SMTPServer, SMTPServerSession, SMTPServerAddress, SMTPServerDataStream } from "smtp-server";
import govUkParser from "./GovUkUpdateParser";
import { default as toDocUpdate } from "./GovUkDocFetcher";
import DocUpdatePusher from "./DocUpdatePusher";


export function gitgovServer(repoPath: string) {
    const pusher = new DocUpdatePusher(repoPath);
    const server = new SMTPServer({
        secure: false,
        authOptional: true,
        onMailFrom(_address: SMTPServerAddress, _session: SMTPServerSession, callback: (_err?: Error) => void) {
            callback();
        },
        onRcptTo(_address: SMTPServerAddress, _session: SMTPServerSession, callback: (_err?: Error) => void) {
            callback();
        },
        onData(stream: SMTPServerDataStream, _session: SMTPServerSession, callback: (err?: Error) => void) {
            console.log(new Date().toISOString(), "DATA")
            async function promised() {
                const [changes, topic] = await govUkParser(stream);
                const updates = changes.map(toDocUpdate);
                // await and push each update sequentially
                for (const update of updates) {
                    await pusher.push(await update, topic);
                }
            }
            promised().then(() => callback(), err => {
                console.error(new Date().toISOString(), err)
                callback(err)
            });
        },
        onClose(session: SMTPServerSession) {
            console.log(new Date().toISOString(), "Closed session", session);
        }
    });
    return server;
}
