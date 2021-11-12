var order = {
  purchase_units: [
    {
      amount: {
        currency_code: "PLN",
        value: "99.99",
      },
    },
  ],
};

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render("#paypal-mark");

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder(data, actions) {
      return actions.order.create(order);
    },
    onApprove(data, actions) {
      return actions.order.capture().then(function (details) {
        alert(`Transaction completed by ${details.payer.name.given_name}!`);
      });
    },
  })
  .render("#paypal-btn");

/* Blik */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.BLIK,
  })
  .render("#blik-mark");

paypal
  .PaymentFields({
    fundingSource: paypal.FUNDING.BLIK,
    style: {},
    fields: {
      name: {
        value: "",
      },
    },
  })
  .render("#blik-container");

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.BLIK,
    style: {
      label: "pay",
    },
    createOrder(data, actions) {
      return actions.order.create(order);
    },
    onApprove(data, actions) {
      fetch(`/capture/${data.orderID}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal(
            "Order Captured!",
            `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
              data.purchase_units[0].payments.captures[0].amount.currency_code
            } ${data.purchase_units[0].payments.captures[0].amount.value}`,
            "success"
          );
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render("#blik-btn");

document.getElementById("blik-btn").style.display = "none";
document.getElementById("blik-container").style.display = "none";

// Listen for changes to the radio buttons
document.querySelectorAll("input[name=payment-option]").forEach((el) => {
  // handle button toggles
  el.addEventListener("change", (event) => {
    switch (event.target.value) {
      case "paypal":
        document.getElementById("blik-container").style.display = "none";
        document.getElementById("blik-btn").style.display = "none";

        document.getElementById("paypal-btn").style.display = "block";

        break;
      case "blik":
        document.getElementById("blik-container").style.display = "block";
        document.getElementById("blik-btn").style.display = "block";

        document.getElementById("paypal-btn").style.display = "none";
        break;

      default:
        break;
    }
  });
});



