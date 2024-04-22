describe("Auth", () => {
  it("login", () => {
    cy.visit("/");
    cy.get("#login").click();

    cy.origin(Cypress.env("AUTH_HOST"), async () => {
      cy.fixture("users").then((obj) => {
        cy.get("#username").type(obj[0].email);
        cy.get("#password").type(obj[0].password);
      });
      cy.contains("Continue").click();
    });

    expect(cy.get("#username").should("contain", "test"));
  });
});
