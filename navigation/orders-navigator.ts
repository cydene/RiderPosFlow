import { createStackNavigator } from "react-navigation";
import { OldOrdersScreen } from "../screens/orders";

export const OrdersNavigator = createStackNavigator({
	oldOrders: {
		screen: OldOrdersScreen,
		navigationOptions: {
			header: null
		}
	},
});
