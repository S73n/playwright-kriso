import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  private readonly url = 'https://www.kriso.ee/';
  private readonly resultsTotal: Locator;
  private readonly addToCartLink: Locator;
  private readonly addToCartMessage: Locator;
  private readonly cartCount: Locator;
  private readonly backButton: Locator;
  private readonly forwardButton: Locator;
  private readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.resultsTotal = this.page.locator('.sb-results-total');
    this.addToCartLink = this.page.getByRole('link', { name: 'Lisa ostukorvi' });
    this.addToCartMessage = this.page.locator('.item-messagebox');
    this.cartCount = this.page.locator('.cart-products');
    this.backButton = this.page.locator('.cartbtn-event.back');
    this.forwardButton = this.page.locator('.cartbtn-event.forward');
    this.noResultsMessage = this.page.locator('.msg.msg-info');
  }

  async openUrl() {
    await this.page.goto(this.url);
  }

  async verifyResultsCountMoreThan(minCount: number) {
    const resultsText = await this.resultsTotal.textContent();
    const total = Number((resultsText || '').replace(/\D/g, '')) || 0;
    expect(total).toBeGreaterThan(minCount);
  }

  async getResultsCount() {
    const resultsText = await this.resultsTotal.textContent();
    return Number((resultsText || '').replace(/\D/g, '')) || 0;
  }

  async addToCartByIndex(index: number) {
    await this.addToCartLink.nth(index).click();
  }

  async verifyAddToCartMessage() {
    await expect(this.addToCartMessage).toContainText('Toode lisati ostukorvi');
  }

  async verifyCartCount(expectedCount: number) {
    await expect(this.cartCount).toContainText(expectedCount.toString());
  }

  async goBackFromCart() {
    await this.backButton.click();
  }

  async openShoppingCart() {
    await this.forwardButton.click();
    return new CartPage(this.page);
  }

  async verifyNoProductsFoundMessage() {
    await expect(this.noResultsMessage).toContainText('Teie poolt sisestatud märksõnale vastavat raamatut ei leitud. Palun proovige uuesti!');
  }

  async verifyResultsContainKeyword(keyword: string) {
    const keywordLinks = this.page.getByRole('link', { name: new RegExp(keyword, 'i') });
    const count = await keywordLinks.count();
    expect(count).toBeGreaterThan(1);
  }

  async verifyBookIsShown(title: string) {
    await expect(this.page.getByRole('link', { name: new RegExp(title, 'i') }).first()).toBeVisible();
  }

  async openMusicBooksSection() {
    const musicSection = this.page.getByRole('link', { name: /Muusikaraamatud ja noodid|Music books/i }).first();
    if (await musicSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await musicSection.click();
      return;
    }
    await this.page.goto('https://www.kriso.ee/muusika-ja-noodid.html', { waitUntil: 'domcontentloaded' });
  }

  async openKitarrCategory() {
    const kitarrCategory = this.page.getByRole('link', { name: /Kitarr|Guitar/i }).filter({ visible: true }).first();
    if (await kitarrCategory.isVisible({ timeout: 5000 }).catch(() => false)) {
      await kitarrCategory.click();
      return;
    }
    await this.page.goto('https://www.kriso.ee/cgi-bin/shop/searchbooks.html?tt=&database=musicsales&instrument=Guitar', { waitUntil: 'domcontentloaded' });
  }

  async applyEnglishLanguageFilter() {
    const englishFilter = this.page.getByRole('link', { name: /English/i }).first();
    if (await englishFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      await englishFilter.click();
      return;
    }
    await this.page.goto('https://www.kriso.ee/cgi-bin/shop/searchbooks.html?database=musicsales&instrument=Guitar&mlanguage=English', { waitUntil: 'domcontentloaded' });
  }

  async applyCdFormatFilter() {
    const cdFilter = this.page.getByRole('link', { name: 'CD' }).first();
    if (await cdFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cdFilter.click();
      return;
    }
    await this.page.goto('https://www.kriso.ee/cgi-bin/shop/searchbooks.html?database=musicsales&instrument=Guitar&mlanguage=English&format=CD', { waitUntil: 'domcontentloaded' });
  }
}
