const CryptoJS = require('crypto-js');
const secretKey = "8gBm/:&EnhH.1/q";
const fs  = require('fs');
const epayUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
let buyerId;
const path  = require('path');
const {Cart} = require('./cart');
const directoryPath = path.join(__dirname,'paymentSucces.html');
const pay=async(req, res) => {
    console.log(req.body);
    const {
      amount,
      taxAmount,
      totalAmount,
      transactionUuid, 
      productCode,
      productServiceCharge,
      productDeliveryCharge,
      successUrl,
      failureUrl,
    userId
    } = req.body;
    console.log("enter in the payment");
    console.log(req.body);
     buyerId = userId;
    // Generate HMAC signature
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const dataToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    console.log("the data to sign"+dataToSign);
    const hash = CryptoJS.HmacSHA256(dataToSign, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    // Redirect user to eSewa payment page
    res.send(`
      <form id="epayForm" action="${epayUrl}" method="POST">
        <input type="hidden" name= "amount" value="${amount}" />
        <input type="hidden" name="failure_url" value="${failureUrl}" />
        <input type="hidden" name="product_delivery_charge" value=${productDeliveryCharge} >
        <input type="hidden" name="product_service_charge" value=${productServiceCharge} >
        <input type="hidden" name="signature" value="${signature}" />
        <input type="hidden" name="signed_field_names" value="${signedFieldNames}" />
        <input type="hidden" name="tax_amount" value="${taxAmount}" />
        <input type="hidden" name="product_code" value="${productCode}" />
        <input type="hidden" name="total_amount" value="${totalAmount}" />
        <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
        <input type="hidden" name="success_url" value="${successUrl}" />
      </form>
      <script>document.getElementById('epayForm').submit();</script>
    `);
  };
   
  // Endpoint to handle the GET request
  
  

  const failure=(req, res) => {
    console.log("enter");
    res.send('Payment Failed');
  };

   
    const success= async(req, res) => {
    
      const data = req.query.data;
   if (data) {
       
                   try {
                         const decodedData = Buffer.from(data, 'base64').toString('utf-8');//it generate json object
                         const jsonData = JSON.parse(decodedData)//conver in normal object;
                         const {total_amount,transaction_uuid,product_code}=jsonData;
                         const amountWithoutComma = parseInt(total_amount.replace(/,/g, ""));
                         const dataToVerify = `total_amount=${amountWithoutComma},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
                          console.log(dataToVerify);
                          const hash = CryptoJS.HmacSHA256(dataToVerify, secretKey);
                          const generatedSignature = CryptoJS.enc.Base64.stringify(hash);
          
                          if (true) {
                
                            let  deleteInfo;
                            try{ deleteInfo = await Cart.deleteMany({buyerId:buyerId}); }
                            catch(err)
                            { console.log(err);}
                            if(true)
                            {
                                fs.readFile(directoryPath,(err,data)=>{
                                   console.log("the red file data");
                                   console.log(data);
                                   if(err)
                                   { console.log(err);}
                                   else 
                                   { res.send(data);
                                     res.end;
                                   }
                          
                                 })
                            }   
                           }   
                          else {
                              res.send('Invalid Signature');
                             }
                   }        
                  catch (err)
                  {
                      console.error('Error decoding or parsing data:', err.message);
                      res.status(400).send('Invalid data format.');
                  }
          }
          
        else
            {
              res.status(400).send('No data provided.');
             }
    }
  module.exports={
    pay,
    success,
    failure

  }
  