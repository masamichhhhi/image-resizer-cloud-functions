import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const dynamicImages = functions.https.onRequest(async (req, res) => {
  const { query, params } = req;

  const { 0: urlparam = "" } = params;

  const width = typeof query.w === "string" && parseInt(query.w);
  const height = typeof query.h === "string" && parseInt(query.h);
  const quality = typeof query.q === "string" && parseInt(query.q);

  const filepath = urlparam.replace(/^\/+/, "");

  if (!filepath || !filepath.length) {
    res.sendStatus(400);
    return;
  }
});
