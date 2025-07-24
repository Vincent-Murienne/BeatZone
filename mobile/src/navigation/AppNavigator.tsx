import ListBandScreen from '../screens/ListBandScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import BandDetailsScreen from '../screens/BandDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../components/BottomTabNavigator';

// export type RootStackParamList = {
//     Login: undefined;
//     Register: undefined;
//     Map: undefined;
//     EventDetails: { id: number };
//     ListBand: undefined;
//     BandDetails: { id: number };
//     Profile: undefined;
// };

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
            <Stack.Screen name="BandDetails" component={BandDetailsScreen} />
            <Stack.Screen name="ListBand" component={ListBandScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
}
