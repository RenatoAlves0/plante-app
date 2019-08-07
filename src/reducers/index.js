import { combineReducers } from 'redux'
import weather_week from './weather_week'
import weather_today from './weather_today'
const allReducers = combineReducers({
    weather_week: weather_week,
    weather_today: weather_today,
})
export default allReducers