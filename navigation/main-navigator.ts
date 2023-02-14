import { createBottomTabNavigator } from "react-navigation";
import { DashboardScreen } from "../screens/dashboard";
import { DEFAULT_BOTTOM_NAVIGATION } from "./navigation-config";

export const MainNavigator = createBottomTabNavigator({
    dashboard: {
        screen: DashboardScreen,
        navigationOptions: {
            header: null
        }
    }
}, DEFAULT_BOTTOM_NAVIGATION);
