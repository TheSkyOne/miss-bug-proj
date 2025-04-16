import { useEffect, useRef, useState } from "react"
import { utilService } from "../services/util.service.js"


export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilterBy, 300)).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    return (
        <section className="bug-filter">
            <h2>Bugs Filter</h2>
            <form >
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text"
                        id="title"
                        name="title"
                        placeholder="By title"
                        value={filterByToEdit.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="severity">Severity:</label>
                    <input type="number"
                        id="severity"
                        name="severity"
                        placeholder="By max severity"
                        value={filterByToEdit.severity || ''}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </section>
    )
}