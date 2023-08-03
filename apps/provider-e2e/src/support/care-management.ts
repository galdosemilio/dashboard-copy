export const getCareManagementBillingRows = ({
  selectedClinicId = '1',
  getTable = true,
  pageToVisit = '/reports/rpm/billing',
  serviceType = {
    id: '1',
    name: 'RPM',
    code: 'rpm'
  }
} = {}) => {
  setSelectedClinicToStorage(selectedClinicId)
  setCareManagementServiceTypeToStorage(serviceType)
  cy.visit(pageToVisit)
  cy.tick(100)
  if (getTable) {
    cy.get('table', { timeout: 10000 })
      .find('tr')
      .as('careManagementBillingRows')
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

export const selectCareManagementServiceType = (
  serviceTypeName: 'rpm' | 'ccm' | 'rtm' | 'pcm' | 'bhi'
) => {
  switch (serviceTypeName) {
    case 'rpm':
      setCareManagementServiceTypeToStorage({
        id: '1',
        name: 'RPM',
        code: 'rpm'
      })
      break

    case 'ccm':
      setCareManagementServiceTypeToStorage({
        id: '2',
        name: 'CCM',
        code: 'ccm'
      })
      break

    case 'rtm':
      setCareManagementServiceTypeToStorage({
        id: '3',
        name: 'RTM',
        code: 'rtm'
      })
      break

    case 'pcm':
      setCareManagementServiceTypeToStorage({
        id: '4',
        name: 'PCM',
        code: 'pcm'
      })
      break

    case 'bhi':
      setCareManagementServiceTypeToStorage({
        id: '5',
        name: 'BHI',
        code: 'bhi'
      })
      break
  }
}
