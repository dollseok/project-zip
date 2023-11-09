// var admin = require('firebase-admin');

// // ownerId - 알림을 받아야하는 유저 Id. ex) 가족 구성원
// // userId - 알림을 보내고자하는 유저 Id. ex) 일정 작성자
// async function sendNotification(ownerId, userId) {
//     // Get the owners details
//     const owner = admin.firestore().collection('users').doc(ownerId).get();
  
//     // Get the users details
//     const user = admin.firestore().collection('users').doc(userId).get();
  
//     await admin.messaging().sendEachForMulticast({
//       tokens: owner.tokens, // ['token_1', 'token_2', ...]
//       data: {
//         owner: JSON.stringify(owner),
//         user: JSON.stringify(user),
//       },
//       apns: {
//         payload: {
//           aps: {
//             // Required for background/quit data-only messages on iOS
//             // Note: iOS frequently will receive the message but decline to deliver it to your app.
//             //           This is an Apple design choice to favor user battery life over data-only delivery
//             //           reliability. It is not under app control, though you may see the behavior in device logs.
//             'content-available': true,
//             // Required for background/quit data-only messages on Android
//             priority: 'high',
//           },
//         },
//       },
//     });
//   }

//   module.exports = sendNotification;