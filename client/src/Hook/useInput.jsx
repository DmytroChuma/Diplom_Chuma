import React from "react";

const useInput = (initial) => {
    const [value, setValue] = React.useState(initial);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return {
        value,
        onChange: handleChange
    };
}

export default useInput