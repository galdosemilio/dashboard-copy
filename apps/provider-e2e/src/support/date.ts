const setSystemDate = (startDate?: number): void => {
  const date = startDate ? startDate : Date.UTC(2020, 0, 1);
  cy.log('Setting system date to:' + date);

  const now = new Date(date).getTime();
  cy.clock(now);
};

export { setSystemDate };
