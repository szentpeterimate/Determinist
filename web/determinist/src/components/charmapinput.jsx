import React, { useState, useEffect, useId } from 'react'
import { IoIosClose } from "react-icons/io";

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
        <div className='grid place-items-center mb-2'>
            <div className="grid place-items-center">
                {pairs.map((pair) => (
                    <div className='flex flex-row gap-4 items-center justify-center mb-2' key={pair.id}>
                        <label className='diff text-base font-normal'>Switch</label>
                        <input
                            className='w-10'
                            type="text"
                            placeholder="Char"
                            value={pair.key}
                            onChange={(e) => handleChange(pair.id, 'key', e.target.value)}
                        />
                        <label className='diff text-base font-normal'>to</label>
                        <input
                            className='w-10'
                            type="text"
                            placeholder="Spec"
                            value={pair.value}
                            onChange={(e) => handleChange(pair.id, 'value', e.target.value)}
                        />
                        <button 
                            className='btn btn-remove grid place-items-center'
                            type="button" 
                            onClick={() => handleRemove(pair.id)}
                            disabled={isMounted ? pairs.length === 1 : false}
                        >
                            <IoIosClose size={24} />
                        </button>
                    </div>
                ))}
            </div>

            <button className='btn btn-add' type="button" onClick={handleAdd}>Add Character Pair</button>
        </div>
    )
}