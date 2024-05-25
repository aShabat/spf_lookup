import { getDnsRecords } from "@layered/dns-records"

function domain_from_url(link) {
    const url = new URL(link)
    return url.hostname.substring(url.hostname.indexOf('.') + 1)
}

async function get_spf_records(domain) {
    const result = await getDnsRecords(domain, "TXT")
    return result.map((record) => record.data)
        .filter((data) => data.includes("spf"))
        .map((data) => data.split(" "))
}

const url = await chrome.tabs.query({ active: true, currentWindow: true })
const domain = domain_from_url(url)
const output = await get_spf_records(domain)
console.log(output)

const list = document.getElementById("listIndex")
output.forEach((data) => {
    const p = document.createElement("p")
    p.textContent = "${data[0]}:"
    list.appendChild(p)

    const sublist = document.createElement("ul")
    data.slice(1).forEach((registry) => {
        const li = document.createElement("li")
        li.textContent = registry
        ul.appendChild(li)
    })
    list.appendChild(sublist)
})
