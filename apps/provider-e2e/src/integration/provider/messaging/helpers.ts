export function assertMessagePostRequest(args: {
  content: string
  subject: string
  threadId: string
}) {
  cy.wait('@messagePostRequest').should((xhr) => {
    expect(xhr.request.body.content).to.contain(args.content)
    expect(xhr.request.body.subject).to.contain(args.subject)
    expect(xhr.request.body.threadId).to.contain(args.threadId)
  })
}
