import { test, expect } from './test';

test('smoke: create wallet -> edit wallet name -> cancel editing -> check if it stayed the same', async ({
  page,
}) => {
  await page.goto('/wallets');

  await page.getByRole('button', { name: /add new wallet/i }).click();

  await page.getByLabel(/name/i).fill('E2E Wallet');
  await page.getByLabel(/currency/i).selectOption('USD');
  await page.getByRole('button', { name: /add the wallet/i }).click();

  await page.getByRole('button', { name: /edit wallet e2e wallet/i }).click();

  const input = page.getByLabel(/wallet name/i);

  await expect(input).toBeVisible();

  await input.fill('E2E Wallet Updated');
  await page.getByRole('button', { name: /cancel/i }).click();

  await expect(page.getByText('E2E Wallet')).toBeVisible();
});
