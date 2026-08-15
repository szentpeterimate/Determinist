"use client"

export default function PresetHandler({ onChange }) {

    function handleChange(e) {
        const reader = new FileReader()

        
        reader.onload = () => {
            onChange(reader.result)
        }

        if (e.target.files) {
            reader.readAsText(e.target.files[0])            
        }

    }

    return (
        <div className="presets card">
            <input type="file" accept=".toml" onChange={handleChange} />
        </div>
    )
}