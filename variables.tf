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
  description = "Google Function source's filepath in current machine"
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