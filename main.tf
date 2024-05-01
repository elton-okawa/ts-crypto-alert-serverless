provider "google" {
  project     = var.project_id
  region      = var.region
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
    // it seems it must adhere to https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
    entry_point = replace(each.value.target, "-", "")
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
  }
}
