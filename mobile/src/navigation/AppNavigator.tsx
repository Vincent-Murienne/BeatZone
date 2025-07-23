import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import BandDetailsScreen from '../screens/BandDetailsScreen';
import ListBandScreen from '../screens/ListBandScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Map: undefined;
    EventDetails: { id: number };
    ListBand: undefined;
    BandDetails: { id: number };
    Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="BandDetails" component={BandDetailsScreen} />
        <Stack.Screen name="ListBand" component={ListBandScreen} />
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        </Stack.Navigator>
    );
}
