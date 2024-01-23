import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  avatar: String,
  animeReviews: [{type: Schema.Types.ObjectId, ref: "Anime"}],
  watchedList: [{type: Schema.Types.ObjectId, ref: "Anime"}],
  role: { type: String, default: "user"}
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
