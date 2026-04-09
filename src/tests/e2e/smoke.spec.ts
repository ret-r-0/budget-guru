import { test, expect } from './test';

test('smoke: create wallet -> add tx -> edit tx -> verify list', async ({
  page,
}) => {
  await page.goto('/wallets');
  await page.getByRole('button', { name: /add new wallet/i }).click();

  await page.getByLabel(/name/i).fill('E2E Wallet');
  await page.getByLabel(/currency/i).selectOption('USD');
  await page.getByRole('button', { name: /add the wallet/i }).click();

  await expect(page.getByText('E2E Wallet')).toBeVisible();
  await page.getByRole('link', { name: /e2e wallet/i }).click();

  await page.getByRole('button', { name: /add new transaction/i }).click();

  await page.getByLabel(/name/i).fill('E2E Salary');
  await page.getByLabel(/date/i).fill('2026-04-08');
  await page.getByLabel(/amount/i).fill('1000');
  await page.getByRole('button', { name: /add transaction/i }).click();

  await expect(page.getByText('E2E Salary')).toBeVisible();

  await page
    .getByRole('link', { name: /e2e salary/i })
    .first()
    .click();
  await page.getByLabel(/name/i).fill('E2E Salary Updated');
  await page.getByRole('button', { name: /save changes/i }).click();

  await expect(page.getByText('E2E Salary Updated')).toBeVisible();
});
