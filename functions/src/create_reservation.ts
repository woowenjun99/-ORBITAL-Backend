import { region, https, Response } from 'firebase-functions';

export const createReservationFunction = region('asia-southeast1').https.onRequest(
  async (req: https.Request, res: Response) => {}
);
