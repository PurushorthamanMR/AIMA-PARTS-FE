# Aima Parts API – Tables and APIs

**Base URL:** `http://localhost:8080` (or from env)

---

## 1. user

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| firstName | STRING | not null |
| lastName | STRING | not null |
| password | STRING | not null |
| address | STRING | |
| emailAddress | STRING | not null, unique |
| mobileNumber | STRING | |
| createdDate | DATE | default now |
| modifiedDate | DATE | |
| isActive | BOOLEAN | default true |
| userRoleId | INTEGER | not null, FK → userRole |

**APIs (prefix: /user)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register user |
| POST | /user/login | Login (returns JWT) |
| POST | /user/admin | Admin check |
| POST | /user/user | User check |
| GET | /user/getAllPage | Paginated users |
| GET | /user/getByName | By firstName, lastName |
| GET | /user/getById | By id |
| GET | /user/getByRole | By userRole |
| GET | /user/getByEmailAddress | By email |
| POST | /user/update | Update user |
| PUT | /user/updateStatus | Update isActive |
| PUT | /user/updatePassword | Update password |

---

## 2. userRole

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| userRole | STRING | not null |
| isActive | BOOLEAN | default true |

**APIs (prefix: /userRole)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /userRole/save | Create role |
| GET | /userRole/getAll | List all |

---

## 3. product

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| name | STRING | |
| brandId | INTEGER | FK → brand |
| productCategoryId | INTEGER | not null, FK → productCategory |
| price | DOUBLE | |
| quantity | INTEGER | |
| lowStock | INTEGER | Low-stock threshold |
| isActive | BOOLEAN | default true |

**APIs (prefix: /product)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /product/save | Create product |
| GET | /product/getAll | List all |
| GET | /product/getAllPage | Paginated |
| GET | /product/getById | By id |
| GET | /product/getByName | By name |
| GET | /product/getAllByBrand | By brandId |
| GET | /product/getAllByCategory | By productCategoryId |
| POST | /product/update | Update product |
| PUT | /product/updateQuantity | Add/subtract quantity (delta) |
| PUT | /product/updateStatus | Update isActive |
| POST | /product/return | Return product |

---

## 4. productCategory

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| name | STRING | not null, unique |
| isActive | BOOLEAN | default true |

**APIs (prefix: /productCategory)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /productCategory/getAll | List all |
| GET | /productCategory/getAllPage | Paginated |
| GET | /productCategory/getByName | By name |
| POST | /productCategory/save | Create |
| PUT | /productCategory/update | Update |
| PUT | /productCategory/updateStatus | Update isActive |

---

## 5. brand

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| name | STRING | not null, unique |
| isActive | BOOLEAN | default true |

**APIs (prefix: /brand)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /brand/save | Create brand |
| POST | /brand/update | Update |
| GET | /brand/getAll | List all |
| PUT | /brand/updateStatus | Update isActive |

---

## 6. customer

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| name | STRING | not null |
| mobileNumber | STRING | not null |
| isActive | BOOLEAN | default true |

**APIs (prefix: /customer)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customer/save | Create customer |
| GET | /customer/getAll | List all |
| GET | /customer/getAllPage | Paginated |
| GET | /customer/getById | By id |
| GET | /customer/getByName | By name |
| GET | /customer/getByMobileNumber | By mobile |
| POST | /customer/update | Update |
| PUT | /customer/updateStatus | Update isActive |

---

## 7. paymentMethod

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| name | STRING | (e.g. Cash, Card) |
| isActive | BOOLEAN | default true |

**APIs (prefix: /paymentMethod)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /paymentMethod/save | Create |
| GET | /paymentMethod/getAll | List all |
| POST | /paymentMethod/update | Update |
| PUT | /paymentMethod/updateStatus | Update isActive |

---

## 8. transaction

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| transactionNo | STRING | unique |
| advancePaymentAmount | DOUBLE | |
| advancePaymentDateTime | DATE | |
| finalPaymentAmount | DOUBLE | |
| finalPaymentDateTime | DATE | |
| totalAmount | DOUBLE | not null |
| balanceAmount | DOUBLE | |
| paymentMethodId | INTEGER | FK → paymentMethod |
| customerId | INTEGER | not null, FK → customer |
| status | STRING | not null (PENDING, COMPLETED, RETURNED) |
| createdDateTime | DATE | |

**APIs (prefix: /transaction)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /transaction/savePending | Create PENDING transaction |
| POST | /transaction/saveComplete | Create COMPLETED transaction |
| POST | /transaction/saveFinal | Complete PENDING (final payment) |
| POST | /transaction/returnAndRestore | Return sale, restore qty, status=RETURNED |
| POST | /transaction/update | Update transaction |
| GET | /transaction/getById | By id |
| GET | /transaction/getAllPage | Paginated |
| GET | /transaction/getAllPageByCustomer | Paginated by customerId |
| GET | /transaction/getAllPageByStatus | Paginated by status |
| GET | /transaction/getAllPageByTransactionNo | Paginated by transactionNo |
| GET | /transaction/getTransactionCashTotal | Sum totalAmount (Cash, COMPLETED) |
| GET | /transaction/getTransactionCardTotal | Sum totalAmount (Card, COMPLETED) |
| GET | /transaction/getAllToday | Transactions created today |

---

## 9. transactionDetails

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| productId | INTEGER | not null, FK → product |
| quantity | INTEGER | not null |
| transactionId | INTEGER | not null, FK → transaction |
| isActive | BOOLEAN | default true |

**APIs (prefix: /transactionDetails)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /transactionDetails/save | Create |
| POST | /transactionDetails/update | Update |
| PUT | /transactionDetails/updateStatus | Update isActive |

---

## 10. transactionImage

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| transactionId | INTEGER | not null, FK → transaction |
| imageUrl | STRING | |
| fileName | STRING | |
| uploadedDateTime | DATE | |
| isActive | BOOLEAN | default true |

**APIs (prefix: /transactionImage)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /transactionImage/uploadImages | Upload images |
| GET | /transactionImage/getByTransactionId | By transactionId |
| DELETE | /transactionImage/deleteImage | Soft delete (isActive=false) |

---

## 11. userLogs

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| action | STRING | |
| timestamp | DATE | default now |
| userId | INTEGER | not null, FK → user |

**APIs (prefix: /userLogs)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /userLogs/save | Create log |
| GET | /userLogs/getAll | Paginated |

---

## 12. adminSettings

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | PK, autoIncrement |
| action | STRING | |
| isActive | BOOLEAN | default true |

**APIs (prefix: /adminSettings)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /adminSettings/save | Create |
| POST | /adminSettings/update | Update |
| GET | /adminSettings/getAll | List all |
| PUT | /adminSettings/updateStatus | Update isActive |

---

## 13. passwordResetToken

No direct CRUD APIs; used by auth flow.

**APIs (prefix: /auth)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/forgot-password | Request reset |
| POST | /auth/reset-password | Reset with token |

---

## Authentication

- Most APIs use Bearer token (JWT from /user/login)
- Register and Login use no auth
- Auth routes: /auth/forgot-password, /auth/reset-password use no auth
