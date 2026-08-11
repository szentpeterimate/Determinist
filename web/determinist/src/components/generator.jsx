"use client"

import argon2 from 'argon2-browser/dist/argon2-bundled.min.js'
import CharMapInput from './charmapinput';
import CharSetInput from './charsetinput';
import { useState } from 'react'
import { PythonRandom } from './python-random'

const encoder = new TextEncoder()

export default function Generator() {
    const [masterpass, setMasterpass] = useState("")
    const [sitename, setSitename] = useState("")
    const [passlength, setPassLength] = useState(0)
    const [version, setVersion] = useState(0)
    const [specmode, setSpecMode] = useState("")
    const [charmap, setCharMap] = useState({})
    const [specchars, setSpecChars] = useState("")
    const [specfreq, setSpecFreq] = useState(0)
    const [charset, setCharSet] = useState(["lowercase", "uppercase", "digits", "special"])
    const [hash, setHash] = useState("")

    const punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    const asciiLowercase = "abcdefghijklmnopqrstuvwxyz"
    const asciiUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const digits = "0123456789"

    async function v1(masterPass, siteName, passLength = 8, specMode = "insert", charMap = {}, specChars = punctuation, specFreq = 4) {
        const hashedString = await argon2.hash({
            pass: masterPass,
            salt: siteName,
            time: 2,
            mem: 65536,
            parallelism: 4,
            hashLen: 32,
            type: argon2.ArgonType.Argon2id
        })
        const stripped = hashedString.encoded.split('$').at(-1)

        let charsAdded = ""
        if (specMode == "insert") {
            for (let i = 0; i < stripped.length; i++) {
                charsAdded += stripped[i]
                if ((i + 1) % specFreq == 0) {
                    charsAdded += specChars[i % specChars.length]
                }
            }
        } else if (specMode == "replace") {
            for (let i = 0; i < stripped.length; i++) {
                if (stripped[i].toLowerCase() in charMap) {
                    charsAdded += charMap[stripped[i].toLowerCase()]
                } else {
                    charsAdded += stripped[i]
                }
            }
        }

        const finalPassword = charsAdded.slice(-passLength)

        return finalPassword
    }

    async function v2(masterPass, siteName, passLength = 8, charTypes = ["digits", "special", "lowercase", "uppercase"]) {
        const typesSet = new Set(charTypes)
        let charSet = ""

        if (typesSet.has("special")) {
            charSet += punctuation
        }
        if (typesSet.has("lowercase")) {
            charSet += asciiLowercase
        }
        if (typesSet.has("uppercase")) {
            charSet += asciiUppercase
        }
        if (typesSet.has("digits")) {
            charSet += digits
        }

        const salt = masterPass + siteName + String(passLength) + "{}" + charSet
        
        const rng = new PythonRandom(salt)
        
        const charSetList = rng.shuffle(charSet.split(''))
        
        const hashedBytes = await argon2.hash({
            pass: encoder.encode(masterPass),
            salt: encoder.encode(salt),
            time: 2,
            mem: 65536,
            parallelism: 4,
            hashLen: 32*passLength,
            type: argon2.ArgonType.Argon2id
        })

        const stream = encoder.encode(hashedBytes.encoded) 

        let password = ""
        const limit = 256 - (256 % charSetList.length)
        for (let i = 0; i < stream.length; i++) {
            const byte = stream[i]
            if (password.length == passLength) {
                break
            } else if (byte < limit) {
                password += charSetList[byte % charSetList.length]
            }
        }
        let passwordToShuffle = password.split('')
        const shuffled_pass = rng.shuffle(passwordToShuffle)
        console.log(JSON.stringify(Array.from(shuffled_pass)))
        const final = shuffled_pass.join('')
        
        return final
    }

    async function handleGenerate(e) {
        e.preventDefault()

        let result = ""

        if (version == 1) {
            result = await v1(masterpass, sitename, passlength, specmode, charmap, specchars, specfreq)
        } else if (version == 2) {
            result = await v2(masterpass, sitename, passlength, charset)
        }

        setHash(result)
    }

  return (
    <div className='genBox'>
        <form onSubmit={handleGenerate}>
            <input 
                type="text" 
                name='masterpass' 
                value={masterpass}
                onChange={(e) => setMasterpass(e.target.value)}
                placeholder="Master Password" 
                autoComplete='off'
            />
            <input 
                type="text" 
                name='sitename' 
                value={sitename}
                onChange={(e) => setSitename(e.target.value)}
                placeholder="Site Name" 
                autoComplete='off'
            />
            <input 
                type="number" 
                name='version' 
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="Algorithm Version"
                autoComplete='off'
            />
            <input 
                type="number" 
                name='passlength' 
                value={passlength}
                onChange={(e) => setPassLength(e.target.value)}
                placeholder="Password Length"
                autoComplete='off'
            />
            <input 
                type="text" 
                name='specmode' 
                value={specmode}
                onChange={(e) => setSpecMode(e.target.value)}
                placeholder="Special Character Mode"
                autoComplete='off'
            />
            <div id="charmapinput">
                <CharMapInput onChange={(dictResult) => setCharMap(dictResult)} />
            </div>
            <div id="charmapinput">
                <CharSetInput onChange={(sets) => setCharSet(sets)} />
            </div>
            <input 
                type="text" 
                name='specchars' 
                value={specchars}
                onChange={(e) => setSpecChars(e.target.value)}
                placeholder="Special Characters"
                autoComplete='off'
            />
            <input 
                type="number" 
                name='specfreq' 
                value={specfreq}
                onChange={(e) => setSpecFreq(e.target.value)}
                placeholder="Special Character Frequency"
                autoComplete='off'
            />
            <button type='submit'>Generate</button>
        </form>
        <p id='result'>{hash}</p>
    </div>
  );
}
