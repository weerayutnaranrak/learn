# 15 — Kubernetes (K8s)

**ไฟล์:** `15-k8s.html` | **หมวด:** Infrastructure & Orchestration

## สิ่งที่จะได้เรียน

Container Orchestration ครบทุกด้าน — ตั้งแต่ Container Basics จนถึง Production: Helm, ArgoCD, RBAC, Scaling

---

## เนื้อหาหลัก

### 1. Learning Path (10 Steps)
1. Container Basics (Docker, Images, Volumes)
2. K8s Architecture (Control Plane, Worker Node, kubectl)
3. First Pod (Pod, Deployment, ReplicaSet, Namespace)
4. Networking (Service, Ingress)
5. Config (ConfigMap, Secret)
6. Storage (PV, PVC, StorageClass)
7. Scaling (HPA, VPA, Resource Limits)
8. Updates (Rolling, Canary, Blue-Green)
9. Security (RBAC, NetworkPolicy)
10. Production (Helm, GitOps, Observability)

### 2. K8s Architecture

**Control Plane:**
- `kube-apiserver` — REST API ของ K8s ทั้งหมด
- `etcd` — Key-value store เก็บ cluster state
- `kube-scheduler` — ตัดสินใจว่า Pod รันบน Node ไหน
- `kube-controller-manager` — Loop ตรวจ desired vs actual state

**Worker Node:**
- `kubelet` — Agent ดูแล containers บน node
- `kube-proxy` — Network rules สำหรับ Services
- `container runtime` — containerd/CRI-O รัน containers จริง

### 3. K8s Objects สำคัญ

| Object | คำอธิบาย |
|--------|----------|
| **Pod** | หน่วยเล็กที่สุด — กลุ่ม containers ที่ share network |
| **ReplicaSet** | รักษา N pods ให้รันอยู่เสมอ |
| **Deployment** | จัดการ ReplicaSet + Rolling updates |
| **StatefulSet** | Pod ที่มี stable identity + persistent storage |
| **DaemonSet** | 1 Pod ต่อ Node (monitoring agent) |
| **ConfigMap** | Config data (non-secret) inject เข้า Pod |
| **Secret** | Sensitive data (base64 encoded) |
| **Namespace** | Virtual cluster แบ่ง resources |

### 4. Networking — Services & Ingress

| Type | ใช้กับ |
|------|--------|
| **ClusterIP** | Internal service (default) |
| **NodePort** | Expose ออก node IP + port |
| **LoadBalancer** | Cloud LB (AWS ALB, GCP LB) |
| **Ingress** | HTTP routing rules — path/host based routing |

### 5. Scaling

| Mechanism | คำอธิบาย |
|-----------|----------|
| **HPA** | Scale pods ตาม CPU/Memory/custom metrics |
| **VPA** | ปรับ resource requests/limits ของ pod อัตโนมัติ |
| **Cluster Autoscaler** | เพิ่ม/ลด nodes ใน cluster |

### 6. Deploy Strategies

| Strategy | คำอธิบาย |
|---------|----------|
| **Rolling Update** | ค่อยๆ แทน pod เก่าด้วยใหม่ — zero downtime |
| **Blue-Green** | Run version ใหม่ parallel → switch traffic ทันที |
| **Canary** | ส่ง % traffic ไป version ใหม่ก่อน |

### 7. kubectl Cheatsheet (ย่อ)
```bash
kubectl get pods / deployments / services
kubectl describe pod <name>
kubectl logs <pod> -f
kubectl exec -it <pod> -- sh
kubectl apply -f manifest.yaml
kubectl rollout undo deployment/<name>
```

### 8. Go + K8s (3 วิธี)
- **client-go** — official K8s Go client
- **controller-runtime** — สร้าง Custom Controller
- **operator-sdk** — สร้าง Kubernetes Operator

### 9. Security
- **RBAC:** ServiceAccount + Role + RoleBinding
- **NetworkPolicy:** ควบคุม traffic ระหว่าง pods
- **Secrets Management:** External Secrets Operator + Vault

### 10. Helm
- **Chart** = package K8s resources
- **Values** = config ที่ override ได้
- **Release** = installed chart instance
- Commands: `helm install`, `helm upgrade`, `helm rollback`

### 11. ArgoCD (GitOps)
- Sync K8s state จาก Git repository
- Detect drift และ sync อัตโนมัติ
- Web UI แสดง sync status ทุก resource

---

## Code ตัวอย่างที่มีในไฟล์
- YAML manifest ครบทุก object type
- Go client-go list pods
- Helm Chart โครงสร้างพร้อม templates
- ArgoCD Application manifest
