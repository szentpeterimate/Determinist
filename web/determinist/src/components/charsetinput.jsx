"use client"

import { useState } from "react"

export default function CharSetInput({ onChange }) {
    const [selectedSets, setSelectedSets] = useState(["lowercase", "uppercase", "digits", "special"])

    const handleChange = (e) => {        
        const { value, checked } = e.target
        const updatedSets = checked ? [...selectedSets, value] : selectedSets.filter(set => set !== value)

        setSelectedSets(updatedSets)
        onChange(updatedSets)
    }

    return (
        <div id="charsetinput">
            <div id="lowercase">
                <input 
                    type="checkbox"
                    value="lowercase"
                    checked={selectedSets.includes("lowercase")}
                    onChange={handleChange}
                />
            Lowercase
            </div>
            <div id="uppercase">
                <input 
                    type="checkbox"
                    value="uppercase"
                    checked={selectedSets.includes("uppercase")}
                    onChange={handleChange}
                />
            Uppercase
            </div>
            <div id="digits">
                <input 
                    type="checkbox"
                    value="digits"
                    checked={selectedSets.includes("digits")}
                    onChange={handleChange}
                />
            Digits
            </div>
            <div id="special">
                <input 
                    type="checkbox"
                    value="special"
                    checked={selectedSets.includes("special")}
                    onChange={handleChange}
                />
            Special Characters
            {selectedSets.length == 0 ? <p>At least one set must be selected.</p> : null}
            </div>
        </div>
    )
}