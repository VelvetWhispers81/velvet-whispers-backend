
// --- REQUIRED IMPORTS ---
const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// --- RAW BODY FOR STRIPE WEBHOOKS ---
app.use(
  "/webhook",
  express.raw({ type: "application/json" })
);

// --- NORMAL JSON FOR EVERYTHING ELSE ---
app.use(express.json());

// --- STRIPE WEBHOOK ROUTE ---
app.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("✅ Stripe event received:", event.type);

  // --- HANDLE EVENTS ---
  switch (event.type) {
    case "checkout.session.completed":
      console.log("💰 Checkout completed");
      break;

    case "invoice.payment_succeeded":
      console.log("🎉 Payment succeeded");
      break;

    case "customer.subscription.created":
      console.log("📦 Subscription created");
      break;

    case "customer.subscription.updated":
      console.log("🔄 Subscription updated");
      break;

    case "customer.subscription.deleted":
      console.log("❌ Subscription canceled");
      break;

    default:
      console.log("Unhandled event:", event.type);
  }

  res.status(200).send("OK");
});

// --- START SERVER ---
app.listen
