"use client"

import { useState, useEffect } from "react"
import { IoIosClose } from "react-icons/io";
const toml = require("toml")

export default function PresetHandler({ onChange }) {
    const [presetList, setPresetList] = useState(() => {
        const items = {...localStorage}

        let parsed = {}
        for (let [key, obj] of Object.entries(items)) {
            parsed[key] = JSON.parse(obj)
        }

        return parsed
        })
    const [preset, setPreset] = useState(() => {
        return presetList.length === 0 ? "" : "add"
    })
    const [readPreset, setReadPreset] = useState()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    function handleFileAdd(e) {
        const reader = new FileReader()
        
        reader.onload = () => {
            setReadPreset(reader.result)
        }

        if (e.target.files) {
            reader.readAsText(e.target.files[0])            
        }

    }

    function handleDelete() {
        if (!preset) return

        const keys = Object.keys(presetList)

        const currentIndex = keys.indexOf(preset)

        let nextPreset = ""
        if (keys.length > 1) {
            if (currentIndex === keys.length - 1) {
                nextPreset = keys[currentIndex - 1]
            } else {
                nextPreset = keys[currentIndex + 1]
            }
        } else {
            nextPreset = "add"
        }

        localStorage.removeItem(preset)
        const updatedPresets = { ...presetList }
        delete updatedPresets[preset]
        setPresetList(updatedPresets)

        setPreset(nextPreset)
    }

    useEffect(() => {
        if (preset == "add" && readPreset) {
            const presetObj = toml.parse(readPreset)
            
            localStorage.setItem(presetObj.preset.name, JSON.stringify(presetObj))
            setPresetList({...presetList, [presetObj.preset.name]: presetObj })
        }
    }, [preset, readPreset])

    useEffect(() => {
        if (preset == "add" || preset == "") return

        onChange(presetList[preset])
    }, [preset])

    return (
        <div className="presets card flex flex-col items-center justify-center gap-2">
            <div className="flex flex-row items-center gap-4">
                <select
                    value={preset}
                    onChange={(e) => setPreset(e.target.value)}
                >
                    {isMounted && Object.keys(presetList).map((key) => (
                        <option key={key} value={key}>{key}</option>
                        ))
                    }

                    <option value="add">Add Preset</option>
                </select>
                {preset != "add" ?
                    <button className="btn btn-remove" onClick={handleDelete}><IoIosClose size={24} /></button>
                :
                    null
                }
            </div>
            {preset == "add" ? 
                <input className="" type="file" accept=".toml" onChange={handleFileAdd} />
            :
                null
            }
        </div>
    )
}