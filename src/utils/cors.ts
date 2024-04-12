type StaticOrigin =
  | boolean
  | string
  | RegExp
  | Array<boolean | string | RegExp>;

const whitelist = ['http://localhost:5173'];

export function originAuth(
  requestOrigin: string,
  callback: (err: Error, origin?: StaticOrigin) => void
) {
  console.log(`WebSocket requestOrigin is ${requestOrigin}`);
  if (
    whitelist.includes(requestOrigin) ||
    typeof requestOrigin === 'undefined'
  ) {
    console.log('CORS allowed');
    return callback(null, true);
  }
  callback(new Error('Not allowed by CORS'));
}
