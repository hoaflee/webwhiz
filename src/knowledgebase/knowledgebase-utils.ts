import { HttpException, HttpStatus } from '@nestjs/common';
import { UserSparse } from '../user/user.schema';
import { KnowledgebaseSparse } from './knowledgebase.schema';

export function checkUserIsOwnerOfKb(
  user: UserSparse,
  kb: KnowledgebaseSparse,
) {
  if (!kb) {
    throw new HttpException('Invalid Knowledgebase Id', HttpStatus.NOT_FOUND);
  }
  if (!user._id.equals(kb.owner)) {
    throw new HttpException('Unauthorised', HttpStatus.UNAUTHORIZED);
  }
}
