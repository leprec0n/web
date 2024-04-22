describe("Auth", () => {
  it("login", () => {
    cy.visit("/");
    cy.get("#login").click();
    cy.origin(Cypress.env("AUTH_HOST"), () => {
      cy.get("#username").type("test@gmail.com");
      cy.get("#password").type("TestTest1");
      cy.contains("Continue").click();
    });
    expect(cy.get("#username").should("contain", "test"));
  });
});
