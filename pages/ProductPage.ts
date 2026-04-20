import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openMusicBooksSection() {
    await this.page.getByRole('link', { name: 'Muusikaraamatud ja noodid' }).first().click();
  }

  async openKitarrCategory() {
    await this.page.getByRole('link', { name: 'Kitarr' }).filter({ visible: true }).first().click();
  }

  async verifyKitarrInUrl() {
    await expect(this.page).toHaveURL(/instrument=Guitar/);
  }

  async getResultsCount() {
    const text = await this.page.locator('.sb-results-total').textContent();
    return Number((text || '').replace(/\D/g, '')) || 0;
  }

  async applyEnglishFilter() {
    await this.page.getByRole('link', { name: 'English' }).first().click();
  }

  async verifyLanguageFilterInUrl() {
    await expect(this.page).toHaveURL(/mlanguage=/);
  }

  async applyCdFormatFilter() {
    await this.page.getByRole('link', { name: 'CD' }).first().click();
  }

  async verifyCdFilterInUrl() {
    await expect(this.page).toHaveURL(/format=CD/);
  }

  async removeActiveFiltersWithBackNavigation() {
    await this.page.goBack();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.goBack();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
