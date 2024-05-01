project_id = "crypto-alert-421018"
bucket = "crypto-alert-serverless-gcf-source"
functions = [ {
  target: "send-alert"
  description: "Send alerts on Discord"
}, {
  target: "update-historical-prices"
  description = "Update historical prices if not present"
}, {
  target: "update-prices"
  description: "Fetch latest price"
}]