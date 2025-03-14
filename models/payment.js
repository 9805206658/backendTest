const CryptoJS = require('crypto-js');
const secretKey = "8gBm/:&EnhH.1/q";
const epayUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

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
      failureUrl
    } = req.body;
  
    // Generate HMAC signature
    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const dataToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hash = CryptoJS.HmacSHA256(dataToSign, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    console.log("enter");
  
    // Redirect user to eSewa payment page
    res.send(`
      <form id="epayForm" action="${epayUrl}" method="POST">
        <input type="hidden" name= "amount" value="100" />
        <input type="hidden" name="failure_url" value="${failureUrl}" />
        <input type="hidden" name="product_delivery_charge" value=${productDeliveryCharge} >
        <input type="hidden" name="product_service_charge" value=${productServiceCharge} >
        <input type="hidden" name="product_code" value="${productCode}" />
        <input type="hidden" name="signature" value="${signature}" />
        <input type="hidden" name="signed_field_names" value="${signedFieldNames}" />
        <input type="hidden" name="tax_amount" value="100" />
        <input type="hidden" name="total_amount" value="${totalAmount}" />
        <input type="hidden" name="transaction_uuid" value="${transactionUuid}" />
        <input type="hidden" name="success_url" value="${successUrl}" />
      </form>
      <script>document.getElementById('epayForm').submit();</script>
    `);
  };
   
  // Endpoint to handle the GET request
  const success=()=>(req, res) => {
    // Retrieve query parameters
    const data = req.query.data;
    console.log(data);
  
    if (data) {
      // Decode Base64 and parse JSON
      try {
   const decodedData = Buffer.from(data, 'base64').toString('utf-8');
   const jsonData = JSON.parse(decodedData);
   console.log(jsonData);
   console.log('Decoded Data:', jsonData);
    const dataToVerify =jsonData.signed_field_names
      .split(',')
      .map((field) => `${field}=${jsonData[field]}`)
      .join(',');
  
    const hash = CryptoJS.HmacSHA256(dataToVerify, secretKey);
    const generatedSignature = CryptoJS.enc.Base64.stringify(hash);
  
    if (generatedSignature == jsonData.signature) {
    res.send(`
        <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <!-- Font Awesome 6 (Latest) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  </head>
  <style>
      .epayForm
      {   
          display:flex; 
          border-radius:50px;
          flex-direction: column;
          row-gap: 10px;
          justify-content: center;
          align-items: center;
          width:20vw; 
          /* border:3px solid blue; */
          background-color:rgba(128, 128, 128, 0.247);
          padding:30px 30px;
        
      }
      .success_title
      {
          color:green;
          text-shadow:3px 2px 2px  yellow;
         font-weight:bold;
      }
      #success_logo
      {
          
          color:rgba(0, 0, 0, 0.63);
          text-shadow:3px 2px 15px  blue;
          font-size:90px;
      }
      .epayForm_container
      {
          display: flex;
          height:95vh;
          justify-content: center;
          align-items: center;
          /* background-color: rgba(255, 255, 0, 0.205); */
          /* border:3px solid red; */
      }
      .form_info
      {
          border-top:dashed;
          border-bottom: dashed; 
          width:15vw;
          padding:20px 20px;
      }
      .form_title
      {
          color:black;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
      }
      .form_title .payment_title
      {
          color:rgba(0, 0, 255, 0.61);
      }
      .btn_item
  {
      /* width:120px; */
      /* height:50px; */
      font-size:20px;
      padding:10px 10px ;
      border-radius:10px;
      border:none;
      background-color:rgba(0, 255, 64, 0.89);
      color:red;
      font-weight:bold;
  }
  </style>
  <body>
   <div class = "epayForm_container" >
      <div class = "epayForm">
          <i  id = "success_logo" class="fa-solid fa-circle-check"></i>
        <h2 class = "success_title">Payment Successfull</h2>
      <div class = "form_info">
          <div class="form_title"><span class = "payment_title">Transaction code</span>${jsonData.transaction_code}</div>
         <div class="form_title"><span class= "payment_title">status</span>Scucessful payment</div>
         <div class="form_title"><span class= "payment_title">Total Amount</span>${jsonData.total_amount}</div>
         <div class="form_title"><span class = "payment_title">Transacton UId:</span>${jsonData.transaction_uuid}</div>
         <div class="form_title"> <span class = "payment_title">Product Code </span>${jsonData.product_code} </div>  
      </div>
      <button id="goHm" class="btn_item">Go To Home</button>
   </div>
  </div>
  <script>
      document.addEventListener("DOMContentLoaded", () => {
          let gohm = document.getElementById("goHm");
          gohm.addEventListener("click", () => {
            //   alert("Hello");
              window.location.replace("http://127.0.0.1:5502/fontend/home.html");
          });
      });
  </script>
  
  </body>
  </html>
       
      `);
    
      // res.redirect('http://127.0.0.1:5502/fontend/home.html');
    } else {
      res.send('Invalid Signature');
    }
       } catch (err) {
        console.error('Error decoding or parsing data:', err.message);
        res.status(400).send('Invalid data format.');
      }
    } else {
      res.status(400).send('No data provided.');
    }
  }
  ;
  

  const failure=(req, res) => {
    res.send('Payment Failed');
  };

  module.exports={
    pay,
    success,
    failure

  }
  