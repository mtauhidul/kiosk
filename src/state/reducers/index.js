import { combineReducers } from 'redux';
import informationReducer from '../reducers/informationReducer';

const reducers = combineReducers({
  data: informationReducer,
});

export default reducers;
