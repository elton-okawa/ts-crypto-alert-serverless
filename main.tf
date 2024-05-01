provider "google" {
  project     = var.project_id
  region      = var.region
}

resource "google_storage_bucket" "default" {
  name                        = var.bucket
  location                    = "us-east1"
  uniform_bucket_level_access = true
}

data "archive_file" "default" {
  type        = "zip"
  output_path = "/tmp/function-source.zip"
  source_dir  = var.source_filepath
}

resource "google_storage_bucket_object" "object" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.default.name
  source = data.archive_file.default.output_path 
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
        bucket = google_storage_bucket.default.name
        object = google_storage_bucket_object.object.name 
      }
    }
  }

  service_config {
    max_instance_count  = 1
    available_memory    = "256M"
    timeout_seconds     = 60
  }
}
