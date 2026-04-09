import { test, expect } from './test';

test('smoke: delete transaction modal -> cancel modal -> transaction is not deleted', async ({
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
  await page.getByLabel(/amount/i).fill('1000');
  await page.getByRole('button', { name: /add transaction/i }).click();

  await page
    .getByRole('button', { name: /delete transaction/i })
    .first()
    .click();

  await expect(
    page.getByRole('button', { name: 'Cancel', exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();

  await expect(page.getByRole('link', { name: /e2e salary/i })).toHaveCount(1);
});
