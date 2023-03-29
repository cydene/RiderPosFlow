// react
import React, { useEffect, useState, useRef } from "react";

// react-native
import { View, ViewStyle, StatusBar, TextStyle, Text, Keyboard, Platform } from "react-native";

// third-party
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDarkMode } from "react-native-dark-mode";
import RNPickerSelect from "react-native-picker-select";

// redux
import { ApplicationState } from "../../redux";
import { notify } from "../../redux/startup";
import {} from "../../redux/startup";
import { authCredentials, updateUserProfileAsync } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts } from "../../theme";
import { Header } from "../../components/header";
import { color } from "react-native-reanimated";
import { translate } from "../../i18n";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import axios from 'axios';

interface DispatchProps {
  updateUserProfileAsync: (values: authCredentials) => void;
  notify: (message: string, type: string) => void;
}

interface StateProps {
  isLoading: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  userDetails: any;
  notificationId: string;
  isOnline: boolean;
  oldBankName: string;
  oldAccountNumber: string;
}

interface ContactUsScreenProps extends NavigationScreenProps {}

type Props = DispatchProps & StateProps & ContactUsScreenProps;

const ROOT: ViewStyle = {
  width: Layout.window.width,
  height: Layout.window.height,
};

const LABEL_VIEW: ViewStyle = {
  marginHorizontal: 20,
};

const LABEL_TEXT = {
  color: colors.companyDarkGreen,
  fontFamily: fonts.robotoBold,
  marginTop: 20,
  textAlign: "center",
  fontSize: 20,
};

const SKIP_BUTTON: ViewStyle = {
  alignSelf: "center",
  justifyContent: "center",
  borderRadius: 30,
  width: Layout.window.width / 1.4,
  backgroundColor: colors.companyDarkGreen,
  height: 50,
  marginVertical: 20,
};

const SKIP_BUTTON_TEXT: TextStyle = {
  fontSize: 14,
  fontFamily: fonts.robotoBold,
  color: colors.white,
  textTransform: "uppercase",
};

const SETTINGS_HEADER = {
  color: colors.black,
  fontFamily: fonts.robotoBold,
};

const SETTINGS_TITLE = {
  color: colors.profileBK,
  fontFamily: fonts.gilroyBold,
  marginBottom: 5,
};

const EDIT_BUTTON: ViewStyle = {
  alignSelf: "center",
  justifyContent: "center",
  borderRadius: 8,
  width: "100%",
  backgroundColor: colors.companyBlue,
  height: 50,
  marginTop: Layout.window.height / 30,
};

const EDIT_BUTTON_TEXT: TextStyle = {
  fontSize: 14,
  fontFamily: fonts.robotoBold,
  color: colors.white,
};

