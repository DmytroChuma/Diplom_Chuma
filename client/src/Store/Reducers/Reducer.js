import UserLogin from '../Actions/UserLogin';
import UserSelect from '../Actions/UserSelect';

function reducer(state, action) {
    switch(action.type) {
        case UserLogin: return {...state, user: action.user}
        case UserSelect: return {...state, select: action.select}
        default: return state;
    }
}

export default reducer;