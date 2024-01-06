# provision key 
resource "aws_key_pair" "musipedia-backend-key" {
  key_name   = var.KEY_PAIR_NAME
  public_key = file("${path.module}/public-keys/${var.PUBLIC_KEY}")
}

# provision security groups


resource "aws_security_group" "elb" {
  name        = "elastic-load-balancer"
  description = "Allow TLS inbound traffic from the internet"

  ingress {
    description      = "Allow TLS inbound traffic from the internet"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "elastic-load-balancer"
  }
}

resource "aws_security_group" "app" {
  name        = "app"
  description = "Allow TLS inbound traffic from the elastic load balancer"

  ingress {
    description      = "Allow TLS inbound traffic from the elastic load balancer"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    security_groups      = [aws_security_group.elb.id]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "app"
  }
}


