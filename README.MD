FARMCONNECT

Course: Electronic Business Development (BINF 503)
Semester: Winter 2025
Instructor: Dr. Nourhan Hamdi
Teaching Assistants: Mr. Nour Gaser, Mr. Omar Alaa

1. Team Members
List all team members (5-6 students) below.

|Name|	Student ID|	Tutorial Group|GitHub Username|
|HANA KHALED	|13002847|	6|	Hanakhaledd|
|JOY BASSEM|	13007189	|6|	malakfawzyy|
|MALAK FAWZY |	13003606	|6	|JoyyB30|
|AYA HUSSEIN	|13004531|	6|	Ayahussein394|
|MALAK GHARIB	|13007525	|2	|malakgharib|
|SALMA WALID	|13007299	|6	\salmawalidd|


2. Project Description
FarmConnect is a FinTech solution designed to digitize the financial activities of small farmers in Egypt The app acts as a bridge between the farmer, their suppliers, and the bank, helping farmers: • Record sales • Record purchases from suppliers • Get automatic daily/monthly totals • Request micro-loans using their national ID All activity is stored in the backend and becomes a digital financial history that the bank can access to evaluate the farmer’s creditworthiness. This solves the core problem: Farmers have no digital records → banks cannot trust or evaluate them → farmers cannot access loans. FarmConnect replaces paper, guesswork, and middlemen with a clean digital profile.

3. Feature Breakdown
3.1 Full Scope
List ALL potential features/user stories envisioned for the complete product (beyond just this course).

Feature A — Farmer Financial Recording • Record daily sales • Record purchases from supplier • Auto-calculate totals • Track price trends of products

Feature B — Supplier Interaction • Supplier account creation • Confirm purchase orders • Digital receipts • Supplier dashboard

Feature C — Bank Integration • Farmer credit score generation • View full transaction history • View loan repayment history • Automated loan approval system

Feature E — Farmer Analytics • Income vs Expenses charts • Productivity trends • Seasonal income prediction

Feature F — Localization & Accessibility • Arabic/English language toggle • Voice-based menu navigation • Large text mode

Feature G — Security & Identity • Biometric verification (future) • Photo/scan of national ID

3.2 Selected MVP Use Cases (Course Scope)
From the list above, identify the 5 or 6 specific use cases you will implement for this course. Note: User Authentication is mandatory. • User Authentication (Registration & Login) • Record Sales Transaction • Record Purchase from Supplier • View Monthly Totals (Income & Expenses) • Request Loan Using National ID • Bank Dashboard (View farmer history & loan requests)

4. Feature Assignments (Accountability)
Assign one distinct use case from Section 3.2 to each team member. This member is responsible for the full-stack implementation of this feature.

|Team Member	|Assigned Use Case	Brief Description of Responsibility|
|Hana Khaled|	Authentication	Register, Login, JWT handling, Password Hashing.|
|Malak Fawzy|	Record sales	prompts, posting sales data to backend, storing in DB|
|Aya Hussein |Record Purchases	Supplier phone prompt, item entry, cost calc, DB store|
|Joy Bassem |	Monthly Totals	Income/expense aggregation, API routes, calculations|
|Malak Gharib |	Loan Requests	Loan form, national ID input, DB logic, loan status|
|Salma Walid |	Bank Dashboard	Fetch farmer records, view loan requests, approve/reject|



5. Data Model (Initial Schemas)
Define the initial Mongoose Schemas for your application’s main data models (User, Transaction, Account, etc.). You may use code blocks or pseudo-code.

### loanrequest 

const mongoose = require('mongoose');

const loanRequestSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nationalID: { type: String, required: true },
  approvedAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  dateRequested: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanRequest', loanRequestSchema);


### purcahses 
const mongoose = require('mongoose');

const purchasesSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplierId: { type: String, required: true },
  itemType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchasesSchema);


### sales 

const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productType: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);


### user 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nationalID: { type: String, required: true },
  role: { type: String, default: 'farmer' }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);

