import { test, expect } from './test';

test('smoke: create wallet -> add a couple of transactions -> delete wallet -> confirmation -> check if the transactions were deleted', async ({
  page,
}) => {
  await page.goto('/wallets');
  await page.getByRole('button', { name: /add new wallet/i }).click();

  await page.getByLabel(/name/i).fill('E2E Wallet');
  await page.getByLabel(/currency/i).selectOption('USD');
  await page.getByRole('button', { name: /add the wallet/i }).click();

  await page.getByRole('link', { name: /e2e wallet/i }).click();

  await page.getByRole('button', { name: /add new transaction/i }).click();

  await page.getByLabel(/name/i).fill('E2E Salary');
  await page.getByLabel(/date/i).fill('2026-04-08');
  await page.getByLabel(/amount/i).fill('5000');
  await page.getByRole('button', { name: /add transaction/i }).click();

  await page.getByRole('button', { name: /add new transaction/i }).click();

  await page.getByLabel(/name/i).fill('E2E Bonus');
  await page.getByLabel(/date/i).fill('2026-04-23');
  await page.getByLabel(/amount/i).fill('1000');
  await page.getByRole('button', { name: /add transaction/i }).click();

  await page.getByRole('button', { name: /back to wallets/i }).click();

  await page
    .getByRole('button', { name: 'Delete Wallet', exact: true })
    .first()
    .click();

  await page.getByRole('button', { name: 'Delete', exact: true }).click();

  await expect(page.getByRole('link', { name: /e2e wallet/i })).toHaveCount(0);

  await page.getByRole('button', { name: /add new wallet/i }).click();

  await page.getByLabel(/name/i).fill('E2E Wallet');
  await page.getByLabel(/currency/i).selectOption('USD');
  await page.getByRole('button', { name: /add the wallet/i }).click();

  await page.getByRole('link', { name: /e2e wallet/i }).click();

  await expect(page.getByRole('link', { name: /e2e salary/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /e2e bonus/i })).toHaveCount(0);
});
