import { handleError, mustFail, state, user, voidTest } from '@coachcare/backend/tests';
import { Meeting, MeetingAttendee, Session } from '../../../providers';
import { entityTest, setupTest, suiteLogin, suiteLogout } from '../../../shared/index.test';

import { getAllMeetingResponse, meetingResponse } from '../../../providers/index.test';
import {
  addMeetingAttendeeRequest,
  createMeetingRequest,
  deleteMeetingAttendeeRequest,
  deleteMeetingRequest,
  getAllMeetingRequest,
  updateMeetingAttendeeRequest,
  updateMeetingRequest
} from './meeting.utils';

describe(`Meeting >`, () => {
  let session: Session;
  let meeting: Meeting;
  let meetingAttend: MeetingAttendee;

  beforeAll(done => {
    // create the services once
    setupTest().then(testBed => {
      session = testBed.get(Session);
      meeting = testBed.get(Meeting);
      meetingAttend = testBed.get(MeetingAttendee);
      done();
    });
  });

  it('defined', function(done) {
    expect(session).toBeTruthy();
    expect(meeting).toBeTruthy();
    expect(meetingAttend).toBeTruthy();
    done();
  });

  /**
   * Utilities
   */

  describe(`Unauthenticated >`, function() {
    it('Create', function(done) {
      meeting
        .create(createMeetingRequest())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get All', function(done) {
      meeting
        .getAll(getAllMeetingRequest())
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Get Single', function(done) {
      meeting
        .getSingle({ id: '3' })
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });

    it('Delete Single', function(done) {
      meeting
        .deleteSingle({ id: '3' })
        .then(mustFail(done, 'Unauthenticated request must fail'))
        .catch(handleError(done, 'You must be authenticated'));
    });
  });

  for (const testUser of [user.client, user.provider]) {
    describe(`${testUser.token} >`, function() {
      beforeAll(done => suiteLogin(done, session, testUser.token));
      afterAll(done => suiteLogout(done, session));

      it('Create', function(done) {
        meeting
          .create(createMeetingRequest())
          .then(entityTest)
          .then(res => {
            state[state.role].meetingId = res.id;
            done();
          })
          .catch(done.fail);
      });

      it('Get All', function(done) {
        meeting
          .getAll(getAllMeetingRequest())
          .then(getAllMeetingResponse)
          .then(res => {
            if (!state[state.role].meetingId && res.data.length) {
              state[state.role].meetingId = res.data[0].id;
            }
            done();
          })
          .catch(done.fail);
      });

      switch (testUser.token) {
        case 'Provider':
          it('Update', function(done) {
            meeting
              .update(updateMeetingRequest())
              .then(voidTest)
              .then(done)
              .catch(done.fail);
          });

          describe(`Attendee >`, function() {
            it('Add Attendee', function(done) {
              meetingAttend
                .add(addMeetingAttendeeRequest())
                .then(voidTest)
                .then(done)
                .catch(done.fail);
            });

            it('Update Attendance', function(done) {
              meetingAttend
                .update(updateMeetingAttendeeRequest())
                .then(voidTest)
                .then(done)
                .catch(done.fail);
            });

            it('Remove Attendee', function(done) {
              meetingAttend
                .deleteSingle(deleteMeetingAttendeeRequest())
                .then(voidTest)
                .then(done)
                .catch(done.fail);
            });
          });

          it('Get Single', function(done) {
            meeting
              .getSingle({ id: state[state.role].meetingId })
              .then(meetingResponse)
              .then(done)
              .catch(done.fail);
          });
          break;

        case 'Client':
        default:
          it('Update', function(done) {
            meeting
              .update(updateMeetingRequest())
              .then(mustFail(done, 'Route access must be restricted'))
              .catch(handleError(done, 'Route access is restricted'));
          });
      }

      it('Delete Single', function(done) {
        if (!state[state.role].meetingId) {
          done();
          return;
        }
        meeting
          .deleteSingle(deleteMeetingRequest())
          .then(voidTest)
          .then(done)
          .catch(done.fail);
      });
    });
  }
});
