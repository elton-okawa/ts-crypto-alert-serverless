terraform {
  cloud {
    organization = "always-remember"

    workspaces {
      name = "ts-crypto-alert-serverless"
    }
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.30.0"
    }
  }

  required_version = ">= 1.8"
}
