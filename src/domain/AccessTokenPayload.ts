export interface AccessTokenPayloadData {
  id: number;
  random: Buffer;
}

export interface AccessTokenPayload {
  data: AccessTokenPayloadData;
}

export default AccessTokenPayload;
