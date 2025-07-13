export const ORDER_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Order Confirmation</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      color: #22D172;
      text-align: center;
      margin-bottom: 20px;
    }
    .details {
      font-size: 14px;
      color: #333;
      margin-bottom: 20px;
    }
    .footer {
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🎉 Order Confirmed!</div>
    <div class="details">
      Hello {{name}},<br><br>
      Your order has been successfully placed. We are now preparing it for shipping.<br><br>
      <strong>Order ID:</strong> {{orderId}}<br>
      <strong>Amount:</strong> ₹{{amount}}<br>
      <strong>Payment Method:</strong> {{paymentMethod}}<br><br>
      Thank you for shopping with us! 😊
    </div>
    <div class="footer">
      If you have any questions, reply to this email.
    </div>
  </div>
</body>
</html>
`
