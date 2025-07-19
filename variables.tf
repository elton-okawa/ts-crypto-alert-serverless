variable "project_id" {
  description = "Google Cloud Project id"
  type = string
}

variable "region" {
  description = "Google Cloud region"
  type = string
  default = "us-east1"
}

variable "bucket" {
  description = "Google Cloud Storage bucket's name"
  type        = string
}

variable "source_filepath" {
  description = "Google Function source's filepath in bucket"
  type        = string
}

variable "runtime" {
  description = "Nodejs runtime version"
  type = string
  default = "nodejs20"
}

variable "functions" {
  description = "Functions' target"
  type = list(object({
    target = string
    description = string
  }))
  default = []
}

variable "binance_api_url" {
  description = "Binance API URL"
  type = string
}

variable "mailjet_mail_to" {
  description = "Mailjet mail to"
  type = string
}

variable "mailjet_mail_from" {
  description = "Mailjet mail from"
  type = string
}

// Secrets - ideally should be secrets but Secret Manager does not have free tier
variable "database_url" {
  description = "MongoDB Database URL"
  type = string
}

variable "discord_bot_token" {
  description = "Discord bot token"
  type = string
}

variable "discord_channel_id" {
  description = "Discord channel ID"
  type = string
}

variable "mailjet_api_key" {
  description = "Mailjet API key"
  type = string
}

variable "mailjet_secret_key" {
  description = "Mailjet secret key"
  type = string
}
