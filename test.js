const validate=async()=>{
  
    try {
        setLoading(true) 

        const payLoad={
            code:code
        }

        const info= await AsyncStorage.getItem('user');
        console.warn('userDetails',info)
        const userInfo=JSON.parse(info)
        console.warn('Payload>>',payLoad)
      
        console.warn('userDetails >>>>333token',userDetails.token)
        let res = await axios({
          method: 'POST',
          url: `https://cydene-admin-prod.herokuapp.com/api/agent/validate-code`,
          data:payLoad,
          headers: {
            Authorization:`Bearer ${userDetails.token}`,
          },
  
        });
        if (res) {
          console.warn('success>>>',res.data.date)

         

          console.warn('success>>> date from now',moment(res.data.date).fromNow())

          console.warn('success>>> Time>>>', moment(res.data.date, "HH:mm:ss").format("hh:mm A"))

        // setToggle(true)
        // setDetails(res.data)
          setLoading(false) 
        }

        
      } catch (err) {
        setLoading(false)
        setShowModal(false)
        console.warn('call err>>>>>>>>>>>>>', err);
if(err.response){
  setErrorModal(true)
  console.warn('call err>>>>>>>>>>>>>222', err.response);
  setErrorMessage(err.response.data.message)
  Toast.show(`${err.response.data.message}`, Toast.LONG);j  
}

        
      }

 }