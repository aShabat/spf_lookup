import { toASCII } from 'punycode'

async function getDnsRecords(name, type) {
	const re = await fetch(`https://dns.google/resolve?name=${toASCII(name)}&type=${type}&cd=1`)

	if (!re.ok) {
		throw new Error(`Error fetching DNS records for ${name}: ${re.status} ${re.statusText}`)
	}

	const json = await re.json()
	const records = (json.Answer || []).map((record) => {
		let data = record.data

		return {
			name: record.name,
			ttl: record.TTL,
			data,
		}
	})

	return records
}
function domain_from_url(link) {
  const url = new URL(link)
  const hostname = url.hostname
  const first_part = hostname.slice(0, hostname.indexOf("."))
  if (first_part === "www") return hostname.slice(hostname.indexOf(".") + 1)
  else return hostname
}

async function get_spf_records(domain) {
  const result = await getDnsRecords(domain, "TXT")
  return result.map((record) => record.data)
    .filter((data) => data.includes("spf"))
    .map((data) => data.split(" "))
}

const url = (await chrome.tabs.query({ active: true, currentWindow: true }))[0].url
console.log(url)
const domain = domain_from_url(url)
console.log(domain)
const output = await get_spf_records(domain)
console.log(output)

const list = document.getElementById("listIndex")
output.forEach((data) => {
  const p = document.createElement("p")
  p.textContent = data[0]
  list.appendChild(p)

  const sublist = document.createElement("ul")
  data.slice(1).forEach((registry) => {
    const li = document.createElement("li")
    li.textContent = registry
    sublist.appendChild(li)
  })
  list.appendChild(sublist)
})
