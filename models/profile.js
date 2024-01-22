import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  avatar: String,
  animeReviews: [{type: Schema.Types.ObjectId, ref: "Anime"}],
  watchedList: [{type: Schema.Types.ObjectId, ref: "Anime"}],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
