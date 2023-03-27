import UserLogin from '../Actions/UserLogin';

function reducer(state, action) {
    switch(action.type) {
        case UserLogin: return {...state, user: action.user}

        default: return state;
    }
}

export default reducer;