import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../common/config/appConfig.service';
import { decryptData, encryptData } from '../common/utils';
import { Knowledgebase } from './knowledgebase.schema';

@Injectable()
export class CustomKeyService {
  private readonly encryptionKey: string;

  constructor(private appConfig: AppConfigService) {
    this.encryptionKey = this.appConfig.get('encryptionKey');
  }

  mergeCustomKeysFromUserAndKb(
    shouldUseCustomKeys?: boolean,
    userCustomKeys?: string[],
    kbCustomKeys?: string[],
  ): Knowledgebase['customKeys'] {
    if (!shouldUseCustomKeys) return undefined;
    const keys = kbCustomKeys || userCustomKeys;
    return {
      useOwnKey: shouldUseCustomKeys,
      keys,
    };
  }

  encryptCustomKeys(keys: string[]): string[] {
    const encryptedKeys = keys.map((k) => {
      const res = encryptData(k, this.encryptionKey);
      return `${res.iv}${res.encryptedData}`;
    });
    return encryptedKeys;
  }

  decryptCustomKeys(keys?: string[]): string[] {
    if (!keys) return undefined;

    const decryptedKeys = keys.map((k) => {
      const iv = k.slice(0, 32);
      const encryptedData = k.slice(32);
      return decryptData(encryptedData, this.encryptionKey, iv);
    });
    return decryptedKeys;
  }
}