const EditProfile = (props: Props) => {
  const {
    oldAccountNumber,
    oldBankName,
    userDetails,
    isLoading,
    isOnline,
    notificationId,
    navigation,
    firstName,
    lastName,
    phone,
    updateUserProfileAsync,
  } = props;
  const isDarkMode = useDarkMode();
  var myPicker = useRef(null);
  const [newFirstName, setNewFirst] = useState("");
  const [newLastName, setNewLast] = useState("");
  const [newPhone, setNewPhone] = useState("");
  var firstNameInput = useRef(null);
  var lastNameInput = useRef(null);
  var phoneInput = useRef(null);
  var accountNumberInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setbankCode] = useState('');
  var bankNameInput = useRef(null);

  console.log(oldBankName, "HHEH");

  useEffect(() => {
    updateBackground();
    getUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("didFocus", () => {
      updateBackground();
    });
    updateBackground();
  }, [isDarkMode]);

  const updateBackground = () => {
    navigation.setParams({
      isDarkMode: isDarkMode,
    });
    StatusBar.setBarStyle("light-content");
    Platform.OS === "android" && StatusBar.setBackgroundColor(colors.companyDarkGreen);
  };

  const manipulate = async (coming) => {
    if (coming == "Zenith bank PLC") {
      console.warn("Coming>>>", coming);
      const check = await banksList.find((item) => item.value == "Zenith Bank");

      console.warn("Testing", check.bankCode);
      return check.bankCode;
    } else {
      console.warn("Coming>>>", coming);
      const check = await banksList.find((item) => item.value == coming);

      console.warn("Testing", check.bankCode);
      return check.bankCode;
    }
  };

  const getUser = async () =>{


    try {
          let res = await axios({
              method: 'GET',
              url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/profile`,

              headers: {
              Authorization:`Bearer ${userDetails.token}`,
              },
          });
          if (res) {
            console.warn('\\ USERDATA EDITPOROFILE success>>>',res.data)
            setLoading(false)
            setAccountNumber(res.data.payoutNumber);
            setBankName(res.data.bankName);
        }

      } catch (err) {
        setLoading(false);
        console.warn("call err>>>>>>>>>>>>>", err);
      }

  }

  const saveUser = async () => {
    console.log('saveUser started');
    
    // updateUserProfileAsync({
    //   firstName: newFirstName || userDetails.firstName,
    //   lastName: newLastName || userDetails.lastName,
    //   phone: newPhone || userDetails.phone,
    //   photo: {
    //     id: userDetails.photo ? userDetails.photo.id : "",
    //     url: userDetails.photo ? (userDetails.photo.url ? userDetails.photo.url : "") : "",
    //   },
    //   notificationId: notificationId,
    //   isOnline: isOnline,
    //   bankName: bankName || oldBankName,
    //   payoutNumber: accountNumber || oldAccountNumber,
    //   bankCode: await manipulate(bankName || oldBankName),
    // });

    
    try {
    //   setLoading(true);
      const info = await AsyncStorage.getItem("user");
      console.warn("userDetails_here", info);

      console.warn("userDetails >>>>333token", userDetails.token);
    //   let res = await axios({
    //       method: 'GET',
    //       url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/profile`,

    //       headers: {
    //       Authorization:`Bearer ${userDetails.token}`,
    //       },

    //   });
    let res = await axios({
        method: 'PUT',
        url: `https://cydene-admin-prod.herokuapp.com/api/dispatchers/${userDetails.id}`,

        headers: {
        Authorization:`Bearer ${userDetails.token}`,
        },
        data:{
            "bankName": bankName,
            "bankCode": bankCode,
            "payoutNumber": accountNumber,
        }

    });
      if (res) {
          console.warn('\\ success>>>',res.data)
          setLoading(false)
      }
    } catch (err) {
      setLoading(false);
      console.warn("call err>>>>>>>>>>>>>", err);
    }

    // console.warn("kkk", {
    //   firstName: newFirstName || userDetails.firstName,
    //   lastName: newLastName || userDetails.lastName,
    //   phone: newPhone || userDetails.phone,
    //   photo: {
    //     id: userDetails.photo ? userDetails.photo.id : "",
    //     url: userDetails.photo ? (userDetails.photo.url ? userDetails.photo.url : "") : "",
    //   },
    //   notificationId: notificationId,
    //   isOnline: isOnline,
    //   bankName: bankName || oldBankName,
    //   payoutNumber: accountNumber || oldAccountNumber,
    //   bankCode: await manipulate(bankName),
    // });
  };

  const placeholderstate = {
    label: "Select bank",
    value: "",
    color: "#565F62",
  };

  const banksList = [
    {
      id: "1",
      value: "Access Bank",
      label: "Access Bank",
      bankCode: "044",
    },
    {
      id: "2",
      value: "Citibank",
      label: "Citibank",
      bankCode: "023",
    },
    {
      id: "3",
      value: "Diamond Bank",
      label: "Diamond Bank",
      bankCode: "063",
    },
    {
      id: "4",
      value: "Dynamic Standard Bank",
      label: "Dynamic Standard Bank",
      bankCode: "",
    },
    {
      id: "5",
      value: "Ecobank Nigeria",
      label: "Ecobank Nigeria",
      bankCode: "050",
    },
    {
      id: "6",
      value: "Fidelity Bank Nigeria",
      label: "Fidelity Bank Nigeria",
      bankCode: "070",
    },
    {
      id: "7",
      value: "First Bank of Nigeria",
      label: "First Bank of Nigeria",
      bankCode: "011",
    },
    {
      id: "8",
      value: "First City Monument Bank",
      label: "First City Monument Bank",
      bankCode: "214",
    },
    {
      id: "9",
      value: "Guaranty Trust Bank",
      label: "Guaranty Trust Bank",
      bankCode: "058",
    },
    {
      id: "10",
      value: "Heritage Bank Plc",
      label: "Heritage Bank Plc",
      bankCode: "030",
    },
    {
      id: "11",
      value: "Jaiz Bank",
      label: "Jaiz Bank",
      bankCode: "301",
    },
    {
      id: "12",
      value: "Keystone Bank Limited",
      label: "Keystone Bank Limited",
      bankCode: "082",
    },
    {
      id: "13",
      value: "Providus Bank Plc",
      label: "Providus Bank Plc",
      bankCode: "101",
    },
    {
      id: "14",
      value: "Polaris Bank",
      label: "Polaris Bank",
      bankCode: "076",
    },
    {
      id: "15",
      value: "Stanbic IBTC Bank Nigeria Limited",
      label: "Stanbic IBTC Bank Nigeria Limited",
      bankCode: "221",
    },
    {
      id: "16",
      value: "Standard Chartered Bank",
      label: "Standard Chartered Bank",
      bankCode: "068",
    },
    {
      id: "17",
      value: "Sterling Bank",
      label: "Sterling Bank",
      bankCode: "232",
    },
    {
      id: "18",
      value: "Suntrust Bank Nigeria Limited",
      label: "Suntrust Bank Nigeria Limited",
      bankCode: "100",
    },
    {
      id: "19",
      value: "Union Bank of Nigeria",
      label: "Union Bank of Nigeria",
      bankCode: "032",
    },
    {
      id: "20",
      value: "United Bank for Africa",
      label: "United Bank for Africa",
      bankCode: "033",
    },
    {
      id: "21",
      value: "Unity Bank Plc",
      label: "Unity Bank Plc",
      bankCode: "215",
    },
    {
      id: "22",
      value: "Wema Bank",
      label: "Wema Bank",
      bankCode: "035",
    },
    {
      id: "23",
      value: "Zenith Bank",
      label: "Zenith Bank",
      bankCode: "057",
    },
  ];

  const banksList2 = [
    {
      id: "1",
      value: "Access Bank",
      label: "Access Bank",
      bankCode: "044",
    },
    {
      id: "2",
      value: "Citibank",
      label: "Citibank",
      bankCode: "023",
    },
    {
      id: "3",
      value: "Diamond Bank",
      label: "Diamond Bank",
      bankCode: "063",
    },
    {
      id: "4",
      value: "Dynamic Standard Bank",
      label: "Dynamic Standard Bank",
      bankCode: "",
    },
    {
      id: "5",
      value: "Ecobank Nigeria",
      label: "Ecobank Nigeria",
      bankCode: "050",
    },
    {
      id: "6",
      value: "Fidelity Bank Nigeria",
      label: "Fidelity Bank Nigeria",
      bankCode: "070",
    },
    {
      id: "7",
      value: "First Bank of Nigeria",
      label: "First Bank of Nigeria",
      bankCode: "011",
    },
    {
      id: "8",
      value: "First City Monument Bank",
      label: "First City Monument Bank",
      bankCode: "214",
    },
    {
      id: "9",
      value: "Guaranty Trust Bank",
      label: "Guaranty Trust Bank",
      bankCode: "058",
    },
    {
      id: "10",
      value: "Heritage Bank Plc",
      label: "Heritage Bank Plc",
      bankCode: "030",
    },
    {
      id: "11",
      value: "Jaiz Bank",
      label: "Jaiz Bank",
      bankCode: "301",
    },
    {
      id: "12",
      value: "Keystone Bank Limited",
      label: "Keystone Bank Limited",
      bankCode: "082",
    },
    {
      id: "13",
      value: "Providus Bank Plc",
      label: "Providus Bank Plc",
      bankCode: "101",
    },
    {
      id: "14",
      value: "Polaris Bank",
      label: "Polaris Bank",
      bankCode: "076",
    },
    {
      id: "15",
      value: "Stanbic IBTC Bank Nigeria Limited",
      label: "Stanbic IBTC Bank Nigeria Limited",
      bankCode: "221",
    },
    {
      id: "16",
      value: "Standard Chartered Bank",
      label: "Standard Chartered Bank",
      bankCode: "068",
    },
    {
      id: "17",
      value: "Sterling Bank",
      label: "Sterling Bank",
      bankCode: "232",
    },
    {
      id: "18",
      value: "Suntrust Bank Nigeria Limited",
      label: "Suntrust Bank Nigeria Limited",
      bankCode: "100",
    },
    {
      id: "19",
      value: "Union Bank of Nigeria",
      label: "Union Bank of Nigeria",
      bankCode: "032",
    },
    {
      id: "20",
      value: "United Bank for Africa",
      label: "United Bank for Africa",
      bankCode: "033",
    },
    {
      id: "21",
      value: "Unity Bank Plc",
      label: "Unity Bank Plc",
      bankCode: "215",
    },
    {
      id: "22",
      value: "Wema Bank",
      label: "Wema Bank",
      bankCode: "035",
    },
    {
      id: "23",
      value: "Zenith Bank",
      label: "Zenith Bank",
      bankCode: "057",
    },
  ];

  const banks = [
    { id: 0, code: "", label: "Select Bank", value: "Select Bank" },
    { id: 1, code: "090133", label: "AL-Barakah Microfinance Bank", value: "AL-Barakah Microfinance Bank" },
    { id: 2, code: "090270", label: "AB Microfinance Bank", value: "AB Microfinance Bank" },
    { id: 3, code: "070010", label: "Abbey Mortgage Bank", value: "Abbey Mortgage Bank" },
    { id: 4, code: "090260", label: "Above Only Microfinance Bank", value: "Above Only Microfinance Bank" },
    { id: 5, code: "090197", label: "ABU Microfinance Bank", value: "ABU Microfinance Bank" },
    { id: 6, code: "044", label: "Access Bank", value: "Access Bank" },
    { id: 7, code: "100013", label: "AccessMobile", value: "AccessMobile" },
    { id: 8, code: "090134", label: "Accion Microfinance Bank", value: "Accion Microfinance Bank" },
    { id: 9, code: "090160", label: "Addosser Microfinance Bank", value: "Addosser Microfinance Bank" },
    {
      id: 10,
      code: "090268",
      label: "Adeyemi College Staff Microfinance Bank",
      value: "Adeyemi College Staff Microfinance Bank",
    },
    { id: 11, code: "100028", label: "AG Mortgage Bank", value: "AG Mortgage Bank" },
    { id: 12, code: "090277", label: "Al-Hayat Microfinance Bank", value: "Al-Hayat Microfinance Bank" },
    { id: 13, code: "090259", label: "Alekun Microfinance Bank", value: "Alekun Microfinance Bank" },
    { id: 14, code: "090131", label: "Allworkers Microfinance Bank", value: "Allworkers Microfinance Bank" },
    { id: 15, code: "090169", label: "Alpha Kapital Microfinance Bank", value: "Alpha Kapital Microfinance Bank" },
    { id: 16, code: "090180", label: "AMJU Unique Microfinance Bank", value: "AMJU Unique Microfinance Bank" },
    { id: 17, code: "090116", label: "AMML MFB", value: "AMML MFB" },
    { id: 18, code: "090143", label: "Apeks Microfinance Bank", value: "Apeks Microfinance Bank" },
    { id: 19, code: "090001", label: "ASOSavings & Loans", value: "ASOSavings & Loans" },
    { id: 20, code: "090172", label: "Astrapolaris Microfinance Bank", value: "Astrapolaris Microfinance Bank" },
    { id: 21, code: "090264", label: "Auchi Microfinance Bank", value: "Auchi Microfinance Bank" },
    { id: 22, code: "090188", label: "Baines Credit Microfinance Bank", value: "Baines Credit Microfinance Bank" },
    { id: 23, code: "090136", label: "Baobab Microfinance Bank", value: "Baobab Microfinance Bank" },
    { id: 24, code: "090127", label: "BC Kash Microfinance Bank", value: "BC Kash Microfinance Bank" },
    { id: 25, code: "090117", label: "Boctrust Microfinance Bank", value: "Boctrust Microfinance Bank" },
    { id: 26, code: "090176", label: "Bosak Microfinance Bank", value: "Bosak Microfinance Bank" },
    { id: 27, code: "090148", label: "Bowen Microfinance Bank", value: "Bowen Microfinance Bank" },
    { id: 28, code: "070015", label: "Brent Mortgage Bank", value: "Brent Mortgage Bank" },
    { id: 29, code: "090393", label: "BRIDGEWAY MICROFINANCE BANK", value: "BRIDGEWAY MICROFINANCE BANK" },
    { id: 30, code: "100005", label: "Cellulant", value: "Cellulant" },
    { id: 31, code: "090154", label: "CEMCS Microfinance Bank", value: "CEMCS Microfinance Bank" },
    { id: 32, code: "303", label: "ChamsMobile", value: "ChamsMobile" },
    { id: 33, code: "090141", label: "Chikum Microfinance Bank", value: "Chikum Microfinance Bank" },
    { id: 34, code: "090144", label: "CIT Microfinance Bank", value: "CIT Microfinance Bank" },
    { id: 35, code: "023", label: "Citi Bank", value: "Citi Bank" },
    { id: 36, code: "090130", label: "Consumer Microfinance Bank", value: "Consumer Microfinance Bank" },
    {
      id: 37,
      code: "100032",
      label: "Contec Global Infotech Limited (NowNow)",
      value: "Contec Global Infotech Limited (NowNow)",
    },
    { id: 38, code: "060001", label: "Coronation Merchant Bank", value: "Coronation Merchant Bank" },
    { id: 39, code: "070006", label: "Covenant Microfinance Bank", value: "Covenant Microfinance Bank" },
    { id: 40, code: "090159", label: "Credit Afrique Microfinance Bank", value: "Credit Afrique Microfinance Bank" },
    { id: 41, code: "090167", label: "Daylight Microfinance Bank", value: "Daylight Microfinance Bank" },
    { id: 42, code: "090156", label: "e-Barcs Microfinance Bank", value: "e-Barcs Microfinance Bank" },
    { id: 43, code: "100021", label: "Eartholeum", value: "Eartholeum" },
    { id: 44, code: "050", label: "EcoBank PLC", value: "EcoBank PLC" },
    { id: 45, code: "100008", label: "Ecobank Xpress Account", value: "Ecobank Xpress Account" },
    { id: 46, code: "100030", label: "EcoMobile", value: "EcoMobile" },
    { id: 47, code: "090097", label: "Ekondo MFB", value: "Ekondo MFB" },
    { id: 48, code: "090273", label: "Emeralds Microfinance Bank", value: "Emeralds Microfinance Bank" },
    { id: 49, code: "090114", label: "Empire trust MFB", value: "Empire trust MFB" },
    { id: 50, code: "000019", label: "Enterprise Bank", value: "Enterprise Bank" },
    { id: 51, code: "090189", label: "Esan Microfinance Bank", value: "Esan Microfinance Bank" },
    { id: 52, code: "090166", label: "Eso-E Microfinance Bank", value: "Eso-E Microfinance Bank" },
    { id: 53, code: "100006", label: "eTranzact", value: "eTranzact" },
    { id: 54, code: "090328", label: "Eyowo MFB", value: "Eyowo MFB" },
    { id: 55, code: "090179", label: "FAST Microfinance Bank", value: "FAST Microfinance Bank" },
    { id: 56, code: "090107", label: "FBN Mortgages Limited", value: "FBN Mortgages Limited" },
    { id: 57, code: "100014", label: "FBNMobile", value: "FBNMobile" },
    { id: 58, code: "060002", label: "FBNQUEST Merchant Bank", value: "FBNQUEST Merchant Bank" },
    { id: 59, code: "100031", label: "FCMB Easy Account", value: "FCMB Easy Account" },
    { id: 60, code: "100001", label: "FET", value: "FET" },
    { id: 61, code: "090153", label: "FFS Microfinance Bank", value: "FFS Microfinance Bank" },
    { id: 62, code: "070", label: "Fidelity Bank", value: "Fidelity Bank" },
    { id: 63, code: "100019", label: "Fidelity Mobile", value: "Fidelity Mobile" },
    { id: 64, code: "090126", label: "Fidfund Microfinance Bank", value: "Fidfund Microfinance Bank" },
    { id: 65, code: "608", label: "FINATRUST MICROFINANCE BANK", value: "FINATRUST MICROFINANCE BANK" },
    { id: 66, code: "011", label: "First Bank PLC", value: "First Bank PLC" },
    { id: 67, code: "214", label: "First City Monument Bank", value: "First City Monument Bank" },
    { id: 68, code: "070014", label: "First Generation Mortgage Bank", value: "First Generation Mortgage Bank" },
    { id: 69, code: "090164", label: "First Royal Microfinance Bank", value: "First Royal Microfinance Bank" },
    {
      id: 70,
      code: "110002",
      label: "Flutterwave Technology Solutions Limited",
      value: "Flutterwave Technology Solutions Limited",
    },
    { id: 71, code: "070002", label: "Fortis Microfinance Bank", value: "Fortis Microfinance Bank" },
    { id: 72, code: "100016", label: "FortisMobile", value: "FortisMobile" },
    { id: 73, code: "400001", label: "FSDH Merchant Bank", value: "FSDH Merchant Bank" },
    { id: 74, code: "090145", label: "Fullrange Microfinance Bank", value: "Fullrange Microfinance Bank" },
    { id: 75, code: "090158", label: "Futo Microfinance Bank", value: "Futo Microfinance Bank" },
    { id: 76, code: "090168", label: "Gashua Microfinance Bank", value: "Gashua Microfinance Bank" },
    { id: 77, code: "070009", label: "Gateway Mortgage Bank", value: "Gateway Mortgage Bank" },
    { id: 78, code: "103", label: "Globus Bank", value: "Globus Bank" },
    { id: 79, code: "100022", label: "GoMoney", value: "GoMoney" },
    { id: 80, code: "090122", label: "Gowans Microfinance Bank", value: "Gowans Microfinance Bank" },
    { id: 81, code: "090178", label: "GreenBank Microfinance Bank", value: "GreenBank Microfinance Bank" },
    { id: 82, code: "090269", label: "Greenville Microfinance Bank", value: "Greenville Microfinance Bank" },
    { id: 83, code: "090195", label: "Grooming Microfinance Bank", value: "Grooming Microfinance Bank" },
    { id: 84, code: "100009", label: "GTMobile", value: "GTMobile" },
    { id: 85, code: "058", label: "Guaranty Trust Bank", value: "Guaranty Trust Bank" },
    { id: 86, code: "090147", label: "Hackman Microfinance Bank", value: "Hackman Microfinance Bank" },
    { id: 87, code: "070017", label: "Haggai Mortgage Bank Limited", value: "Haggai Mortgage Bank Limited" },
    { id: 88, code: "090121", label: "Hasal Microfinance Bank", value: "Hasal Microfinance Bank" },
    { id: 89, code: "100017", label: "Hedonmark", value: "Hedonmark" },
    { id: 90, code: "030", label: "Heritage Bank", value: "Heritage Bank" },
    { id: 91, code: "090175", label: "HighStreet Microfinance Bank", value: "HighStreet Microfinance Bank" },
    { id: 92, code: "090118", label: "IBILE Microfinance Bank", value: "IBILE Microfinance Bank" },
    { id: 93, code: "090258", label: "Imo State Microfinance Bank", value: "Imo State Microfinance Bank" },
    { id: 94, code: "100024", label: "Imperial Homes Mortgage Bank", value: "Imperial Homes Mortgage Bank" },
    { id: 95, code: "090157", label: "Infinity Microfinance Bank", value: "Infinity Microfinance Bank" },
    { id: 96, code: "070016", label: "Infinity Trust Mortgage Bank", value: "Infinity Trust Mortgage Bank" },
    { id: 97, code: "100029", label: "Innovectives Kesh", value: "Innovectives Kesh" },
    { id: 98, code: "100027", label: "Intellifin", value: "Intellifin" },
    { id: 99, code: "090149", label: "IRL Microfinance Bank", value: "IRL Microfinance Bank" },
    { id: 100, code: "301", label: "Jaiz Bank", value: "Jaiz Bank" },
    { id: 101, code: "090003", label: "Jubilee-Life Mortgage Bank", value: "Jubilee-Life Mortgage Bank" },
    { id: 102, code: "090191", label: "KCMB Microfinance Bank", value: "KCMB Microfinance Bank" },
    { id: 103, code: "100015", label: "Kegow", value: "Kegow" },
    { id: 104, code: "082", label: "Keystone Bank", value: "Keystone Bank" },
    { id: 105, code: "090267", label: "Kuda", value: "Kuda" },
    { id: 106, code: "090155", label: "La Fayette Microfinance Bank", value: "La Fayette Microfinance Bank" },
    { id: 107, code: "070012", label: "Lagos Building Investment Company", value: "Lagos Building Investment Company" },
    { id: 108, code: "090177", label: "Lapo Microfinance Bank", value: "Lapo Microfinance Bank" },
    { id: 109, code: "090271", label: "Lavender Microfinance Bank", value: "Lavender Microfinance Bank" },
    { id: 110, code: "090265", label: "Lovonus Microfinance Bank", value: "Lovonus Microfinance Bank" },
    { id: 111, code: "090171", label: "Mainstreet Microfinance Bank", value: "Mainstreet Microfinance Bank" },
    { id: 112, code: "090174", label: "Malachy Microfinance Bank", value: "Malachy Microfinance Bank" },
    { id: 113, code: "090192", label: "Midland Microfinance Bank", value: "Midland Microfinance Bank" },
    { id: 114, code: "090281", label: "Mint-Finex MICROFINANCE BANK", value: "Mint-Finex MICROFINANCE BANK" },
    { id: 115, code: "100011", label: "Mkudi", value: "Mkudi" },
    { id: 116, code: "090129", label: "Money Trust Microfinance Bank", value: "Money Trust Microfinance Bank" },
    { id: 117, code: "100020", label: "MoneyBox", value: "MoneyBox" },
    { id: 118, code: "090190", label: "Mutual Benefits Microfinance Bank", value: "Mutual Benefits Microfinance Bank" },
    { id: 119, code: "090151", label: "Mutual Trust Microfinance Bank", value: "Mutual Trust Microfinance Bank" },
    { id: 120, code: "090152", label: "Nagarta Microfinance Bank", value: "Nagarta Microfinance Bank" },
    { id: 121, code: "090263", label: "Navy Microfinance Bank", value: "Navy Microfinance Bank" },
    { id: 122, code: "090128", label: "Ndiorah Microfinance Bank", value: "Ndiorah Microfinance Bank" },
    { id: 123, code: "090205", label: "New Dawn Microfinance Bank", value: "New Dawn Microfinance Bank" },
    { id: 124, code: "090108", label: "New Prudential Bank", value: "New Prudential Bank" },
    { id: 125, code: "999999", label: "NIP Virtual Bank", value: "NIP Virtual Bank" },
    { id: 126, code: "090194", label: "NIRSAL Microfinance Bank", value: "NIRSAL Microfinance Bank" },
    { id: 127, code: "060003", label: "Nova Merchant Bank", value: "Nova Merchant Bank" },
    { id: 128, code: "070001", label: "NPF MicroFinance Bank", value: "NPF MicroFinance Bank" },
    { id: 129, code: "090119", label: "Ohafia Microfinance Bank", value: "Ohafia Microfinance Bank" },
    { id: 130, code: "090161", label: "Okpoga Microfinance Bank", value: "Okpoga Microfinance Bank" },
    {
      id: 131,
      code: "090272",
      label: "Olabisi Onabanjo University Microfinance Bank",
      value: "Olabisi Onabanjo University Microfinance Bank",
    },
    { id: 132, code: "070007", label: "Omoluabi savings and loans", value: "Omoluabi savings and loans" },
    { id: 133, code: "100026", label: "One Finance", value: "One Finance" },
    { id: 134, code: "327", label: "Paga", value: "Paga" },
    { id: 135, code: "070008", label: "Page Financials", value: "Page Financials" },
    { id: 136, code: "100003", label: "Parkway-ReadyCash", value: "Parkway-ReadyCash" },
    { id: 137, code: "090004", label: "Parralex Microfinance bank", value: "Parralex Microfinance bank" },
    { id: 138, code: "090317", label: "PatrickGold Microfinance Bank", value: "PatrickGold Microfinance Bank" },
    { id: 139, code: "110001", label: "PayAttitude Online", value: "PayAttitude Online" },
    { id: 140, code: "305", label: "Paycom", value: "Paycom" },
    { id: 141, code: "090137", label: "PecanTrust Microfinance Bank", value: "PecanTrust Microfinance Bank" },
    { id: 142, code: "090196", label: "Pennywise Microfinance Bank", value: "Pennywise Microfinance Bank" },
    { id: 143, code: "090135", label: "Personal Trust Microfinance Bank", value: "Personal Trust Microfinance Bank" },
    { id: 144, code: "090165", label: "Petra Microfinance Bank", value: "Petra Microfinance Bank" },
    { id: 145, code: "070013", label: "Platinum Mortgage Bank", value: "Platinum Mortgage Bank" },
    { id: 146, code: "076", label: "Polaris bank", value: "Polaris bank" },
    { id: 147, code: "101", label: "ProvidusBank PLC", value: "ProvidusBank PLC" },
    { id: 148, code: "090261", label: "Quickfund Microfinance Bank", value: "Quickfund Microfinance Bank" },
    { id: 149, code: "502", label: "Rand merchant Bank", value: "Rand merchant Bank" },
    { id: 150, code: "070011", label: "Refuge Mortgage Bank", value: "Refuge Mortgage Bank" },
    { id: 151, code: "090125", label: "Regent Microfinance Bank", value: "Regent Microfinance Bank" },
    { id: 152, code: "090173", label: "Reliance Microfinance Bank", value: "Reliance Microfinance Bank" },
    { id: 153, code: "090198", label: "RenMoney Microfinance Bank", value: "RenMoney Microfinance Bank" },
    { id: 154, code: "090132", label: "Richway Microfinance Bank", value: "Richway Microfinance Bank" },
    { id: 155, code: "090138", label: "Royal Exchange Microfinance Bank", value: "Royal Exchange Microfinance Bank" },
    { id: 156, code: "090175", label: "Rubies Microfinance Bank", value: "Rubies Microfinance Bank" },
    { id: 157, code: "090006", label: "SafeTrust", value: "SafeTrust" },
    { id: 158, code: "090140", label: "Sagamu Microfinance Bank", value: "Sagamu Microfinance Bank" },
    { id: 159, code: "090112", label: "Seed Capital Microfinance Bank", value: "Seed Capital Microfinance Bank" },
    { id: 160, code: "090325", label: "Sparkle", value: "Sparkle" },
    { id: 161, code: "100007", label: "Stanbic IBTC @ease wallet", value: "Stanbic IBTC @ease wallet" },
    { id: 162, code: "221", label: "Stanbic IBTC Bank", value: "Stanbic IBTC Bank" },
    { id: 163, code: "068", label: "Standard Chaterted bank PLC", value: "Standard Chaterted bank PLC" },
    { id: 164, code: "090162", label: "Stanford Microfinance Bak", value: "Stanford Microfinance Bak" },
    { id: 165, code: "090262", label: "Stellas Microfinance Bank", value: "Stellas Microfinance Bank" },
    { id: 166, code: "232", label: "Sterling Bank PLC", value: "Sterling Bank PLC" },
    { id: 167, code: "100", label: "Suntrust Bank", value: "Suntrust Bank" },
    { id: 168, code: "100023", label: "TagPay", value: "TagPay" },
    { id: 169, code: "000026", label: "Taj Bank Limited", value: "Taj Bank Limited" },
    { id: 170, code: "090115", label: "TCF MFB", value: "TCF MFB" },
    { id: 171, code: "100010", label: "TeasyMobile", value: "TeasyMobile" },
    { id: 172, code: "000025", label: "Titan Trust Bank", value: "Titan Trust Bank" },
    { id: 173, code: "090146", label: "Trident Microfinance Bank", value: "Trident Microfinance Bank" },
    { id: 174, code: "090005", label: "Trustbond Mortgage Bank", value: "Trustbond Mortgage Bank" },
    { id: 175, code: "090276", label: "Trustfund Microfinance Bank", value: "Trustfund Microfinance Bank" },
    { id: 176, code: "090266", label: "Uniben Microfinance Bank", value: "Uniben Microfinance Bank" },
    { id: 177, code: "090193", label: "Unical Microfinance Bank", value: "Unical Microfinance Bank" },
    { id: 178, code: "032", label: "Union Bank PLC", value: "Union Bank PLC" },
    { id: 179, code: "033", label: "United Bank for Africa", value: "United Bank for Africa" },
    { id: 180, code: "215", label: "Unity Bank PLC", value: "Unity Bank PLC" },
    { id: 181, code: "090251", label: "UNN MFB", value: "UNN MFB" },
    { id: 182, code: "090123", label: "Verite Microfinance Bank", value: "Verite Microfinance Bank" },

    { id: 184, code: "090150", label: "Virtue Microfinance Bank", value: "Virtue Microfinance Bank" },
    { id: 185, code: "090139", label: "Visa Microfinance Bank", value: "Visa Microfinance Bank" },
    { id: 186, code: "100012", label: "VTNetworks", value: "VTNetworks" },
    { id: 187, code: "035", label: "Wema Bank PLC", value: "Wema Bank PLC" },
    { id: 188, code: "090120", label: "Wetland Microfinance Bank", value: "Wetland Microfinance Bank" },
    { id: 189, code: "090124", label: "Xslnce Microfinance Bank", value: "Xslnce Microfinance Bank" },
    { id: 190, code: "090142", label: "Yes Microfinance Bank", value: "Yes Microfinance Bank" },
    { id: 191, code: "057", label: "Zenith bank PLC", value: "Zenith bank PLC" },
    { id: 192, code: "100018", label: "ZenithMobile", value: "ZenithMobile" },
    { id: 193, code: "100025", label: "Zinternet Nigera Limited", value: "Zinternet Nigera Limited" },
  ];

  return (
    <View style={[ROOT, {}]}>
      <ScrollView>
        <View
          style={{
            backgroundColor: colors.companyDarkGreen,
          }}
        >
          <Header
            leftIcon="arrowBackWhite"
            navigation={navigation}
            onLeftPress={() => navigation.navigate("profile")}
            style={{
              backgroundColor: "transparent",
            }}
            titleStyle={{
              color: colors.white,
            }}
            titleTx={"profile.editTitle"}
          />
        </View>

        <View
          style={{
            margin: 20,
          }}
        >
          <View
            style={{
              width: Layout.window.width / 1.15,
              alignSelf: "center",
              marginTop: 20,
              backgroundColor: colors.settingsSubView,
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderRadius: 16,
              justifyContent: "space-between",
            }}
          >
            <Text style={SETTINGS_TITLE}>{translate("profile.firstName")}</Text>

            <TextField
              name="firstName"
              keyboardType="default"
              value={newFirstName}
              onChangeText={(fName) => setNewFirst(fName)}
              autoCapitalize="words"
              returnKeyType="next"
              placeholder={firstName}
              placeholderTextColor={colors.dotColor}
              onSubmitEditing={() => lastNameInput.current.focus()}
              forwardedRef={firstNameInput}
            />

            <Text style={SETTINGS_TITLE}>{translate("profile.lastName")}</Text>

            <TextField
              name="Last Name"
              keyboardType="default"
              value={newLastName}
              onChangeText={(lName) => setNewLast(lName)}
              autoCapitalize="words"
              returnKeyType="next"
              placeholder={lastName}
              placeholderTextColor={colors.dotColor}
              onSubmitEditing={() => phoneInput.current.focus()}
              forwardedRef={lastNameInput}
            />

            <Text style={SETTINGS_TITLE}>{translate("profile.phone")}</Text>

            <TextField
              name="Last Name"
              keyboardType="default"
              value={newPhone}
              onChangeText={(phone) => setNewPhone(phone)}
              autoCapitalize="words"
              returnKeyType="next"
              placeholder={phone}
              placeholderTextColor={colors.dotColor}
              onSubmitEditing={() => Keyboard.dismiss()}
              forwardedRef={phoneInput}
              keyboardType={"phone-pad"}
            />

            <Text style={SETTINGS_TITLE}>{translate("profile.accountNumber")}</Text>

            <TextField
              name="Account Number"
              keyboardType="number-pad"
              value={accountNumber}
              onChangeText={(number) => setAccountNumber(number)}
              autoCapitalize="none"
              returnKeyType="done"
              placeholder={oldAccountNumber}
              placeholderTextColor={colors.dotColor}
              onSubmitEditing={() => Keyboard.dismiss()}
              forwardedRef={accountNumberInput}
            />

            <Text style={SETTINGS_TITLE}>{translate("profile.bankName")}</Text>

            <RNPickerSelect
              items={banks}
              onValueChange={(value) => {
                console.tron.log(value);
                setBankName(value);
                banks.filter((x) =>{
                  if (x.value === value) {
                    console.log('item', x);
                    setbankCode(x.code)
                  }
                })
                // console.log(banks.fil);
                
                // setGasQuantity(1)
              }}
              value={bankName}
              useNativeAndroidPickerStyle={false}
              textInputProps={{
                color: colors.companyDarkGreen,
                fontFamily: fonts.gilroyLight,
              }}
              placeholder={placeholderstate}
            >
              <TextField
                name="Bank Name"
                keyboardType="default"
                value={bankName}
                autoCapitalize="none"
                returnKeyType="done"
                placeholder={oldBankName}
                placeholderTextColor={colors.dotColor}
                onSubmitEditing={() => Keyboard.dismiss()}
                forwardedRef={bankNameInput}
              />
            </RNPickerSelect>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 20,
            }}
          >
            <Button
              style={[EDIT_BUTTON, { backgroundColor: colors.companyDarkGreen }]}
              textStyle={[EDIT_BUTTON_TEXT, { color: colors.white }]}
              onPress={() => saveUser()}
              tx={`profile.save`}
              disabled={loading || isLoading}
              loading={loading || isLoading}
              loadingTextX={"profile.saving"}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  notify: (message: string, type: string) => dispatch(notify(message, type)),
  updateUserProfileAsync: (values: authCredentials) => dispatch(updateUserProfileAsync(values)),
});

let mapStateToProps: (state: ApplicationState) => StateProps;
mapStateToProps = (state: ApplicationState): StateProps => ({
  isLoading: state.auth.loading,
  firstName: state.auth.user.firstName || "",
  lastName: state.auth.user.lastName || "",
  phone: state.auth.user.phone || "",
  userDetails: state.auth.user,
  notificationId: state.auth.notificationId,
  isOnline: state.auth.user.isOnline,
  oldBankName: state.auth.user.bankName,
  oldAccountNumber: state.auth.user.payoutNumber,
});

export const EditProfileScreen = connect<StateProps>(
  // @ts-ignore
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
