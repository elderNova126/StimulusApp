
test
### Install istio in your preferred kubernetes cluster
https://istio.io/docs/setup/getting-started/

### Use the demo profile for development
```
istioctl manifest apply --set profile=demo
```
### Make sure istio sidecar auto injection is enabled
```
kubectl label namespace <namespace> istio-injection=enabled
```

### Deploy kubernetes platform service definitions
```
cd platform/
kubectl apply -f .\stimulus-user-api-service.yaml
kubectl apply -f .\stimulus-controller-service.yaml
```
```
kubectl apply -f .\stimulus-user-api-service-aks.yaml
kubectl apply -f .\stimulus-controller-service-aks.yaml
```

### Deploy istio networking service definitions
```
cd networking/
kubectl apply -f .\stimulus-gateway.yaml
kubectl apply -f .\stimulus-virtualservice.yaml
kubectl apply -f .\stimulus-destination-rules.yaml
# This is for experimental purposes only, the api manages auth in a self contained way
kubectl apply -f .\stimulus-gateway-auth-policy.yaml
```

### Useful commands

* Dashboard access
```
kubectl proxy
```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/overview?namespace=default

* Kiali access
```
istioctl dashboard kiali
```

* Get cluster external IP
```
kubectl get services --namespace istio-system
...
NAME                     TYPE           CLUSTER-IP          EXTERNAL-IP
istio-ingressgateway     LoadBalancer   <ClusterIpValue>    <ExternalIpValue>
...
```

### Hosted Authentication UI ADB2C
https://stimulusdev.b2clogin.com/stimulusdev.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_signup_signin&client_id=2ea9f497-00f4-4d12-b484-64e15121879c&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid%20https%3A%2F%2Fstimulusdev.onmicrosoft.com%2Fstimulus-cloud%2Fapi.access%20https%3A%2F%2Fstimulusdev.onmicrosoft.com%2Fstimulus-cloud%2Fuser_impersonation&response_type=id_token%20token&prompt=login


