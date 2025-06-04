const headers = {
  'content-type': 'application/json',
  'X-RapidAPI-Key': Cypress.env('CYPRESS_RAPIDAPI_KEY'),
  'X-RapidAPI-Host': 'temp-mail44.p.rapidapi.com',
};

Cypress.Commands.add('createRandomEmail', () => {
  return cy.request({
    method: 'POST',
    url: 'https://temp-mail44.p.rapidapi.com/api/v3/email/new',
    headers,
  });
});

Cypress.Commands.add('getInboxMessages', (email) => {
  return cy.request({
    method: 'GET',
    url: `https://temp-mail44.p.rapidapi.com/api/v3/email/${email}/messages`,
    headers,
  });
});

Cypress.Commands.add('getVerificationCode', (message) => {
  const regex = /Your code is: (\d+)/;
  const matches = regex.exec(message);
  const codigo = matches && matches[1];
  return codigo;
});
