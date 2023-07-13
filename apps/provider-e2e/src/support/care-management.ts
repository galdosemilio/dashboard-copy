export const getRpmBillingRows = ({
  selectedClinicId = '1',
  getTable = true,
  serviceType = {
    id: '1',
    name: 'RPM',
    code: 'rpm'
  }
} = {}) => {
  setSelectedClinicToStorage(selectedClinicId)
  setCareManagementServiceTypeToStorage(serviceType)
  cy.visit(`/reports/rpm/billing`)
  cy.tick(100)
  if (getTable) {
    cy.get('table', { timeout: 10000 }).find('tr').as('rpmBillingRows')
    cy.get('table').find('.code-cell').as('codeCells')
  }
}

export const setCareManagementServiceTypeToStorage = (serviceType) => {
  window.localStorage.setItem('ccrCareManagementServiceType', serviceType.id)
}

export const setSelectedClinicToStorage = (selectedClinicId) => {
  window.localStorage.setItem(
    'ccrRPMBillingsFilter',
    JSON.stringify({
      selectedClinicId
    })
  )
}
