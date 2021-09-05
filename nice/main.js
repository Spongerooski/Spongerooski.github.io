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
            let  ret = ''
            for (let i = 0; i < str.length; i++) {
                let char = str[i]
                if (char === '\n') ret += '\\n'
                else if (char === '"') ret += '\\x22'
                else ret += char
                if (char === '\\') ret += '\\'
            }
            return ret
        } 
        /**
         * 
         * @param {Object} obj 
         * @param {Array<string>} keys 
         */
        function onlyKeys(obj, keys) {
            if (!Object.keys(obj).every((e) => keys.includes(e))) throw new Error(':(')
        }
        if (typeof(data) !== 'object' || Array.isArray(data)) throw new Error('owperowkepr')
        onlyKeys(data, ['description', 'image', 'thumbnail', 'footer', 'title', 'fields', 'author', 'color', 'url', 'type'])
        for (let smt of ['description', 'image', 'thumbnail', 'footer', 'title', 'fields', 'author', 'color', 'url']) {
            if (!data[smt]) continue
            let part = data[smt]
            switch (smt) {
                case 'image':
                case 'thumbnail':
                    onlyKeys(part, ['url', 'proxy_url', 'width', 'height'])
                    if (!part.url) throw new Error('epic games')
                    part = `(sdict "url" "${escape(part.url)}")`
                break
                case 'footer':
                    if (typeof(part) !== 'object' || Array.isArray(part)) throw new Error('epic')
                    onlyKeys(part, ['text', 'icon_url', 'proxy_icon_url'])
                    let foot = ''
                    if (part.icon_url) foot += `\n\t"icon_url" "${escape(part.icon_url)}"`
                    if (part.text) foot += `\n\t"text" "${escape(part.text)}"`
                    part = `(sdict${foot}${foot ? '\n' : ''})`
                break
                case 'fields':
                    let fild = [], big
                    if (!Array.isArray(part)) throw new Error('bruh')
                    for (let field of part) {
                        if (typeof(field) !== 'object'||Array.isArray(field)) throw new Error('e')
                        onlyKeys(field, ['name', 'value', 'inline'])
                        if (typeof(field.inline||false) !== 'boolean') throw new Error('someone messed up')
                        if (!field.value||!field.name) throw new Error('songlosses')
                        let sjawlk = `(sdict "name" "${escape(field.name)}" "value" "${escape(field.value)}" "inline" ${(field.inline||false).toString()})`
                        fild.push(sjawlk)
                        if (sjawlk.length > 200) big = true
                    }
                    part = `(cslice ${big || fild.join(' ').length > 250 ? '\n\t' + fild.join('\n\t') + '\n' : fild.join(' ')})`
                break
                case 'author':
                    if (typeof(part) !== 'object' || Array.isArray(part)) throw new Error('pejekhj')
                    let auth = ''
                    onlyKeys(part, ['name', 'icon_url', 'url', 'proxy_icon_url'])
                    if (part.icon_url) auth += `\n\t"icon_url" "${escape(part.icon_url)}"`
                    if (part.name) auth += `\n\t"name" "${escape(part.name)}"`
                    if (part.url) auth += `\n\t"url" "${escape(part.url)}"`
                    part = `(sdict${auth}${auth ? '\n' : ''})`
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
        console.error(e)
    }
}