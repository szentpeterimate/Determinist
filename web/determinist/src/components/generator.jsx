"use client"

import argon2 from 'argon2-browser/dist/argon2-bundled.min.js'
import { useState } from 'react'

export default function Generator() {
    const [masterpass, setMasterpass] = useState("");
    const [sitename, setSitename] = useState("");
    const [hash, setHash] = useState("");

    async function handleGenerate(e) {
        e.preventDefault()

        const result = await argon2.hash({
            pass: masterpass,
            salt: sitename,
            time: 2,
            mem: 65536,
            parallelism: 4,
            hashLen: 32,
            type: argon2.ArgonType.Argon2id,
        })

        setHash(result.encoded)
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
            />
            <input 
                type="text" 
                name='sitename' 
                value={sitename}
                onChange={(e) => setSitename(e.target.value)}
                placeholder="Site Name"
            />
            <button type='submit'>Generate</button>
        </form>
        <p id='result'>{hash}</p> 
    </div>
  );
}
