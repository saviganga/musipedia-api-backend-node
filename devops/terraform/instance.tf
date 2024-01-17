# provision key 
resource "aws_key_pair" "musipedia-backend-key" {
  key_name   = var.KEY_PAIR_NAME
  public_key = file("${path.module}/pub-keys/${var.PUBLIC_KEY}")
}

# provision security groups
resource "aws_security_group" "app" {
  name        = "app"
  description = "Allow TLS inbound traffic from the internet"

  ingress {
    description      = "Allow TLS inbound traffic from the internet"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  # Rule for HTTPS traffic (port 443)
  ingress {
    description      = "Allow HTTPS inbound traffic from the internet"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "allow ssh access to ec2 instance"
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app"
  }
}

# provision ec2 instance
resource "aws_instance" "musipedia-instance" {
  ami             = var.AMIS[var.REGION]
  instance_type   = "t2.micro"
  key_name        = aws_key_pair.musipedia-backend-key.key_name
  security_groups = [aws_security_group.app.name]

  tags = {
    Name = "musipedia instance"
    User = "saviganga"
  }

  
}


# print out some output
output "public_ip" {
    value = aws_instance.musipedia-instance.public_ip
  }

output "public_dns" {
    value = aws_instance.musipedia-instance.public_dns
  }
