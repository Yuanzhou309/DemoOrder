# This is just an example, all secrets should be injected in safer way.

## IF you don't have k8s cluster, use terraform in this repo to create a test EKS cluster for order-app.

## IF you have a k8s cluster, skip this step.
```bash
cd terraform

aws configure
```
- Put AWS Access key ID and AWS Secret access key default region: ap-southeast-2, then run
```bash
terraform init

terraform plan

terraform apply -auto-approve

aws eks update-kubeconfig --region ap-southeast-2 --name order-flask-eks
```
- To test if it is running, 
```bash
kubectl get svc
```        
- IF it shows kubernetes ClusterIP service, it's connected.

## Use helm install:

- For Dev enviroment:
```bash       
helm install \
orderapp-release orderapp/ \
--values orderapp/values-dev.yaml \
-f orderapp/values-dev.yaml \
--namespace order-dev \
--create-namespace
```
- For Production enviroment:
```bash
helm install \
orderapp-release orderapp/ \
--values orderapp/values-prod.yaml \
-f orderapp/values-prod.yaml \
--namespace order-prod \
--create-namespace
```

## To check service working use port-forwarding, open broswer localhost:8888 to check.
```bash
kubectl port-forward service/backend-svc-dev 8888:80 --namespace order-dev
kubectl port-forward service/backend-svc-prod 8888:80 --namespace order-prod
```
- Or go to LoadBalancer to check published service
```bash
kubectl get svc -n order-dev
kubectl get svc -n order-prod
```
- Copy EXTERNAL-IP into browser example port is 80 
- (it may take up to 3 mins after orderapp helm installed):
- "*************************.ap-southeast-2.elb.amazonaws.com:80"

## To create monitoring
```bash
helm install prometheus \
prometheus-community/kube-prometheus-stack \
-n monitoring --create-namespace
```
## port-forwarding grafana, open broswer localhost:3000
```bash
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
```
## Grafana login then go to dashboard to check monitoring
username: admin
password: prom-operator

## To cleanup:
- For Dev enviroment:
```bash
helm uninstall orderapp-release --namespace order-dev && \
kubectl delete namespace order-dev
```
- For Production enviroment:
```bash        
helm uninstall orderapp-release --namespace order-prod && \
kubectl delete namespace order-prod
```
- For Monitoring:
```bash        
helm uninstall prometheus -n monitoring && \
kubectl delete namespace monitoring
```
## To cleanup EKS cluster:
```bash 
cd terraform
terraform destroy
```