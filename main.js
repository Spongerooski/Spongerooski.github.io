const input = document.getElementById('in')
const answer = document.getElementById('ans')
input.oninput = () => {
    try {
        let e = input.value
        const data = JSON.parse(e)
        let ans = 'cembed'
        /**
        * @param {string} str
        * @returns {string}
        */
        function escape(str) {
            let escape = '', ret = ''
            for (let i = 0; i < str.length; i++) {
                let char = str[i]
                if (char === '\n') ret += '\\n'
                else if (char === '"') ret += '\\x22'
                else ret += char
                if (escape === '\\' && char === '\\') escape = 'epic'
                escape = char
                if (char === '\\') ret += '\\'
            }
            return ret
        }
        for (let smt of ['description', 'image', 'thumbnail', 'footer', 'title', 'fields', 'author', 'color', 'url']) {
            if (!data[smt]) continue
            let part = data[smt]
            switch (smt) {
                case 'image':
                case 'thumbnail':
                    part = `(sdict "url" "${escape(part.url)}")`
                break
                case 'footer':
                    if (typeof(part) !== 'object') throw new Error('epic')
                    let foot = ''
                    if (part.icon_url) foot += ` "icon_url" "${escape(part.icon_url)}"`
                    if (part.text) foot += ` "text" "${escape(part.text)}"`
                    part = `(sdict${foot})`
                break
                case 'fields':
                    let fild = []
                    if (!Array.isArray(part)) throw new Error('bruh')
                    for (let field of part) {
                        if (typeof(field) !== 'object') throw new Error('e')
                        if (typeof(field.inline||false) !== 'boolean') throw new Error('someone messed up')
                        fild.push(`(sdict "name" "${escape(field.name)}" "value" "${escape(field.value)}" "inline" ${(field.inline||false).toString()})`)
                    }
                    part = `(cslice ${fild.join(' ')})`
                break
                case 'author':
                    if (typeof(part) !== 'object') throw new Error('pejekhj')
                    let auth = ''
                    if (part.icon_url) auth += ` "icon_url" "${escape(part.icon_url)}"`
                    if (part.name) auth += ` "name" "${escape(part.name)}"`
                    if (part.url) auth += ` "url" "${escape(part.url)}"`
                    part = `(sdict${auth})`
                break
                case 'color':
                    if (/^#[a-fA-F0-9]{1,6}$/.test(part)) part = '0x' + part.replace('#', '')
                    else part = parseInt(part) || 0
                break
                default:
                    if (typeof(part) !== 'string') throw new Error('uhm')
                    part = '"' + escape(data[smt]) + '"'
            }
            if (part) ans += `\n"${smt}" ${part}`
        }
        answer.style.color = 'white'
        answer.textContent = ans
    } catch(e) {
        answer.style.color = 'red'
        answer.textContent = 'invalid embed json'
    }
}