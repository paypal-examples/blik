const order = {
  purchase_units: [
    {
      amount: {
        currency_code: 'PLN',
        value: '49.11',
      },
    },
  ],
  application_context: {
    return_url: `${window.location.origin}/success.html`,
    cancel_url: `${window.location.origin}/cancel.html`,
  },
}

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render('#paypal-mark')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder(data, actions) {
      return actions.order.create(order)
    },
    onApprove(data, actions) {
      return actions.order.capture().then(function(details) {
        alert(`Transaction completed by ${details.payer.name.given_name}!`)
      })
    },
  })
  .render('#paypal-btn')

/* Blik */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.BLIK,
  })
  .render('#blik-mark')

paypal
  .Fields({
    fundingSource: paypal.FUNDING.BLIK,
    style: {
      base: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        lineHeight: '1.4',
        letterSpacing: '0.3',
      },
      input: {
        backgroundColor: 'white',
        fontSize: '16px',
        color: '#333',
        borderColor: '#dbdbdb',
        borderRadius: '4px',
        borderWidth: '1px',
        padding: '1rem',
      },
      invalid: {
        color: 'red',
      },
      active: {
        color: 'black',
      },
    },
    fields: {
      name: {
        value: '',
        hidden: false,
      },
    },
  })
  .render('#blik-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.BLIK,
    upgradeLSAT: true,
    style: {
      label: 'pay',
    },
    onApprove(data, actions) {
      fetch(`/capture/${data.orderID}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          swal("Order Captured!", `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${data.purchase_units[0].payments.captures[0].amount.currency_code} ${data.purchase_units[0].payments.captures[0].amount.value}`, "success");
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      console.log(data)
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render('#blik-btn')

// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('blik-container').style.display = 'none'
        document.getElementById('blik-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'blik':
        document.getElementById('blik-container').style.display = 'block'
        document.getElementById('blik-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})

document.getElementById('blik-container').style.display = 'none'
document.getElementById('blik-btn').style.display = 'none'
