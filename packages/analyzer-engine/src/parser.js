import { normalizeText } from './utils/helper.js'

function parseCommit(text){
    const lines = text.split(/\r?\n/)   //accounting for both carriage return (windows) and line feed (unix based os)
    const normalizedHeader = normalizeText(lines[0]);
    
    const headerRegex = /^([a-z]+?)(!)?(\([a-z0-9\-\.\/\_]+\))?(!)?:\s?(.+)$/
    const match = normalizedHeader.match(headerRegex)
    console.log(match)

    const type = match[1]
    const scope = match[3].slice(1,-1)
    const breaking = match[2] || match[4] ? true : false
    const subject = match[5]

    let body = null
    let footer = null
    let breakingFooter = false

    

    if (match){
        return {
            raw : text,
            type : match[1],
            scope : match[2] ? match[2].slice(1, -1) : null,
            subject : match[3],
            body : null,
            footer : null
            // breaking : text.includes
        }
    }
}

parseCommit("feat(parser/ui)!: added changes")