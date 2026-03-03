# Fix: "The query requires an index" (sent/received proposals)

Trade proposals need two Firestore composite indexes. Use **either** option below.

---

## Option A: Create indexes in Firebase Console (quick)

Open each link and click **Create index**. Wait a few minutes for each to finish building.

1. **Received proposals** (toUserId + createdAt)  
   https://console.firebase.google.com/v1/r/project/rock-project-ef60a/firestore/indexes?create_composite=ClFwcm9qZWN0cy9yb2NrLXByb2plY3QtZWY2MGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3RyYWRlcy9pbmRleGVzL18QARoMCgh0b1VzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

2. **Sent proposals** (fromUserId + createdAt)  
   https://console.firebase.google.com/v1/r/project/rock-project-ef60a/firestore/indexes?create_composite=ClFwcm9qZWN0cy9yb2NrLXByb2plY3QtZWY2MGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3RyYWRlcy9pbmRleGVzL18QARoOCgpmcm9tVXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg

After both indexes show as **Enabled**, the "Error fetching sent proposals" and "Error fetching received proposals" messages will stop.

---

## Option B: Deploy indexes with Firebase CLI

From the project root:

```bash
firebase deploy --only firestore:indexes
```

Requires Firebase CLI and the project linked (`firebase use rock-project-ef60a`). Indexes are defined in `firestore.indexes.json`.
