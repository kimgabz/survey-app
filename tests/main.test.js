const Page = require('./helpers/page');

let page;

beforeAll(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterAll(async () => {
  await page.close();
});

// test('When logged in, can see create survey', async () => {
//   await page.login();
//   await page.click('a.btn-floating');

//   const label = await page.getContentsOf('form label');

//   expect(label).toEqual('Survey Title');
// });

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Survey Title');
  });

  describe('And using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.subject input', 'My Subject');
      await page.type('.body input', 'My Body');
      await page.type('.recipients input', 'kim@kim.com');
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then saving adds survey to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Subject');

      // const result = await page.evaluate(() => {
      //   return fetch('/api/surveys', {
      //     method: 'POST',
      //     credentials: 'same-origin',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       title: 'My Title',
      //       content: 'My subject',
      //       body: 'My body',
      //       recipients: 'k@k.com',
      //     }),
      //   }).then((res) => res.json());
      // });
      // const values = JSON.stringify({
      //   title: 'My Title',
      //   content: 'My subject',
      //   body: 'My body',
      //   recipients: 'k@k.com',
      // });
      // const result = await axios.post('/api/surveys', values);

      console.log(result); // { error: 'Not enough credits' }
      // expect(result).toEqual({ error: 'You must log in ' });
    });
  });

  describe(' And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const subjectError = await page.getContentsOf('.subject .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(subjectError).toEqual('You must provide a value');
    });
  });

  describe('User is not logged in', async () => {
    const actions = [
      {
        method: 'get',
        path: '/api/surveys',
      },
      {
        method: 'post',
        path: '/api/surveys',
        data: {
          title: 'T',
          subject: 'C',
        },
      },
    ];

    test('Survey related actions are prohibited', async () => {
      const results = await page.execRequests(actions);

      for (let result of results) {
        expect(result).toEqual({ error: 'You must log in!' });
      }
    });
  });
});
