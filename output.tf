output "functions_uri" { 
  value = [
    for function in google_cloudfunctions2_function.function: function.service_config[0].uri
  ]
}