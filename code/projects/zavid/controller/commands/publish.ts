// import { Loader, Publisher, PublishOptions } from '@ziventi/utils';

// import { marshalGuests } from '../utils/shared';

// const ZPublisher = new Publisher();
// const ZLoader = new Loader({
//   cacheName: 'zavid',
//   spreadsheetId: process.env.SS_PUBLIC_LISTS_ID!,
//   guestMarshaler: marshalGuests
// });

// /**
//  * Updates the public spreadsheet with the currently invited and confirmed
//  * guests.
//  * @param options The update options.
//  */
// export default async function publish(options: PublishOptions) {
//   const { refreshCache } = options;

//   const guests = (await ZLoader.load(refreshCache))
//     .filter((g) => g.invited)
//     .sort((a, b) => (a.name > b.name ? 1 : -1));

//   await ZPublisher.publish(guests);
// }
