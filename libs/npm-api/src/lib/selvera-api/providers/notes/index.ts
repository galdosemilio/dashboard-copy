import { ApiService } from '../../services';
import { AddResponse } from '../foodKey/responses';
import {
    AddConsultationNoteRequest,
    AddNoteRequest,
    FetchAllConsultationNotesRequest,
    FetchAllNotesRequest,
    UpdateConsultationNoteRequest,
    UpdateNoteRequest
} from './requests';
import {
    FetchAllConsultationNotesResponse,
    FetchAllNotesResponse,
    FetchConsultationNoteResponse,
    FetchNoteResponse
} from './responses';

/**
 * Consumption Notes Service
 */
class Notes {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Create new general note [Client, Provider]
     * @param request must implement AddNoteRequest
     * @returns Promise<AddResponse>
     */
    public addNote(request: AddNoteRequest): Promise<AddResponse> {
        return this.apiService
            .request({
                endpoint: '/note/general',
                method: 'POST',
                data: request,
                version: '2.0'
            })
            .then(res => ({
                id: String(res.id)
            }));
    }

    /**
     * Fetch all general notes
     * @param request FetchAllNotesRequest
     * @returns Promise<FetchAllNotesResponse>
     */
    public fetchAllNotes(request: FetchAllNotesRequest): Promise<FetchAllNotesResponse> {
        return this.apiService.request({
            endpoint: '/note/general',
            method: 'GET',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Fetch single general note
     * @param id note id
     * @returns Promise<FetchSingleOrganizationKeyResponse>
     */
    public fetchSingleNote(id: string): Promise<FetchNoteResponse> {
        return this.apiService.request({
            endpoint: `/note/general/${id}`,
            method: 'GET',
            version: '2.0'
        });
    }

    /**
     * Update general note
     * @param request must implement UpdateNoteRequest
     * @returns Promise<boolean>
     */
    public updateNote(request: UpdateNoteRequest): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/note/general/${request.id}`,
            method: 'PATCH',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Delete general note
     * @param id note id
     * @returns Promise<boolean>
     */
    public deleteNote(id: string): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/note/general/${id}`,
            method: 'DELETE',
            version: '2.0'
        });
    }

    /**
     * Create new  consultation note [Admin]
     * @param request must implement AddConsultationNoteRequest
     * @returns Promise<AddResponse>
     */
    public addConsultationNote(request: AddConsultationNoteRequest): Promise<AddResponse> {
        return this.apiService
            .request({
                endpoint: '/note/consultation',
                method: 'POST',
                data: request,
                version: '2.0'
            })
            .then(res => ({
                id: String(res.id)
            }));
    }

    /**
     * Fetch all consultation notes
     * @param request FetchAllConsultationNotesRequest
     * @returns Promise<FetchAllConsultationNotesResponse>
     */
    public fetchAllConsultationNotes(
        request: FetchAllConsultationNotesRequest
    ): Promise<FetchAllConsultationNotesResponse> {
        return this.apiService.request({
            endpoint: '/note/consultation',
            method: 'GET',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Fetch single consultation note
     * @param id note id
     * @returns Promise<FetchConsultationNoteResponse>
     */
    public fetchSingleConsultationNote(id: string): Promise<FetchConsultationNoteResponse> {
        return this.apiService.request({
            endpoint: `/note/consultation/${id}`,
            method: 'GET',
            version: '2.0'
        });
    }

    /**
     * Update general note
     * @param request must implement UpdateNoteRequest
     * @returns Promise<boolean>
     */
    public updateConsultationNote(request: UpdateConsultationNoteRequest): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/note/consultation/${request.id}`,
            method: 'PATCH',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Delete consultation note
     * @param id note id
     * @returns Promise<boolean>
     */
    public deleteConsultationNote(id: string): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/note/consultation/${id}`,
            method: 'DELETE',
            version: '2.0'
        });
    }
}

export { Notes };
