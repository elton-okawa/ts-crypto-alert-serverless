project_id = "crypto-alert-421018"
bucket = "crypto-alert-serverless-gcf-source"
functions = [ {
  target: "sendAlert"
  description: "Send alerts on Discord"
}, {
  target: "updateHistoricalPrices"
  description = "Update historical prices if not present"
}, {
  target: "updatePrices"
  description: "Fetch latest price"
}]