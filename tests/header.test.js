const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');

const Page = require('./helpers/page');

let page;

beforeAll(async () => {
  // browser = await puppeteer.launch({
  //   headless: false,
  // });
  // page = await browser.newPage();
  page = await Page.build();
  // await page.goto('localhost:3000');
});

afterAll(async () => {
  // await browser.close();
  await page.close();
});

test('Header has correct text', async () => {
  await page.goto('localhost:3000');
  // const text = await page.$eval('a.left.brand-logo', (el) => el.innerHTML);
  const text = await page.getContentsOf('a.left.brand-logo');

  expect(text).toEqual('Header');
});

test('Header has correct text', async () => {
  await page.goto('localhost:3000');
  await page.click('.right a');

  const url = await page.url();

  //   console.log(url);
  expect(url).toMatch(/accounts\.google\.com/);
});

test('show logout button', async () => {
  // const id = '5ee85508e1b15e11c7728c84'; // _id of the user

  // const user = await userFactory();
  // const { session, sig } = sessionFactory(user);
  // // console.log(sessionString, sig);
  // await page.setCookie({ name: 'express:sess.sig', value: sig });
  // await page.setCookie({ name: 'express:sess', value: session });

  // // await page.reload({ waitUntil: 'domcontentloaded' });
  // // await page.on('load', () => console.log('DOM actually loaded'));
  // await page.goto('localhost:3000');

  // await page.waitFor('a[href="/api/logout"]');
  await page.goto('localhost:3000');
  await page.login();

  const text = await page.$eval('a[href="/api/logout"]', (el) => el.innerHTML);

  expect(text).toEqual('Logout');
});
