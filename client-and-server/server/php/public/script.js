// Create a Checkout Session with the selected plan ID
var createCheckoutSession = function(priceId) {
  return fetch("/create-checkout-session.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      priceId: priceId
    })
  }).then(function(result) {
    return result.json();
  });
};

// Handle any errors returned from Checkout
var handleResult = function(result) {
  if (result.error) {
    var displayError = document.getElementById("error-message");
    displayError.textContent = result.error.message;
  }
};

/* Get your Stripe publishable key to initialize Stripe.js */
fetch("/config.php")
  .then(function(result) {
    return result.json();
  })
  .then(function(json) {
    var publishableKey = json.publishableKey;
    var memberPriceId = json.memberPrice;

    var stripe = Stripe(publishableKey);

    // Setup event handler to create a Checkout Session when button is clicked
    document
      .getElementById("membership-btn")
      .addEventListener("click", function(evt) {
        createCheckoutSession(memberPriceId).then(function(data) {
          // Call Stripe.js method to redirect to the new Checkout page
          stripe
            .redirectToCheckout({
              sessionId: data.sessionId
            })
            .then(handleResult);
        });
      });
  });
