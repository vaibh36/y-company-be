const express = require("express");
const Stripe = require("stripe");
const app = express();
const port = 3001;
const cors = require("cors");
const bodyParser = require("body-parser"); // Required for Express versions below 4.16.0

const stripe = new Stripe(
  "sk_test_51MQ3YASHdhwdgbtqV0I54pAFtOGsMNvtguNSjIKr1CJyqNPBiA3MynqQjzf3nCQ69zg3bmHqaPKRGOTuDpWTmh6k00OMjIGqtb"
);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin,X-Requested-With, Content-Type,Accept"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );

  next();
});

// Define a simple GET route
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Node.js API!, this is vaibhav here" });
});

app.post("/api/checkout-sessions", async (req, res) => {
  const itemMetadata = req?.body?.items;
  console.log("item meta data is:-", itemMetadata);
  //   res.status(200).json({
  //     message: "This is the post api",
  //   });
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["IN"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "inr" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      payment_method_types: ["card"],
      line_items: req.body?.items,
      success_url: `${req.headers.origin}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}`,
    });
    res.status(200).json(session);
  } catch (e) {
    console.log("error here is:-", e);
    res.status(500).json({
      statusCode: 500,
      message: e.messages,
    });
  }
});
