"use client"

import { useEffect, useState } from "react"

export default function CharSetInput({ charSet, onChange }) {
    const [selectedSets, setSelectedSets] = useState(charSet)

    useEffect(() => {
        setSelectedSets(charSet)
    })

    const handleChange = (e) => {        
        const { value, checked } = e.target
        const updatedSets = checked ? [...selectedSets, value] : selectedSets.filter(set => set !== value)

        setSelectedSets(updatedSets)
        onChange(updatedSets)
    }

    return (
        <div className="charsetinput w-full h-fit grid place-items-center">
            <div className="grid">
                <label className="w-full h-full">
                    Character Sets
                </label>
                <div className="flex flex-row jusify-center align-center gap-2 accent-complimentary">
                    <input
                        type="checkbox"
                        value="lowercase"
                        checked={selectedSets.includes("lowercase")}
                        onChange={handleChange}
                    />
                Lowercase
                </div>
                <div className="flex flex-row jusify-center align-center gap-2 accent-complimentary">
                    <input
                        type="checkbox"
                        value="uppercase"
                        checked={selectedSets.includes("uppercase")}
                        onChange={handleChange}
                    />
                Uppercase
                </div>
                <div className="flex flex-row jusify-center align-center gap-2 accent-complimentary">
                    <input
                        type="checkbox"
                        value="digits"
                        checked={selectedSets.includes("digits")}
                        onChange={handleChange}
                    />
                Digits
                </div>
                <div className="flex flex-row jusify-center align-center gap-2 accent-complimentary">
                    <input
                        type="checkbox"
                        value="special"
                        checked={selectedSets.includes("special")}
                        onChange={handleChange}
                    />
                Special Characters
                </div>
            </div>
        </div>
    )
}