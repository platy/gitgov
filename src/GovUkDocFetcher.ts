import { GovUkChange } from "../src/GovUkUpdateParser"
import { default as fetch, Request, Response } from "node-fetch"
import { DocUpdate } from "./DocUpdate";
import { stripDoc } from "./GovUKDocStripper";

export let myfetch = fetch

export default async function toDocUpdate(change: GovUkChange): Promise<DocUpdate> {
    const response = await myfetch(change.url.toString())
    if (!response.ok) {
        throw "Failed to get doc"
    }
    return {
        path: change.url.pathname,
        content: await stripDoc(response.body),
        changeMessage: change.summary,
    }
}

export function setFetch(newFetch: typeof fetch) {
    myfetch = newFetch
}
