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
      MAILJET_API_KEY = var.mailjet_api_key
      MAILJET_SECRET_KEY = var.mailjet_secret_key
      MAILJET_MAIL_TO = var.mailjet_mail_to
      MAILJET_MAIL_FROM = var.mailjet_mail_from
    }
  }
}
