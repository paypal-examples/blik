const { NODE_ENV, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const isProd = NODE_ENV === "production";

const PAYPAL_API_BASE = isProd
  ? "https://api.paypal.com"
  : "https://api.sandbox.paypal.com";


module.exports = {
  isProd,
  PAYPAL_API_BASE,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
};
