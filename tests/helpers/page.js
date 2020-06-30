const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    // const id = '5ee85508e1b15e11c7728c84'; // _id of the user

    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    // console.log(sessionString, sig);
    await this.page.setCookie({ name: 'express:sess', value: session });
    await this.page.setCookie({ name: 'express:sess.sig', value: sig });

    // await this.page.reload({ waitUntil: 'domcontentloaded' });
    // await this.page.on('load', () => console.log('DOM actually loaded'));
    await this.page.goto('http://localhost:3000/surveys');
    await this.page.waitFor('a[href="/api/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
