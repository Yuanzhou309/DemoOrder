If you don't have k8s cluster, use terraform in this repo to create a test EKS cluster for order-app.

If you have a k8s cluster, skip this step.

    1.  cd terraform

        aws configure

        # put AWS Access key ID and AWS Secret access key default region: ap-southeast-2

        terraform init

        terraform plan

        terraform apply -auto-approve

        aws eks update-kubeconfig --region ap-southeast-2 --name order-flask-eks

        # to test if it is running, 

        kubectl get svc
        
        # if it shows kubernetes ClusterIP service, it's connected.

    2. use helm install:

        #for Dev enviroment:
            helm install \
            orderapp-release orderapp/ \
            --values orderapp/values-dev.yaml \
            -f orderapp/values-dev.yaml \
            --namespace order-dev \
            --create-namespace

        #for Production enviroment:
            helm install \
            orderapp-release orderapp/ \
            --values orderapp/values-prod.yaml \
            -f orderapp/values-prod.yaml \
            --namespace order-prod \
            --create-namespace

        #To cleanup:

        #for Dev enviroment:
            helm uninstall orderapp-release --namespace order-dev && \
            kubectl delete namespace order-dev

        #for Production enviroment:
            helm uninstall orderapp-release --namespace order-prod && \
            kubectl delete namespace order-prod

