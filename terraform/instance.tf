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

resource "aws_security_group" "app_ssh" {
  name        = "app_ssh-sg"
  description = "Allow ssh inbound traffic"

  ingress {
    description      = "allow ssh access to ec2 instance"
    from_port        = 0
    to_port          = 0
    protocol         = -1
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
    Name = "app_ssh"
  }
}

# provision ec2 instance
resource "aws_instance" "musipedia-instance" {
  ami             = var.AMIS[var.REGION]
  instance_type   = "t2.micro"
  key_name        = aws_key_pair.musipedia-backend-key.key_name
  security_groups = [aws_security_group.app_ssh.name, aws_security_group.app.name]

  # create a connection to the ec2 instance to run provisioner commands
  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = self.public_ip
    private_key = file("${path.module}/public-keys/${var.PRIVATE_KEY}")
  }

  ## provisioner to install ansible on the ec2 instance :
  provisioner "file" {
    source      = "${path.module}/scripts/${var.INSTALL_NODE_UBUNTU}"
    destination = "/tmp/install-node.sh"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo chmod u+x /tmp/install-node.sh",
      "/tmp/install-node.sh",
    ]
  }

  tags = {
    Name = "musipedia instance"
    User = "saviganga"
  }
}
