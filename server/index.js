const express = require("express");
const { resolve } = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const { getAccessToken } = require("./oauth");
const { PAYPAL_API_BASE } = require("./config");

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(resolve(__dirname, "../client")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "../client/index.html"));
});

/**
 * Webhook handlers.
 */
app.post("/webhook", async (req, res) => {
  const { access_token } = await getAccessToken();

  const { id, event_type, resource } = req.body;
  const orderId = resource.id;

  console.log(`🪝 Recieved Webhook Event`);

  /* verify the webhook signature */

  /* ** skip ** validation while endpoint gets looked at
  {
    "name": "VALIDATION_ERROR",
    "message": "Invalid request - see details",
    "debug_id": "924631cb4acbe",
    "details": [{
        "field": "webhookId",
        "value": "WH-64G99887NT8468436-37R34875Y77436504",
        "location": "body",
        "issue": "must match \"^[a-zA-Z0-9]+$\""
    }],
    "links": []
  }
  */

  /*
  try {
    const { data } = await axios({
      url: `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: {
        transmission_id: req.headers["paypal-transmission-id"],
        transmission_time: req.headers["paypal-transmission-time"],
        cert_url: req.headers["paypal-cert-url"],
        auth_algo: req.headers["paypal-auth-algo"],
        transmission_sig: req.headers["paypal-transmission-sig"],
        webhook_id: id,
        webhook_event: req.body,
      },
    });
    const { verification_status } = data;
    if (verification_status !== "SUCCESS") {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    return res.sendStatus(400);
  }
  */

  /* capture the order if approved */
  if (event_type === "CHECKOUT.ORDER.APPROVED") {
    try {
      const { data } = await axios({
        url: `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log(`💰 Payment captured!`);
    } catch (err) {
      console.log(`❌ Payment failed.`);
      return res.sendStatus(400);
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});