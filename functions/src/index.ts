import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sharp from "sharp";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });]

admin.initializeApp();

export const dynamicImages = functions.https.onRequest(async (req, res) => {
  const { query, params } = req;

  const { 0: urlparam = "" } = params;

  const width = typeof query.w === "string" ? parseInt(query.w) : undefined;
  const height = typeof query.h === "string" ? parseInt(query.h) : undefined;
  const quality = typeof query.q === "string" ? parseInt(query.q) : undefined;

  const filepath = urlparam.replace(/^\/+/, "");

  if (!filepath || !filepath.length) {
    res.sendStatus(400);
    return;
  }

  const bucket = admin.storage().bucket();
  const ref = bucket.file(filepath);
  console.log(ref.name);

  const [isExists] = await ref.exists();

  if (!isExists) {
    res.sendStatus(404);
    return;
  }

  const { contentType } = ref.metadata;

  const resizeOpts: sharp.ResizeOptions = { width, height, fit: "inside" };

  const SHARP_FORMATS = Object.values(sharp.format);

  const formatOpts = { quality };

  const format = SHARP_FORMATS.find(
    // eslint-disable-next-line indent
    (f) => f.id === contentType.replace("image/", "")
  );

  res.contentType(contentType);
  res.set("Cache-Control", "public, max-age=31536000, s-maxage=31536000");

  const pipeline = sharp();

  ref.createReadStream().pipe(pipeline);

  pipeline.resize(resizeOpts).toFormat(format, formatOpts).pipe(res);
});
