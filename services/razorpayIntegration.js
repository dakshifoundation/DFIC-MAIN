const razorpay= require('razorpay')


exports.createRazorpayInstance= async ()=>{
  try{
      const RazorpayInstance= new razorpay({
         key_id: 'rzpzp_test_fake_hai_bhavnwqq5aaGvuvOi44',
         key_secret: 'qvBzp_test_i4kNhi_bhavnwqq5aaGvuvOi4kNhXSi8'
      })
      return RazorpayInstance
  }catch(err){
      console.log("Error in creating Razorpay Instance.",err)
  }
}

// key : qvBOBp0ErsczSBd6CkNhXSi8
