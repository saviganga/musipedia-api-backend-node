variable "REGION" {
  default = "us-east-1"
}

variable "KEY_NAME" {
  default = "musipedia-backend-key"
}

variable "PUBLIC_KEY" {
  type    = string
  default = "mb.pub"
}

variable "KEY_PAIR_NAME" {
  type    = string
  default = "musipedia-backend"
}

variable "PRIVATE_KEY" {
  type    = string
  default = "musipedia-backend"

}


variable "AMIS" {
  type = map(any)
  default = {
    us-east-1 = "ami-0c7217cdde317cfec"
  }
}

