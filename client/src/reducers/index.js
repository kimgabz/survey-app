import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './auth.reducer';
import surveysReducer from './surveys.reducer';

export default combineReducers({
  form: reduxForm,
  auth: authReducer,
  surveys: surveysReducer,
});
