provider "google" {
  project     = var.project_id
  region      = var.region
}

resource "google_storage_bucket_object" "object" {
  name   = "function-source.zip"
  bucket = var.bucket
  source = var.source_filepath
}

resource "google_cloudfunctions2_function" "function" {
  for_each = {
    for index, function in var.functions:
    function.target => function
  }
  name = "function-v2"
  location = var.region
  description = each.value.description

  build_config {
    runtime = var.runtime
    entry_point = each.value.target
    source {
      storage_source {
        bucket = var.bucket
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
