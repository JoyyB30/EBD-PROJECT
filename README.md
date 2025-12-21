# FARMCONNECT 

**Course:** Electronic Business Development (BINF 503)  
**Semester:** Winter 2025  
**Instructor:** Dr. Nourhan Hamdi  
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa

---

## 1. Team Members

_List all team members (5-6 students) below._

| Name             | Student ID | Tutorial Group | GitHub Username |
| :--------------- | :--------- | :------------- | :-------------- |
| Hana Khaled      | 13002847   | 6              | hanakhaledd     |
| Malak Fawzy      | 13007189   | 6              | malakfawzyy     |
| Aya Hussein      | 13004531   | 6              | ayahussein394   |
| Joy Bassem       | 13003606   | 6              | JoyyB30         |
| Malak gharib     | 13007525   | 2              | Malak gharib    |
| Salama Walid     | 13007299   | 6              | salmawalidd     |

---

## 2. Project Description

_Provide a detailed description of your project concept here. What is the app? What problem does it solve?_

FarmConnect is a FinTech web application designed to digitize the financial activities of small-scale farmers in Egypt.

The platform acts as a bridge between farmers, banks, and the system administrator, enabling farmers to create a reliable digital financial record that can be accessed by financial institutions to evaluate creditworthiness.

Problem Addressed

Many small farmers rely on paper records or informal tracking methods, which prevents banks from verifying their income, expenses, and repayment ability. As a result, farmers face significant barriers when applying for loans.

Solution

FarmConnect replaces paper-based records with a secure digital system where:

Farmers record sales and purchases

Financial summaries are automatically generated

Banks can review verified transaction histories

Loan requests are submitted, reviewed, and processed digitally

This creates transparency, trust, and access to financial services.

---

## 3. Feature Breakdown

### 3.1 Full Scope

_List ALL potential features/user stories envisioned for the complete product (beyond just this course)._

Feature A — Farmer Financial Recording
•	Record daily sales
•	Record purchases from supplier
•	Auto-calculate totals
•	Track price trends of products

Feature B — Supplier Interaction
•	Supplier account creation
•	Confirm purchase orders
•	Digital receipts
•	Supplier dashboard

Feature C — Bank Integration
•	Farmer credit score generation
•	View full transaction history
•	View loan repayment history
•	Automated loan approval system

Feature D — Farmer Analytics
•	Income vs Expenses charts
•	Productivity trends
•	Seasonal income prediction

Feature E — Localization & Accessibility
•	Arabic/English language toggle
•	Voice-based menu navigation
•	Large text mode

Feature F — Security & Identity
•	Biometric verification (future)
•	Photo/scan of national ID

### 3.2 Selected MVP Use Cases (Course Scope)


_From the list above, identify the **5 or 6 specific use cases** you will implement for this course. Note: User Authentication is mandatory._

Farmer (Primary User)

-Register and log in using secure credentials
-Record daily sales transactions
-Record purchases from suppliers
-Automatic calculation of totals
-View monthly financial summaries (income, expenses, net balance)
-Submit micro-loan requests

Bank (Institutional User)

-Secure staff login
-View all registered farmers
-Access individual farmer transaction histories
-Review loan requests
-Approve or reject loan requests and assign approved amounts

Admin (System Administrator)

-Secure administrative access
-View all registered farmers
-Access complete farmer profiles, including:
  -Sales records
  -Purchase records
  -Loan requests and statuses
-Monitor platform data integrity (read-only role)

---

## 4. Feature Assignments (Accountability)

_Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature._

| Team Member | Assigned Use Case       | Brief Description of Responsibility              |
| :---------- | :---------------------- | :----------------------------------------------- |
| Hana Khaled | User Authentication     | Registration, login, JWT handling, password hashing |
| Malak Fawzy | Record sales            | Sales entry, backend storage, calculations|
| Aya Hussein | Record Purchases        | Purchase entry, supplier tracking, cost calculations|
| Joy Bassem  | Monthly Totals          | Aggregation logic for income and expenses|
| Malak Gharib| Loan Requests           | Loan submission, status handling, database logic|
| Salma Walid | Bank Dashboard          | Farmer listing, loan review, approve/reject logic|

---

## 5. Data Model (Initial Schemas)

_Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code._

### Loan Request Schema 
const mongoose = require("mongoose");

const loanRequestSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    approvedAmount: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    dateRequested: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanRequest", loanRequestSchema);

### Purchases Schema 
const mongoose = require("mongoose");

const purchasesSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Purchase", purchasesSchema);

### Sales Schema 
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sale", saleSchema);

### User Schema 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{11}$/, "Phone number must be exactly 11 digits"],
    },

    nationalID: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{14}$/, "National ID must be exactly 14 digits"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "farmer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);