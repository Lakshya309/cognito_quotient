
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Disc from './screens/Disc';
import Option from './screens/Option';
import Quiz from './screens/Quiz';
import Try from './screens/Try';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="options" component={Option} />
      <Stack.Screen name="disclaimer" component={Disc} />
      <Stack.Screen name="iqqiz" component={Quiz}  />
      <Stack.Screen name="a" component={Try}  />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
