// import typeKeywords from "../dev-data/type-keywords.json" assert { type : "json" };
import pastTenseVerbs from "../dev-data/past-tense-verbs.json" with { type : "json" };
import conversions from "../dev-data/conversions.json" with { type : "json" };
import vagueVerbs from "../dev-data/vague-verbs.json" with { type : "json" };
import commonNouns from "../dev-data/common-nouns.json" with { type : "json" };
import dictionary from "../dev-data/dictionary-words.json" with { type : "json" };

// export const TYPE_KEYWORDS = typeKeywords;
export const PAST_TENSE_VERBS = pastTenseVerbs;
export const CONVERSIONS = conversions;
export const VAGUE_VERBS = vagueVerbs;
export const COMMON_NOUNS = commonNouns;
export const DICTIONARY = new Set(dictionary);


//normalize text (remove articles + remove trailing period + convert to lowercase + deal with whitespaces)
function normalizeText(text){
    return text
        .replace(/\b(a|an|the)\b/gi, '')
        .replace(/\.+$/, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
}

//split normalized text into words
function convertToWords(text){
    return normalizeText(text).split(' ')
}

// console.log(normalizeText("added dark mode"))
// console.log(convertToWords("added dark mode"))

//check if text contains keyword from list
function keywordMapping(text, keywordMap){
    const normalized = normalizeText(text)

    for (const [category, keywords] of Object.entries(keywordMap)){
        for (const keyword of keywords){
            if (normalized.includes(keyword)){
                return category
            }
        }
    }
    return null
}

// console.log(keywordMapping("Added dark mode", TYPE_KEYWORDS))


//check if verb in past tense
function checkPastTense(text){
    const normalized = normalizeText(text)
    const wordedText = convertToWords(normalized)
    let exists = false

    for (const word of wordedText){
        if (PAST_TENSE_VERBS.includes(word)){
            exists = true
            break;
        }
    }

    return exists;
}

// console.log(checkPastTense(' UI and added dark mode'))


//change past tense to imperative 
function convertToImperative(text){
    const normalized = normalizeText(text)
    const wordedText = convertToWords(normalized)

    for (let i = 0; i < wordedText.length; ++i){
        if (CONVERSIONS[wordedText[i]]){
            wordedText[i] = CONVERSIONS[wordedText[i]]
        }
    }
    return wordedText.join(' ')
}

// console.log(convertToImperative('added and removed dark mode'))


//check if message is vague
function checkVague(text){
    const normalized = normalizeText(text)
    const wordedText = convertToWords(normalized)
    
    //too short -> vague
    if (wordedText.length <= 2) return true
    
    //if more than 50% of words are vague then msg is vague
    let vagueCount = 0;
    for (const word in wordedText){
        if (VAGUE_VERBS.includes(word)){
            vagueCount++;
        }
    }
    if (vagueCount/wordedText.length > 0.5) return true

    //no object/noun after verb -> not detailed enough
    if (!wordedText.some(word => COMMON_NOUNS.includes(word))) {
        return true
    }

    return false
}

// console.log(checkVague("added changes in ui component"))


// check if message is gibberish
function checkGibberish(text){
    const normalized = normalizeText(text)
    const wordedText = convertToWords(normalized)

    //if meaningful words < 50% -> gibberish
    let meaningfulCount = 0;
    for (const word of wordedText){
        if (DICTIONARY.has(word)) meaningfulCount++;
    }
    const meaningfulRatio = meaningfulCount / wordedText.length;
    if (meaningfulRatio < 0.5) return true;

    // special case: messages like "fix #123", "resolve 404", etc
    if (wordedText.some(word => /^#?\d+$/.test(word)) && meaningfulRatio >= 0.3) {
        return false;
    }

    //no vowels -> gibberish
    if (!/[aeiou]/.test(normalized)) return true;

    //long consonant clusters of 5 or more like asdfsidf -> gibberish
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(normalized)) return true;

    //too many non letter characters -> gibberish
    const alpha = normalized.replace(/[^a-z]/g, "").length;
    if (alpha / normalized.length < 0.4) return true;

    //Single repeated nonsense word ("asdf asdf asdf")
    const unique = new Set(wordedText);
    if (unique.size === 1 && wordedText.length > 1) return true;

    //if all words numeric -> gibberish
    const allNumeric = wordedText.every(word => /^[0-9]+$/.test(word));
    if (allNumeric) return true;

    return false;
}


//TODO : check if typo


