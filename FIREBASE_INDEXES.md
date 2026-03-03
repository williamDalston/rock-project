# Create Firestore indexes (fix “The query requires an index”)

The app’s trade proposals need two composite indexes. Create them once in Firebase:

1. **Received proposals** (toUserId + createdAt):  
   [Open and create this index](https://console.firebase.google.com/v1/r/project/rock-project-ef60a/firestore/indexes?create_composite=ClFwcm9qZWN0cy9yb2NrLXByb2plY3QtZWY2MGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3RyYWRlcy9pbmRleGVzL18QARoMCgh0b1VzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI)

2. **Sent proposals** (fromUserId + createdAt):  
   [Open and create this index](https://console.firebase.google.com/v1/r/project/rock-project-ef60a/firestore/indexes?create_composite=ClFwcm9qZWN0cy9yb2NrLXByb2plY3QtZWY2MGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3RyYWRlcy9pbmRleGVzL18QARoOCgpmcm9tVXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg)

For each link: click **Create index**, then wait a few minutes for the index to build. The “Error fetching received/sent proposals” messages will stop once both are built.
