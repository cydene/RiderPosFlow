import { createSwitchNavigator } from "react-navigation";
import { BVNScreen } from "../screens/bnv/BVN";
import { CreateProductScreen } from "../screens/createProducts/CreateProduct";
import { DashboardScreen } from "../screens/dashboard";
import { EditProductsScreen } from "../screens/editProduct";
import { HistoryScreen } from "../screens/history/History";
import { ManageProductsScreen } from "../screens/manageProduct";
import { FullMapScreen } from "../screens/map";
import { OldOrdersScreen } from "../screens/orders";
import { EditProfileScreen, ProfileScreen } from "../screens/profile";
import { ResetPasswordScreen } from "../screens/resetPassword/ResetPassword";
import { TransactionsScreen, WalletScreen } from "../screens/wallet";

export const RootNavigator = createSwitchNavigator({
  Bvn: { screen: BVNScreen },
  dashboard: { screen: DashboardScreen },
  profile: { screen: ProfileScreen },
  editProfile: { screen: EditProfileScreen },
  wallet: { screen: WalletScreen },
  oldOrders: { screen: OldOrdersScreen },
  resetPassword: { screen: ResetPasswordScreen },
  fullScreen: { screen: FullMapScreen },
  history: { screen: HistoryScreen },
  transactions: { screen: TransactionsScreen },
  createProduct: { screen: CreateProductScreen },
  manageProducts: { screen: ManageProductsScreen },
  editProducts: { screen: EditProductsScreen },
});
