import UserLogin from "../Actions/UserLogin";

function userLogin(value) {
    return { 
        type: UserLogin,
        user: value
    };
}

export default userLogin;