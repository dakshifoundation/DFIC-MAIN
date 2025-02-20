const Razorpay = require('razorpay')
const crypto= require('crypto')
const logger= require('../services/logging.winston.js')
const { createRazorpayInstance }  = require('../services/razorpayIntegration.js')
const { appendDataToDonorSheet }= require('../services/donorFormData.js')
const Payment= require('../models/donationCertificateSchema.js')
const { getPaymentDetails, handleGetPaymentInfo }= require('../services/miscellaneousServices')

let RazorpayInstance
const RzInstance=(async () => {
  RazorpayInstance = await createRazorpayInstance();    // Await for the instance to be created
})
RzInstance()


exports.createOrder= async(req,res)=>{
 try{
     const { Donation }= req.body
     const options ={
        amount: Donation * 100,
        currency: "INR"
     }
     try{
         const order= await RazorpayInstance.orders.create(options);
         if(order){
            console.log("Order Created Successfully.")
            logger.apiLogger.log('info','Order Created SuccessFully.')
            return res.status(200).json({success: true, order:order });
         }
     }catch(err){
        console.log("Error in creating Order",err)
        logger.apiLogger.log('error',`Error in creating Order.${err}`)
        return res.status(500).json({success: false, msg: "Internal Server Error"})
     }

 }catch(err){
    console.log(err)
    res.status(500).json({success: false,msg: "Internal Server Error"})
 }
}



exports.verifyPayment= async (req,res)=>{
  try{
      const { order_id, payment_id, signature, data}= req.body
      const { Name, Mobile_No, Email, Address, AdharId, Donation, Toward, Remark }=data
       
      const key= "rzp_test_bVnwqq5GvuvOi4"
      const secret= 'qvBOBp0ErsczSBd6CkNhXSi8'

      if ( !order_id || !payment_id || !signature ) {
        return res.status(400).json({ success: false, msg: "Missing required parameters." });
      }

      const hmac= crypto.createHmac("sha256", secret)
      hmac.update(order_id+ '|' + payment_id)
      const generatedSignature= hmac.digest("hex")
      
      if(generatedSignature===signature){
          console.log("Payment Successfull.")
           
          if(  !Name || !Mobile_No || !Email || !Address  || !AdharId || !Donation || !payment_id){
            return res.status(400).json({ success: false, msg: "Provide all data about user" });
          }
          
          try{
              try{
                  const paymentData= await handleGetPaymentInfo(payment_id, key, secret)
                  const certificate_id= `Dakshi-`+crypto.randomBytes(4).toString('hex')
                  const URL= `https://dakshifoundation.s3.ap-south-1.amazonaws.com/donation/${certificate_id}.pdf`
    
                  const paymentDetails = {
                    name: Name,
                    mobileNo: Mobile_No,
                    email: Email,
                    address: Address,
                    payment_id: payment_id,
                    donation: Donation,
                    modeOfDonation: paymentData.method, 
                    certificateId: certificate_id,
                    certificateUrl: URL,
                    emailSent: false,
                    toward: Toward
                  }
                 const payment = await Payment.create(paymentDetails)
                 console.log("Data saved in DB")

              }catch(err){
                 console.error("Error in Data saving into DataBase", err)
              }
              
              const statusCode= await appendDataToDonorSheet( Name, payment_id, Mobile_No, Email, Address, AdharId, Donation, Toward, Remark )
                if(statusCode===200){
                  const returnData= { Name, payment_id, Mobile_No, Email, Address, AdharId, Donation, Toward, Remark }
                  logger.apiLogger.log('info','Donor Data submitted successfully.')
                  return res.status(200).json({sucess: true, msg: "Payment verified", DATA: returnData})         
                }else{
                  console,log("status code: ", statusCode)
                  logger.apiLogger.log('info','Problem in submitting Partner Data.')
                }

          }catch(err){
               console.log("Error in savinf data in form",err)
          }   

      }else{
          return res.status(400).json({success: false, msg: "Payment failed."})
      }

  }catch(err){
      console.log("Error in payment varification API.",err)
      logger.apiLogger.log('error',`Error in Payment verification.${err}`)
      return res.status(500).json({ success: false, msg: "Internal Server Error"})
  }     
}