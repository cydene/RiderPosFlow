// react
import React, { useEffect, useState, useRef } from "react";

import {
  View,
  ViewStyle,
  StatusBar,
  Platform,
  ScrollView,
  ImageStyle,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextStyle,
  FlatList,
  RefreshControl,
  Linking,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
// third-party
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from "react-native-dark-mode";
import Clipboard from "@react-native-community/clipboard";
import Modal from "react-native-modal";

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {} from "../../redux/startup";
import { fetchBanksAsync, FetchWalletTransactionsAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";
import { Header } from "../../components/header";
import { translate } from "../../i18n";

import { Icon } from "../../components/icon";
import { formatAmount } from "../../utils/formatters";
import moment from "moment";
import axios from "axios";
import Toast from "react-native-simple-toast";
import tw from "twrnc";

interface DispatchProps {
  notify: (message: string, type: string) => void;
  fetchBanksAsync: () => void;
  // FetchWalletTransactionsAsync: () => void
}

interface StateProps {
  isLoading: boolean;
  transactions: Array<any>;
}

interface MyFormValues {}

interface TransactionsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & TransactionsScreenProps;

const ROOT: ViewStyle = {
  width: Layout.window.width,
  height: Layout.window.height,
};

const Transactions = (props: Props) => {
  const { navigation, notify, FetchWalletTransactionsAsync } = props;
  const isDarkMode = useDarkMode();
  const [detailsToggle, setDetailsToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [ValidatedTransactions, setValidatedTransactions] = useState([]);
  const [NotValidatedTransactions, setNotValidatedTransactions] = useState([]);
  const [section, setsection] = useState("NotValidated");

  const [selectedDetails, setSelectedDetails] = useState("");
  useEffect(() => {
    updateBackground();
    getTransaction();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("didFocus", () => {
      updateBackground();
      // FetchWalletTransactionsAsync()
    });
    updateBackground();
  }, [isDarkMode]);

  const getTransaction = async () => {
    console.log("called again");
    try {
      //   setLoading(true)
      setIsLoading(true);
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        console.warn("userDetails yessss>>>>>>>>yess", value);
      } else console.warn("nothing ooo");

      const userInfo = await AsyncStorage.getItem("user");

      const next = JSON.parse(value);
      console.warn("next>>>next>>NEXT", next);
      const userModify = JSON.parse(userInfo);
      console.warn("next>>>userModifyT", userModify.wallet.id);

      let res = await axios({
        method: "GET",
        url: `https://cydene-admin-prod.herokuapp.com/api/wallet/${userModify.wallet.id}/transactions`,

        headers: { Authorization: `Bearer ${next}` },
      });
      if (res) {
        setIsLoading(false);
        console.warn("retrieve user info ", res);
        setTransactions(res.data);
        if (res.data) {
          let array_Val = [];
          let array_Not = [];
          res.data.map((item: any, index: any) => {
            if (item.transferValidated == true) {
              array_Val.push(item);
            } else {
              array_Not.push(item);
            }
            // console.log('Array1', array1);
          });
          console.log("Array2", array_Val);
          setValidatedTransactions(array_Val);
          setNotValidatedTransactions(array_Not);
        }
      }
    } catch (err) {
      setIsLoading(false);
      // setLoading(false)
      // Toast.show(`${err.response.data.message}`, Toast.LONG);
      console.warn("any error ? see this>>", err);
    }
  };

  const ValidateTransaction = async (comingId) => {
    console.warn("userDetails yessss>>>>>>>>yess", comingId);
    try {
      //   setLoading(true)
      setIsLoading(true);
      const value = await AsyncStorage.getItem("token");
      if (value !== null) {
        console.warn("userDetails yessss>>>>>>>>yess", value);
      } else console.warn("nothing ooo, token null");

      const userInfo = await AsyncStorage.getItem("user");

      const userToken = JSON.parse(value);
      console.warn("next>>>next>>NEXT", userToken);
      const userModify = JSON.parse(userInfo);
      console.warn("next>>>userModifyT", userModify.wallet.id);

      let res = await axios({
        method: "POST",
        // url: `https://cydene-admin-prod.herokuapp.com/api/orders/${comingId}/complete`,
        url: `https://cydene-admin-prod.herokuapp.com/api/agent/complete-payment`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          transactionId: comingId,
        },
      });
      if (res) {
        Toast.show(`Transaction Validated successfully`, Toast.LONG);
        setDetailsToggle(false);
        await getTransaction();
        setIsLoading(false);
        console.warn("retrieve user info ", res.data);
      }
    } catch (err) {
      setIsLoading(false);
      // setLoading(false)
      // Toast.show(`${err.response.data.message}`, Toast.LONG);
      console.warn("any error ? see this>>", err);
    }
  };

  const detailsManipulation = (value) => {
    setSelectedDetails(value);
    console.warn("details>>>manipulation>>", value);
    setDetailsToggle(true);
  };

  const updateBackground = () => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    navigation.setParams({
      isDarkMode: isDarkMode,
    });
    Platform.OS === "android" && StatusBar.setBackgroundColor(isDarkMode ? colors.companyDarkGreen : colors.companyDarkGreen);
  };

  const returnBkColorLight = (index: number) => {
    return index ? colors.settingsSubView : colors.companyDarkGreen;
  };

  const returnTextColorLight = (index: number) => {
    return index ? colors.success : colors.error;
  };

  const renderItem = ({ item, index }: any) => {
    const { transactionRef, transactionMethod, isCredit, transactionDate, settlementAmount, amount } = item;
    console.tron.log("GOT HERE", item);

    return (
      <TouchableOpacity key={index} onPress={() => detailsManipulation(item)}>
        <View
          style={{
            marginTop: 10,
            width: "100%",
            height: 60,
            backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.settingsSubView,
            justifyContent: "center",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              // alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                // fontSize: 20
                width: "30%",
              }}
            >
              {`${moment(transactionDate).format("MMMM Do YYYY")}`}
            </Text>

            <Text
              style={{
                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                // fontSize: 20,
                // textAlign: 'center',s
                width: "50%",
              }}
            >
              {/* {transactionMethod} */}
              {transactionMethod == "AgentPayment"
                ? "Payment via App"
                : transactionMethod == "CreditWallet" || transactionMethod == "FundWallet"
                ? "Payment via transfer"
                : transactionMethod == "WithdrawFromWallet"
                ? "Withdraw From Wallet"
                : transactionMethod}
            </Text>

            <TouchableOpacity
              onPress={() => {
                // setShowModal(true)
                // setSeletedUssdTemplate(ussdTemplate)
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? colors.white : returnTextColorLight(isCredit),
                  // fontFamily: fonts.robotoBold,
                  // marginBottom: 10
                  // width: '100%',
                  // textAlign: 'right'
                }}
              >
                {translate("transactions.amount", {
                  amount: amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // <ScrollView
    //   contentContainerStyle={[
    //     ROOT,
    //     {
    //       backgroundColor: isDarkMode ? colors.companyDarkGreen : colors.white,
    //     },
    //   ]}
    //   scrollEnabled={false}
    // >
    <View style={{ flex: 1 }}>
      <Header
        leftIcon="arrowBackWhite"
        navigation={navigation}
        onLeftPress={() => navigation.navigate("wallet")}
        style={{
          backgroundColor: "transparent",
        }}
        titleStyle={{
          color: isDarkMode ? colors.white : colors.companyDarkGreen,
        }}
        titleTx={"transactions.headerText"}
        leftIconStyle={{
          tintColor: isDarkMode ? colors.white : colors.companyDarkGreen,
          marginTop: 15,
          marginLeft: 3,
        }}
      />

      {isLoading && (
        <View
          style={{
            marginTop: Layout.window.height / 3.5,
          }}
        >
          <ActivityIndicator size={"large"} color={isDarkMode ? colors.white : colors.companyDarkGreen} />
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              getTransaction();
            }}
          />
        }
      >
        {!isLoading && (
          <>
            <View style={tw`flex flex-row px-[5%] mt-4`}>
              <TouchableOpacity
                style={tw`w-1/2 py-2 items-center ${
                  section === "NotValidated" ? `border-b-2  border-[${colors.profileBlue}]` : ""
                }`}
                onPress={() => {
                  setsection("NotValidated");
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    fontFamily: fonts.robotoBold,
                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                  }}
                >
                  Pending Validation ({NotValidatedTransactions.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`w-1/2 py-2 items-center ${section === "Validated" ? `border-b-2  border-[${colors.profileBlue}]` : ""}`}
                onPress={() => {
                  setsection("Validated");
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    fontFamily: fonts.robotoBold,
                    color: isDarkMode ? colors.white : colors.companyDarkGreen,
                  }}
                >
                  Validated ({ValidatedTransactions.length})
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 20,
                paddingHorizontal: 20,
              }}
            >
              {/* {console.warn('iiii',transactions)} */}

              {section === "NotValidated" && (
                <>
                  {transactions !== undefined && transactions.length > 0 && NotValidatedTransactions.length > 0 && (
                    <FlatList
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={NotValidatedTransactions}
                      renderItem={renderItem}
                      contentContainerStyle={{
                        paddingBottom: "20%",
                      }}
                    />
                  )}
                </>
              )}
              {/* Not Validated */}

              {/* Validated */}

              {section === "Validated" && (
                <>
                  {transactions !== undefined && transactions.length > 0 && ValidatedTransactions.length > 0 && (
                    <FlatList
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      data={ValidatedTransactions}
                      renderItem={renderItem}
                      contentContainerStyle={{
                        paddingBottom: "70%",
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {transactions === undefined ||
        (transactions.length < 1 && !isLoading && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "50%",
            }}
          >
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.companyDarkGreen,
                // fontSize: 0,
                fontFamily: fonts.robotoBold,
              }}
            >
              {translate("transactions.empty")}
            </Text>
          </View>
        ))}

      <Modal
        isVisible={detailsToggle}
        onBackButtonPress={() => setDetailsToggle(false)}
        onBackdropPress={() => setDetailsToggle(false)}
        onSwipeComplete={() => setDetailsToggle(false)}
        style={{
          height: "100%",
          width: "100%",
          marginLeft: "-0%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* start */}
        <View
          style={{
            backgroundColor: "white",
            width: "90%",
            height: "90%",
          }}
        >
          <View style={{ width: "100%" }}>
            <Header
              leftIcon="arrowBackWhite"
              navigation={navigation}
              onLeftPress={() => setDetailsToggle(false)}
              style={{
                backgroundColor: "transparent",
              }}
              titleStyle={{
                // color: !isDarkMode ? colors.white : colors.companyDarkGreen,
                color: colors.companyDarkGreen,
              }}
              titleTx={"transactions.headerText2"}
              leftIconStyle={{
                // tintColor: !isDarkMode ? colors.white : colors.companyDarkGreen,
                tintColor: colors.companyDarkGreen,
                marginTop: 15,
                marginLeft: 3,
              }}
            />
          </View>

          <ScrollView>
            {selectedDetails.transferAccountName == null ? null : (
              <View style={{ height: "4%", width: "100%", marginTop: "8%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}> Account Name : </Text>
                </View>

                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.transferAccountName ? selectedDetails.transferAccountName : "") : ""}{" "}
                  </Text>
                </View>
              </View>
            )}
            {selectedDetails.transferAccountName == null ? null : (
              <View style={{ height: "4%", width: "100%", marginTop: "8%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}> Account Number : </Text>
                </View>

                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.transferAccountNumber ? selectedDetails.transferAccountNumber : "") : ""}{" "}
                  </Text>
                </View>
              </View>
            )}
            {selectedDetails.transferAccountName == null ? null : (
              <View style={{ height: "4%", width: "100%", marginTop: "8%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}> Bank : </Text>
                </View>

                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.transferBank ? selectedDetails.transferBank : "") : ""}{" "}
                  </Text>
                </View>
              </View>
            )}

            {selectedDetails.customerName == null ? null : (
              <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}> Customer Name : </Text>
                </View>

                <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.customerName ? selectedDetails.customerName : "") : ""}{" "}
                  </Text>
                </View>
              </View>
            )}

            {/* 2 */}

            {selectedDetails.customerEmail == null ? null : (
              <View style={{ height: "6%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "40%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}> Account Email : </Text>
                </View>

                <View style={{ height: "100%", width: "60%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.customerEmail ? selectedDetails.customerEmail : "") : ""}
                  </Text>
                </View>
              </View>
            )}

            {/* <View style={{height:'4%',width:'100%',marginTop:'10%',flexDirection:'row'}}>

<View style={{height:'100%',width:'50%',justifyContent:'center',paddingLeft:15}}>


<Text style={{fontSize:15}}> Account Email : </Text>


 </View>

 <View style={{height:'100%',width:'50%',justifyContent:'center',paddingRight:15}}>



 <Text style={{fontSize:15,textAlign:'right'}}>{selectedDetails?selectedDetails.transferAccountNumber?selectedDetails.transferAccountNumber:'':''}</Text>

 </View>

</View>  */}

            {/* box */}
            {selectedDetails.customerPhone == null ? null : (
              <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
                <View style={{ height: "100%", width: "40%", justifyContent: "center", paddingLeft: 15 }}>
                  <Text style={{ fontSize: 15 }}>Phone number : </Text>
                </View>

                <View style={{ height: "100%", width: "60%", justifyContent: "center", paddingRight: 15 }}>
                  <Text style={{ fontSize: 15, textAlign: "right" }}>
                    {selectedDetails ? (selectedDetails.customerPhone ? selectedDetails.customerPhone : "") : ""}
                  </Text>
                </View>
              </View>
            )}

            {/* box closed */}

            {/* box */}
            <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
              <View style={{ height: "100%", width: "40%", justifyContent: "center", paddingLeft: 15 }}>
                <Text style={{ fontSize: 15 }}> Amount : </Text>
              </View>

              <View style={{ height: "100%", width: "60%", justifyContent: "center", paddingRight: 15 }}>
                <Text style={{ fontSize: 15, textAlign: "right" }}>
                  ₦ {selectedDetails ? (selectedDetails.amount ? selectedDetails.amount : "") : ""}
                </Text>
              </View>
            </View>
            {/* box closed */}

            {/* box */}
            <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
              <View style={{ height: "100%", width: "40%", justifyContent: "center", paddingLeft: 15 }}>
                <Text style={{ fontSize: 15 }}> Reference : </Text>
              </View>

              <View style={{ height: "100%", width: "60%", justifyContent: "center", paddingRight: 15 }}>
                <Text style={{ fontSize: 15, textAlign: "right" }}>
                  {selectedDetails ? (selectedDetails.transactionRef ? selectedDetails.transactionRef : "") : ""}
                </Text>
              </View>
            </View>
            {/* box closed */}

            {/* box closed */}

            {/* box */}
            <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                <Text style={{ fontSize: 15 }}> Session Id : </Text>
              </View>

              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                <Text style={{ fontSize: 15, textAlign: "right" }}>
                  {selectedDetails ? (selectedDetails.id ? selectedDetails.id : "") : ""}
                </Text>
              </View>
            </View>
            {/* box closed */}

            {/* box */}
            <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                <Text style={{ fontSize: 15 }}> Time : </Text>
              </View>

              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                <Text style={{ fontSize: 15, textAlign: "right" }}>
                  {selectedDetails
                    ? selectedDetails.transactionDate
                      ? `${moment(selectedDetails.transactionDate).format("hh:mm:ss")}`
                      : ""
                    : ""}
                </Text>
              </View>
            </View>
            {/* box closed */}

            {/* box */}
            <View style={{ height: "4%", width: "100%", marginTop: "10%", flexDirection: "row" }}>
              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingLeft: 15 }}>
                <Text style={{ fontSize: 15 }}> Date : </Text>
              </View>

              <View style={{ height: "100%", width: "50%", justifyContent: "center", paddingRight: 15 }}>
                <Text style={{ fontSize: 15, textAlign: "right" }}>
                  {" "}
                  {selectedDetails
                    ? selectedDetails.transactionDate
                      ? `${moment(selectedDetails.transactionDate).format("MMMM Do YYYY")}`
                      : ""
                    : ""}
                </Text>
              </View>
            </View>

            <View
              style={{
                height: "15%",
                width: "100%",
                marginTop: "12.5%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* {selectedDetails.transactionMethod == "AgentPayment" && selectedDetails.transferValidated == false ? (
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: "90%",
                    backgroundColor: colors.companyDarkGreen,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 7,
                  }}
                  onPress={() => ValidateTransaction(selectedDetails.id)}
                >
                  <Text style={{ color: "white" }}>Validate</Text>
                </TouchableOpacity>
              ) : null} */}

              {/* transactionMethod == "CreditWallet" || transactionMethod == "FundWallet" */}
              {(selectedDetails.transactionMethod == "CreditWallet" || selectedDetails.transactionMethod == "FundWallet") &&
              !isLoading &&
              selectedDetails.transferValidated == false ? (
                <TouchableOpacity
                  style={{
                    height: 50,
                    width: "90%",
                    backgroundColor: colors.companyDarkGreen,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 7,
                  }}
                  onPress={() => ValidateTransaction(selectedDetails.id)}
                >
                  {isLoading && (
                    <View
                      style={{
                        marginTop: Layout.window.height / 3.5,
                      }}
                    >
                      <ActivityIndicator size={"large"} color={colors.companyDarkGreen} />
                    </View>
                  )}
                  {!isLoading && <Text style={{ color: "white" }}>Validate</Text>}
                </TouchableOpacity>
              ) : null}

              {/* 

            <TouchableOpacity style={{height:50,width:'90%',backgroundColor:colors.companyDarkGreen,justifyContent:'center',alignItems:'center',borderRadius:7}} onPress={()=>ValidateTransaction(selectedDetails.id)}>
              <Text style={{color:'white'}}>Validate</Text>
            </TouchableOpacity> */}
            </View>
            {/* <View style={{ height: 25 }} /> */}
            {/* box closed */}
          </ScrollView>
        </View>

        {/* finish */}
      </Modal>
    </View>
    // </ScrollView>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  notify: (message: string, type: string) => dispatch(notify(message, type)),
  fetchBanksAsync: () => dispatch(fetchBanksAsync()),
  // FetchWalletTransactionsAsync: () => dispatch(FetchWalletTransactionsAsync()),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
  isLoading: state.auth.loading,
  transactions: state.auth.myWalletTransactions ? state.auth.myWalletTransactions : [],
});

export const TransactionsScreen = connect<StateProps>(
  // @ts-ignore
  mapStateToProps,
  mapDispatchToProps
)(Transactions);
