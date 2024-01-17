# MUSIPEDIA NODE BACKEND

# Terraform Deployment

This terraform deployment deploys the musipedia backend to AWS. It provisions EC2 instances to house servers, an ELB for load balancing, and an ASG to handle automatic scaling of the apllication.

1. Login to AWS using 'aws configure'
2. setup variables in vars.tf file
3. declare your cloud provider (AWS) 