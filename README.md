## If you don't have k8s cluster, use terraform in this repo to create a test EKS cluster for order-app.

## If you have a k8s cluster, skip this step.
```bash
cd terraform

aws configure
```
- put AWS Access key ID and AWS Secret access key default region: ap-southeast-2, then run

terraform init

terraform plan

terraform apply -auto-approve

aws eks update-kubeconfig --region ap-southeast-2 --name order-flask-eks

- to test if it is running, 
```bash
kubectl get svc
```        
- if it shows kubernetes ClusterIP service, it's connected.

## use helm install:

- for Dev enviroment:
```bash       
helm install \
orderapp-release orderapp/ \
--values orderapp/values-dev.yaml \
-f orderapp/values-dev.yaml \
--namespace order-dev \
--create-namespace
```
- for Production enviroment:
```bash
helm install \
orderapp-release orderapp/ \
--values orderapp/values-prod.yaml \
-f orderapp/values-prod.yaml \
--namespace order-prod \
--create-namespace
```

- to check service working use port-forwarding
```bash
kubectl port-forward service/backend-svc 8888:80 --namespace order-dev
kubectl port-forward service/backend-svc 8888:80 --namespace order-prod
```
- or go to LoadBalancer to check published service
```bash
kubectl get svc -n order-dev
kubectl get svc -n order-prod
```
- copy EXTERNAL-IP into browser example:
"*************************.ap-southeast-2.elb.amazonaws.com"


## To cleanup:
- for Dev enviroment:
```bash
helm uninstall orderapp-release --namespace order-dev && \
kubectl delete namespace order-dev
```
- for Production enviroment:
```bash        
helm uninstall orderapp-release --namespace order-prod && \
kubectl delete namespace order-prod
```
## To cleanup EKS cluster:
```bash 
cd terraform
terraform destroy
```
