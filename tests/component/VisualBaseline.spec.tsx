import { test, expect } from '@playwright/experimental-ct-react';
import Carousel from '../../src/components/Carousel';
import DestinationCard from '../../src/components/DestinationCard';
import FavoriteButton from '../../src/components/FavoriteButton';
import FilterBar from '../../src/components/FilterBar';
import Footer from '../../src/components/Footer';
import Navbar from '../../src/components/Navbar';
import ScrollToTop from '../../src/components/ScrollToTop';
import SearchBar from '../../src/components/SearchBar';
import WeatherWidget from '../../src/components/WeatherWidget';
import { destinations } from '../../src/data/destinations';
import { TestWrapper } from '../fixtures/test-utils';
import { LayoutVisualStory, VisualFrame } from '../fixtures/visual-stories';

const favoriteStorageKey = 'travelvista_favorites';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
});

test('carousel visual baseline', async ({ mount }) => {
  const component = await mount(
    <VisualFrame width={880}>
      <Carousel
        autoPlayInterval={5000}
        items={[
          <div key="slide-1" className="rounded-xl bg-white p-8 shadow-md">海岛灵感看板</div>,
          <div key="slide-2" className="rounded-xl bg-white p-8 shadow-md">城市漫游精选</div>,
          <div key="slide-3" className="rounded-xl bg-white p-8 shadow-md">山野徒步路线</div>,
        ]}
      />
    </VisualFrame>
  );

  await expect(component).toHaveScreenshot('carousel-component.png', { animations: 'disabled' });
});

test('destination card visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <VisualFrame width={420}>
        <DestinationCard destination={destinations[0]} />
      </VisualFrame>
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('destination-card-component.png', { animations: 'disabled' });
});

test('favorite button visual baseline', async ({ mount, page }) => {
  await page.addInitScript((storageKey) => {
    localStorage.setItem(storageKey, JSON.stringify(['bali']));
  }, favoriteStorageKey);

  const component = await mount(
    <VisualFrame width={120}>
      <FavoriteButton destinationId="bali" />
    </VisualFrame>
  );

  await expect(component).toHaveScreenshot('favorite-button-component.png', { animations: 'disabled' });
});

test('filter bar visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <VisualFrame>
        <FilterBar
          keyword="巴厘"
          region="asia"
          type="beach"
          sortBy="rating"
          onKeywordChange={() => {}}
          onRegionChange={() => {}}
          onTypeChange={() => {}}
          onSortChange={() => {}}
        />
      </VisualFrame>
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('filter-bar-component.png', { animations: 'disabled' });
});

test('footer visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <Footer />
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('footer-component.png', { animations: 'disabled' });
});

test('layout visual baseline', async ({ mount }) => {
  const component = await mount(<LayoutVisualStory />);

  await expect(component).toHaveScreenshot('layout-component.png', { animations: 'disabled' });
});

test('navbar visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper initialEntries={['/destinations']}>
      <Navbar />
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('navbar-component.png', { animations: 'disabled' });
});

test('scroll to top visual baseline', async ({ mount, page }) => {
  const component = await mount(
    <div className="h-[1600px] bg-sky-100">
      <ScrollToTop />
    </div>
  );

  await page.evaluate(() => {
    window.scrollTo(0, 600);
    window.dispatchEvent(new Event('scroll'));
  });

  await expect(component).toHaveScreenshot('scroll-to-top-component.png', { animations: 'disabled' });
});

test('search bar visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <VisualFrame width={560}>
        <SearchBar value="京都" onChange={() => {}} />
      </VisualFrame>
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('search-bar-component.png', { animations: 'disabled' });
});

test('weather widget visual baseline', async ({ mount }) => {
  const component = await mount(
    <TestWrapper>
      <VisualFrame width={420}>
        <WeatherWidget destinationId="bali" />
      </VisualFrame>
    </TestWrapper>
  );

  await expect(component).toHaveScreenshot('weather-widget-component.png', { animations: 'disabled' });
});