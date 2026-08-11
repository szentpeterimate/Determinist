import React, { useState, useEffect, useId } from 'react'

export default function CharMapInput({ initialData = {}, onChange }) {
    const baseId = useId()
    const [isMounted, setIsMounted] = useState(false)

    const [pairs, setPairs] = useState(() => {
        const keys = Object.keys(initialData)
        if (keys.length === 0) {
            return [{ id: `${baseId}-0`, key: '', value: '' }]
        }

        return keys.map((key, id) => ({
            id: `${baseId}-${id}`,
            key: key,
            value: initialData[key]
        }))
    })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        const dict = pairs.reduce((acc, pair) => {
            const trimmedKey = pair.key.trim()

            if (trimmedKey) {
                acc[trimmedKey] = pair.value
            }
            
            return acc
        }, {})

        if (onChange) {
            onChange(dict)
        }
    }, [pairs, onChange, isMounted])

    const handleChange = (id, field, value) => {
        setPairs(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)))
    }

    const handleAdd = () => {
        setPairs(prev => [...prev, { id: crypto.randomUUID(), key: '', value: '' }])
    }

    const handleRemove = (id) => {
        setPairs(prev => prev.filter(p => p.id !== id))
    }

    return (
        <div>
            {pairs.map((pair) => (
                <div key={pair.id}>
                    <input
                        type="text"
                        placeholder="Character to Replace"
                        value={pair.key}
                        onChange={(e) => handleChange(pair.id, 'key', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Special Character"
                        value={pair.value}
                        onChange={(e) => handleChange(pair.id, 'value', e.target.value)}
                    />
                    <button 
                        type="button" 
                        onClick={() => handleRemove(pair.id)}
                        disabled={isMounted ? pairs.length === 1 : false}
                    >
                        ❌
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAdd}>Add Character Pair</button>
        </div>
    )
}