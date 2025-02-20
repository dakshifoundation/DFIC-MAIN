

exports.handleGetPaymentInfo= async(paymentId, keyId, keySecret)=>{
    try{
        const URL= `https://api.razorpay.com/v1/payments/${paymentId}`
        const credentials = btoa(`${keyId}:${keySecret}`)

        const response= await fetch(URL, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            }
        })

        if(!response.ok){
            throw new Error(`Error: ${response.status} ${response.statusText}`)
        }

        const paymentData= await response.json()
        return paymentData

    }catch(err){
        console.error("Failed to fetch payment details:", err.message)
        return null
    }
}