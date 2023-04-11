import store from "../Store/Store";
import userSelect from "../Store/ActionsCreators/UserSelect";

const handleSelect = (id) => {
    if (store.getState().select) {
        // if localStorage != empty
        // and DB != empty
        // concat arrays
       
        let items = store.getState().select;
       
        if (items === '') {
            items = []
            
        }
        else {
            items = JSON.parse(items)
        }
      
        localStorage.setItem('select', JSON.stringify(items));
      }
      let selectArr = JSON.parse(localStorage.getItem('select')) ?? [];
      let type = 1;
      if (!selectArr.includes(id)){
          selectArr.push(id);
      }
      else {
          const index = selectArr.indexOf(id);
          selectArr.splice(index, 1);
          type = 0;
      }
      localStorage.setItem('select', JSON.stringify(selectArr));

      fetch('/add_select', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
                      'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({id: id, type: type})
      });

      if (store.getState().user) {
          store.dispatch(userSelect(localStorage.getItem('select')));
          fetch('/add_select_user', {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                          'Content-Type': 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({user: store.getState().user.id, select: localStorage.getItem('select')})
          }); 
      }
}

export default handleSelect;