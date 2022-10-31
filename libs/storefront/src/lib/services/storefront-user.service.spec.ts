import { StorefrontUserService } from './storefront-user.service'
import {
  AccountIdentifier,
  AccSingleResponse,
  ApiService,
  FetchAllIdentifiersResponse,
  GetAssetsOrganizationPreferenceResponse,
  OrgAccessResponse,
  OrganizationPreference,
  OrganizationPreferenceSingle,
  OrganizationProvider,
  Session,
  User
} from '@coachcare/sdk'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { CCRState } from '@coachcare/backend/store'
import { MockService } from 'ng-mocks'
import { TranslateService } from '@ngx-translate/core'

describe('StorefrontUserService', () => {
  let service: StorefrontUserService
  let session: Session
  let router: Router
  let organizationPreference: OrganizationPreference
  let organizationProvider: OrganizationProvider
  let translate: TranslateService
  let accountIdentifier: AccountIdentifier
  let store: Store<CCRState.State>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      replace: jest.fn()
    })
    router = MockService(Router)
    organizationPreference = MockService(OrganizationPreference, {
      getSingle: () =>
        Promise.resolve({
          id: '7576',
          storeUrl: 'test.ecommerce.coachcare.com',
          displayName: 'Coachcare',
          assets: {},
          food: {},
          mala: {}
        }) as Promise<OrganizationPreferenceSingle>,
      getAssets: () =>
        Promise.resolve({
          id: '7576',
          storeUrl: 'test.ecommerce.coachcare.com',
          displayName: 'Coachcare',
          assets: {},
          mala: {}
        }) as Promise<GetAssetsOrganizationPreferenceResponse>
    })
    session = MockService(Session, {
      check: () =>
        Promise.resolve({
          id: '1'
        })
    })
    organizationProvider = MockService(OrganizationProvider, {
      getAccessibleList: () =>
        Promise.resolve({
          data: [
            {
              id: '1',
              organization: {
                id: '7575',
                address: '',
                name: 'Coachcare',
                shortcode: 'CC',
                hierarchyPath: ['']
              },
              isDirect: true,
              associatedAt: ''
            }
          ],
          pagination: {
            totalCount: 1
          }
        }) as Promise<OrgAccessResponse>
    })
    translate = MockService(TranslateService)
    store = MockService(Store)
    accountIdentifier = MockService(AccountIdentifier, {
      fetchAll: () => <Promise<FetchAllIdentifiersResponse>>Promise.resolve({
          data: [
            {
              id: '1121',
              account: {
                id: '8641'
              },
              organization: {
                id: '7571'
              },
              name: 'Spree ID',
              value: '410',
              isActive: true
            }
          ]
        })
    })

    service = new StorefrontUserService(
      {
        defaultOrgId: '30',
        production: false,
        stripeKey: '',
        nxtstimOrgId: '',
        cdn: '',
        apiUrl: '',
        appName: '',
        appVersion: '',
        cookieDomain: '',
        url: '',
        ccrApiEnv: 'test'
      },
      MockService(ApiService),
      store,
      router,
      organizationPreference,
      organizationProvider,
      accountIdentifier,
      MockService(User, {
        get: () => <Promise<AccSingleResponse>>Promise.resolve({
            id: '1'
          })
      }),
      session,
      translate
    )
  })

  describe('init', () => {
    it('should setup user, storeUrl successfully', async () => {
      await service.init()

      expect(service.storeUrl).toEqual('test.ecommerce.coachcare.com')
      expect(service.user).toEqual({
        id: '1'
      })
      expect(service.accountIdentifier.id).toEqual('1121')
    })

    describe('Spree account without account identifier on defaultOrg', () => {
      it('should create an account identifier under default org', async () => {
        accountIdentifier.fetchAll = jest
          .fn()
          .mockResolvedValue({
            data: [
              {
                id: '1121',
                account: {
                  id: '8641'
                },
                organization: {
                  id: '7571'
                },
                name: 'Spree ID',
                value: '410',
                isActive: true
              }
            ]
          })
          .mockResolvedValueOnce({ data: [] })
        accountIdentifier.add = jest.fn().mockResolvedValue({ id: '1122' })

        await service.init()

        expect(accountIdentifier.add).toBeCalledTimes(1)
        expect(accountIdentifier.add).toBeCalledWith({
          account: '1',
          name: 'Spree ID',
          organization: '30',
          value: '410'
        })
      })

      it('should work with no spree account found', async () => {
        accountIdentifier.fetchAll = jest.fn().mockResolvedValue({
          data: []
        })
        accountIdentifier.add = jest.fn().mockResolvedValue({ id: '1122' })

        await service.init()

        expect(accountIdentifier.add).toBeCalledTimes(0)
      })
    })

    describe('Access to organization denied', () => {
      it('should throw error if no organizations fallback', async () => {
        organizationPreference.getSingle = jest
          .fn()
          .mockRejectedValue('Access to organization denied.')
        organizationProvider.getAccessibleList = jest
          .fn()
          .mockResolvedValue({ data: [] })

        await expect(async () => {
          await service.init()
        }).rejects.toThrow('Error: Access to organization denied.')
      })

      it('should redirect if there are organizations fallback', async () => {
        organizationPreference.getSingle = jest
          .fn()
          .mockRejectedValue('Access to organization denied.')
        organizationProvider.getAccessibleList = jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              organization: {
                id: '7575'
              }
            }
          ]
        })

        await service.init()

        expect(window.location.replace).toHaveBeenCalledTimes(1)
        expect(window.location.replace).toHaveBeenCalledWith('/?baseOrg=7575')
      })
    })

    describe('Invalid store url', () => {
      it('should redirect to store with url set', async () => {
        organizationPreference.getSingle = jest
          .fn()
          .mockResolvedValue({
            id: '7575',
            storeUrl: 'test.ecommerce.coachcare.com'
          })
          .mockResolvedValueOnce({
            id: '31',
            storeUrl: 'invalid.store'
          })

        await service.init()

        expect(window.location.replace).toHaveBeenCalledTimes(1)
        expect(window.location.replace).toHaveBeenCalledWith('/?baseOrg=7575')
      })

      it('should throw error if no store url configured', async () => {
        translate.get = jest.fn().mockResolvedValue('Store not available')
        organizationPreference.getSingle = jest
          .fn()
          .mockResolvedValue({
            id: '7575',
            storeUrl: 'test.other.coachcare.com'
          })
          .mockResolvedValueOnce({
            id: '31',
            storeUrl: 'invalid.store'
          })

        await expect(async () => {
          await service.init()
        }).rejects.toThrow('Error: Store not available')
      })
    })
  })
})
