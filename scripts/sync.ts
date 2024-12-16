import { readdir } from "fs/promises"

import { getHeaders } from "../packages/deepsea-tools/src/utils/getHeaders"

const headers = getHeaders(`accept:
*/*
accept-encoding:
gzip, deflate, br, zstd
accept-language:
zh-CN,zh;q=0.9,en;q=0.8
content-length:
0
dnt:
1
origin:
https://npmmirror.com
priority:
u=1, i
referer:
https://npmmirror.com/
sec-ch-ua:
"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"
sec-ch-ua-mobile:
?0
sec-ch-ua-platform:
"Windows"
sec-fetch-dest:
empty
sec-fetch-mode:
cors
sec-fetch-site:
same-site
user-agent:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`)

function syncPackage(packageName: string) {
    return fetch(`https://registry-direct.npmmirror.com/-/package/${packageName}/syncs`, {
        headers,
        referrer: "https://npmmirror.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        method: "PUT",
        mode: "cors",
        credentials: "omit",
    })
}

async function sync() {
    const packages = (await readdir("packages")).filter(name => name !== "playground")
    await Promise.all(packages.map(syncPackage))
}

sync()
