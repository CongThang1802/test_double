import { v4 as uuidv4 } from 'uuid';
import {
  enumRequestStatus,
  RequestMonitoring,
} from './test/request-monitoring';

export class PreventDuplicateRequest {
  public static Protected_Stack_Ready: RequestMonitoring[] =
    new Array<RequestMonitoring>();
  public static Protected_Stack_Waiting: RequestMonitoring[] =
    new Array<RequestMonitoring>();
  public static Protected_Stack_Handling: RequestMonitoring[] =
    new Array<RequestMonitoring>();
  public static Protected_Stack_Done: RequestMonitoring[] =
    new Array<RequestMonitoring>();

  static async generateToken() {
    try {
      let generateNew = () => {
        var id = uuidv4();
        return new RequestMonitoring({
          request_id: id,
          status: enumRequestStatus.ready,
          time: +new Date(),
          client_ip: '0.0.0.0',
        });
      };

      var get_request = generateNew();
      return get_request.request_id;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
