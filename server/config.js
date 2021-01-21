const { NODE_ENV, CLIENT_ID, CLIENT_SECRET } = process.env;

const isProd = NODE_ENV === "production";

const PAYPAL_API_BASE = isProd
  ? "https://api.paypal.com"
  : "https://api.sandbox.paypal.com";


module.exports = {
  isProd,
  PAYPAL_API_BASE,
  CLIENT_ID,
  CLIENT_SECRET,
};
