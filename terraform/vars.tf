variable "REGION" {
  default = "us-east-1"
}

variable "KEY_NAME" {
  default = "musipedia-backend-key"
}

variable "PUBLIC_KEY" {
  type    = string
  default = "musipedia-backend.pub"
}

variable "KEY_PAIR_NAME" {
  type    = string
  default = "musipedia-backend"
}

variable "PRIVATE_KEY" {
  type    = string
  default = "musipedia-backend"

}