// src/database/seeds/categories.seed.ts
import AppDataSource from '../ormconfig';
import { Category } from '../../categories/entities/category.entity';
import { TransactionType } from '../../transactions/enums/transaction-type.enum';

const systemCategories = [
  { name: 'Housing', icon: 'house', color: '#6ac8ff', type: TransactionType.EXPENSE },
  { name: 'Food', icon: 'hamburger', color: '#ff6a6a', type: TransactionType.EXPENSE },
  { name: 'Transport', icon: 'car', color: '#ffdc6a', type: TransactionType.EXPENSE },
  { name: 'Health', icon: 'heartPulse', color: '#6affb8', type: TransactionType.EXPENSE },
  { name: 'Entertainment', icon: 'clapperboard', color: '#c86aff', type: TransactionType.EXPENSE },
  { name: 'Education', icon: 'libraryBig', color: '#6ac8ff', type: TransactionType.EXPENSE },
  { name: 'Shopping', icon: 'shoppingCart', color: '#ff9c6a', type: TransactionType.EXPENSE },
  { name: 'Utilities', icon: 'lightbulb', color: '#ffdc6a', type: TransactionType.EXPENSE },
  { name: 'Salary', icon: 'banknoteArrowUp', color: '#6affb8', type: TransactionType.INCOME },
  { name: 'Freelance', icon: 'laptop', color: '#ffdc6a', type: TransactionType.INCOME },
  { name: 'Investment', icon: 'bitcoin', color: '#6ac8ff', type: TransactionType.INCOME },
  { name: 'Other', icon: 'packageOpen', color: '#888888', type: TransactionType.EXPENSE },
];

async function seed() {
  await AppDataSource.initialize();

  const categoryRepository = AppDataSource.getRepository(Category);

  const existing = await categoryRepository.findBy({ isSystem: true });
  if (existing.length > 0) {
    console.log('System categories already seeded — skipping');
    await AppDataSource.destroy();
    return;
  }

  const categories = systemCategories.map((cat) =>
    categoryRepository.create({
      ...cat,
      isSystem: true,
      user: null,
    }),
  );

  await categoryRepository.save(categories);
  console.log(`Seeded ${categories.length} system categories`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
