import UserSelect from "../Actions/UserSelect";

function userSelect(value) {
    return { 
        type: UserSelect,
        select: value
    };
}

export default userSelect;