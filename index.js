import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import Routes from './src/routes/Routes'
console.disableYellowBox = true

AppRegistry.registerComponent(appName, () => Routes)
