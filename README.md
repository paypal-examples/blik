# Paying with Blik or Paypal on the web

<p>
<img src="https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_blik.svg" alt="Blik Logo">
<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width="100px" style="margin-left: 20px" alt="Blik Logo">
</p>


This integration uses the JavaScript SDK to accept Blik payments


See a [hosted version](https://blik-js-sdk.herokuapp.com) of the sample


### How to run locally

Copy the .env.example file into a file named .env

```
cp .env.example .env
```

and configuring your .env config file with your Paypal ClientId and ClientSecret

1. Clone the repo  `git clone git@github.com:paypal-examples/blik-payment.git`
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to `http://localhost:8080/`