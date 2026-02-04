const locationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: String,
  region: String
});