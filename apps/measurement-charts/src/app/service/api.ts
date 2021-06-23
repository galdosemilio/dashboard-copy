import { baseData, BaseData } from '@chart/model'
import {
  ApiService,
  AuthenticationToken,
  MeasurementDataPointProvider
} from '@coachcare/sdk'
import { Environment } from '@coachcare/sdk/dist/lib/config'
import { environment } from '../../environments/environment'

export class Api {
  public baseData: BaseData = baseData
  public readonly measurementDataPoint: MeasurementDataPointProvider

  public apiService: ApiService
  public token: AuthenticationToken

  constructor() {
    this.token = new AuthenticationToken()
    this.apiService = this.setup()

    this.measurementDataPoint = new MeasurementDataPointProvider(
      this.apiService
    )
  }

  public appendBaseData(data: Partial<BaseData>): void {
    this.baseData = { ...this.baseData, ...data }
  }

  public setToken(token: string): void {
    this.token.value = token
  }

  private setup(): ApiService {
    const apiService = new ApiService({
      throttling: {
        enabled: true
      },
      caching: {
        enabled: true
      },
      token: this.token
    })

    apiService.setEnvironment(
      environment.selveraApiEnv as Environment,
      environment.apiUrl
    )

    return apiService
  }
}

const api = new Api()

export { api }