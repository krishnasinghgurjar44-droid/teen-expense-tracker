const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('TeenSpend API Integration Test Suite', async (t) => {
  let authToken = '';
  let secondUserToken = '';
  let createdExpenseId = '';
  let testCategoryId = '';
  const testEmail = `teen_${Date.now()}@example.com`;
  const otherEmail = `other_${Date.now()}@example.com`;
  const testPassword = 'Password#123';

  await t.test('1. Health Check Endpoint', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.status, 'healthy');
  });

  await t.test('2. User Registration - Success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Teenager',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.email, testEmail);
    assert.equal(res.body.data.user.password_hash, undefined); // Never return password hash!
    authToken = res.body.data.token;
  });

  await t.test('3. User Registration - Duplicate Email Rejection', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate Teenager',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
  });

  await t.test('4. User Registration - Validation Failure on Mismatched Password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'Password#123',
        confirmPassword: 'DifferentPassword#123'
      });

    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
  });

  await t.test('5. User Login - Success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    authToken = res.body.data.token;
  });

  await t.test('6. User Login - Invalid Credentials Failure', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword#999'
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await t.test('7. Protected Route - Rejects Unauthenticated Access', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await t.test('8. Protected Route - Accepts Valid Token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.email, testEmail);
  });

  await t.test('9. Categories - List Categories', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
    testCategoryId = res.body.data[0].id;
  });

  await t.test('10. Monthly Budget - Create and Retrieve', async () => {
    const setBudgetRes = await request(app)
      .post('/api/budget')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        month: 9,
        year: 2026,
        amount: 8000
      });

    assert.equal(setBudgetRes.status, 200);
    assert.equal(setBudgetRes.body.success, true);
    assert.equal(setBudgetRes.body.data.budget, 8000);

    const getBudgetRes = await request(app)
      .get('/api/budget?month=9&year=2026')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(getBudgetRes.status, 200);
    assert.equal(getBudgetRes.body.data.budget, 8000);
  });

  await t.test('11. Expense Management - Create Expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'College Lunch',
        amount: 120,
        category_id: testCategoryId,
        expense_date: '2026-09-28',
        payment_method: 'UPI',
        description: 'Canteen veg thali'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.title, 'College Lunch');
    assert.equal(res.body.data.amount, 120);
    assert.ok(res.body.data.id);
    createdExpenseId = res.body.data.id;
  });

  await t.test('12. Expense Management - Validation on Negative Amount', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Invalid Negative Expense',
        amount: -50,
        category_id: testCategoryId,
        expense_date: '2026-09-28',
        payment_method: 'Cash'
      });

    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
  });

  await t.test('13. Expense Management - Read and Filter', async () => {
    const res = await request(app)
      .get('/api/expenses?page=1&limit=10&paymentMethod=UPI')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 1);
    assert.ok(res.body.pagination.total >= 1);
  });

  await t.test('14. Expense Management - Update Expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'College Lunch with Dessert',
        amount: 150
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.title, 'College Lunch with Dessert');
    assert.equal(res.body.data.amount, 150);
  });

  await t.test('15. Security - Prevent Cross-User Data Tampering (Unauthorized Expense Access)', async () => {
    // Register second user
    const secondUserRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Teen',
        email: otherEmail,
        password: testPassword,
        confirmPassword: testPassword
      });

    secondUserToken = secondUserRes.body.data.token;

    // Second user attempts to read first user's expense
    const getRes = await request(app)
      .get(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${secondUserToken}`);

    assert.equal(getRes.status, 404); // Forbidden / Not Found to second user

    // Second user attempts to update first user's expense
    const putRes = await request(app)
      .put(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({ title: 'Hacked Title' });

    assert.equal(putRes.status, 404);

    // Second user attempts to delete first user's expense
    const delRes = await request(app)
      .delete(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${secondUserToken}`);

    assert.equal(delRes.status, 404);
  });

  await t.test('16. Dashboard - Summary and Calculations', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary?month=9&year=2026')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.budget);
    assert.equal(res.body.data.budget.monthlyBudget, 8000);
    assert.equal(res.body.data.budget.totalSpent, 150);
    assert.equal(res.body.data.budget.remainingBudget, 7850);
    assert.ok(res.body.data.metrics);
    assert.equal(res.body.data.metrics.transactionCount, 1);
  });

  await t.test('17. Dashboard - Analytics and Suggestions', async () => {
    const analyticsRes = await request(app)
      .get('/api/dashboard/analytics?month=9&year=2026')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(analyticsRes.status, 200);
    assert.ok(analyticsRes.body.data.categoryDonut);
    assert.ok(analyticsRes.body.data.dailySpending);

    const suggestionsRes = await request(app)
      .get('/api/dashboard/suggestions?month=9&year=2026')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(suggestionsRes.status, 200);
    assert.ok(Array.isArray(suggestionsRes.body.data));
    assert.ok(suggestionsRes.body.data.length >= 1);
  });

  await t.test('18. Expense Management - Delete Expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    // Verify it is gone
    const getRes = await request(app)
      .get(`/api/expenses/${createdExpenseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(getRes.status, 404);
  });
});
