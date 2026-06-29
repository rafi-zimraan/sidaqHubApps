# API — SidaqHub

## GraphQL Endpoint
- Development: `http://localhost:4000/graphql` (future)
- Production: `https://api.sidaqhub.com/graphql` (future)

## Current (Mock)
Semua data dari `src/utils/mock.ts` via wrapper `src/utils/api.ts`.

### API Functions
```ts
apiGet<T>(endpoint: string): Promise<T>
apiPost<T>(endpoint: string, data?: any): Promise<T>
apiPut<T>(endpoint: string, data?: any): Promise<T>
apiDelete<T>(endpoint: string): Promise<T>
```
- Delay artifisial: 250ms
- Data: POSTS, USERS, HALAQAHS dari mock.ts

## Future GraphQL Mutations

### Auth
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) { token user { ...UserFields } }
}
mutation Register($input: RegisterInput!) {
  register(input: $input) { token user { ...UserFields } }
}
```

### User
```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) { ...UserFields }
}
```

### Posts (Future)
```graphql
query GetFeed { posts { id content type user { name } } }
mutation CreatePost($input: PostInput!) { createPost(input: $input) { id } }
```

## Client Config
File: `src/graphql/client.ts`
- HTTP Link → `createHttpLink({ uri: GRAPHQL_URL })`
- Auth middleware → setContext with Bearer token
- Cache → InMemoryCache
