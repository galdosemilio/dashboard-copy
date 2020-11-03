import { ApiService } from '../../services/api.service';
import { COUNTRY_CODES, CountryCode } from './entities/countryCodes';
import {
    GetAllCountriesRequest,
    GetAllCountryPhoneCodesRequest
} from './requests';
import { GetAllCountriesResponse } from './responses';

export class Country {
    public constructor(private readonly apiService: ApiService) {}

    public getAll(
        request: GetAllCountriesRequest
    ): Promise<GetAllCountriesResponse> {
        return this.apiService.request({
            endpoint: '/country',
            method: 'GET',
            version: '2.0',
            data: request
        });
    }

    public getAllCountryPhoneCodes(
        request?: GetAllCountryPhoneCodesRequest
    ): CountryCode[] {
        let firstCountries: CountryCode[] = [];
        const allCountries = COUNTRY_CODES.map(countryCode => ({
            ...countryCode
        }));

        if (request && request.firstCountries.length) {
            allCountries.forEach(countryCode => {
                if (request.firstCountries.indexOf(countryCode.locale) > -1) {
                    firstCountries.push(countryCode);
                }
            });

            firstCountries = firstCountries.sort((current, next) => {
                const currentIndex = request.firstCountries.indexOf(
                    current.locale
                );
                const nextIndex = request.firstCountries.indexOf(next.locale);

                if (currentIndex > nextIndex) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }

        return [
            ...firstCountries,
            ...allCountries.filter(
                countryCode =>
                    !firstCountries.find(
                        country => country.locale === countryCode.locale
                    )
            )
        ];
    }
}
