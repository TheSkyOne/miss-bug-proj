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
        let newFilter = { ...filterByToEdit }
        switch (type) {
            case "number":
                value = +value
                newFilter[field] = value
                break
            case "checkbox":
                if (target.checked) newFilter[field] = [...newFilter[field], value]
                else {
                    const valueExists = newFilter[field].indexOf(value)
                    if (valueExists !== -1) newFilter[field].splice(valueExists, 1)
                }
                break
        }

        setFilterByToEdit(newFilter)
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
                        placeholder="By min severity"
                        value={filterByToEdit.severity || ''}
                        onChange={handleChange}
                    />
                </div>

                <fieldset>
                    <legend>Bug labels:</legend>

                    <div>
                        <label htmlFor="critical">Critical</label>
                        <input type="checkbox" id="critical" name="labels" value="critical" onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor="cr">Needs-CR</label>
                        <input type="checkbox" id="cr" name="labels" value="need-CR" onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor="dev">Dev-branch</label>
                        <input type="checkbox" id="dev" name="labels" value="dev-branch" onChange={handleChange} />
                    </div>
                </fieldset>
            </form>
        </section>
    )
}