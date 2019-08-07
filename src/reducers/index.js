import { combineReducers } from 'redux'
import weather_week from './weather_week'
const allReducers = combineReducers({
    weather_week: weather_week,
})
export default allReducers