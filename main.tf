provider "google" {
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_tasks_queue" "task" {
  for_each = {
    for index, function in var.functions:
    function.target => function
  }
  name = "crypto-${each.value.target}-queue"
  location = var.region

  rate_limits {
    max_concurrent_dispatches = 1
    max_dispatches_per_second = 10
  }

  retry_config {
    max_attempts = 3
  }
}

resource "google_cloudfunctions2_function" "function" {
  for_each = {
    for index, function in var.functions:
    function.target => function
  }
  name = each.value.target
  location = var.region
  description = each.value.description

  build_config {
    runtime = var.runtime
    entry_point = each.value.target
    source {
      storage_source {
        bucket = var.bucket
        object = var.source_filepath 
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
    environment_variables = {
      BINANCE_API_URL = var.binance_api_url
      DATABASE_NAME = "crypto-alert"
      DATABASE_URL = var.database_url
      DISCORD_BOT_TOKEN = var.discord_bot_token
      DISCORD_CHANNEL_ID = var.discord_channel_id
      SENDGRID_API_KEY = var.sendgrid_api_key
      SENDGRID_MAIL_TO = var.sendgrid_mail_to
      SENDGRID_MAIL_FROM = var.sendgrid_mail_from
      SENDGRID_TEMPLATE_ID_CRYPTO_ALERT = var.sendgrid_template_id_crypto_alert
    }
  }
}
