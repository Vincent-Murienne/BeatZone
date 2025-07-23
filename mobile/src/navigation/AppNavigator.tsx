import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

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
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            {/* <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="ListBand" component={ListBandScreen} />
        <Stack.Screen name="BandDetails" component={BandDetailsScreen} />
        */}
        </Stack.Navigator>
    );
}
