"use client"

import argon2 from 'argon2-browser/dist/argon2-bundled.min.js'
import CharMapInput from './charmapinput';
import { useState } from 'react'

export default function Generator() {
    const [masterpass, setMasterpass] = useState("");
    const [sitename, setSitename] = useState("");
    const [passlength, setPassLength] = useState();
    const [specmode, setSpecMode] = useState("");
    const [charmap, setCharMap] = useState({});
    const [specchars, setSpecChars] = useState("");
    const [specfreq, setSpecFreq] = useState();
    const [hash, setHash] = useState("")

    const punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

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

    async function handleGenerate(e) {
        e.preventDefault()

        const result = await v1(masterpass, sitename, passlength, specmode, charmap, specchars, specfreq)
        console.log(charmap)
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
                <CharMapInput onChange={(dictResult) => setCharMap(dictResult)}></CharMapInput>
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
