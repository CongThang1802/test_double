import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PreventDuplicateRequest } from 'src/prevent-duplicate';
import { enumRequestStatus } from './request-monitoring';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { headers } = request;
    const request_id = headers['protected_token'] ?? headers['hash'] ?? 0;

    console.log(PreventDuplicateRequest.Protected_Stack_Ready);
    if (
      !request_id ||
      !request_id.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      ) ||
      !PreventDuplicateRequest.Protected_Stack_Ready.map(
        (item) => item.request_id,
      ).includes(request_id)
    ) {
      throw new NotFoundException('UNAUTHORIZED');
    }

    if (
      PreventDuplicateRequest.Protected_Stack_Waiting.map(
        (item) => item.request_id,
      ).includes(request_id)
    ) {
      throw new NotFoundException('IS_HANDLING');
    }

    PreventDuplicateRequest.Protected_Stack_Ready.filter(
      (item) => item.request_id == request_id,
    )[0].status = enumRequestStatus.waiting;

    return true;
  }
}
