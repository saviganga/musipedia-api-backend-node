# MUSIPEDIA NODE BACKEND

Wagwan,
Welcome to Musipedia Node Backend! This project is part of the DevOps Challenge Series, promising more updates and magic as we go along.

# HOLD UP! 🚨🎩✨
- Usually, I make things a breeze with one-click magic scripts. But, I'm learning to make Terraform and Ansible dance seamlessly. Stay tuned for the magic!

- use env.example file to fill up your .env in the root directory, and './devops/ansible/' directory

-🚨 Remember to run 'terrafoorm destroy' in the terraform directory to destroy the provisioned infrastructure. Unless you're RICH RICH, then you can leave them running 🚨

This project showcases:
- Terraform: Builds rock-solid infrastructure.
- Ansible: Tweaks the OS with finesse.
- A smooth blend of a node.js app with MongoDB.
- All dancing in the clouds of AWS.

# COOKING INGREDIENTS 🛠️
1. terraform
2. ansible
3. nodejs
4. aws
5. mongoDB

# YOUR GUIDE 📂
1. api/: this folder contains the nodejs application api

2. devops/: the Terraform and Ansible dream team.
    - terraform/
        - provider.tf: contains the cloud service provider to be provisioned by terraform
        - vars.tf: contains variables to be used across terraform deployment
        - instance.tf: contains terraform cloud resource provisioning script. This configuration file provisions:
            - an aws key pair for remote ssh connections to the configured instance
            - an aws security group that serves as a firewall for the created instance
            - an aws ec2 instance
    
    - ansible/
        - playbooks/
            - syspackages.yml: ansible playbook to update apt packages on the provisioned ec2 instance
            - clonerepo.yml: ansible playbook to clone the application repository from github to the provisioned instance. This playbook performs the following tasks:
                - authenticates with github
                - clones the application repository
                - installs npm packages
            - startapp.yml: ansible playbook to start the application on the provisioned instance


# STEPS

- TERRAFORM

1. navigate to './devops/terraform/' directory
2. run 'aws configure' in your terminal for authentication
3. ensure vars.tf file contains appropriate values for the variables
4. run 'terraform plan' to get a sneak peek of what your configuration files will provision
5. run 'terraform apply' to provision infrastructure. (add '-auto-approve' flag to bypass the prompt)
6. take note of the outputs
    - public_dns
    - public_ip


- ANSIBLE

1. navigate to './devops/ansible/' directory
2. update the inventory file's 'ansible_host' variable with the 'public_ip' gotten from the terraform configuration
3. REMEMBER TO CREATE YOUR '.env' FILE USING THE 'env.example' FILE
4. run the playblooks:
    - ansible-playbook -i inventory playbooks/syspackages.yml 
    - ansible-playbook -i inventory playbooks/clonerepo.yml 
    - ansible-playbook -i inventory playbooks/startapp.yml 

