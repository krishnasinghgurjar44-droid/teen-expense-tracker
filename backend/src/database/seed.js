const supabase = require('../config/db');
const { hashPassword } = require('../utils/password');

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#f97316' },
  { name: 'Travel', icon: '🚌', color: '#06b6d4' },
  { name: 'Education', icon: '📚', color: '#3b82f6' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Entertainment', icon: '🎮', color: '#8b5cf6' },
  { name: 'Bills', icon: '⚡', color: '#eab308' },
  { name: 'Health', icon: '💊', color: '#10b981' },
  { name: 'Personal Care', icon: '✨', color: '#14b8a6' },
  { name: 'Other', icon: '📦', color: '#64748b' }
];

async function seedDatabase() {
  console.log('🌱 Starting TeenSpend database seed...');

  try {
    // 1. Seed or retrieve Categories
    console.log('🏷️ Ensuring categories exist...');
    const categoriesMap = {};

    for (const cat of DEFAULT_CATEGORIES) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', cat.name)
        .maybeSingle();

      if (existing) {
        categoriesMap[cat.name] = existing.id;
      } else {
        const { data: created, error } = await supabase
          .from('categories')
          .insert(cat)
          .select('id, name')
          .single();
        if (error) {
          console.warn(`Could not insert category ${cat.name}:`, error.message);
        } else if (created) {
          categoriesMap[cat.name] = created.id;
        }
      }
    }

    // 2. Seed Demo User
    const demoEmail = 'teen@teenspend.app';
    const demoPassword = 'Password#123';
    console.log(`👤 Checking for demo user: ${demoEmail}...`);

    let userId;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', demoEmail)
      .maybeSingle();

    if (existingUser) {
      userId = existingUser.id;
      console.log('✅ Demo user already exists:', userId);
    } else {
      const password_hash = await hashPassword(demoPassword);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name: 'Aarav Sharma',
          email: demoEmail,
          password_hash
        })
        .select('id, name, email')
        .single();

      if (error) {
        throw new Error(`Failed to create demo user: ${error.message}`);
      }
      userId = newUser.id;
      console.log('✅ Created demo user:', demoEmail, 'Password:', demoPassword);
    }

    // Clean existing test data for this demo user to avoid duplicate key conflicts on multiple seed runs
    await supabase.from('expenses').delete().eq('user_id', userId);
    await supabase.from('budgets').delete().eq('user_id', userId);

    // 3. Seed Monthly Budgets
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const prevDate = new Date(currentYear, currentMonth - 2, 1);
    const prevMonth = prevDate.getMonth() + 1;
    const prevYear = prevDate.getFullYear();

    const twoMonthsAgoDate = new Date(currentYear, currentMonth - 3, 1);
    const twoMonthsAgoMonth = twoMonthsAgoDate.getMonth() + 1;
    const twoMonthsAgoYear = twoMonthsAgoDate.getFullYear();

    console.log('💰 Seeding monthly budgets...');
    await supabase.from('budgets').insert([
      { user_id: userId, month: currentMonth, year: currentYear, amount: 10000 },
      { user_id: userId, month: prevMonth, year: prevYear, amount: 9500 },
      { user_id: userId, month: twoMonthsAgoMonth, year: twoMonthsAgoYear, amount: 9000 }
    ]);

    // 4. Seed Realistic Teenager Expenses
    console.log('📝 Seeding realistic expenses across recent months...');

    // Helper to format date strings YYYY-MM-DD
    const formatDate = (y, m, d) =>
      `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const seedExpenses = [
      // Current Month Expenses
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'College Canteen Lunch',
        description: 'Thali & fresh lime soda with batchmates',
        amount: 140,
        expense_date: formatDate(currentYear, currentMonth, Math.min(24, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Travel'] || Object.values(categoriesMap)[0],
        title: 'Metro Smart Card Recharge',
        description: 'Monthly student commute balance',
        amount: 300,
        expense_date: formatDate(currentYear, currentMonth, Math.min(20, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Education'] || Object.values(categoriesMap)[0],
        title: 'Reference Textbook & Stationery',
        description: 'Maths workbook and pack of fineliners',
        amount: 450,
        expense_date: formatDate(currentYear, currentMonth, Math.min(18, now.getDate())),
        payment_method: 'Debit Card'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Shopping'] || Object.values(categoriesMap)[0],
        title: 'Casual Hoodie',
        description: 'Weekend end-of-season sale purchase',
        amount: 999,
        expense_date: formatDate(currentYear, currentMonth, Math.min(15, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Entertainment'] || Object.values(categoriesMap)[0],
        title: 'Online Gaming Pass',
        description: 'Monthly gaming server subscription',
        amount: 499,
        expense_date: formatDate(currentYear, currentMonth, Math.min(12, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Bills'] || Object.values(categoriesMap)[0],
        title: 'Mobile 5G Recharge',
        description: '28 days unlimited student plan',
        amount: 299,
        expense_date: formatDate(currentYear, currentMonth, Math.min(10, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'Evening Samosa & Chai',
        description: 'Post coaching snack with friends',
        amount: 50,
        expense_date: formatDate(currentYear, currentMonth, Math.min(9, now.getDate())),
        payment_method: 'Cash'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'Bakery Pastry & Cold Drink',
        description: 'Afternoon quick snack',
        amount: 80,
        expense_date: formatDate(currentYear, currentMonth, Math.min(8, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'Juice Stall Smoothie',
        description: 'Mango juice after sports practice',
        amount: 60,
        expense_date: formatDate(currentYear, currentMonth, Math.min(7, now.getDate())),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Travel'] || Object.values(categoriesMap)[0],
        title: 'Shared Auto Fare',
        description: 'Return trip from library to home',
        amount: 40,
        expense_date: formatDate(currentYear, currentMonth, Math.min(6, now.getDate())),
        payment_method: 'Cash'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Personal Care'] || Object.values(categoriesMap)[0],
        title: 'Haircut & Styling',
        description: 'Regular grooming salon visit',
        amount: 250,
        expense_date: formatDate(currentYear, currentMonth, Math.min(5, now.getDate())),
        payment_method: 'Cash'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Health'] || Object.values(categoriesMap)[0],
        title: 'Vitamins & Pain Relief Spray',
        description: 'Chemist store purchase',
        amount: 220,
        expense_date: formatDate(currentYear, currentMonth, Math.min(3, now.getDate())),
        payment_method: 'Cash'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Entertainment'] || Object.values(categoriesMap)[0],
        title: 'Movie Ticket with Batch',
        description: 'Matinee student discount ticket',
        amount: 280,
        expense_date: formatDate(currentYear, currentMonth, Math.min(2, now.getDate())),
        payment_method: 'UPI'
      },

      // Previous Month Expenses (gives depth for comparison & bar charts)
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'Birthday Pizza Treat',
        description: 'Group pizza slices for friends',
        amount: 850,
        expense_date: formatDate(prevYear, prevMonth, 22),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Education'] || Object.values(categoriesMap)[0],
        title: 'Physics Practical Lab Journal',
        description: 'College stationery kit',
        amount: 320,
        expense_date: formatDate(prevYear, prevMonth, 16),
        payment_method: 'Debit Card'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Travel'] || Object.values(categoriesMap)[0],
        title: 'Bus Pass Monthly Pass',
        description: 'Student concession pass',
        amount: 250,
        expense_date: formatDate(prevYear, prevMonth, 10),
        payment_method: 'Cash'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Shopping'] || Object.values(categoriesMap)[0],
        title: 'Sports Shoes On Clearance',
        description: 'Running sneakers for athletics',
        amount: 1450,
        expense_date: formatDate(prevYear, prevMonth, 5),
        payment_method: 'Debit Card'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Bills'] || Object.values(categoriesMap)[0],
        title: 'Monthly Mobile Recharge',
        description: 'Prepaid pack',
        amount: 299,
        expense_date: formatDate(prevYear, prevMonth, 2),
        payment_method: 'UPI'
      },

      // Two Months Ago Expenses
      {
        user_id: userId,
        category_id: categoriesMap['Food'] || Object.values(categoriesMap)[0],
        title: 'Cafe Hangout',
        description: 'Coffee and waffle',
        amount: 320,
        expense_date: formatDate(twoMonthsAgoYear, twoMonthsAgoMonth, 20),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Education'] || Object.values(categoriesMap)[0],
        title: 'Exam Registration Fee',
        description: 'Semester mock exam fee',
        amount: 600,
        expense_date: formatDate(twoMonthsAgoYear, twoMonthsAgoMonth, 12),
        payment_method: 'UPI'
      },
      {
        user_id: userId,
        category_id: categoriesMap['Entertainment'] || Object.values(categoriesMap)[0],
        title: 'Comic Con Student Ticket',
        description: 'Annual cultural pass',
        amount: 500,
        expense_date: formatDate(twoMonthsAgoYear, twoMonthsAgoMonth, 5),
        payment_method: 'UPI'
      }
    ];

    await supabase.from('expenses').insert(seedExpenses);
    console.log(`✅ Seeded ${seedExpenses.length} realistic teenager expenses!`);
    console.log('\n🎉 Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log(`  Demo Account Email:    ${demoEmail}`);
    console.log(`  Demo Account Password: ${demoPassword}`);
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
