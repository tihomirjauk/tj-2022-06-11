import { useState } from "react";

import "./App.css";

const child = (id) => {
    return {
        id: "c" + id,
        value: false,
        children: [],
    };
};

const checkboxList = [
    {
        id: "p1",
        value: false,
        children: [child(1), child(2)],
    },
    {
        id: "p2",
        value: false,
        children: [child(3), child(4)],
    },
    {
        id: "p3",
        value: false,
        children: [child(5), child(6)],
    },
];

function CheckboxTreeComponent({ data, onChange, allowMultiCheck = false }) {
    const uncheckBranch = (item) => {
        item.value = false;
        item.children.map((child) => {
            child.value = false;
            return child;
        });
        return item;
    };

    const toggleCheckbox = (index) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        let nextData = [...data];

        // toggle current checkbox
        const nextValue = !nextData[index].value;

        // only one parent checkbox can be checked at a time
        if (nextValue && !allowMultiCheck) {
            nextData = nextData.map(uncheckBranch);
        }
        nextData[index].value = nextValue;

        // When you check on the parent checkbox,
        // the children checkboxes should also be checked
        if (nextValue) {
            nextData[index].children.map((child) => {
                child.value = nextValue;
                return child;
            });
        }

        onChange(nextData);
    };

    const handleChildrenChange = (index) => (value) => {
        let nextData = [...data];
        nextData[index].children = value;

        // when both children checkboxes are checked,
        // the parent checkbox should also be checked
        if (value.every((el) => el.value)) {
            nextData[index].value = true;

            // but all the other parents now needs to be unchecked
            // and if all their children are checked,
            // then they should also become unchecked
            nextData = nextData.map((parent, parentIndex) => {
                if (
                    !allowMultiCheck &&
                    parentIndex !== index &&
                    parent.children.every((el) => el.value)
                ) {
                    return uncheckBranch(parent);
                }
                return parent;
            });
        }

        onChange(nextData);
    };

    return data.map((item, index) => {
        return (
            <div
                key={`chk-${index}`}
                style={{
                    textAlign: "left",
                    paddingLeft: "50px",
                }}
            >
                <input
                    type="checkbox"
                    checked={item.value ? "checked" : ""}
                    onChange={toggleCheckbox(index)}
                />
                <label onClick={toggleCheckbox(index)}>
                    {item.value ? "True" : "False"}
                </label>
                <CheckboxTreeComponent
                    data={item.children}
                    onChange={handleChildrenChange(index)}
                    allowMultiCheck={true}
                />
            </div>
        );
    });
}

function App() {
    const [data, setData] = useState(checkboxList);
    const [allowMultiCheck, setAllowMultiCheck] = useState(false);

    const toggleMultiCheck = (event) => {
        setAllowMultiCheck(!allowMultiCheck);
    };
    return (
        <div className="App">
            <button onClick={toggleMultiCheck}>
                {allowMultiCheck ? "Disable" : "Enable"} multi-check
            </button>
            <CheckboxTreeComponent
                data={data}
                onChange={setData}
                allowMultiCheck={allowMultiCheck}
            />
        </div>
    );
}

export default App;
